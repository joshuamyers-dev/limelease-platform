/// <reference path="./.sst/platform/config.d.ts" />

import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

export default $config({
  app(input) {
    return {
      name: "platform",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-southeast-2",
          sharedConfigFiles: null,
        },
      },
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2("Services");
    const vpc = new sst.aws.Vpc("LimeLeaseVPC");

    const bucket = new sst.aws.Bucket("Storage", {
      public: false,
    });

    const securityGroup = new aws.ec2.SecurityGroup("ElixirApiSecurityGroup", {
      vpcId: vpc.id,
      ingress: [
        {
          protocol: "tcp",
          fromPort: 80,
          toPort: 80,
          cidrBlocks: ["0.0.0.0/0"],
        },
        {
          protocol: "tcp",
          fromPort: 443,
          toPort: 443,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: "-1",
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
    });

    const dbSecurityGroup = new aws.ec2.SecurityGroup("DatabaseSecurityGroup", {
      vpcId: vpc.id,
      description: "Allow access to the database from ECS tasks",
      ingress: [
        {
          fromPort: 5432,
          toPort: 5432,
          protocol: "tcp",
          securityGroups: [securityGroup.id],
        },
      ],
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: "-1",
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
    });

    const dbSubnetGroup = new aws.rds.SubnetGroup("DatabaseSubnetGroup", {
      name: "database-subnet-group",
      subnetIds: vpc.privateSubnets,
      description: "Subnet group for the database",
    });

    const databaseParameterGroup = new aws.rds.ParameterGroup(
      "DatabaseParameterGroup",
      {
        family: "postgres16",
        name: "database-parameter-group",
        parameters: [{ name: "rds.force_ssl", value: "0" }],
      }
    );

    const database = new aws.rds.Instance("Database", {
      engine: "postgres",
      instanceClass: "db.t3.micro",
      identifierPrefix: "limelease-db-",
      dbName: "lime_lease_prod",
      allocatedStorage: 20,
      username: "root",
      password: "REDACTED_DB_PASSWORD",
      skipFinalSnapshot: true,
      parameterGroupName: databaseParameterGroup.name,
      dbSubnetGroupName: dbSubnetGroup.name,
      vpcSecurityGroupIds: [dbSecurityGroup.id],
    });

    const cluster = new aws.ecs.Cluster("ApiCluster");

    const apiRepoistory = new aws.ecr.Repository("ElixirApiRepository", {
      name: "elixir-api",
    });

    const nextAppRepository = new aws.ecr.Repository("NextJsAppRepository", {
      name: "nextjs-app",
    });

    const ecsTaskExecutionRole = new aws.iam.Role("EcsTaskExecutionRole", {
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
            },
            Effect: "Allow",
            Sid: "",
          },
        ],
      }),
    });

    // Attach AWS Managed Policies
    new aws.iam.RolePolicyAttachment(
      "EcsTaskExecutionRoleAmazonECSTaskExecutionRolePolicy",
      {
        role: ecsTaskExecutionRole,
        policyArn:
          "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
      }
    );

    new aws.iam.RolePolicyAttachment("EcsTaskExecutionRoleRDSFullAccess", {
      role: ecsTaskExecutionRole,
      policyArn: "arn:aws:iam::aws:policy/AmazonRDSFullAccess",
    });

    new aws.iam.RolePolicyAttachment(
      "EcsTaskExecutionRoleCloudWatchFullAccess",
      {
        role: ecsTaskExecutionRole,
        policyArn: "arn:aws:iam::aws:policy/CloudWatchFullAccess",
      }
    );

    const customPolicy = new aws.iam.Policy("CustomPolicy", {
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["secretsmanager:GetSecretValue", "ssm:GetParameters"],
            Resource: "*",
            Effect: "Allow",
          },
        ],
      }),
    });

    new aws.iam.RolePolicyAttachment("CustomPolicyAttachment", {
      role: ecsTaskExecutionRole,
      policyArn: customPolicy.arn,
    });

    const logGroup = new aws.cloudwatch.LogGroup("ElixirApiLogGroup", {
      name: "/ecs/ElixirApi",
      retentionInDays: 0,
    });

    const taskDefinition = new aws.ecs.TaskDefinition(
      "ElixirApiECSTask",
      {
        family: "elixir-ecs-tasks",
        cpu: "256", // Adjust based on your needs
        memory: "512", // Adjust based on your needs
        networkMode: "awsvpc",
        requiresCompatibilities: ["FARGATE"],
        executionRoleArn: ecsTaskExecutionRole.arn,
        containerDefinitions: pulumi
          .all([
            database.endpoint,
            database.dbName,
            apiRepoistory.repositoryUrl,
          ])
          .apply(([endpoint, dbName, repoUrl]) => {
            return JSON.stringify([
              {
                name: "elixir-api",
                image: `${repoUrl}:latest`,
                portMappings: [
                  {
                    containerPort: 80,
                    hostPort: 80,
                    protocol: "tcp",
                  },
                ],
                logConfiguration: {
                  logDriver: "awslogs",
                  options: {
                    "awslogs-group": "/ecs/ElixirApi",
                    "awslogs-region": "ap-southeast-2",
                    "awslogs-stream-prefix": "ElixirApi",
                  },
                },
                environment: [
                  {
                    name: "DATABASE_URL",
                    value: `postgresql://root:REDACTED_DB_PASSWORD@${endpoint}/${dbName}`,
                  },
                  {
                    name: "SECRET_KEY_BASE",
                    value:
                      "REDACTED_SECRET_KEY_BASE",
                  },
                  {
                    name: "PORT",
                    value: "80",
                  },
                  {
                    name: "CLICKSEND_API_USERNAME",
                    value: "REDACTED_EMAIL",
                  },
                  {
                    name: "CLICKSEND_API_KEY",
                    value: "REDACTED_CLICKSEND_KEY",
                  },
                  {
                    name: "FRONT_END_URL",
                    value: "http://localhost:3000",
                  },
                  {
                    name: "AWS_KEY_ID",
                    value: "REDACTED_AWS_ACCESS_KEY_ID",
                  },
                  {
                    name: "AWS_SECRET_KEY",
                    value: "REDACTED_AWS_SECRET_KEY",
                  },
                  {
                    name: "AWS_BUCKET",
                    value: "limelease",
                  },
                  {
                    name: "AWS_STATIC_FOLDER",
                    value: "static-files",
                  },
                  {
                    name: "POSTMARK_API_KEY",
                    value: "REDACTED_POSTMARK_KEY_1",
                  },
                ],
              },
            ]);
          }),
      },
      { dependsOn: [database] }
    );

    const zone = await aws.route53.getZone({
      name: "limelease.com",
      privateZone: false,
    });

    const certificate = new aws.acm.Certificate("ApiCertificate", {
      domainName: "api.limelease.com",
      validationMethod: "DNS",
    });

    const validationRecord = new aws.route53.Record("ApiValidationRecord", {
      zoneId: zone.id,
      name: certificate.domainValidationOptions[0].resourceRecordName,
      type: certificate.domainValidationOptions[0].resourceRecordType,
      records: [certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: 300,
    });

    const certificateValidation = new aws.acm.CertificateValidation(
      "ApiCertificateValidation",
      {
        certificateArn: certificate.arn,
        validationRecordFqdns: [validationRecord.fqdn],
      }
    );

    const alb = new aws.lb.LoadBalancer("ElixirApiAlb", {
      securityGroups: [securityGroup.id],
      subnets: vpc.publicSubnets,
      loadBalancerType: "application",
    });

    const targetGroup = new aws.lb.TargetGroup("ElixirApiTargetGroup", {
      port: 80,
      protocol: "HTTP",
      targetType: "ip",
      vpcId: vpc.id,
      healthCheck: {
        path: "/health",
        enabled: true,
      },
    });

    const listener = new aws.lb.Listener("ElixirApiListener", {
      loadBalancerArn: alb.arn,
      port: 443,
      protocol: "HTTPS",
      sslPolicy: "ELBSecurityPolicy-2016-08",
      certificateArn: certificateValidation.certificateArn,
      defaultActions: [
        {
          type: "forward",
          targetGroupArn: targetGroup.arn,
        },
      ],
    });

    const apiSubdomainRecord = new aws.route53.Record("LimeLeaseApiSubDomain", {
      zoneId: zone.id,
      name: "api.limelease.com",
      type: "A",
      aliases: [
        {
          name: alb.dnsName,
          zoneId: alb.zoneId,
          evaluateTargetHealth: false,
        },
      ],
    });

    new aws.ecs.Service(
      "ElixirApiFargateService",
      {
        cluster: cluster.arn,
        desiredCount: 1,
        launchType: "FARGATE",
        taskDefinition: taskDefinition.arn,
        networkConfiguration: {
          assignPublicIp: true,
          subnets: vpc.publicSubnets,
          securityGroups: [securityGroup.id],
        },
        loadBalancers: [
          {
            targetGroupArn: targetGroup.arn,
            containerName: "elixir-api",
            containerPort: 80,
          },
        ],
      },
      { dependsOn: [taskDefinition, listener] }
    );

    // new aws.ecs.Service(
    //   "NextjsAppFargateService",
    //   {
    //     cluster: cluster.arn,
    //     desiredCount: 1,
    //     launchType: "FARGATE",
    //     taskDefinition: taskDefinition.arn,
    //     networkConfiguration: {
    //       assignPublicIp: true,
    //       subnets: vpc.publicSubnets,
    //       securityGroups: [securityGroup.id],
    //     },
    //     loadBalancers: [
    //       {
    //         targetGroupArn: targetGroup.arn,
    //         containerName: apiRepoistory.name,
    //         containerPort: 80,
    //       },
    //     ],
    //   },
    //   { dependsOn: [taskDefinition, listener] }
    // );

    api.route("POST /scrape", {
      handler: "limelease/services/playwright-scraper/index.handler",
      nodejs: {
        install: [
          "@sparticuz/chromium",
          "playwright-core",
          "puppeteer-extra-plugin-stealth",
        ],
      },
      runtime: "nodejs18.x",
      timeout: "60 seconds",
      memory: "2048 MB",
      url: {
        cors: true,
      },
    });

    api.route("POST /snapshot", {
      handler: "limelease/services/playwright-snapshotter/index.handler",
      nodejs: {
        install: ["@sparticuz/chromium", "playwright-core"],
      },
      runtime: "nodejs18.x",
      timeout: "60 seconds",
      memory: "2048 MB",
      url: {
        cors: true,
      },
    });
  },
});
