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
    const vpc = new sst.aws.Vpc("OccupieVPC", {
      nat: "ec2",
      bastion: true,
    });

    const bucket = new sst.aws.Bucket("Storage", {
      public: false,
    });

    const database = new sst.aws.Postgres("Postgres", {
      vpc,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || (() => { throw new Error("DB_PASSWORD environment variable is required") })(),
      database: process.env.DB_NAME || "lime_lease_prod",
    });

    const cluster = new sst.aws.Cluster("MyCluster", {
      vpc,
      forceUpgrade: "v2",
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
            "80/http": {
              path: "/health",
              interval: "10 seconds",
            },
          },
          domain: {
            name: "api.occupie.com.au",
          },
          rules: [
            { listen: "80/http" },
            { listen: "443/https", forward: "80/http" },
          ],
        },
        health: {
          command: [
            "CMD-SHELL",
            "curl -f http://127.0.0.1:80/health || exit 1",
          ],
          startPeriod: "120 seconds",
          timeout: "10 seconds",
          interval: "60 seconds",
          retries: 3,
        },
        permissions: [
          {
            actions: ["s3:ListBucket"],
            resources: ["*"],
          },
          {
            actions: ["s3:GetObject"],
            resources: ["*"],
          },
          {
            actions: ["s3:PutObject"],
            resources: ["*"],
          },
        ],
        environment: {
          DATABASE_URL: pulumi.interpolate`postgresql://${process.env.DB_USERNAME || "root"}:${process.env.DB_PASSWORD}@${database.host}/${database.database}`,
          SECRET_KEY_BASE: process.env.SECRET_KEY_BASE || (() => { throw new Error("SECRET_KEY_BASE environment variable is required") })(),
          PORT: "80",
          CLICKSEND_API_USERNAME: process.env.CLICKSEND_API_USERNAME || (() => { throw new Error("CLICKSEND_API_USERNAME environment variable is required") })(),
          CLICKSEND_API_KEY: process.env.CLICKSEND_API_KEY || (() => { throw new Error("CLICKSEND_API_KEY environment variable is required") })(),
          FRONT_END_URL: process.env.FRONT_END_URL || "https://app.occupie.com.au",
          AWS_BUCKET: process.env.AWS_BUCKET || "occupie",
          AWS_STATIC_FOLDER: process.env.AWS_STATIC_FOLDER || "public",
          POSTMARK_API_KEY: process.env.POSTMARK_API_KEY || (() => { throw new Error("POSTMARK_API_KEY environment variable is required") })(),
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
        domain: {
          name: "app.occupie.com.au",
        },
        health: {
          "3000/http": {
            path: "/login",
            interval: "10 seconds",
          },
        },
        rules: [
          { listen: "3000/http" },
          { listen: "443/https", forward: "3000/http" },
        ],
      },
      health: {
        command: ["CMD-SHELL", "curl -f http://127.0.0.1:3000/login || exit 1"],
        startPeriod: "120 seconds",
        timeout: "10 seconds",
        interval: "60 seconds",
        retries: 3,
      },
      environment: {
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.occupie.com.au",
        NEXT_PUBLIC_WS_ADDRESS: process.env.NEXT_PUBLIC_WS_ADDRESS || "api.occupie.com.au",
        NEXT_PUBLIC_DOMAIN_API_KEY: process.env.NEXT_PUBLIC_DOMAIN_API_KEY || (() => { throw new Error("NEXT_PUBLIC_DOMAIN_API_KEY environment variable is required") })(),
        NEXT_PUBLIC_FRONT_END_URL: process.env.NEXT_PUBLIC_FRONT_END_URL || "https://www.occupie.com.au",
        NEXT_PUBLIC_PROPERTY_FETCHER_LAMBDA_URL: pulumi.interpolate`${api.url}/scrape`,
      },
    });

    const playwrightScraperTaskDefinition = new sst.aws.Service(
      "PlaywrightScraper",
      {
        cluster: cluster,
        image: {
          context: "limelease/services/playwright-scraper/.",
        },
        capacity: "spot",
        memory: "2 GB",
        loadBalancer: {
          domain: {
            name: "scrape.occupie.com.au",
          },
          health: {
            "3000/http": {
              path: "/health",
              interval: "10 seconds",
            },
          },
          rules: [
            { listen: "3000/http" },
            { listen: "443/https", forward: "3000/http" },
          ],
        },
        health: {
          command: [
            "CMD-SHELL",
            "curl -f http://127.0.0.1:3000/health || exit 1",
          ],
          startPeriod: "120 seconds",
          timeout: "10 seconds",
          interval: "60 seconds",
          retries: 3,
        },
      }
    );

    // api.route("POST /scrape", {
    //   handler: "limelease/services/playwright-scraper/index.handler",
    //   nodejs: {
    //     install: [
    //       "@sparticuz/chromium",
    //       "playwright",
    //       "playwright-extra",
    //       "puppeteer-real-browser",
    //       "slugify",
    //     ],
    //   },
    //   runtime: "nodejs22.x",
    //   timeout: "60 seconds",
    //   memory: "2048 MB",
    //   url: {
    //     cors: true,
    //   },
    // });

    api.route("POST /snapshot", {
      handler: "limelease/services/playwright-snapshotter/index.handler",
      nodejs: {
        install: ["@sparticuz/chromium", "playwright", "playwright-extra"],
      },
      runtime: "nodejs22.x",
      timeout: "60 seconds",
      memory: "3008 MB",
      architecture: "arm64",
      url: {
        cors: true,
      },
    });
  },
});