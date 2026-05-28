import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
        <p className="text-lg mb-8">Thank you for your purchase. Your order has been placed.</p>
        <Link href="/orders" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl">
          View Your Orders
        </Link>
        <Link href="/" className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg text-xl">
          Continue Shopping
        </Link>
      </main>
    </>
  )
}
