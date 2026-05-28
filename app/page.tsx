import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to YouMe E-commerce</h1>
      <p className="text-lg mb-8">Your one-stop shop for amazing products.</p>
      <div className="flex space-x-4">
        <Link href="/products" className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75">
          Shop Products
        </Link>
        <Link href="/admin/products" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-75">
          Admin Products
        </Link>
      </div>
    </main>
  );
}
