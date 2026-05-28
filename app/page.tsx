import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function Home() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const products = await prisma.product.findMany()

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg shadow-md overflow-hidden">
              <Image src={product.imageUrl} alt={product.name} width={400} height={300} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${(product.price / 100).toFixed(2)}</span>
                  <Link href={`/product/${product.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
