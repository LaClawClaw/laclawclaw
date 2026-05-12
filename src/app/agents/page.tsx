"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const AGENT_HOST = process.env.NEXT_PUBLIC_AGENT_HOST || "https://agent.laclawclaw.com";
const DISCOVERY_URL = `${AGENT_HOST}/.well-known/agent-card.json`;
const MESSAGE_URL = `${AGENT_HOST}/agent/message`;
const DEMO_STEP_DELAY_MS = 1400;
const JSON_STREAM_CHUNK_DELAY_MS = 28;
const JSON_STREAM_CHARS_PER_TICK = 10;
// Demo bearer is embedded client-side intentionally — this is a showcase
// endpoint, gated against bots and curious humans but not a secret for agents.
const DEMO_BEARER = "lcc_demo_agent_2026";

type LogLine = {
  id: string;
  kind: "info" | "request" | "response" | "success" | "error";
  text: string;
  format?: "plain" | "json";
};

type JsonObject = Record<string, unknown>;

function parseMaybeJson(raw: string): JsonObject | null {
  try {
    return JSON.parse(raw) as JsonObject;
  } catch {
    return null;
  }
}

function parseRpcPayload(raw: string): JsonObject | null {
  const direct = parseMaybeJson(raw);
  if (direct) return direct;

  const eventLine = raw
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("data: "));

  return eventLine ? parseMaybeJson(eventLine.slice(6)) : null;
}

function asObject(value: unknown): JsonObject | null {
  return value && typeof value === "object" ? (value as JsonObject) : null;
}

function getTextParts(content: unknown): string[] {
  if (!Array.isArray(content)) return [];
  return content
    .map((part) => asObject(part)?.text)
    .filter((text): text is string => typeof text === "string");
}

function extractA2AData(result: unknown): JsonObject | null {
  const resultObj = asObject(result);
  if (!resultObj) return null;

  const directParts = Array.isArray(resultObj.parts) ? resultObj.parts : [];
  for (const part of directParts) {
    const data = asObject(asObject(part)?.data);
    const payload = asObject(data?.data);
    if (payload) return payload;
    if (data) return data;
  }

  const history = Array.isArray(resultObj.history) ? resultObj.history : [];
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const message = asObject(history[i]);
    const parts = Array.isArray(message?.parts) ? message.parts : [];
    for (const part of parts) {
      const data = asObject(asObject(part)?.data);
      const payload = asObject(data?.data);
      if (payload) return payload;
      if (data) return data;
    }
  }

  const artifacts = Array.isArray(resultObj.artifacts) ? resultObj.artifacts : [];
  for (const artifact of artifacts) {
    const artifactObj = asObject(artifact);
    const parts = Array.isArray(artifactObj?.parts) ? artifactObj.parts : [];
    for (const part of parts) {
      const data = asObject(asObject(part)?.data);
      const payload = asObject(data?.data);
      if (payload) return payload;
      if (data) return data;
    }
  }

  return null;
}

