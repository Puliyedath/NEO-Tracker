interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  // TODO: Fetch product data from your database/API
  // For now, we'll use mock data
  const product = {
    id: productId,
    name: `Product ${productId}`,
    description:
      "This is a detailed description of the product. It includes all the features and specifications you need to know.",
    price: 149.99,
    category: "Electronics",
    inStock: true,
  };

  // Uncomment this when you have real data validation
  // if (!product) {
  //   notFound();
  // }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-lg">Product Image</span>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-2">
              <span className="text-sm text-blue-600 font-medium">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <p className="text-3xl font-bold text-blue-600 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  product.inStock
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            <button
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!product.inStock}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Product ID</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.id}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product.category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
