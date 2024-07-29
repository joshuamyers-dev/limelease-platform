/// <reference path="./.sst/platform/config.d.ts" />

import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";


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

/*

// Future AWS IaC

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
        {
          fromPort: 3000,
          toPort: 3000,
          protocol: "tcp",
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
                healthCheck: {
                  command: [
                    "CMD-SHELL",
                    "curl -f http://127.0.0.1/health || exit 1",
                  ],
                  interval: 30,
                  timeout: 5,
                  retries: 3,
                  startPeriod: 10,
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

    const apiCertificate = new aws.acm.Certificate("ApiCertificate", {
      domainName: "api.limelease.com",
      validationMethod: "DNS",
    });

    const appCertificate = new aws.acm.Certificate("AppCertificate", {
      domainName: "app.limelease.com",
      validationMethod: "DNS",
    });

    const rootCertificate = new aws.acm.Certificate("RootCertificate", {
      domainName: "limelease.com",
      validationMethod: "DNS",
    });

    const apiValidationRecord = new aws.route53.Record("ApiValidationRecord", {
      zoneId: zone.id,
      name: apiCertificate.domainValidationOptions[0].resourceRecordName,
      type: apiCertificate.domainValidationOptions[0].resourceRecordType,
      records: [apiCertificate.domainValidationOptions[0].resourceRecordValue],
      ttl: 300,
    });

    const appValidationRecord = new aws.route53.Record("AppValidationRecord", {
      zoneId: zone.id,
      name: appCertificate.domainValidationOptions[0].resourceRecordName,
      type: appCertificate.domainValidationOptions[0].resourceRecordType,
      records: [appCertificate.domainValidationOptions[0].resourceRecordValue],
      ttl: 300,
    });

    const rootValidationRecord = new aws.route53.Record(
      "RootValidationRecord",
      {
        zoneId: zone.id,
        name: rootCertificate.domainValidationOptions[0].resourceRecordName,
        type: rootCertificate.domainValidationOptions[0].resourceRecordType,
        records: [
          rootCertificate.domainValidationOptions[0].resourceRecordValue,
        ],
        ttl: 300,
      }
    );

    const apiCertificateValidation = new aws.acm.CertificateValidation(
      "ApiCertificateValidation",
      {
        certificateArn: apiCertificate.arn,
        validationRecordFqdns: [apiValidationRecord.fqdn],
      }
    );

    const appCertificateValidation = new aws.acm.CertificateValidation(
      "AppCertificateValidation",
      {
        certificateArn: appCertificate.arn,
        validationRecordFqdns: [appValidationRecord.fqdn],
      }
    );

    const rootCertificateValidation = new aws.acm.CertificateValidation(
      "RootCertificateValidation",
      {
        certificateArn: rootCertificate.arn,
        validationRecordFqdns: [rootValidationRecord.fqdn],
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
      certificateArn: apiCertificateValidation.certificateArn,
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

    const nextAppTaskDefinition = new aws.ecs.TaskDefinition(
      "NextjsAppECSTask",
      {
        family: "nextjs-app-ecs-tasks",
        cpu: "256", // Adjust based on your needs
        memory: "512", // Adjust based on your needs
        networkMode: "awsvpc",
        requiresCompatibilities: ["FARGATE"],
        executionRoleArn: ecsTaskExecutionRole.arn,
        containerDefinitions: pulumi
          .all([nextAppRepository.repositoryUrl, api.url])
          .apply(([repoUrl, lambdaUrl]) => {
            return JSON.stringify([
              {
                name: "nextjs-app",
                image: `${repoUrl}:9d09a9736d2b8e56e43c8b7ae56cd86851b3daf4`,
                portMappings: [
                  {
                    containerPort: 3000,
                    hostPort: 3000,
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
                    name: "NEXT_PUBLIC_API_URL",
                    value: `https://api.limelease.com`,
                  },
                  {
                    name: "NEXT_PUBLIC_WS_ADDRESS",
                    value: "api.limelease.com",
                  },
                  {
                    name: "NEXT_PUBLIC_DOMAIN_API_KEY",
                    value: "REDACTED_DOMAIN_API_KEY",
                  },
                  {
                    name: "NEXT_PUBLIC_FRONT_END_URL",
                    value: "https://app.limelease.com",
                  },
                  {
                    name: "NEXT_PUBLIC_PROPERTY_FETCHER_LAMBDA_URL",
                    value: `${lambdaUrl}/scrape`,
                  },
                ],
              },
            ]);
          }),
      },
      { dependsOn: [nextAppRepository, api] }
    );

    const appAlb = new aws.lb.LoadBalancer("AppAlb", {
      securityGroups: [securityGroup.id],
      subnets: vpc.publicSubnets,
      loadBalancerType: "application",
    });

    const appTargetGroup = new aws.lb.TargetGroup("AppTargetGroup", {
      port: 80,
      protocol: "HTTP",
      targetType: "ip",
      vpcId: vpc.id,
      healthCheck: {
        path: "/login",
        enabled: true,
      },
    });

    const appListener = new aws.lb.Listener("AppListener", {
      loadBalancerArn: appAlb.arn,
      port: 443,
      protocol: "HTTPS",
      sslPolicy: "ELBSecurityPolicy-2016-08",
      certificateArn: appCertificateValidation.certificateArn,
      defaultActions: [
        {
          type: "forward",
          targetGroupArn: appTargetGroup.arn,
        },
      ],
    });

    const httpRedirectListener = new aws.lb.Listener("HttpRedirectListener", {
      loadBalancerArn: appAlb.arn,
      port: 80,
      protocol: "HTTP",
      defaultActions: [
        {
          type: "redirect",
          redirect: {
            protocol: "HTTPS",
            port: "443",
            statusCode: "HTTP_301",
          },
        },
      ],
    });

    new aws.ecs.Service(
      "NextjsAppFargateService",
      {
        cluster: cluster.arn,
        desiredCount: 1,
        launchType: "FARGATE",
        taskDefinition: nextAppTaskDefinition.arn,
        networkConfiguration: {
          assignPublicIp: true,
          subnets: vpc.publicSubnets,
          securityGroups: [securityGroup.id],
        },
        loadBalancers: [
          {
            targetGroupArn: appTargetGroup.arn,
            containerName: "nextjs-app",
            containerPort: 3000,
          },
        ],
      },
      { dependsOn: [nextAppTaskDefinition, appListener] }
    );

    const appSubdomainRecord = new aws.route53.Record("LimeLeaseAppSubDomain", {
      zoneId: zone.id,
      name: "app.limelease.com",
      type: "A",
      aliases: [
        {
          name: appAlb.dnsName,
          zoneId: appAlb.zoneId,
          evaluateTargetHealth: false,
        },
      ],
    });

    const wordpressSg = new aws.ec2.SecurityGroup("WordpressSecurityGroup2", {
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
        {
          protocol: "tcp",
          fromPort: 22,
          toPort: 22,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] },
      ],
    });

    // Wordpress Website
    const wordpress = new aws.ec2.Instance(
      "Wordpress",
      {
        instanceType: "t2.small",
        ami: "ami-076fe60835f136dc9",
        vpcSecurityGroupIds: [wordpressSg.id],
        subnetId: vpc.publicSubnets.apply((subnets) => subnets[0]),
      },
      { dependsOn: [wordpressSg, vpc] }
    );

    // const eip = new aws.ec2.Eip("WordpressEip", {
    //   instance: wordpress.id,
    // });

    const wordpressAlb = new aws.lb.LoadBalancer("WordpressAlb", {
      securityGroups: [securityGroup.id],
      subnets: vpc.publicSubnets,
      loadBalancerType: "application",
    });

    const wordpressTargetGroup = new aws.lb.TargetGroup(
      "WordpressTargetGroup",
      {
        port: 80,
        protocol: "HTTP",
        targetType: "instance",
        vpcId: vpc.id,
        healthCheck: {
          path: "/",
          enabled: true,
        },
      }
    );

    const wordpressListener = new aws.lb.Listener("WordpressListener", {
      loadBalancerArn: wordpressAlb.arn,
      port: 443,
      protocol: "HTTPS",
      sslPolicy: "ELBSecurityPolicy-2016-08",
      certificateArn: rootCertificateValidation.certificateArn,
      defaultActions: [
        {
          type: "forward",
          targetGroupArn: wordpressTargetGroup.arn,
        },
      ],
    });

    // const wordpressListener2 = new aws.lb.Listener("WordpressListener2", {
    //   loadBalancerArn: wordpressAlb.arn,
    //   port: 80,
    //   protocol: "HTTP",
    //   defaultActions: [
    //     {
    //       type: "forward",
    //       targetGroupArn: wordpressTargetGroup.arn,
    //     },
    //   ],
    // });

    new aws.lb.TargetGroupAttachment("WordpressTargetGroupAttachment", {
      targetGroupArn: wordpressTargetGroup.arn,
      targetId: wordpress.id,
    });

    // const wordpressHttpRedirectListener = new aws.lb.Listener(
    //   "WordpressHttpRedirectListener",
    //   {
    //     loadBalancerArn: wordpressAlb.arn,
    //     port: 80,
    //     protocol: "HTTP",
    //     defaultActions: [
    //       {
    //         type: "redirect",
    //         redirect: {
    //           protocol: "HTTPS",
    //           port: "443",
    //           statusCode: "HTTP_301",
    //         },
    //       },
    //     ],
    //   }
    // );

    new aws.route53.Record("LimeLeaseRootDomain", {
      zoneId: zone.id,
      name: "limelease.com",
      type: "A",
      aliases: [
        {
          name: wordpressAlb.dnsName,
          zoneId: wordpressAlb.zoneId,
          evaluateTargetHealth: false,
        },
      ],
    });

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

*/