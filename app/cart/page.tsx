import Navbar from '@/components/Navbar'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const prisma = new PrismaClient()

export default async function CartPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">User Not Found</h1>
        </main>
      </>
    )
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  })

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {
          cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border rounded-lg p-4 shadow-sm">
                  <Image src={item.product.imageUrl} alt={item.product.name} width={100} height={100} className="w-24 h-24 object-cover rounded-md" />
                  <div className="ml-4 flex-grow">
                    <h2 className="text-xl font-semibold">{item.product.name}</h2>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-lg font-bold">${((item.quantity * item.product.price) / 100).toFixed(2)}</p>
                  </div>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Remove</button>
                </div>
              ))}
              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className="text-2xl font-bold">Total: ${(total / 100).toFixed(2)}</span>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )
        }
      </main>
    </>
  )
}
