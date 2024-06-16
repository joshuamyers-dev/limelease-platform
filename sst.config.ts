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

    const bucket = new sst.aws.Bucket("Storage", {
      public: false,
    });

    api.route("POST /scrape", {
      handler: "limelease/services/playwright/index.handler",
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
  },
});
