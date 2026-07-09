#!/usr/bin/env node

/**
 * Scraper for epicworks-kw.com
 * Since the site is client-rendered (Next.js + Upayments),
 * this uses Puppeteer to wait for JavaScript execution and extract products.
 */

const BASE_URL = "https://epicworks-kw.com";
const STORE_CODE = "q3nDga7odp";

async function scrape() {
  console.log("=== Epic Works Product Scraper ===");
  console.log("Target:", BASE_URL);

  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.log("\n[SKIP] Puppeteer not installed. Install with: npm install puppeteer");
    console.log("For now, using existing sample product data.\n");
    return;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const categories = ["Exterior", "Interior", "Performance", "Accessories", "Lighting", "Wheels"];
  const allProducts = [];

  for (const category of categories) {
    try {
      console.log(`\nScraping category: ${category}...`);
      await page.goto(`${BASE_URL}/${STORE_CODE}/category/${category}`, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for content to render
      await new Promise((r) => setTimeout(r, 3000));

      // Try to extract products from the page
      const products = await page.evaluate(() => {
        const items = [];
        // Upayments stores product data in __NEXT_DATA__
        const script = document.getElementById("__NEXT_DATA__");
        // Also look for Redux store or rendered product elements
        const productEls = document.querySelectorAll("[class*='product'], [class*='Product'], [class*='card'], [class*='Card']");

        productEls.forEach((el) => {
          const text = el.textContent?.trim();
          if (text && text.length > 20) {
            items.push(text.substring(0, 200));
          }
        });

        return items;
      });

      console.log(`  Found ${products.length} potential items`);
      allProducts.push(...products);
    } catch (err) {
      console.log(`  Error scraping ${category}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nScraping complete. Extracted ${allProducts.length} items total.`);

  if (allProducts.length > 0) {
    const fs = await import("fs/promises");
    await fs.writeFile(
      "data/scraped-products.json",
      JSON.stringify(allProducts, null, 2)
    );
    console.log("Saved to data/scraped-products.json");
  }
}

scrape().catch(console.error);
