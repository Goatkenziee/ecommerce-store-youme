import Navbar from '@/components/Navbar'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

const productSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required.' }),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: 'Invalid price format.' }).transform(val => Math.round(parseFloat(val) * 100)),
  imageUrl: z.string().url({ message: 'Invalid image URL.' }),
})

interface ProductFormPageProps {
  params: {
    id: string
  }
}

export default async function ProductFormPage({ params }: ProductFormPageProps) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const isEdit = params.id !== 'new'
  let product = null

  if (isEdit) {
    product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      redirect('/admin/products') // Or show a 404
    }
  }

  async function saveProduct(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const imageUrl = formData.get('imageUrl') as string

    const parsedProduct = productSchema.safeParse({ name, description, price, imageUrl })

    if (!parsedProduct.success) {
      // In a real app, you'd handle errors more gracefully, e.g., re-render with errors
      console.error(parsedProduct.error.flatten())
      return
    }

    try {
      if (isEdit) {
        await prisma.product.update({
          where: { id: params.id },
          data: parsedProduct.data,
        })
      } else {
        await prisma.product.create({
          data: parsedProduct.data,
        })
      }
      revalidatePath('/admin/products')
      redirect('/admin/products')
    } catch (error) {
      console.error('Failed to save product', error)
    }
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <form action={saveProduct} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={product?.name || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description || ''}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="text"
              id="price"
              name="price"
              defaultValue={(product?.price / 100).toFixed(2) || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              defaultValue={product?.imageUrl || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </main>
    </>
  )
}
