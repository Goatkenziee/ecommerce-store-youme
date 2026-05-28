"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  price: number;
}

export default function AddToCartButton({ productId, price }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity, price }),
      });

      if (response.ok) {
        alert("Item added to cart!");
        router.refresh(); // Refresh to update cart count in Navbar
      } else {
        const errorData = await response.json();
        alert(`Failed to add item to cart: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-20 border border-gray-300 rounded-md py-2 px-3 text-center"
      />
      <button
        onClick={handleAddToCart}
        className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
}
