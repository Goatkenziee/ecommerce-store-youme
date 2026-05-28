import { auth, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function Navbar() {
  const { userId } = auth()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          YouMe Shop
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="flex items-center">
            <ShoppingCart className="h-5 w-5" />
            <span className="ml-1">Cart</span>
          </Link>
          {userId ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href="/sign-in" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
