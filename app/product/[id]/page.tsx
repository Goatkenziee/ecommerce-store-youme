import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Product Not Found</h1>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Image src={product.imageUrl} alt={product.name} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-700 text-lg mb-6">{product.description}</p>
            <span className="text-3xl font-bold text-blue-600">${(product.price / 100).toFixed(2)}</span>
            <button className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
