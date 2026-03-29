import { NextRequest, NextResponse } from "next/server";

const API_MASTER_KEY = process.env.API_MASTER_KEY;

function generateKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "lcc_";
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ") || auth.slice(7) !== API_MASTER_KEY) {
    return NextResponse.json(
      {
        error: "operator_auth_required",
        hint: "Use master API key to register agents",
      },
      { status: 401 }
    );
  }

  const body = await req.json();
  if (!body.agent_name || !body.operator_email) {
    return NextResponse.json(
      {
        error: "missing_fields",
        required: ["agent_name", "operator_email"],
        optional: ["agent_description", "webhook_url"],
      },
      { status: 400 }
    );
  }

  const agentId = `agent_${generateKey().slice(4, 14)}`;
  const apiKey = generateKey();

  // TODO: persist to database
  return NextResponse.json(
    {
      agent_id: agentId,
      api_key: apiKey,
      scopes: ["products:read", "orders:create", "orders:read"],
      message: "Store this API key securely — it cannot be retrieved later.",
    },
    { status: 201 }
  );
}
