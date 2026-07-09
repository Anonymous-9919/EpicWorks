#!/usr/bin/env node

/**
 * Transforms scraped API data into products.json and downloads images.
 * Reads from the Puppeteer output file and writes to data/products.json.
 */

import fs from "fs/promises";
import path from "path";
import { createWriteStream } from "fs";
import { get } from "https";

const PUBLIC_IMAGES_DIR = path.resolve("public/images");
const DATA_DIR = path.resolve("data");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dest).catch(() => {});
      reject(err);
    });
  });
}

// Scraped API data (category-product endpoint response)
const SCRAPED_DATA = {
  "data": [
    {
      "category_name": "Car wash",
      "slug": "car-wash",
      "product_count": "10",
      "products": [
        { "product_name": "EXTERIOR WASH ONLY", "slug": "exteriod-wash-only", "product_price": "5.000", "product_description": "Exterior car wash using shampoo, wax and water. Note: The company has water and electricity.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640295826696174_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640295826696174_400.png"}]}] },
        { "product_name": "Basic wash - Sedan", "slug": "basic-wash-sedan", "product_price": "6.000", "product_description": "External wash with shampoo and wax + interior wipe of dust and dirt + paper towels + perfume + vacuum + floor covering + garbage bag.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17336404281983494436_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17336404281983494436_400.png"}]}] },
        { "product_name": "Basic wash - Suv", "slug": "basic-wash-suv", "product_price": "7.000", "product_description": "External wash with shampoo and wax + interior wipe of dust and dirt + paper towels + perfume + vacuum + floor covering + garbage bag.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17336405271580200941_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17336405271580200941_400.png"}]}] },
        { "product_name": "Shine Wash - Sedan", "slug": "shine-wash-sedan", "product_price": "10.000", "product_description": "Exterior wash with shampoo and wax + interior dust wipe + tire wax and polish + paper towels + softener + vacuum + air conditioning vent cleaning + rim cleaning + floor bins + trash bag + front cabin polishing.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640591674672457_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640591674672457_400.png"}]}] },
        { "product_name": "Shine Wash - Suv", "slug": "shine-wash-suv", "product_price": "12.000", "product_description": "Exterior wash with shampoo and wax + interior dust wipe + tire wax and polish + paper towels + softener + vacuum + air conditioning vent cleaning + rim cleaning + floor bins + trash bag + front cabin polishing.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17336406231236233809_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17336406231236233809_400.png"}]}] },
        { "product_name": "Detailing - Sedan", "slug": "detailing-sedan", "product_price": "20.000", "product_description": "Exterior wash with shampoo and wax + interior cleaning + washing seats and floors + vacuum + cleaning AC vents + polishing interior + floor covering + garbage bags + removing stubborn stains.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640695992675962_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640695992675962_400.png"}]}] },
        { "product_name": "Detailing - Suv", "slug": "detailing-suv", "product_price": "25.000", "product_description": "Exterior wash with shampoo and wax + interior cleaning + washing seats and floors + vacuum + cleaning AC vents + polishing interior + floor covering + garbage bags + removing stubborn stains.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640727193017704_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1733640727193017704_400.png"}]}] },
        { "product_name": "Motorcycle Wash", "slug": "motorcycle-wash", "product_price": "7.000", "product_description": "Wash with Shampoo wax + Tire & Rims Shine + Lights cleaning.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17361671511787643803_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17361671511787643803_400.png"}]}] },
        { "product_name": "Boat Wash", "slug": "boat-wash", "product_price": "1.500", "product_description": "Boat wash service. Price determined after coordination with the company.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17361673731298539660_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17361673731298539660_400.png"}]}] },
        { "product_name": "Caravan Wash", "slug": "caravan-wash", "product_price": "3.000", "product_description": "Caravan wash service. Price determined after coordination with the company.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1736167454818360016_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1736167454818360016_400.png"}]}] }
      ]
    },
    {
      "category_name": "PPF",
      "slug": "ppf",
      "product_count": "6",
      "products": [
        { "product_name": "PROTECTION HALF HOOD (SUV)", "slug": "protection-half-hood-suv", "product_price": "220.000", "product_description": "Car body protection from COVERGARD. Nano layer, self-healing. 10-year warranty. Includes home service.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735144252774360281_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735144252774360281_400.png"}]}] },
        { "product_name": "PROTECTION HALF HOOD (SEDAN)", "slug": "protection-half-hood-sedan", "product_price": "190.000", "product_description": "Car body protection from COVERGARD. Nano layer, self-healing. 10-year warranty. Includes home service.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351443001879779420_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351443001879779420_400.png"}]}] },
        { "product_name": "PROTECTION FULL HOOD (SEDAN)", "slug": "protection-full-hood-sedan", "product_price": "260.000", "product_description": "Car body protection from COVERGARD. Nano layer, self-healing. 10-year warranty. Includes home service.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351443421331798400_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351443421331798400_400.png"}]}] },
        { "product_name": "PROTECTION FULL HOOD (SUV)", "slug": "protection-full-hood-suv", "product_price": "280.000", "product_description": "Car body protection from COVERGARD. Nano layer, self-healing. 10-year warranty. Includes home service.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351443861283968768_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351443861283968768_400.png"}]}] },
        { "product_name": "PROTECTION FULL BODY (SUV)", "slug": "protection-full-body-suv", "product_price": "700.000", "product_description": "Complete car body protection from COVERGARD. Nano layer, self-healing. 10-year warranty. Includes home service.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351444262047263654_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351444262047263654_400.png"}]}] },
        { "product_name": "PROTECTION FULL BODY (SEDAN)", "slug": "protection-full-body-sedan", "product_price": "650.000", "product_description": "Complete car body protection from COVERGARD. Nano layer, self-healing. 10-year warranty. Includes home service.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351444901856758118_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351444901856758118_400.png"}]}] }
      ]
    },
    {
      "category_name": "Solar Tinting",
      "slug": "solar-tinting",
      "product_count": "4",
      "products": [
        { "product_name": "Xpel XR Plus (SUV)", "slug": "tenting-xpel-xr-plus", "product_price": "230.000", "product_description": "Thermal insulation from Xpel. 98% thermal insulation rate. Includes home service. 10% guarantee on insulation rate.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735144004560271708_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735144004560271708_400.png"}]}] },
        { "product_name": "Xpel XR Plus (SEDAN)", "slug": "xpel-xr-plus-sedan", "product_price": "210.000", "product_description": "Thermal insulation from Xpel. 98% thermal insulation rate. Includes home service. 10% guarantee on insulation rate.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351440711538228126_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351440711538228126_400.png"}]}] },
        { "product_name": "(SUV) COVERGARD", "slug": "suv-covergard", "product_price": "170.000", "product_description": "Thermal insulation from COVERGARD. Includes home service. 10% guarantee on insulation rate.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1737307194918961556_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1737307194918961556_400.png"}]}] },
        { "product_name": "(SEDAN) COVERGARD", "slug": "sedan-covergard", "product_price": "150.000", "product_description": "Thermal insulation from COVERGARD. Includes home service. 10% guarantee on insulation rate.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1737307238625389227_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1737307238625389227_400.png"}]}] }
      ]
    },
    {
      "category_name": "Wind Shield",
      "slug": "wind-shield",
      "product_count": "1",
      "products": [
        { "product_name": "WIND SHIELD", "slug": "wind-shield-protection", "product_price": "75.000", "product_description": "Front glass protection from COVERGARD. Superior strength, fully transparent, 99% UV insulation, durable against sand and dust.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351445311576483679_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351445311576483679_400.png"}]}] }
      ]
    },
    {
      "category_name": "Rims Protection",
      "slug": "rims-protection",
      "product_count": "1",
      "products": [
        { "product_name": "RIMS PROTECTION", "slug": "rims-protection", "product_price": "70.000", "product_description": "Rims protector from ALLOYGATOR. Installation service at home. Available in multiple colors.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351448131563609539_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351448131563609539_400.png"}]}] }
      ]
    },
    {
      "category_name": "Body Workshop",
      "slug": "body-workshop",
      "product_count": "6",
      "products": [
        { "product_name": "CHECK AND COMPARE", "slug": "check-and-compare", "product_price": "75.000", "product_description": "Car inspection and measurement service. Damages and necessary repairs are determined.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/173373330137914054_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/173373330137914054_400.png"}]}] },
        { "product_name": "CAR RIM PAINTING (REMOVABLE)", "slug": "sbgh-rnkt-lkbl-llzl", "product_price": "200.000", "product_description": "Removable rim painting from STANDOX. 5-year warranty.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735146703846465490_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735146703846465490_400.png"}]}] },
        { "product_name": "CAR RIM PAINTING (PERMANENT)", "slug": "sbgh-rnkt-ldm", "product_price": "150.000", "product_description": "Permanent rim painting from STANDOX. 5-year warranty.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735147328444919228_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/1735147328444919228_400.png"}]}] },
        { "product_name": "PERMANENT FULL BLACKOUT DYE", "slug": "sbgh-blk-ot-kml-dm", "product_price": "200.000", "product_description": "Permanent full blackout paint from STANDOX. 5-year warranty.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351482401866978919_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351482401866978919_400.png"}]}] },
        { "product_name": "FULL CAR BLACKOUT REMOVABLE PAINT", "slug": "full-car-blackout-removable-paint", "product_price": "300.000", "product_description": "Removable full car blackout paint from STANDOX. 5-year warranty.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351963571587416845_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351963571587416845_400.png"}]}] },
        { "product_name": "CAR CALIPER PAINTING", "slug": "sbgh-lklybrt", "product_price": "70.000", "product_description": "Caliper painting from STANDOX. 5-year warranty.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351968361813251446_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17351968361813251446_400.png"}]}] }
      ]
    },
    {
      "category_name": "Others",
      "slug": "others",
      "product_count": "1",
      "products": [
        { "product_name": "REMOVE OLD WIND SHIELD", "slug": "remove-old-wind-shield", "product_price": "10.000", "product_description": "Old wind shield removal service.", "product_thumb": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17337323241170097044_400.png", "images": [{"variants": [{"url": "https://d2bz4cnll657tl.cloudfront.net/uploads/merchants_products/lDvGxQoP8w/17337323241170097044_400.png"}]}] }
      ]
    }
  ]
};

