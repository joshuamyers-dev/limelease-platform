/// <reference path="./.sst/platform/config.d.ts" />

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
    // Dynamically import modules
    const pulumi = await import("@pulumi/pulumi");
    const aws = await import("@pulumi/aws");

    const api = new sst.aws.ApiGatewayV2("Services");

    // Use EC2 NAT instances instead of AWS NAT Gateways for cost savings
    const vpc = new sst.aws.Vpc("LimeLeaseVPC", {
      nat: "ec2",
    });

    const bucket = new sst.aws.Bucket("Storage", {
      public: false,
    });

    // Use the dynamically imported AWS module
    const securityGroup = new aws.default.ec2.SecurityGroup(
      "ElixirApiSecurityGroup",
      {
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
      }
    );

    const database = new sst.aws.Postgres("Postgresql", {
      vpc,
      username: "root",
      password: "REDACTED_DB_PASSWORD",
      database: "lime_lease_prod",
    });

    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    const apiRepoistory = new aws.default.ecr.Repository(
      "ElixirApiRepository",
      {
        name: "elixir-api",
      }
    );

    const nextAppRepository = new aws.default.ecr.Repository(
      "NextJsAppRepository",
      {
        name: "nextjs-app",
      }
    );

    const ecsTaskExecutionRole = new aws.default.iam.Role(
      "EcsTaskExecutionRole",
      {
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
      }
    );

    // Attach AWS Managed Policies
    new aws.default.iam.RolePolicyAttachment(
      "EcsTaskExecutionRoleAmazonECSTaskExecutionRolePolicy",
      {
        role: ecsTaskExecutionRole,
        policyArn:
          "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
      }
    );

    new aws.default.iam.RolePolicyAttachment(
      "EcsTaskExecutionRoleRDSFullAccess",
      {
        role: ecsTaskExecutionRole,
        policyArn: "arn:aws:iam::aws:policy/AmazonRDSFullAccess",
      }
    );

    new aws.default.iam.RolePolicyAttachment(
      "EcsTaskExecutionRoleCloudWatchFullAccess",
      {
        role: ecsTaskExecutionRole,
        policyArn: "arn:aws:iam::aws:policy/CloudWatchFullAccess",
      }
    );

    const customPolicy = new aws.default.iam.Policy("CustomPolicy", {
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

    new aws.default.iam.RolePolicyAttachment("CustomPolicyAttachment", {
      role: ecsTaskExecutionRole,
      policyArn: customPolicy.arn,
    });

    new sst.aws.Service(
      "ElixirService",
      {
        cluster,
        image: {
          context: "limelease/services/elixir-api/.",
        },
        capacity: "spot",
        loadBalancer: {
          health: {
            path: "/health",
          },
          domain: "api.occupie.com.au",
          rules: [
            { listen: "80/http" },
            { listen: "443/https", forward: "80/http" },
          ],
        },
        health: {
          command: [
            "CMD-SHELL",
            "curl -f http://localhost:80/health || exit 1",
          ],
          startPeriod: "60 seconds",
          timeout: "5 seconds",
          interval: "30 seconds",
          retries: 3,
        },
        environment: {
          DATABASE_URL: pulumi.interpolate`postgresql://root:REDACTED_DB_PASSWORD@${database.host}/${database.database}`,
          SECRET_KEY_BASE:
            "REDACTED_SECRET_KEY_BASE",
          PORT: "80",
          CLICKSEND_API_USERNAME: "REDACTED_EMAIL",
          CLICKSEND_API_KEY: "REDACTED_CLICKSEND_KEY",
          FRONT_END_URL: "http://localhost:3000",
          AWS_KEY_ID: "REDACTED_AWS_ACCESS_KEY_ID",
          AWS_SECRET_KEY: "REDACTED_AWS_SECRET_KEY",
          AWS_BUCKET: "limelease",
          AWS_STATIC_FOLDER: "static-files",
          POSTMARK_API_KEY: "REDACTED_POSTMARK_KEY_1",
          API_GATEWAY_ENDPOINT: api.url,
        },
      },
      { dependsOn: [database] }
    );


    const nextAppTaskDefinition = new sst.aws.Service("NextjsApp", {
      cluster: cluster,
      image: {
        context: "limelease/apps/nextjs-app/.",
      },
      capacity: "spot",
      loadBalancer: {
        domain: "app.occupie.com.au",
        health: {
          path: "/login",
        },
        rules: [
          { listen: "80/http" },
          { listen: "443/https", forward: "80/http" },
        ],
      },
      health: {
        command: ["CMD-SHELL", "curl -f http://localhost:3000/login || exit 1"],
        startPeriod: "60 seconds",
        timeout: "5 seconds",
        interval: "30 seconds",
        retries: 3,
      },
      environment: {
        NEXT_PUBLIC_API_URL: "https://api.occupie.com.au",
        NEXT_PUBLIC_WS_ADDRESS: "api.occupie.com.au",
        NEXT_PUBLIC_DOMAIN_API_KEY: "REDACTED_DOMAIN_API_KEY",
        NEXT_PUBLIC_FRONT_END_URL: "https://www.occupie.com.au",
        NEXT_PUBLIC_PROPERTY_FETCHER_LAMBDA_URL: pulumi.interpolate`${api.url}/scrape`,
      },
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