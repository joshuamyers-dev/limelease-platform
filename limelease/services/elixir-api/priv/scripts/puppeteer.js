const puppeteer = require("puppeteer");

async function generate() {
  const url = process.argv[2];

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(url);

  await page.setViewport({ width: 2500, height: 1500 });

  await page.waitForSelector("#requestDetails");
  await page.waitForNetworkIdle();

  const element = await page.$("#requestDetails");
  const boundingBox = await element.boundingBox();

  const screenshot = await page.screenshot({
    type: "jpeg",
    quality: 100,
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width:
        Math.min(boundingBox.width, page.viewport().width - boundingBox.x) /
        2.8,
      height: Math.min(
        boundingBox.height,
        page.viewport().height - boundingBox.y
      ),
    },
  });

  console.log(screenshot.toString("base64"));

  await browser.close();
}

generate();
