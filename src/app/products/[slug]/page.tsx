import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { PRODUCTS, getProduct } from "@/lib/products";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const isBlue = product.color === "neon-blue";
  const accent = isBlue ? "neon-blue" : "neon-pink";

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 pt-28 pb-24">
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors"
        >
          &larr; Back to prizes
        </Link>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Product image */}
          <div
            className={`aspect-square rounded-2xl bg-${accent}/5 border border-${accent}/10 flex items-center justify-center relative overflow-hidden`}
          >
            {/* Placeholder plushie */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 120 120"
              fill="none"
              className="plush-shadow animate-float"
            >
              <circle
                cx="60"
                cy="55"
                r="35"
                fill={isBlue ? "#00d4ff" : "#ff2d7b"}
                opacity="0.2"
              />
              <circle
                cx="60"
                cy="55"
                r="30"
                fill={isBlue ? "#00d4ff" : "#ff2d7b"}
                opacity="0.3"
              />
              <circle cx="48" cy="50" r="4" fill="white" opacity="0.8" />
              <circle cx="72" cy="50" r="4" fill="white" opacity="0.8" />
              <circle cx="49" cy="49" r="2" fill="#0a0a12" />
              <circle cx="73" cy="49" r="2" fill="#0a0a12" />
              <path
                d="M50 62 Q60 70 70 62"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
              <circle
                cx="38"
                cy="30"
                r="12"
                fill={isBlue ? "#00d4ff" : "#ff2d7b"}
                opacity="0.25"
              />
              <circle
                cx="82"
                cy="30"
                r="12"
                fill={isBlue ? "#00d4ff" : "#ff2d7b"}
                opacity="0.25"
              />
              <ellipse
                cx="60"
                cy="95"
                rx="22"
                ry="15"
                fill={isBlue ? "#00d4ff" : "#ff2d7b"}
                opacity="0.15"
              />
            </svg>

            <div className="absolute top-4 right-4 rounded-full bg-arcade-dark/80 backdrop-blur px-3 py-1 text-xs font-mono text-neon-green">
              Agent exclusive
            </div>
          </div>

          {/* Product details */}
          <div className="flex flex-col justify-center">
            <p className={`text-xs font-mono text-${accent} mb-2`}>
              {product.sku}
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-gray-400 mb-6">{product.tagline}</p>

            <p className="text-gray-300 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 mb-1">USD</span>
            </div>

            <AddToCartButton product={product} />

            {/* Agent gate notice */}
            <div className="mt-6 glass rounded-xl p-4 flex items-start gap-3">
              <span className="text-neon-purple text-lg mt-0.5">&#9881;</span>
              <div>
                <p className="text-sm font-semibold text-gray-200 mb-1">
                  Agent-gated checkout
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  You can add to cart and browse freely. When you&apos;re ready
                  to buy, your AI agent will complete the purchase for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
