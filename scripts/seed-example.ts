import { faker } from "@faker-js/faker";
import { MongoClient, ObjectId } from "mongodb";

/**
 * Seed script using Faker to generate realistic product data
 * Uses native MongoDB driver to avoid Prisma transaction requirements
 * Run with: npm run db:seed
 */

const connectionString =
  process.env.DATABASE_URL ||
  "mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin";

// Configuration
const PRODUCTS_TO_CREATE = 100;

// Product categories for clothing
const CATEGORIES = [
  "T-Shirts",
  "Jeans",
  "Dresses",
  "Jackets",
  "Sweaters",
  "Hoodies",
  "Shorts",
  "Skirts",
  "Pants",
  "Blouses",
];

// Clothing brands
const BRANDS = [
  "Urban Style",
  "Classic Wear",
  "Modern Threads",
  "Fashion Forward",
  "Comfort Zone",
  "Elite Apparel",
  "Casual Chic",
  "Street Style",
  "Premium Clothing Co.",
  "Everyday Essentials",
];

// Available colors
const COLORS = [
  "Black",
  "White",
  "Navy",
  "Gray",
  "Blue",
  "Red",
  "Green",
  "Beige",
  "Brown",
  "Pink",
];

// Available sizes
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

/**
 * Generate a random product with variants and assets
 */
function generateProduct(index: number) {
  const category = faker.helpers.arrayElement(CATEGORIES);
  const brand = faker.helpers.arrayElement(BRANDS);
  const productName = `${faker.commerce.productAdjective()} ${category.slice(
    0,
    -1
  )}`;
  const basePrice = parseFloat(faker.commerce.price({ min: 20, max: 200 }));
  const sku = `PROD-${String(index).padStart(5, "0")}`;

  // Generate 3-6 random variants
  const numVariants = faker.number.int({ min: 3, max: 6 });
  const selectedColors = faker.helpers.arrayElements(
    COLORS,
    faker.number.int({ min: 2, max: 4 })
  );
  const selectedSizes = faker.helpers.arrayElements(
    SIZES,
    faker.number.int({ min: 2, max: 4 })
  );

  const variants = [];
  let variantIndex = 0;
  for (const color of selectedColors) {
    for (const size of selectedSizes) {
      if (variantIndex >= numVariants) break;
      const colorCode = color.substring(0, 3).toUpperCase();
      variants.push({
        color,
        size,
        sku: `${sku}-${colorCode}-${size}`,
        price: basePrice + faker.number.float({ min: -5, max: 10 }),
        stockQuantity: faker.number.int({ min: 0, max: 100 }),
        isAvailable: faker.datatype.boolean(0.9), // 90% available
      });
      variantIndex++;
    }
  }

  // Generate 2-5 product images using Picsum Photos (simple, reliable URLs)
  const numImages = faker.number.int({ min: 2, max: 5 });
  const assets = [];

  for (let i = 0; i < numImages; i++) {
    // Use Picsum Photos with unique seed for consistent random images
    assets.push({
      url: `https://picsum.photos/seed/${productName.replace(
        /\s+/g,
        "-"
      )}-${i}/800/800`,
      altText: `${productName} - ${i === 0 ? "Main" : `View ${i + 1}`}`,
      type: "image",
      isPrimary: i === 0,
      displayOrder: i + 1,
    });
  }

  return {
    product: {
      name: productName,
      description: faker.commerce.productDescription(),
      category,
      brand,
      basePrice,
      sku,
      isActive: faker.datatype.boolean(0.95), // 95% active
    },
    variants,
    assets,
  };
}

async function seedProducts() {
  const client = new MongoClient(connectionString);

  try {
    console.log(`🌱 Starting to seed ${PRODUCTS_TO_CREATE} products...\n`);
    console.log("   Connecting to MongoDB...");

    await client.connect();
    const db = client.db("product_catalog");

    const productsCollection = db.collection("products");
    const variantsCollection = db.collection("product_variants");
    const assetsCollection = db.collection("product_assets");

    console.log("   ✅ Connected to MongoDB\n");
    console.log("ℹ️  Creating products (existing data will be preserved)\n");

    let totalVariants = 0;
    let totalAssets = 0;

    // Create products one by one using native MongoDB driver
    for (let i = 0; i < PRODUCTS_TO_CREATE; i++) {
      const { product: productData, variants, assets } = generateProduct(i + 1);

      // Step 1: Create the product with MongoDB ObjectId
      const productId = new ObjectId();
      const productDoc = {
        _id: productId,
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await productsCollection.insertOne(productDoc);

      // Step 2: Create variants
      if (variants.length > 0) {
        const variantDocs = variants.map((v) => ({
          _id: new ObjectId(),
          ...v,
          productId: productId, // Keep as ObjectId, not string
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        await variantsCollection.insertMany(variantDocs);
        totalVariants += variants.length;
      }

      // Step 3: Create assets
      if (assets.length > 0) {
        const assetDocs = assets.map((a) => ({
          _id: new ObjectId(),
          ...a,
          productId: productId, // Keep as ObjectId, not string
          createdAt: new Date(),
        }));
        await assetsCollection.insertMany(assetDocs);
        totalAssets += assets.length;
      }

      // Progress update every 10 products
      if ((i + 1) % 10 === 0 || i + 1 === PRODUCTS_TO_CREATE) {
        console.log(
          `✅ Created ${i + 1}/${PRODUCTS_TO_CREATE} products (${Math.round(
            ((i + 1) / PRODUCTS_TO_CREATE) * 100
          )}%)`
        );
      }
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - ${PRODUCTS_TO_CREATE} products created`);
    console.log(`   - ${totalVariants} product variants created`);
    console.log(`   - ${totalAssets} product images created`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the seed function
seedProducts();
