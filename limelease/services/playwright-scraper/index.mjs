import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import slugify from "slugify";
import chromium from "@sparticuz/chromium";

// Add stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

async function setupRequestInterception(page, allowedDomain) {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = new URL(request.url());
    const isDifferentDomain = !url.host.endsWith(allowedDomain);
    if (
      request.resourceType() === "image" ||
      (isDifferentDomain && request.resourceType() === "script")
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

export const handler = async (event) => {
  let browser = null;
  let response = {
    statusCode: 200,
  };

  // const authorizationHeader =
  //   event.headers["Authorization"] || event.headers["authorization"];

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

    // Launch the browser
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    // Create a new page
    const page = await browser.newPage();
    // await setupRequestInterception(page, "domain.com.au");

    console.log(
      `Navigating to ${`https://www.domain.com.au/property-profile/${address}`}`
    );

    // Navigate to the URL
    await page.goto(`https://www.domain.com.au/property-profile/${address}`, {
      waitUntil: "networkidle0",
    });

    await page.click('a[class="css-p593q1"]');

    // Wait for the features container to load
    await page.waitForSelector('[data-testid="property-features-wrapper"]');

    // Extract the features
    const featuresTexts = await page.$$eval(
      '[data-testid="property-features-feature"]',
      (elements) => elements.map((element) => element.textContent)
    );

    // Click on the image to open gallery
    await page.click('button[class="css-1azjcl"]');

    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const imageSrcs = await page.$$eval('img[class="css-c690t6"]', (images) =>
      images.map((img) => img.src)
    );

    // Prepare the response
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

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error occurred", error.message);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Error occurred during scrape",
      error: error.message,
    });

    // Make sure to close the browser in case of error
    if (browser) {
      await browser.close();
    }
  }

  return response;
};

handler();
