# LaClawClaw — Agent-Native Commerce

The first e-commerce store built for AI agent customers.

## Architecture

```
laclawclaw.com          → Static landing page (Caddy)
api.laclawclaw.com      → Agent ordering API (Node.js)
docs.laclawclaw.com     → Integration docs
```

**Backend**: Shopify (headless) for payments, fulfillment, trust
**Frontend**: None for ordering — agents use the API directly
**Landing**: Static HTML brand page for humans

## Quick Start

```bash
# Local dev
cd api && npm install && npm run dev

# The API runs on :3100
curl http://localhost:3100/health
curl http://localhost:3100/v1/products
```

## Agent Integration Spec

### 1. Discovery

Agents discover LaClawClaw via the well-known endpoint:

```
GET https://api.laclawclaw.com/.well-known/agent.json
```

Returns API base URL, available endpoints, and auth instructions.

### 2. Registration

A human operator registers their agent:

```bash
curl -X POST https://api.laclawclaw.com/v1/agents/register \
  -H "Authorization: Bearer <MASTER_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "ShoppingBot v1",
    "operator_email": "dev@example.com",
    "webhook_url": "https://example.com/webhooks/laclawclaw"
  }'
```

Returns `agent_id` and `api_key`. The agent uses the API key for all subsequent requests.

### 3. Product Discovery

```bash
curl https://api.laclawclaw.com/v1/products
```

Returns structured product data optimized for machine parsing:

```json
{
  "products": [
    {
      "sku": "LCC-001",
      "name": "Agent Starter Kit",
      "price": { "amount": "49.00", "currency": "USD" },
      "available": true,
      "metadata": {
        "type": "subscription",
        "includes": ["api_access", "sandbox", "test_credits_100"]
      }
    }
  ]
}
```

### 4. Place an Order

```bash
curl -X POST https://api.laclawclaw.com/v1/orders \
  -H "Authorization: Bearer <AGENT_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{ "sku": "LCC-001", "quantity": 1 }],
    "shipping": { "method": "digital" }
  }'
```

### 5. Order Confirmation

Orders return structured confirmation:

```json
{
  "order": {
    "order_id": "ord_abc123",
    "status": "pending_payment",
    "line_items": [...],
    "total": { "amount": "49.00", "currency": "USD" },
    "checkout_url": "https://...",
    "created": "2026-03-29T..."
  }
}
```

Webhook callbacks deliver real-time status updates to the agent's registered URL.

## Deployment

Hosted on Hetzner CPX11 (€4.85/mo). See `infra/setup-hetzner.sh`.

**DNS (Cloudflare)**:
- `@` → A record → server IP (proxied)
- `api` → A record → server IP (proxied)
- `docs` → A record → server IP (proxied)

## SKUs

| SKU | Name | Price | Type |
|-----|------|-------|------|
| LCC-001 | Agent Starter Kit | $49 | One-time |
| LCC-002 | Agent Commerce License | $199/mo | Subscription |

## Repo Structure

```
landing/     → Static landing page HTML
api/         → Node.js agent ordering API
docs/        → Integration documentation
infra/       → Hetzner setup, Caddyfile
scripts/     → Deploy and utility scripts
```

## Contact

founders@injester.com
