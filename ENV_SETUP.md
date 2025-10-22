# Environment Setup

This project uses environment variables to configure the MongoDB connection and other settings.

## Environment Files

### `.env.local` (Required - Not in Git)

This file contains your local environment variables and **should not be committed** to Git.

Create this file in the root of your project:

```bash
# .env.local
DATABASE_URL="mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin"
```

### `.env` (Template - In Git)

This file serves as a template showing which environment variables are needed. It's safe to commit to Git.

## Quick Setup

1. **Copy the template to create your local environment file:**

   ```bash
   cp .env .env.local
   ```

2. **Or create `.env.local` manually:**
   ```bash
   echo 'DATABASE_URL="mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin"' > .env.local
   ```

## How Next.js Loads Environment Variables

Next.js automatically loads environment variables from:

1. `.env.local` - Local overrides (highest priority)
2. `.env.development` - Development environment
3. `.env.production` - Production environment
4. `.env` - All environments (lowest priority)

**Note:** `.env.local` is always ignored by Git and should contain your secrets.

## Using Environment Variables

### In Server Components and API Routes

```typescript
// Direct access to process.env
const dbUrl = process.env.DATABASE_URL;
```

### In Prisma Client

Prisma automatically reads `DATABASE_URL` from your environment:

```typescript
// src/db/client.ts
import { PrismaClient } from "@prisma/client";

// Prisma will use DATABASE_URL from .env.local
export const prisma = new PrismaClient();
```

### In Client Components

To expose variables to the browser, prefix them with `NEXT_PUBLIC_`:

```bash
# .env.local
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

```typescript
// Can be used in client components
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Production Setup

For production, update your `.env.local` or set environment variables in your hosting platform:

```bash
# Production MongoDB URL example
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/product_catalog?retryWrites=true&w=majority"
```

### Popular Hosting Platforms

**Vercel:**

- Add environment variables in Project Settings → Environment Variables

**Netlify:**

- Add in Site Settings → Environment Variables

**Railway/Render:**

- Add in your service's Environment tab

## Security Best Practices

1. ✅ **Never commit `.env.local`** - It's in `.gitignore`
2. ✅ **Use strong passwords** for production databases
3. ✅ **Rotate credentials** regularly
4. ✅ **Use different credentials** for development and production
5. ✅ **Prefix client-side variables** with `NEXT_PUBLIC_` only when necessary

## Troubleshooting

### Prisma can't connect to database

1. Verify `.env.local` exists
2. Check the `DATABASE_URL` format
3. Ensure MongoDB is running (`docker-compose up -d`)
4. Try regenerating Prisma Client: `npm run db:generate`

### Environment variables not updating

1. Restart Next.js dev server
2. Clear Next.js cache: `rm -rf .next`
3. Verify you're editing `.env.local` not `.env`

## Current MongoDB Configuration

**Default Development Setup (via Docker):**

- Host: `localhost`
- Port: `27017`
- Username: `admin`
- Password: `password123`
- Database: `product_catalog`
- Auth Database: `admin`

**Connection String:**

```
mongodb://admin:password123@localhost:27017/product_catalog?authSource=admin
```

For different credentials, update your `.env.local` file accordingly.
