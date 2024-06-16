import { chromium as playwright } from "playwright-core";
import chromium from "@sparticuz/chromium";

export const handler = async (event) => {
  let result = null;
  let browser = null;

  const { url } = JSON.parse(event.body);

  try {
    browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url);

    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("#requestDetails");

    const element = await page.$("#requestDetails");
    const screenshot = await element.screenshot({
      type: "jpeg",
      quality: 100,
    });

    result = {
      statusCode: 200,
      body: screenshot.toString("base64"),
    };
  } catch (error) {
    result = { statusCode: 500, body: error.toString() };
  }

  return result;
};