export default function AgentsGate() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const logBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (line: Omit<LogLine, "id">) => {
    const id = crypto.randomUUID();
    setLogs((prev) => [...prev, { ...line, id }]);
    return id;
  };
  const updateLog = (id: string, updater: (line: LogLine) => LogLine) =>
    setLogs((prev) => prev.map((line) => (line.id === id ? updater(line) : line)));
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const streamLog = async (kind: LogLine["kind"], text: string, format: LogLine["format"] = "plain") => {
    const id = addLog({ kind, text: "", format });
    for (let i = 0; i < text.length; i += JSON_STREAM_CHARS_PER_TICK) {
      const next = text.slice(0, i + JSON_STREAM_CHARS_PER_TICK);
      updateLog(id, (line) => ({ ...line, text: next }));
      await sleep(JSON_STREAM_CHUNK_DELAY_MS);
    }
  };

  const runDemo = async () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setCheckoutUrl(null);

    try {
      addLog({ kind: "info", text: "[agent] bootstrapping…" });
      await sleep(400);

      const t0 = Date.now();
      addLog({ kind: "request", text: `GET ${DISCOVERY_URL}` });
      const discoveryRes = await fetch(DISCOVERY_URL);
      const discovery = await discoveryRes.json();
      const discoveryMs = Date.now() - t0;
      addLog({
        kind: "response",
        text: `200 OK  discovered ${discovery.name} with ${discovery.skills.length} skills`,
      });
      await streamLog("response", JSON.stringify(discovery.skills, null, 2), "json");
      await sleep(DEMO_STEP_DELAY_MS);

      addLog({ kind: "info", text: "[agent] authenticating with bearer token…" });
      await sleep(DEMO_STEP_DELAY_MS);

      // Step 2: Ask the Nebius-powered OpenClaw clerk
      addLog({
        kind: "info",
        text: "[agent] calling OpenClaw clerk via MCP · model: nemotron-3-super-120b (Nebius Token Factory)…",
      });
      const clerkBody = {
        jsonrpc: "2.0",
        id: 10,
        method: "tools/call",
        params: {
          name: "list_products",
          arguments: { query: "collectible" },
        },
      };
      addLog({
        kind: "request",
        text: `POST ${AGENT_HOST}/mcp  tool=list_products  query="What collectibles do you have?"`,
      });
      await sleep(DEMO_STEP_DELAY_MS);

      const clerkT0 = Date.now();
      try {
        const clerkRes = await fetch(`${AGENT_HOST}/mcp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
          },
          body: JSON.stringify(clerkBody),
        });
        const clerkMs = Date.now() - clerkT0;
        const clerkRaw = await clerkRes.text();
        const clerkData = parseRpcPayload(clerkRaw);
        if (clerkData?.error) {
          const error = asObject(clerkData.error);
          addLog({
            kind: "error",
            text: `[OpenClaw] MCP error ${String(error?.code ?? "unknown")}: ${String(error?.message ?? "Unknown error")}`,
          });
        } else if (clerkData?.result) {
          const result = asObject(clerkData.result);
          const textParts = getTextParts(result?.content);
          const products = parseMaybeJson(textParts[1] || textParts[0] || "");
          const items = Array.isArray(products) ? products.map((item) => asObject(item)).filter(Boolean) : [];
          const pricedItems = items
            .map((item) => {
              const variants = Array.isArray(item?.variants) ? item.variants : [];
              const firstVariant = asObject(variants[0]);
              const rawPrice = firstVariant?.price;
              const price =
                typeof rawPrice === "string" || typeof rawPrice === "number"
                  ? Number(rawPrice)
                  : Number.NaN;
              return {
                title: typeof item?.title === "string" ? item.title : "Unknown product",
                price,
              };
            })
            .filter((item) => Number.isFinite(item.price));
          const firstItem = pricedItems[0];

          addLog({
            kind: "response",
            text: `200 OK  catalog returned ${pricedItems.length} priced item${pricedItems.length === 1 ? "" : "s"}`,
          });
          await streamLog("response", JSON.stringify(clerkData, null, 2), "json");

          const clerkAnswer = firstItem
            ? `I discovered ${firstItem.title} first in the catalog at $${firstItem.price.toFixed(2)}.`
            : textParts[0] || "Catalog lookup returned no structured answer.";

          addLog({ kind: "response", text: `[OpenClaw] ${clerkAnswer}` });
        }
      } catch {
        addLog({ kind: "info", text: "[clerk call skipped — continuing to checkout]" });
      }
      await sleep(DEMO_STEP_DELAY_MS);

      // Step 3: Agent-gated checkout
      addLog({ kind: "info", text: "[agent] proceeding to agent-gated checkout…" });
      await sleep(DEMO_STEP_DELAY_MS);

      const acpBody = {
        jsonrpc: "2.0",
        id: 11,
        method: "message/send",
        params: {
          configuration: {
            acceptedOutputModes: ["application/json"],
            blocking: true,
          },
          message: {
            kind: "message",
            messageId: crypto.randomUUID(),
            role: "user",
            parts: [
              { kind: "text", text: "Create the checkout link for the Founders Edition pre-order." },
              { kind: "data", data: { operation: "create_checkout", params: {} } },
            ],
          },
        },
      };
      addLog({
        kind: "request",
        text: `POST ${MESSAGE_URL}  op=create_checkout  auth=Bearer ${DEMO_BEARER.slice(0, 12)}…`,
      });
      await sleep(DEMO_STEP_DELAY_MS);

      const res = await fetch(MESSAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEMO_BEARER}`,
        },
        body: JSON.stringify(acpBody),
      });

      if (!res.ok) {
        const err = await res.text();
        addLog({ kind: "error", text: `${res.status} ${err}` });
        return;
      }

      const data = await res.json();
      await streamLog("response", JSON.stringify(data, null, 2), "json");
      const url =
        (extractA2AData(data?.result)?.checkoutUrl as string | undefined) ||
        (typeof data?.result?.checkoutUrl === "string" ? data.result.checkoutUrl : null);
      addLog({
        kind: "response",
        text: url ? `200 OK  checkout URL created` : `200 OK  response received, but no checkout URL found`,
      });
      await sleep(DEMO_STEP_DELAY_MS);

      if (url) {
        setCheckoutUrl(url);
        addLog({
          kind: "success",
          text: `[agent] checkout link ready. Handing URL back to human for payment.`,
        });
      } else {
        addLog({ kind: "error", text: "No checkoutUrl in response" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog({ kind: "error", text: `fetch failed: ${msg}` });
    } finally {
      setRunning(false);
    }
  };

  return (
    <main className="agents-gate">
      <style>{`
        body { background: #05070b; color: #f5f7fb; }
        .agents-gate {
          min-height: 100vh;
          padding: 48px 24px 96px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          display: grid;
          gap: 56px;
          justify-items: center;
        }
        .eyebrow-tag {
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-size: 0.78rem;
          color: #ffd166;
          padding: 8px 14px;
          border: 1px solid rgba(255,209,102,0.3);
          background: rgba(255,209,102,0.06);
          border-radius: 999px;
        }
        .agents-hero {
          display: grid;
          gap: 18px;
          justify-items: center;
          text-align: center;
          max-width: 720px;
        }
        .agents-hero h1 {
          margin: 0;
          font-size: clamp(2.4rem, 6vw, 4.8rem);
          line-height: 1;
          letter-spacing: -0.05em;
        }
        .agents-hero p {
          margin: 0;
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          max-width: 620px;
        }
        .agents-hero p.agents-lede {
          font-size: clamp(1.05rem, 1.6vw, 1.3rem);
          color: rgba(255,255,255,0.88);
          font-weight: 500;
        }
        .agents-hero code {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.88em;
          color: #9be7c9;
          background: rgba(155,231,201,0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .endpoint-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 36px;
          align-items: center;
          padding: 32px;
          border-radius: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          max-width: 760px;
        }
        .qr-wrap {
          padding: 20px;
          background: #fff;
          border-radius: 18px;
        }
        .endpoint-details { display: grid; gap: 10px; }
        .endpoint-details label {
          font-size: 0.74rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .endpoint-url {
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 1rem;
          background: #0a0d12;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 14px;
          word-break: break-all;
          color: #9be7c9;
        }
        .endpoint-hint {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
        }
        .demo-section {
          width: 100%;
          max-width: 960px;
          display: grid;
          gap: 18px;
        }
        .demo-section h2 {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          letter-spacing: -0.02em;
          margin: 0;
        }
        .demo-section h2 .light {
          color: rgba(255,255,255,0.5);
          font-weight: 400;
        }
        .demo-run-btn {
          appearance: none;
          border: 0;
          cursor: pointer;
          padding: 14px 22px;
          border-radius: 999px;
          background: #ffd166;
          color: #0a0d12;
          font-weight: 700;
          font-size: 1rem;
          font-family: inherit;
          letter-spacing: 0.02em;
          transition: transform 180ms ease, opacity 180ms ease;
          justify-self: start;
        }
        .demo-run-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .demo-run-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .terminal {
          background: #05070a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 20px;
          font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
          font-size: 0.92rem;
          line-height: 1.55;
          max-height: 420px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .terminal-empty {
          color: rgba(255,255,255,0.4);
          font-style: italic;
        }
        .log-info     { color: rgba(255,255,255,0.72); }
        .log-request  { color: #89d8ff; }
        .log-response { color: #9be7c9; }
        .log-success  { color: #ffd166; font-weight: 600; }
        .log-error    { color: #ff7a7a; }
        .log-json {
          font-family: "Courier New", Courier, monospace;
          font-size: 0.78rem;
          line-height: 1.45;
        }
        .pay-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 26px;
          border-radius: 999px;
          background: #9be7c9;
          color: #05070b;
          font-weight: 700;
          text-decoration: none;
          justify-self: start;
          transition: transform 180ms ease;
        }
        .pay-cta:hover { transform: translateY(-1px); }
        .back-home {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.88rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .back-home:hover { color: #fff; }
        .openclaw-setup {
          width: 100%;
          max-width: 760px;
          padding: 28px 32px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          display: grid;
          gap: 16px;
          justify-items: center;
          text-align: center;
        }
        .openclaw-setup h2 {
          margin: 0;
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          letter-spacing: -0.02em;
          color: #ffd166;
        }
        .openclaw-setup ol {
          margin: 0;
          padding-left: 1.4em;
          display: grid;
          gap: 12px;
          text-align: left;
        }
        .openclaw-setup li {
          font-size: 0.97rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.82);
        }
        .openclaw-setup a {
          color: #9be7c9;
          text-decoration: none;
          word-break: break-all;
        }
        .openclaw-setup a:hover { text-decoration: underline; }
        .openclaw-setup code {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.88em;
          color: #9be7c9;
          background: rgba(155,231,201,0.08);
          padding: 2px 6px;
          border-radius: 4px;
        }
        @media (max-width: 720px) {
          .endpoint-card { grid-template-columns: 1fr; gap: 20px; justify-items: center; }
        }

        .bring-your-own {
          width: 100%;
          max-width: 960px;
          display: grid;
          gap: 28px;
        }
        .byo-head { display: grid; gap: 10px; }
        .byo-kicker {
          font-size: 0.74rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #9be7c9;
        }
        .bring-your-own h2 {
          margin: 0;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .bring-your-own > .byo-head p {
          margin: 0;
          color: rgba(255,255,255,0.7);
          font-size: clamp(0.98rem, 1.3vw, 1.1rem);
          line-height: 1.55;
          max-width: 660px;
        }
        .byo-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 720px) {
          .byo-cards { grid-template-columns: 1fr; }
        }
        .byo-card {
          padding: 24px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          display: grid;
          gap: 10px;
          align-content: start;
        }
        .byo-num {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em;
        }
        .byo-card h3 {
          margin: 0;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
        }
        .byo-card p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.72);
        }
        .byo-card code {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.88em;
          color: #9be7c9;
          background: rgba(155,231,201,0.08);
          padding: 1px 5px;
          border-radius: 3px;
        }
        .byo-snippet {
          margin: 6px 0 0;
          background: #05070a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 14px 16px;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.82rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.88);
          overflow-x: auto;
        }
        .byo-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }
        .byo-link {
          color: #9be7c9;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 600;
        }
        .byo-link:hover { text-decoration: underline; }
      `}</style>

      <a href="/" className="back-home">← back to laclawclaw.com</a>

      <section className="agents-hero">
        <span className="eyebrow-tag">Agents only · First agent-only Shopify commerce</span>
        <h1>Point your OpenClaw agent here.</h1>
        <p className="agents-lede">
          You&apos;re looking at the first agent-only Shopify commerce
          experience. No cart UI. No checkout form. No human flow.
          Just protocol endpoints — A2A, MCP, AWP — for agents to
          transact on behalf of their humans.
        </p>
        <p>
          Your OpenClaw discovers our skills at{" "}
          <code>/.well-known/agent-card.json</code>, transacts via{" "}
          <code>POST /agent/message</code>, or connects as a Claude
          Desktop MCP server at <code>/mcp</code>. Humans land here by
          mistake — point your OpenClaw, don&apos;t point yourself.
        </p>
      </section>

      <div className="endpoint-card">
        <div className="qr-wrap">
          <QRCodeSVG value={DISCOVERY_URL} size={180} level="M" />
        </div>
        <div className="endpoint-details">
          <label>Agent Card URL</label>
          <div className="endpoint-url">{DISCOVERY_URL}</div>
          <p className="endpoint-hint">
            Scan with your phone or paste into your agent. Bearer-gated endpoints
            will reject browsers — that&apos;s the point.
          </p>
        </div>
      </div>

      <section className="openclaw-setup">
        <h2>If you are an Openclaw agent:</h2>
        <ol>
          <li>
            Grab the plugin at{" "}
            <a href="https://github.com/win4r/openclaw-a2a-gateway/tree/master" target="_blank" rel="noopener noreferrer">
              https://github.com/win4r/openclaw-a2a-gateway/tree/master
            </a>{" "}
            and install it.
          </li>
          <li>
            Set up A2A and add <code>{new URL(AGENT_HOST).hostname}</code> as a peer. Use agent key <code>lcc_demo_agent_2026</code>.
            Use your identity and other information for other config fields.
          </li>
          <li>
            When your owner asks you for shopping for Glytch or LaClawClaw, use the laclawclaw peer to shop.
          </li>
        </ol>
      </section>

      <section className="demo-section">
        <h2>
          Don&apos;t have OpenClaw yet? <span className="light">Watch a demo agent run it live.</span>
        </h2>
        <button
          className="demo-run-btn"
          onClick={runDemo}
          disabled={running}
        >
          {running ? "Running…" : "▶ Run demo agent"}
        </button>

        <div className="terminal" ref={logBoxRef}>
          {logs.length === 0 ? (
            <div className="terminal-empty">
              {"// Click 'Run demo agent' to see live API calls, bearer auth, and the returned Stripe checkout URL."}
            </div>
          ) : (
            logs.map((line) => (
              <div
                key={line.id}
                className={`log-${line.kind}${line.format === "json" ? " log-json" : ""}`}
              >
                {line.text}
              </div>
            ))
          )}
        </div>

        {checkoutUrl && (
          <a
            className="pay-cta"
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Complete purchase — $10 →
          </a>
        )}
      </section>

      <section className="bring-your-own">
        <div className="byo-head">
          <span className="byo-kicker">Bring your own OpenClaw</span>
          <h2>Two paths into the store.</h2>
          <p>
            OpenClaw is the open-source agent recipe for shopping at
            agent-only stores. Bring any MCP- or A2A-capable agent and
            it works — we call the canonical pattern OpenClaw.
          </p>
        </div>

        <div className="byo-cards">
          <div className="byo-card">
            <div className="byo-num">01</div>
            <h3>Claude Desktop</h3>
            <p>
              Drop this into your{" "}
              <code>claude_desktop_config.json</code>, restart Claude,
              and you&apos;re shopping. Zero setup beyond the one-line
              config.
            </p>
            <pre className="byo-snippet">{`{
  "mcpServers": {
    "laclawclaw": {
      "url": "https://agent.laclawclaw.com/mcp"
    }
  }
}`}</pre>
          </div>

          <div className="byo-card">
            <div className="byo-num">02</div>
            <h3>Build your own OpenClaw</h3>
            <p>
              Full protocol spec, manifest, tool schemas, and reference
              build log live in the open. Canonical OpenClaw reference
              implementation ships at launch.
            </p>
            <div className="byo-links">
              <a href="/how-it-works" className="byo-link">Protocol explainer →</a>
              <a href="/.well-known/agent.json" className="byo-link">AWP manifest →</a>
              <a href="https://agentwebprotocol.org" target="_blank" rel="noopener noreferrer" className="byo-link">AWP spec (we wrote it) →</a>
              <a href="https://github.com/LaClawClaw/production" target="_blank" rel="noopener noreferrer" className="byo-link">Open source production →</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
