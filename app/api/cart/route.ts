import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    // Transform cart items to include product details directly
    const formattedCartItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.product.price, // Corrected to access price from product
      quantity: item.quantity,
    }));

    return NextResponse.json({ cartItems: formattedCartItems });
  } catch (error) {
    console.error("[CART_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  const { productId, quantity, price } = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!productId || !quantity || !price) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existingCartItem) {
      const cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
      return NextResponse.json(cartItem);
    } else {
      const cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          price,
        },
      });
      return NextResponse.json(cartItem);
    }
  } catch (error) {
    console.error("[CART_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { userId } = auth();
  const { productId, quantity } = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!productId || !quantity) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const cartItem = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("[CART_PUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  const { productId } = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!productId) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("[CART_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
