"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("lcc-cart") || "[]");
    const existing = cart.find((item: { sku: string }) => item.sku === product.sku);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    }
    localStorage.setItem("lcc-cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full rounded-full py-4 font-semibold text-lg transition-all ${
        added
          ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
          : "bg-neon-pink text-white box-glow-pink hover:scale-[1.02]"
      }`}
    >
      {added ? "Added to cart!" : "Add to cart"}
    </button>
  );
}
