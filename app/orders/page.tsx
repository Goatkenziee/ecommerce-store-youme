import Navbar from '@/components/Navbar'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const prisma = new PrismaClient()

export default async function OrdersPage() {
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

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        {
          orders.length === 0 ? (
            <p>You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
                    <span className="text-lg font-bold">Total: ${(order.totalAmount / 100).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 mb-4">Status: {order.status}</p>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center border rounded-lg p-4 shadow-sm">
                        <Image src={item.product.imageUrl} alt={item.product.name} width={80} height={80} className="w-20 h-20 object-cover rounded-md" />
                        <div className="ml-4 flex-grow">
                          <h3 className="text-lg font-semibold">{item.product.name}</h3>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-md font-bold">${(item.price / 100).toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </main>
    </>
  )
}
