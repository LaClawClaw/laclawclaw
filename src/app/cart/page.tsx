"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { PRODUCTS } from "@/lib/products";

interface CartItem {
  sku: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem("lcc-cart") || "[]");
    setCart(stored);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("lcc-cart", JSON.stringify(newCart));
  };

  const removeItem = (sku: string) => {
    updateCart(cart.filter((item) => item.sku !== sku));
  };

  const updateQuantity = (sku: string, delta: number) => {
    updateCart(
      cart
        .map((item) =>
          item.sku === sku
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!mounted) return null;

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 pt-28 pb-24">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-8">
          Your cart
        </h1>

        {cart.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-gray-400 mb-6">Nothing in the claw yet.</p>
            <Link
              href="/#products"
              className="inline-flex rounded-full bg-neon-pink px-6 py-3 font-semibold text-white box-glow-pink"
            >
              Browse prizes
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.sku === item.sku);
                const accent =
                  product?.color === "neon-blue" ? "neon-blue" : "neon-pink";
                return (
                  <div
                    key={item.sku}
                    className="glass rounded-xl p-5 flex items-center gap-5"
                  >
                    {/* Mini placeholder */}
                    <div
                      className={`h-16 w-16 rounded-lg bg-${accent}/10 flex items-center justify-center shrink-0`}
                    >
                      <span className="text-2xl">
                        {accent === "neon-blue" ? "🎮" : "🧸"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-gray-400 font-mono">
                        {item.sku}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.sku, -1)}
                        className="h-8 w-8 rounded-full border border-arcade-border text-gray-400 hover:text-white hover:border-white transition-colors flex items-center justify-center"
                      >
                        &minus;
                      </button>
                      <span className="font-mono w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, 1)}
                        className="h-8 w-8 rounded-full border border-arcade-border text-gray-400 hover:text-white hover:border-white transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right w-20">
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.sku)}
                      className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total + checkout */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400">Total</span>
                <span className="text-3xl font-bold">${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full rounded-full bg-neon-pink py-4 text-center font-semibold text-lg text-white box-glow-pink hover:scale-[1.02] transition-all"
              >
                Proceed to agent checkout
              </Link>

              <p className="text-center text-xs text-gray-500 mt-4">
                Your AI agent will complete the purchase at checkout
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
