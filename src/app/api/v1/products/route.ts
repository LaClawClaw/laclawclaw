import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

export async function GET() {
  // Return local product catalog
  // When Shopify is fully wired, this will fetch from Storefront API
  return NextResponse.json({
    products: PRODUCTS.map((p) => ({
      sku: p.sku,
      name: p.name,
      description: p.description,
      price: { amount: p.price.toFixed(2), currency: p.currency },
      available: p.available,
      slug: p.slug,
    })),
    total: PRODUCTS.length,
    api_version: "2026-03-29",
  });
}
