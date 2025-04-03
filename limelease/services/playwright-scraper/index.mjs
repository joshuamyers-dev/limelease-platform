import slugify from "slugify";
import { connect } from "puppeteer-real-browser";
import express from "express";

const app = express();
app.use(express.json());

// Configure port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Initialize browser connection outside of handler for connection reuse
const { page } = await connect({
  headless: false,
  disableXvfb: false,
  turnstile: true,
  ignoreAllFlags: true,
});

// The scraper function (former Lambda handler)
async function scrapeProperty(address) {
  try {
    address = slugify(address.replace("/", "-"), {
      lower: true,
    });

    await page.goto("https://www.property.com.au", {
      waitUntil: "networkidle0",
    });

    await page.click(
      'button[data-testid="home-page-multi-intent-search-modal-button"]'
    );

    console.log(
      await page.$eval(
        'input[placeholder="Search by suburb, postcode or area"]'
      )
    );

    await page.waitForSelector(
      'input[placeholder="Search by suburb, postcode or area"]'
    );
    await page.type(
      'input[placeholder="Search by suburb, postcode or area"]',
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

    for (let i = 0; i < Math.max(totalImageCount, 5); i++) {
      await page.click('button[aria-label="next"]');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      imageSrcs.push(await page.$eval("picture img", (img) => img.src));
    }

    return {
      propertyFeatures: {
        bedrooms: parseInt(bedrooms),
        bath: parseInt(baths),
        carSpaces: parseInt(carSpaces),
      },
      imageUrls: imageSrcs,
    };
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error;
  }
}

// Define API endpoint
app.post("/scrape", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const result = await scrapeProperty(address);
    res.json(result);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({
      error: "Failed to scrape property data",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start server
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
