import { MongoClient } from "mongodb";

/**
 * Clear all data from the database using native MongoDB driver
 * This bypasses Prisma's transaction requirements from onDelete: Cascade
 * Run with: npm run db:clear
 */

const connectionString =
  process.env.DATABASE_URL ||
  "mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin";

async function clearDatabase() {
  const client = new MongoClient(connectionString);

  try {
    console.log("🗑️  Clearing database...\n");
    console.log("   Connecting to MongoDB...");

    await client.connect();
    const db = client.db("product_catalog");

    // Delete in reverse order to avoid foreign key issues
    // Using native MongoDB driver (no transactions required)

    console.log("   Deleting product assets...");
    const assetsResult = await db.collection("product_assets").deleteMany({});
    console.log(`   ✅ Deleted ${assetsResult.deletedCount} product assets`);

    console.log("   Deleting product variants...");
    const variantsResult = await db
      .collection("product_variants")
      .deleteMany({});
    console.log(
      `   ✅ Deleted ${variantsResult.deletedCount} product variants`
    );

    console.log("   Deleting products...");
    const productsResult = await db.collection("products").deleteMany({});
    console.log(`   ✅ Deleted ${productsResult.deletedCount} products`);

    const totalDeleted =
      assetsResult.deletedCount +
      variantsResult.deletedCount +
      productsResult.deletedCount;

    console.log("\n🎉 Database cleared successfully!");
    console.log(`📊 Total deleted: ${totalDeleted} records`);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run the clear function
clearDatabase();
