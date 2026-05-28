import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingCartIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function Navbar() {
  const { userId } = auth();
  let cartItemCount = 0;

  if (userId) {
    const cart = await prisma.cartItem.findMany({
      where: { userId },
    });
    cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <nav className="bg-gray-800 p-4 text-white fixed w-full z-10 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <p className="text-2xl font-bold flex items-center">
            <HomeIcon className="h-6 w-6 mr-2" /> E-commerce
          </p>
        </Link>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/admin/products">
              <p className="flex items-center hover:text-gray-300">
                <UserGroupIcon className="h-5 w-5 mr-1" /> Admin
              </p>
            </Link>
            <Link href="/cart">
              <p className="relative flex items-center hover:text-gray-300">
                <ShoppingCartIcon className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
                <span className="ml-1">Cart</span>
              </p>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
