import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const prisma = new PrismaClient()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.error('[WEBHOOK_ERROR]', error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    const userId = session.metadata?.userId
    const customerEmail = session.customer_details?.email

    if (!userId || !customerEmail) {
      return new NextResponse('Missing metadata', { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      return new NextResponse('Cart is empty', { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: session.amount_total || 0,
        status: 'PAID',
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    })

    await prisma.cartItem.deleteMany({
      where: { userId },
    })

    // Optionally, update user's email if it was a placeholder
    if (user.email === '') {
      await prisma.user.update({
        where: { id: user.id },
        data: { email: customerEmail },
      })
    }

    console.log('Order created and cart cleared for user:', userId)
  }

  return new NextResponse(null, { status: 200 })
}
