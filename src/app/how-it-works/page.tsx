import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How LaClawClaw works — agent commerce in four protocols",
  description:
    "Agent discovers the AWP manifest, speaks MCP to build a cart, gets a Stripe payment link, hands it to the human. Full flow, copy-pasteable code.",
};

const MCP_CONFIG_SNIPPET = `{
  "mcpServers": {
    "laclawclaw": {
      "url": "https://agent.laclawclaw.com/mcp"
    }
  }
}`;

const CURL_MCP_LIST = `curl -sS https://agent.laclawclaw.com/mcp \\
  -H 'Content-Type: application/json' \\
  -H 'Accept: application/json, text/event-stream' \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'`;

const CURL_AWP_DISCOVERY = `curl -sS https://laclawclaw.com/.well-known/agent.json

# Returns the full AWP v0.2 manifest — every protocol we speak,
# every action we expose. No config required on the agent side.`;

const CURL_A2A_CHECKOUT = `curl -sS -X POST https://agent.laclawclaw.com/agent/message \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer <agent_key>' \\
  -d '{
    "type": "acp-request",
    "from": "your-agent",
    "payload": {
      "operation": "checkout.create",
      "params": {}
    }
  }'`;

export default function HowItWorks() {
  return (
    <main className="howitworks">
      <style>{`
        body { background: #05070b; color: #f5f7fb; }
        .howitworks {
          max-width: 980px;
          margin: 0 auto;
          padding: 64px 24px 120px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          display: grid;
          gap: 56px;
        }
        .back-home {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.82rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .back-home:hover { color: #fff; }

        .hiw-hero { display: grid; gap: 18px; }
        .eyebrow-tag {
          justify-self: start;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 0.74rem;
          color: #ffd166;
          padding: 8px 14px;
          border: 1px solid rgba(255,209,102,0.3);
          background: rgba(255,209,102,0.06);
          border-radius: 999px;
        }
        .hiw-hero h1 {
          margin: 0;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          line-height: 1.02;
          letter-spacing: -0.04em;
          max-width: 820px;
        }
        .hiw-hero p.lede {
          margin: 0;
          color: rgba(255,255,255,0.72);
          font-size: clamp(1.02rem, 1.5vw, 1.2rem);
          line-height: 1.55;
          max-width: 720px;
        }

        .protocol-strip {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .proto-badge {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.82rem;
          padding: 6px 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          border-radius: 6px;
          letter-spacing: 0.05em;
        }
        .proto-badge strong { color: #9be7c9; font-weight: 700; }

        .section { display: grid; gap: 16px; }
        .section h2 {
          margin: 0;
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          letter-spacing: -0.02em;
        }
        .section h2 .dim { color: rgba(255,255,255,0.4); font-weight: 400; }
        .section p {
          margin: 0;
          color: rgba(255,255,255,0.75);
          line-height: 1.65;
          max-width: 740px;
        }

        .flow {
          display: grid;
          gap: 14px;
          margin-top: 8px;
        }
        .flow-step {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 18px;
          align-items: start;
          padding: 18px 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025);
          border-radius: 14px;
        }
        .flow-step.highlight {
          border-color: rgba(255,209,102,0.3);
          background: rgba(255,209,102,0.04);
        }
        .flow-num {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 1.8rem;
          font-weight: 700;
          color: #9be7c9;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .flow-step.highlight .flow-num { color: #ffd166; }
        .flow-body { display: grid; gap: 6px; }
        .flow-title {
          font-weight: 600;
          font-size: 1.05rem;
        }
        .flow-desc {
          color: rgba(255,255,255,0.68);
          font-size: 0.95rem;
          line-height: 1.55;
        }
        .flow-tag {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.78rem;
          color: #89d8ff;
        }

        .code-block {
          background: #0a0d12;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 18px 20px;
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 0.88rem;
          line-height: 1.6;
          overflow-x: auto;
          white-space: pre;
          color: rgba(255,255,255,0.88);
        }
        .code-label {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.48);
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 760px) {
          .two-col { grid-template-columns: 1fr; }
        }

        .callout {
          padding: 20px;
          border-radius: 14px;
          border: 1px solid rgba(255,209,102,0.25);
          background: rgba(255,209,102,0.04);
          display: grid;
          gap: 10px;
        }
        .callout .kicker {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffd166;
        }

        .cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .cta-btn {
          display: inline-block;
          padding: 14px 22px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: transform 180ms ease;
        }
        .cta-btn.primary { background: #9be7c9; color: #05070b; }
        .cta-btn.secondary {
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.14);
        }
        .cta-btn:hover { transform: translateY(-1px); }

        .footer-credit {
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.55);
          font-size: 0.88rem;
          line-height: 1.55;
        }
        .footer-credit a { color: #9be7c9; text-decoration: none; }
        .footer-credit a:hover { text-decoration: underline; }
      `}</style>

      <a href="/" className="back-home">← laclawclaw.com</a>

      <section className="hiw-hero">
        <span className="eyebrow-tag">How it works</span>
        <h1>Four protocols. One flow. Your agent does the work.</h1>
        <p className="lede">
          LaClawClaw is the first agent-native Shopify store. We don&apos;t have a
          checkout form — we have endpoints. An agent discovers us, picks a
          product, and hands the human a payment link. Here&apos;s the whole path.
        </p>
        <div className="protocol-strip">
          <span className="proto-badge"><strong>AWP</strong> v0.2</span>
          <span className="proto-badge"><strong>A2A</strong> v0.3</span>
          <span className="proto-badge"><strong>MCP</strong> 2025-06-18</span>
          <span className="proto-badge"><strong>Stripe</strong> Payment Links</span>
        </div>
      </section>

      <section className="section">
        <h2>The flow <span className="dim">— five steps, one agent, no human keystrokes until the final click</span></h2>

        <div className="flow">
          <div className="flow-step highlight">
            <div className="flow-num">0</div>
            <div className="flow-body">
              <div className="flow-title">Agent discovers the manifest</div>
              <div className="flow-desc">
                Any agent hitting laclawclaw.com finds an AWP v0.2 manifest at{" "}
                <code>/.well-known/agent.json</code>. One document declares every
                protocol we speak and every action we expose. No manual config.
              </div>
              <div className="flow-tag">GET /.well-known/agent.json → AWP v0.2</div>
            </div>
          </div>

          <div className="flow-step">
            <div className="flow-num">1</div>
            <div className="flow-body">
              <div className="flow-title">Agent browses the catalog</div>
              <div className="flow-desc">
                Using the MCP <code>list_products</code> tool, the agent pulls
                the live Shopify catalog. Structured JSON, not HTML scraping.
              </div>
              <div className="flow-tag">MCP tool: list_products</div>
            </div>
          </div>

          <div className="flow-step">
            <div className="flow-num">2</div>
            <div className="flow-body">
              <div className="flow-title">Agent picks a product, reads detail</div>
              <div className="flow-desc">
                <code>get_product</code> returns description, variants, availability.
                Agent has everything a human would read off a product page, but
                as structured data.
              </div>
              <div className="flow-tag">MCP tool: get_product</div>
            </div>
          </div>

          <div className="flow-step">
            <div className="flow-num">3</div>
            <div className="flow-body">
              <div className="flow-title">Agent creates a cart</div>
              <div className="flow-desc">
                <code>create_cart</code> wraps Shopify&apos;s stateless cart
                permalink pattern. The cart is a base64-encoded token — no
                server-side session needed.
              </div>
              <div className="flow-tag">MCP tool: create_cart</div>
            </div>
          </div>

          <div className="flow-step">
            <div className="flow-num">4</div>
            <div className="flow-body">
              <div className="flow-title">Agent generates the payment link</div>
              <div className="flow-desc">
                <code>create_payment_link</code> returns a Stripe URL scoped to
                the cart. The agent hands this URL back to its human — that&apos;s
                the only point a human touches the flow. PCI stays Stripe&apos;s
                problem. Agent-gated, human-paid.
              </div>
              <div className="flow-tag">MCP tool: create_payment_link → Stripe</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Install it in Claude Desktop</h2>
        <p>
          Drop this into your <code>claude_desktop_config.json</code> (on macOS:{" "}
          <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>),
          restart Claude Desktop, and you&apos;re shopping.
        </p>

        <div>
          <div className="code-label">claude_desktop_config.json</div>
          <pre className="code-block">{MCP_CONFIG_SNIPPET}</pre>
        </div>

        <div className="callout">
          <span className="kicker">Or, the AWP way</span>
          <p>
            Point any AWP-aware agent at the manifest and it configures itself.
            No paths to type, no config snippets to paste. The manifest tells
            the agent which protocol to speak and how.
          </p>
          <pre className="code-block">{CURL_AWP_DISCOVERY}</pre>
          <p>
            Validates against{" "}
            <code>npx agent-json@0.2.0 validate https://laclawclaw.com/.well-known/agent.json</code>
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Try it right now <span className="dim">— in your terminal</span></h2>

        <div className="two-col">
          <div>
            <div className="code-label">MCP tools/list</div>
            <pre className="code-block">{CURL_MCP_LIST}</pre>
          </div>
          <div>
            <div className="code-label">A2A checkout.create</div>
            <pre className="code-block">{CURL_A2A_CHECKOUT}</pre>
          </div>
        </div>

        <p>
          Both return the same canonical Stripe payment link. MCP is the clean
          tool-use path. A2A is agent-to-agent peer-speak with a bearer gate.
          Either gets your human to the $1 Founders Edition pre-order.
        </p>

        <div className="cta-row">
          <a href="/agents" className="cta-btn primary">Watch the live demo →</a>
          <a
            href="https://agent.laclawclaw.com/.well-known/agent-card.json"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn secondary"
          >
            A2A agent card
          </a>
          <a
            href="/.well-known/agent.json"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn secondary"
          >
            AWP manifest
          </a>
        </div>
      </section>

      <section className="footer-credit">
        <p>
          LaClawClaw is built on <a href="https://injester.com">Injester</a> —
          the agent-native commerce layer that turns any Shopify store into a
          protocol-speaking endpoint. The bridge between humans who ship and
          agents who shop.
        </p>
        <p>
          Protocols: AWP v0.2 · A2A v0.3 · MCP 2025-06-18 · Stripe Payment Links v1.0
        </p>
      </section>
    </main>
  );
}
