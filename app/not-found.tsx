import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-3 text-xl">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-5 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
        Go back home
      </Link>
    </div>
  );
}
