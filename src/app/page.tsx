import { prisma } from "../db";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  // Fetch first 20 products with their primary image
  const products = await prisma.product.findMany({
    take: 20,
    where: {
      isActive: true,
    },
    include: {
      assets: {
        where: {
          isPrimary: true,
        },
        take: 1,
      },
      variants: {
        take: 1,
        orderBy: {
          price: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Catalog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Browse our collection of {products.length} products
          </p>
        </header>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No products found. Seed the database to get started!
            </p>
            <code className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded">
              npm run db:seed
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: (typeof products)[0]) => {
              const primaryImage = product.assets[0];
              const minPrice = product.variants[0]?.price || product.basePrice;

              return (
                <Link
                  key={product.id}
                  href={`/${product.id}`}
                  className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.altText || product.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {product.brand}
                      </p>
                    )}
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      ${minPrice.toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
