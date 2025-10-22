# MongoDB Simple Setup (No Replica Set)

This project runs MongoDB in **simple development mode** without replica sets.

## Why No Replica Set?

- ✅ Simpler setup for development
- ✅ No keyfile complexity
- ✅ Faster startup
- ❌ No transactions support (we work around this)

## Important: Prisma + MongoDB Limitations

### No Migration Files

**Prisma does NOT generate migration files for MongoDB** because MongoDB is schema-less.

Instead, you use:

```bash
npm run db:push
```

This command:

- Creates/updates collections directly in MongoDB
- Creates indexes for unique fields and relations
- Does NOT create migration files
- Is the recommended approach for MongoDB with Prisma

### No Nested Creates (Transactions)

Without a replica set, you **cannot use** nested creates like this:

```typescript
// ❌ This WILL FAIL (requires transactions)
await prisma.product.create({
  data: {
    name: "T-Shirt",
    variants: {
      create: [{ color: "Black", size: "M" }],
    },
  },
});
```

Instead, use **sequential creates**:

```typescript
// ✅ This WORKS (no transactions)
const product = await prisma.product.create({
  data: { name: "T-Shirt", sku: "TS-001", basePrice: 29.99 },
});

await prisma.productVariant.createMany({
  data: [
    {
      productId: product.id,
      color: "Black",
      size: "M",
      sku: "TS-001-BLK-M",
      price: 29.99,
    },
  ],
});
```

## Setup Instructions

### 1. Start MongoDB

```bash
docker-compose up -d
```

This starts:

- MongoDB on `localhost:27017` (simple mode, no replica set)
- Mongo Express on `localhost:8081` (web UI)

### 2. Configure Environment

The `.env.local` file is already set up:

```env
DATABASE_URL="mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin"
```

Note: **No `replicaSet=rs0`** parameter!

### 3. Push Schema to MongoDB

```bash
npm run db:push
```

This creates the collections and indexes in MongoDB.

### 4. Seed with Data

```bash
npm run db:seed
```

This creates 100 products with variants and assets using **sequential creates** (no transactions).

### 5. Clear Database (Optional)

```bash
npm run db:clear
```

This removes all data from the database.

## Available Commands

```bash
# Development
npm run dev              # Start Next.js dev server

# Database
npm run db:push          # Sync Prisma schema to MongoDB
npm run db:generate      # Generate Prisma Client
npm run db:seed          # Seed with 100 products
npm run db:clear         # Clear all data
npm run db:studio        # Open Prisma Studio (GUI)

# Linting
npm run lint             # Check for errors
npm run lint:fix         # Auto-fix errors
```

## MongoDB Access

### Mongo Express (Web UI)

- URL: `http://localhost:8081`
- Username: `admin`
- Password: `admin123`

### MongoDB Connection String

```
mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin
```

## Prisma Usage Without Transactions

### ✅ Safe Operations

```typescript
// Single create
await prisma.product.create({ data: { ... } });

// Create many (batch insert)
await prisma.productVariant.createMany({ data: [...] });

// Read operations (always safe)
await prisma.product.findMany({ include: { variants: true } });

// Updates
await prisma.product.update({ where: { id }, data: { ... } });

// Deletes
await prisma.product.delete({ where: { id } });
await prisma.product.deleteMany({ where: { category: "T-Shirts" } });
```

### ❌ Operations That Require Transactions

```typescript
// Nested creates
await prisma.product.create({
  data: {
    name: "Product",
    variants: { create: [...] }  // ❌ Requires transaction
  }
});

// Nested updates with creates
await prisma.product.update({
  where: { id },
  data: {
    variants: { create: [...] }  // ❌ Requires transaction
  }
});
```

## Workaround Pattern

Instead of nested operations, use this pattern:

```typescript
// Create parent
const product = await prisma.product.create({
  data: {
    name: "Classic T-Shirt",
    sku: "TS-001",
    basePrice: 29.99,
    category: "T-Shirts",
    brand: "Urban Style",
    description: "A comfortable t-shirt",
    isActive: true,
  },
});

// Create children separately
await prisma.productVariant.createMany({
  data: [
    {
      productId: product.id,
      color: "Black",
      size: "M",
      sku: "TS-001-BLK-M",
      price: 29.99,
      stockQuantity: 50,
      isAvailable: true,
    },
    {
      productId: product.id,
      color: "White",
      size: "M",
      sku: "TS-001-WHT-M",
      price: 29.99,
      stockQuantity: 40,
      isAvailable: true,
    },
  ],
});

await prisma.productAsset.createMany({
  data: [
    {
      productId: product.id,
      url: "/images/tshirt.jpg",
      type: "image",
      isPrimary: true,
      displayOrder: 1,
    },
  ],
});
```

## When to Use Replica Sets

You should consider using replica sets if you need:

- Transactions for complex multi-document operations
- High availability and failover
- Production deployment

For development, this simple setup is perfectly fine!

## Troubleshooting

### Error: "Prisma needs to perform transactions"

**Solution:** You're using nested creates. Use sequential creates instead (see examples above).

### MongoDB won't start

```bash
# Stop containers
docker-compose down

# Remove old data
rm -rf ./mongodb_data ./mongodb_config

# Start fresh
docker-compose up -d
```

### Can't connect to MongoDB

1. Check if MongoDB is running: `docker ps`
2. Check logs: `docker logs product-catalog-mongodb`
3. Verify `.env.local` has the correct connection string
4. Make sure port 27017 is not in use by another process

## Production Considerations

For production, you should:

1. Use MongoDB Atlas (managed service) or configure a replica set
2. Use strong passwords and secure authentication
3. Enable SSL/TLS for connections
4. Set up proper backups
5. Monitor performance and connections

This simple setup is **for development only**! 🚀
