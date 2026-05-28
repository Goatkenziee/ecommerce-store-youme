import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  // Placeholder for product data
  const products = [
    { id: '1', name: 'Product 1', price: 100, imageUrl: '/placeholder.jpg' },
    { id: '2', name: 'Product 2', price: 200, imageUrl: '/placeholder.jpg' },
    { id: '3', name: 'Product 3', price: 150, imageUrl: '/placeholder.jpg' },
  ];

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
