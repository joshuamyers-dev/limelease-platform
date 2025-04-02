import slugify from "slugify";
import { connect } from "puppeteer-real-browser";
import chromium from "@sparticuz/chromium";

const { page, browser } = await connect({
  headless: chromium.headless,
  customConfig: {
    ...args,
    chromePath: await chromium.executablePath(),
  },
  connectOption: {
    defaultViewport: chromium.defaultViewport,
  },
});

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

    address = slugify(address.replace("/", "-"), {
      lower: true,
    });

    await page.goto("https://www.property.com.au", {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector(
      'button[data-testid="home-page-multi-intent-search-modal-button"]'
    );
    await page.click(
      'button[data-testid="home-page-multi-intent-search-modal-button"]'
    );
    await page.waitForSelector(
      'input[id="multi-intent-search-modal-default-screen"]'
    );
    await page.type(
      'input[id="multi-intent-search-modal-default-screen"]',
      address
    );
    await page.waitForSelector(
      'div[class="styles__ListboxWrapper-sc-1sw1a31-0 ccOqvP location-suggest-listbox-wrapper"]'
    );
    await Promise.all([
      page.waitForNavigation(),
      page.click(
        'div[class="styles__ListboxWrapper-sc-1sw1a31-0 ccOqvP location-suggest-listbox-wrapper"]'
      ),
    ]);

    const bedrooms = await page.$eval(
      'div[title="Bedrooms"]',
      (el) => el.innerText
    );
    const baths = await page.$eval(
      'div[title="Bathrooms"]',
      (el) => el.innerText
    );
    const carSpaces = await page.$eval(
      'div[title="Car spaces"]',
      (el) => el.innerText
    );

    await Promise.all([
      page.waitForNavigation(),
      page.click('button[aria-label="Open Media Gallery Lightbox"]'),
    ]);

    const imageCountElement = await page.$eval(
      ".carousel.media-gallery-carousel p",
      (element) => element.innerText
    );

    const totalImageCount = imageCountElement.split("/")[1];

    let imageSrcs = [];

    for (let i = 0; i < totalImageCount / 2; i++) {
      await page.click('button[aria-label="next"]');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      imageSrcs.push(await page.$eval("picture img", (img) => img.src));
    }

    // Prepare the response
    response.body = JSON.stringify({
      propertyFeatures: {
        bedrooms: parseInt(bedrooms),
        bath: parseInt(baths),
        carSpaces: parseInt(carSpaces),
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
