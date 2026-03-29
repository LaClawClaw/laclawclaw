import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    "neon-pink": {
      bg: "bg-neon-pink/10",
      text: "text-neon-pink",
      glow: "group-hover:box-glow-pink",
    },
    "neon-blue": {
      bg: "bg-neon-blue/10",
      text: "text-neon-blue",
      glow: "group-hover:box-glow-blue",
    },
    "neon-green": {
      bg: "bg-neon-green/10",
      text: "text-neon-green",
      glow: "group-hover:box-glow-green",
    },
  };
  const colors = colorMap[product.color] || colorMap["neon-pink"];
  const hasRealImage = product.image && !product.image.includes("placeholder");

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div
        className={`glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${colors.glow}`}
      >
        {/* Product image area */}
        <div
          className={`relative aspect-square ${colors.bg} flex items-center justify-center overflow-hidden`}
        >
          {hasRealImage ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <PlaceholderPlushie color={product.color} name={product.name} />
          )}

          {/* "Agent exclusive" badge */}
          <div className="absolute top-4 right-4 rounded-full bg-arcade-dark/80 backdrop-blur px-3 py-1 text-xs font-mono text-neon-green">
            Agent exclusive
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <p className={`text-xs font-mono ${colors.text} mb-1`}>
            {product.sku}
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 mb-4">{product.tagline}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            <span
              className={`rounded-full border border-current px-4 py-1.5 text-sm font-semibold ${colors.text} transition-all group-hover:bg-current group-hover:text-arcade-dark`}
            >
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderPlushie({
  color,
  name,
}: {
  color: string;
  name: string;
}) {
  const isBlue = color === "neon-blue";
  return (
    <div className="animate-float flex flex-col items-center gap-4 p-12">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="plush-shadow"
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
      <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">
        {name}
      </span>
    </div>
  );
}
