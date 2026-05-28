import Navbar from '@/components/Navbar'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const prisma = new PrismaClient()

export default async function AdminProductsPage() {
  const { userId } = auth()

  // In a real app, you'd check for admin role here
  if (!userId) {
    redirect('/sign-in')
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Link href="/admin/products/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add New Product
          </Link>
        </div>

        {
          products.length === 0 ? (
            <p>No products found. Add a new product to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg shadow-md overflow-hidden">
                  <Image src={product.imageUrl} alt={product.name} width={400} height={300} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-4">${(product.price / 100).toFixed(2)}</p>
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/products/${product.id}`} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                        Edit
                      </Link>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    </div>
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
