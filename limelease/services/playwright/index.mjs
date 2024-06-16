import { chromium as playwright } from "playwright-extra";
import chromium from "@sparticuz/chromium";
import slugify from "slugify";

const stealth = require("puppeteer-extra-plugin-stealth")();

playwright.use(stealth);

async function setupRequestInterception(page, allowedDomain) {
  await page.route("**/*", (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isDifferentDomain = !url.host.endsWith(allowedDomain);
    if (
      request.resourceType() === "image" ||
      (isDifferentDomain && request.resourceType() === "script")
    ) {
      route.abort();
    } else {
      route.continue();
    }
  });
}

export const handler = async (event) => {
  let browser = null;
  let response = {
    statusCode: 200,
  };

  const authorizationHeader =
    event.headers["Authorization"] || event.headers["authorization"];

  // if (!authorizationHeader) {
  //   response.statusCode = 401;
  //   response.body = JSON.stringify({
  //     message: "No Authorization header provided",
  //   });

  //   return response;
  // }

  try {
    let { address } = JSON.parse(event.body);

    console.log(`Input address: ${address}`);

    address = slugify(address.replace("/", "-"), {
      lower: true,
    });

    const browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    const context = await browser.newContext();

    context.on("page", async (page) => {
      await setupRequestInterception(page, "domain.com.au");
    });

    console.log(
      `Navigating to ${`https://www.domain.com.au/property-profile/${address}`}`
    );

    const page = await browser.newPage();
    await page.goto(`https://www.domain.com.au/property-profile/${address}`, {
      waitUntil: "networkidle0",
    });

    await page.waitForSelector(
      '[data-testid="property-features-text-container"]'
    );

    const featuresTexts = await page.$$eval(
      '[data-testid="property-features-feature"]',
      (elements) => elements.map((element) => element.textContent)
    );

    await page.click(
      '[data-testid="propertyid-details-property-hero-image-gradient"]'
    );
    await page.waitForSelector("button.css-12p5ldm");
    await page.click("button.css-12p5ldm");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let imageSrcs = await page.$$eval("img.css-c690t6", (images) =>
      images.map((img) => img.src)
    );

    imageSrcs = imageSrcs.filter((src, index) => index !== 1);

    response.body = JSON.stringify({
      propertyFeatures: {
        bedrooms: parseInt(
          featuresTexts[0].replace("Beds", "").replace(" ", "")
        ),
        bath: parseInt(featuresTexts[1].replace("Baths", "").replace(" ", "")),
        carSpaces: parseInt(
          featuresTexts[2].replace("Parking", "").replace(" ", "")
        ),
      },
      imageUrls: imageSrcs,
    });
  } catch (error) {
    console.error("Error occurred", error.message);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Error occurred during scrape",
      error: error.message,
    });
  }

  return response;
};
