# Prisma ORM Setup for MongoDB Product Catalog

This project uses Prisma ORM with MongoDB to manage an e-commerce product catalog with support for product variants (colors, sizes) and product assets (images).

## 📋 Schema Overview

The database consists of three main models:

### 1. **Product**

- Main product information (name, description, category, brand)
- Base price and unique SKU
- Active status and timestamps
- Relations to variants and assets

### 2. **ProductVariant**

- Product variations (color, size combinations)
- Variant-specific SKU and pricing
- Stock quantity and availability
- Relations to parent product and variant-specific assets

### 3. **ProductAsset**

- Product images and media files
- Can be linked to product or specific variant
- Primary image flag and display order
- Relations to product and optional variant

## 🚀 Getting Started

### 1. Start MongoDB

```bash
docker-compose up -d
```

This will start:

- MongoDB on `localhost:27017`
- Mongo Express (web UI) on `localhost:8081`

### 2. Environment Setup

The `.env` file has been created with:

```env
DATABASE_URL="mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

This generates the type-safe Prisma Client based on your schema.

### 4. Push Schema to Database

```bash
npm run db:push
```

This syncs your Prisma schema with MongoDB (no migrations needed for MongoDB).

### 5. Seed the Database

```bash
npm run db:seed
```

This will populate the database with example products, variants, and assets.

## 📖 Usage Examples

### Import Prisma Client

```typescript
import { prisma } from "@/db";
```

### Create a Product with Variants and Assets

```typescript
const product = await prisma.product.create({
  data: {
    name: "Classic Cotton T-Shirt",
    description: "Premium quality cotton t-shirt",
    category: "T-Shirts",
    brand: "Urban Style",
    basePrice: 29.99,
    sku: "TSHIRT-001",
    isActive: true,
    variants: {
      create: [
        {
          color: "Black",
          size: "M",
          sku: "TSHIRT-001-BLK-M",
          price: 29.99,
          stockQuantity: 75,
          isAvailable: true,
        },
        // ... more variants
      ],
    },
    assets: {
      create: [
        {
          url: "/images/products/tshirt-001-main.jpg",
          altText: "Product Image",
          type: "image",
          isPrimary: true,
          displayOrder: 1,
        },
      ],
    },
  },
  include: {
    variants: true,
    assets: true,
  },
});
```

### Query Products with Relations

```typescript
// Get all products with variants and assets
const products = await prisma.product.findMany({
  include: {
    variants: true,
    assets: {
      orderBy: {
        displayOrder: "asc",
      },
    },
  },
});

// Get a single product by ID
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: {
    variants: {
      where: { isAvailable: true },
    },
    assets: {
      where: { isPrimary: true },
    },
  },
});

// Search products by name
const searchResults = await prisma.product.findMany({
  where: {
    name: {
      contains: searchQuery,
      mode: "insensitive",
    },
    isActive: true,
  },
  include: {
    variants: true,
    assets: {
      where: { isPrimary: true },
    },
  },
});
```

### Update Product Stock

```typescript
await prisma.productVariant.update({
  where: { id: variantId },
  data: {
    stockQuantity: { decrement: 1 },
  },
});
```

### Filter by Category

```typescript
const tshirts = await prisma.product.findMany({
  where: {
    category: "T-Shirts",
    isActive: true,
  },
  include: {
    variants: {
      where: { stockQuantity: { gt: 0 } },
    },
  },
});
```

### Get Products with Available Stock

```typescript
const availableProducts = await prisma.product.findMany({
  where: {
    isActive: true,
    variants: {
      some: {
        isAvailable: true,
        stockQuantity: { gt: 0 },
      },
    },
  },
  include: {
    variants: {
      where: {
        isAvailable: true,
        stockQuantity: { gt: 0 },
      },
    },
    assets: true,
  },
});
```

## 🛠️ Available Commands

```bash
# Generate Prisma Client (run after schema changes)
npm run db:generate

# Push schema to MongoDB (sync database)
npm run db:push

# Seed database with example data
npm run db:seed

# Open Prisma Studio (visual database editor)
npm run db:studio
```

## 🎨 Prisma Studio

Open a visual editor for your database:

```bash
npm run db:studio
```

Then visit `http://localhost:5555` to view and edit your data in a web interface.

## 📂 File Structure

```
prisma/
  schema.prisma           # Database schema definition

src/
  db/
    client.ts            # Prisma Client singleton
    schema.ts            # Type exports (if needed)
    index.ts             # Main exports

scripts/
  seed-example.ts        # Database seeding script
```

## 🔄 Schema Updates

When you modify `prisma/schema.prisma`:

1. **Generate Prisma Client**

   ```bash
   npm run db:generate
   ```

2. **Sync with Database**
   ```bash
   npm run db:push
   ```

Note: MongoDB with Prisma doesn't use traditional migrations. `db push` syncs your schema directly.

## 🌐 MongoDB Access

### Mongo Express (Web UI)

- URL: `http://localhost:8081`
- Username: `admin`
- Password: `admin123`

### MongoDB Connection String

```
mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin
```

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

## 🎯 TypeScript Support

Prisma provides full TypeScript support with auto-generated types:

```typescript
import type { Product, ProductVariant, ProductAsset } from "@prisma/client";

// Use Prisma's utility types
import { Prisma } from "@prisma/client";

// Product with relations
type ProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true; assets: true };
}>;
```

## ⚡ Performance Tips

1. **Use `select` to fetch only needed fields**

   ```typescript
   const products = await prisma.product.findMany({
     select: {
       id: true,
       name: true,
       basePrice: true,
     },
   });
   ```

2. **Use pagination for large datasets**

   ```typescript
   const products = await prisma.product.findMany({
     skip: (page - 1) * pageSize,
     take: pageSize,
   });
   ```

3. **Use connection pooling in production**
   - Prisma automatically manages connection pooling
   - Configure via DATABASE_URL connection parameters

## 🔐 Production Considerations

1. **Use environment variables for sensitive data**
2. **Enable connection pooling**
3. **Implement proper error handling**
4. **Add database indexes for frequently queried fields**
5. **Monitor query performance using Prisma's logging**

Happy coding! 🚀
