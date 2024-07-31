import { chromium as playwright } from "playwright-extra";
import chromium from "@sparticuz/chromium";

export const handler = async (event) => {
  const { url } = JSON.parse(event.body);

  let result;

  try {
    const browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
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
