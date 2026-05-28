import { auth } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const prisma = new PrismaClient()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
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

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  })

  if (cartItems.length === 0) {
    return new NextResponse('Cart is empty', { status: 400 })
  }

  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        images: [item.product.imageUrl],
      },
      unit_amount: item.product.price,
    },
    quantity: item.quantity,
  }))

  try {
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[STRIPE_CHECKOUT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
