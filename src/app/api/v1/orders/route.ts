import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        error: "unauthorized",
        hint: "Include Authorization: Bearer <api_key> header",
      },
      { status: 401 }
    );
  }

  const body = await req.json();
  if (!body.items?.length) {
    return NextResponse.json(
      {
        error: "missing_items",
        example: { items: [{ sku: "LCC-PLUSH-001", quantity: 1 }] },
      },
      { status: 400 }
    );
  }

  // Validate SKUs
  const invalidSkus = body.items.filter(
    (i: { sku: string }) => !PRODUCTS.find((p) => p.sku === i.sku)
  );
  if (invalidSkus.length) {
    return NextResponse.json(
      {
        error: "invalid_sku",
        invalid: invalidSkus.map((i: { sku: string }) => i.sku),
        available: PRODUCTS.map((p) => p.sku),
      },
      { status: 400 }
    );
  }

  const lineItems = body.items.map(
    (item: { sku: string; quantity?: number }) => {
      const product = PRODUCTS.find((p) => p.sku === item.sku)!;
      const qty = item.quantity || 1;
      return {
        sku: item.sku,
        name: product.name,
        quantity: qty,
        unit_price: { amount: product.price.toFixed(2), currency: "USD" },
        line_total: {
          amount: (product.price * qty).toFixed(2),
          currency: "USD",
        },
      };
    }
  );

  const total = lineItems.reduce(
    (sum: number, li: { line_total: { amount: string } }) =>
      sum + parseFloat(li.line_total.amount),
    0
  );

  const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  // TODO: create Shopify checkout via Storefront API
  return NextResponse.json(
    {
      order: {
        order_id: orderId,
        status: "pending_payment",
        line_items: lineItems,
        total: { amount: total.toFixed(2), currency: "USD" },
        shipping: body.shipping || null,
        created: new Date().toISOString(),
        note: "Agent order received — Shopify checkout creation pending",
      },
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({
    orders: [],
    total: 0,
    note: "Order persistence coming soon",
  });
}
