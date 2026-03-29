import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

// --- Config ---
const PORT = process.env.PORT || 3100;
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_MASTER_KEY = process.env.API_MASTER_KEY;

// --- In-memory agent registry (replace with DB later) ---
const agents = new Map();
const apiKeys = new Map(); // key -> { operatorId, agentId, scopes, created }

// --- Placeholder SKUs (until Shopify is connected) ---
const CATALOG = [
  {
    sku: 'LCC-001',
    name: 'Agent Starter Kit',
    description: 'Everything an AI agent needs to start transacting. Includes API documentation, sandbox access, and 100 test credits.',
    price: { amount: '49.00', currency: 'USD' },
    available: true,
    category: 'digital',
    metadata: {
      type: 'subscription',
      billing_cycle: 'one-time',
      includes: ['api_access', 'sandbox', 'test_credits_100']
    }
  },
  {
    sku: 'LCC-002',
    name: 'Agent Commerce License',
    description: 'Production API access for AI agents. Unlimited orders, webhook integrations, priority support.',
    price: { amount: '199.00', currency: 'USD' },
    available: true,
    category: 'digital',
    metadata: {
      type: 'subscription',
      billing_cycle: 'monthly',
      includes: ['production_api', 'unlimited_orders', 'webhooks', 'priority_support']
    }
  }
];

// --- Helpers ---
function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-API-Version': '2026-03-29',
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {});
      } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function authenticate(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);

  // Master key grants full access (for operator setup)
  if (token === API_MASTER_KEY) return { role: 'operator', id: 'master' };

  // Agent API key
  const agent = apiKeys.get(token);
  if (agent) return { role: 'agent', ...agent };

  return null;
}

function generateKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'lcc_';
  for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

