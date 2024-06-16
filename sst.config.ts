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
    const api = new sst.aws.ApiGatewayV2("Services");
    const vpc = new sst.aws.Vpc("LimeLeaseVPC");

    const bucket = new sst.aws.Bucket("Storage", {
      public: false,
    });

    // const database = new aws.rds.Cluster("Database", {
    //   engine: "postgres",
    //   databaseName: "lime_lease_prod",
    //   allocatedStorage: 10,
    // });

    // const cluster = new aws.ecs.Cluster("ApiCluster")

    const repository = aws.ecr.getRepository({
      name: "limelease",
    });

    //   const taskDefinition = new aws.ecs.TaskDefinition("my-task", {
    //     family: "my-task-family",
    //     cpu: "256", // Adjust based on your needs
    //     memory: "512", // Adjust based on your needs
    //     networkMode: "awsvpc",
    //     requiresCompatibilities: ["FARGATE"],
    //     executionRoleArn: aws.iam.Role.get("ecsTaskExecutionRole", "ecsTaskExecutionRole").arn,
    //     containerDefinitions: pulumi.all([repository]).apply(([repo]) => JSON.stringify([{
    //         name: "my-container",
    //         image: `${repo.repositoryUrl}:latest`, // Use your specific image tag if needed
    //         portMappings: [{
    //             containerPort: 80,
    //             hostPort: 80,
    //             protocol: "tcp",
    //         }],
    //     }])),
    // });

    // const service = new aws.ecs.Service("my-service", {
    //   cluster: cluster.arn,
    //   desiredCount: 1,
    //   launchType: "FARGATE",
    //   taskDefinition: taskDefinition.arn,
    //   networkConfiguration: {
    //       assignPublicIp: true,
    //       subnets: ["subnet-12345"], // Replace with your subnet IDs
    //       securityGroups: ["sg-12345"], // Replace with your security group IDs
    //   },
    // }, { dependsOn: [taskDefinition] });

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
