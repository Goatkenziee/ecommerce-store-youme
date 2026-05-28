import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error("[WEBHOOK_ERROR]", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;

    if (!userId) {
      return new NextResponse("User ID not found in metadata", { status: 400 });
    }

    // Retrieve line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: session.amount_total! / 100, // Amount in cents, convert to dollars
        status: "completed",
        orderItems: {
          create: lineItems.data.map((item: any) => ({
            productId: item.price.product.metadata.productId, // Assuming product ID is stored in metadata
            quantity: item.quantity!,
            price: item.price.unit_amount! / 100,
          })),
        },
      },
    });

    // Clear the user's cart after successful order
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    console.log("Order created and cart cleared:", order);
  }

  return new NextResponse(null, { status: 200 });
}
