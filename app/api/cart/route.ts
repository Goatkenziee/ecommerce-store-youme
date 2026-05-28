import { auth } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const prisma = new PrismaClient()

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
})

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    // Create a new user in the database if they don't exist
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: '', // Placeholder, will be updated by webhook or user profile
      },
    })
    // Update the user variable for subsequent operations
    // This is a temporary fix, proper user sync should happen via webhook
    // or on first login after clerk user object is available
    Object.assign(user, newUser);
  }

  const body = await req.json()
  const validation = cartItemSchema.safeParse(body)

  if (!validation.success) {
    return new NextResponse('Invalid request body', { status: 400 })
  }

  const { productId, quantity } = validation.data

  try {
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user?.id || '', // Use user.id, if user is null, this will cause an error which is intended.
          productId,
        },
      },
    })

    if (existingCartItem) {
      const cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      })
      return NextResponse.json(cartItem)
    } else {
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: user?.id || '',
          productId,
          quantity,
        },
      })
      return NextResponse.json(cartItem)
    }
  } catch (error) {
    console.error('[CART_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PUT(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return new NextResponse('User not found', { status: 404 })
  }

  const body = await req.json()
  const validation = cartItemSchema.safeParse(body)

  if (!validation.success) {
    return new NextResponse('Invalid request body', { status: 400 })
  }

  const { productId, quantity } = validation.data

  try {
    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      data: { quantity },
    })
    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('[CART_PUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    return new NextResponse('User not found', { status: 404 })
  }

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return new NextResponse('Product ID is required', { status: 400 })
  }

  try {
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[CART_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
