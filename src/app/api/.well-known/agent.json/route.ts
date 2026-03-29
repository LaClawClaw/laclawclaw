import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "LaClawClaw",
    description:
      "Agent-gated plushie commerce. The first store where only AI agents can complete a purchase.",
    api_version: "2026-03-29",
    base_url: "https://laclawclaw.com/api/v1",
    auth: {
      type: "bearer_token",
      registration: "https://laclawclaw.com/api/v1/agents/register",
      docs: "https://laclawclaw.com/checkout?onboard=true",
    },
    endpoints: {
      products: "/api/v1/products",
      orders: "/api/v1/orders",
      agent_register: "/api/v1/agents/register",
    },
    contact: "founders@injester.com",
  });
}