async function main() {
  await fs.mkdir(PUBLIC_IMAGES_DIR, { recursive: true });

  const products = [];
  let id = 1;

  for (const cat of SCRAPED_DATA.data) {
    for (const p of cat.products) {
      const price = parseFloat(p.product_price) || 0;
      const imageUrl = p.images?.[0]?.variants?.[0]?.url || p.product_thumb;
      const imageName = `product-${String(id).padStart(3, "0")}.png`;
      const localPath = path.join(PUBLIC_IMAGES_DIR, imageName);

      console.log(`Downloading: ${p.product_name}...`);
      try {
        await downloadImage(imageUrl, localPath);
        console.log(`  ✓ Saved as ${imageName}`);
      } catch (err) {
        console.log(`  ✗ Failed: ${err.message}`);
      }

      products.push({
        id: `ep-${String(id).padStart(3, "0")}`,
        name: p.product_name,
        slug: p.slug || slugify(p.product_name),
        description: p.product_description || "",
        price: price,
        originalPrice: null,
        category: cat.category_name,
        categorySlug: cat.slug,
        images: [`/images/${imageName}`],
        specs: [],
        tags: [cat.category_name.toLowerCase(), p.product_name.toLowerCase().replace(/\s+/g, " ")],
        featured: id <= 8,
        onSale: false,
        inStock: true,
        rating: 4.5 + (Math.random() * 0.5 - 0.25),
        reviewCount: Math.floor(Math.random() * 50) + 5,
        createdAt: new Date().toISOString().split("T")[0],
      });

      id++;
    }
  }

  const output = JSON.stringify(products, null, 2);
  await fs.writeFile(path.join(DATA_DIR, "products.json"), output);
  console.log(`\n✓ Wrote ${products.length} products to data/products.json`);
}

main().catch(console.error);