// --- Router ---
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Agent-Id',
    });
    return res.end();
  }

  // --- Public endpoints (no auth) ---

  // Agent discovery document
  if (path === '/.well-known/agent.json' && method === 'GET') {
    return json(res, 200, {
      name: 'LaClawClaw',
      description: 'Agent-native commerce API',
      api_version: '2026-03-29',
      base_url: 'https://api.laclawclaw.com/v1',
      auth: {
        type: 'bearer_token',
        registration: 'https://api.laclawclaw.com/v1/agents/register',
        docs: 'https://docs.laclawclaw.com/auth'
      },
      endpoints: {
        products: '/v1/products',
        orders: '/v1/orders',
        order_status: '/v1/orders/:id',
        agent_register: '/v1/agents/register'
      },
      contact: 'founders@injester.com'
    });
  }

  // Health check
  if (path === '/health' && method === 'GET') {
    return json(res, 200, {
      status: 'ok',
      version: '0.1.0',
      timestamp: new Date().toISOString()
    });
  }

  // --- Product catalog (public, no auth required) ---
  if (path === '/v1/products' && method === 'GET') {
    return json(res, 200, {
      products: CATALOG,
      total: CATALOG.length,
      api_version: '2026-03-29'
    });
  }

  if (path.startsWith('/v1/products/') && method === 'GET') {
    const sku = path.split('/').pop();
    const product = CATALOG.find(p => p.sku === sku);
    if (!product) return json(res, 404, { error: 'product_not_found', sku });
    return json(res, 200, { product });
  }

  // --- Agent registration (requires operator auth) ---
  if (path === '/v1/agents/register' && method === 'POST') {
    const auth = authenticate(req);
    if (!auth || auth.role !== 'operator') {
      return json(res, 401, { error: 'operator_auth_required', hint: 'Use master API key to register agents' });
    }

    const body = await parseBody(req);
    if (!body.agent_name || !body.operator_email) {
      return json(res, 400, {
        error: 'missing_fields',
        required: ['agent_name', 'operator_email'],
        optional: ['agent_description', 'webhook_url', 'scopes']
      });
    }

    const agentId = `agent_${generateKey().slice(4, 14)}`;
    const apiKey = generateKey();
    const agent = {
      agentId,
      agentName: body.agent_name,
      operatorEmail: body.operator_email,
      description: body.agent_description || '',
      webhookUrl: body.webhook_url || null,
      scopes: body.scopes || ['products:read', 'orders:create', 'orders:read'],
      created: new Date().toISOString()
    };

    agents.set(agentId, agent);
    apiKeys.set(apiKey, { operatorId: auth.id, agentId, scopes: agent.scopes, created: agent.created });

    return json(res, 201, {
      agent_id: agentId,
      api_key: apiKey,
      scopes: agent.scopes,
      message: 'Store this API key securely — it cannot be retrieved later.'
    });
  }

  // --- Authenticated endpoints ---
  const auth = authenticate(req);
  if (!auth) {
    return json(res, 401, {
      error: 'unauthorized',
      hint: 'Include Authorization: Bearer <api_key> header',
      register: 'POST /v1/agents/register'
    });
  }

  // Create order
  if (path === '/v1/orders' && method === 'POST') {
    const body = await parseBody(req);

    if (!body.items?.length) {
      return json(res, 400, {
        error: 'missing_items',
        example: { items: [{ sku: 'LCC-001', quantity: 1 }] }
      });
    }

    // Validate all SKUs
    const invalidSkus = body.items.filter(i => !CATALOG.find(p => p.sku === i.sku));
    if (invalidSkus.length) {
      return json(res, 400, {
        error: 'invalid_sku',
        invalid: invalidSkus.map(i => i.sku),
        available: CATALOG.map(p => p.sku)
      });
    }

    // Calculate total
    const lineItems = body.items.map(item => {
      const product = CATALOG.find(p => p.sku === item.sku);
      return {
        sku: item.sku,
        name: product.name,
        quantity: item.quantity || 1,
        unit_price: product.price,
        line_total: {
          amount: (parseFloat(product.price.amount) * (item.quantity || 1)).toFixed(2),
          currency: product.price.currency
        }
      };
    });

    const total = lineItems.reduce((sum, li) => sum + parseFloat(li.line_total.amount), 0);

    const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const order = {
      order_id: orderId,
      status: 'pending_payment',
      agent_id: auth.agentId || auth.id,
      line_items: lineItems,
      total: { amount: total.toFixed(2), currency: 'USD' },
      shipping: body.shipping || null,
      created: new Date().toISOString(),
      // In production, this would create a Shopify checkout
      checkout_url: SHOPIFY_DOMAIN
        ? `https://${SHOPIFY_DOMAIN}/checkout?order=${orderId}`
        : null,
      note: 'Placeholder order — Shopify integration pending'
    };

    return json(res, 201, { order });
  }

  // List orders (placeholder)
  if (path === '/v1/orders' && method === 'GET') {
    return json(res, 200, {
      orders: [],
      total: 0,
      note: 'Order persistence coming soon'
    });
  }

  // Agent info
  if (path === '/v1/agents/me' && method === 'GET') {
    const agentInfo = agents.get(auth.agentId);
    if (!agentInfo) return json(res, 200, { agent: { id: auth.id, role: auth.role } });
    return json(res, 200, { agent: agentInfo });
  }

  // 404
  return json(res, 404, {
    error: 'not_found',
    path,
    available_endpoints: [
      'GET  /.well-known/agent.json',
      'GET  /health',
      'GET  /v1/products',
      'GET  /v1/products/:sku',
      'POST /v1/agents/register',
      'POST /v1/orders',
      'GET  /v1/orders',
      'GET  /v1/agents/me'
    ]
  });
}

// --- Server ---
const server = createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error(`${req.method} ${req.url} Error:`, err.message);
    json(res, 500, { error: 'internal_error', message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`LaClawClaw API running on :${PORT}`);
  console.log(`Shopify: ${SHOPIFY_DOMAIN || 'not configured'}`);
});
