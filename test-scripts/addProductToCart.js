import * as puppeteer from 'puppeteer' 
import dotenv from 'dotenv';

dotenv.config();

export async function addProductToCart() {
  console.time("feedbackForm-test");
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
    args: ["--window-size=1080,700"],
  });
  const page = await browser.newPage();

  page.on("console", (message) => {
    if (message.type() === "log") {
      console.log(`Browser console: ${message.text()}`);
    }
  });
  
  await page.goto(
    `http://localhost:3001`,
    { timeout: 80000 }
  );
  await page.waitForSelector('[data-testid="shop_product_plus"]');
  await page.click('[data-testid=shop_product_plus]')
  await page.waitForSelector('[data-testid="add_to_cart"]');
  await page.click('[data-testid="add_to_cart"]')

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  return({browser, page})
}

addProductToCart();
