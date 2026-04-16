"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const AGENT_HOST = "https://agent.laclawclaw.com";
const DISCOVERY_URL = `${AGENT_HOST}/.well-known/agent-card.json`;
const MESSAGE_URL = `${AGENT_HOST}/agent/message`;
// Demo bearer is embedded client-side intentionally — this is a showcase
// endpoint, gated against bots and curious humans but not a secret for agents.
const DEMO_BEARER = "lcc_demo_agent_2026";

type LogLine = {
  kind: "info" | "request" | "response" | "success" | "error";
  text: string;
};

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

  const addLog = (line: LogLine) => setLogs((prev) => [...prev, line]);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runDemo = async () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setCheckoutUrl(null);

    try {
      addLog({ kind: "info", text: "[agent] bootstrapping…" });
      await sleep(400);

      addLog({ kind: "request", text: `GET ${DISCOVERY_URL}` });
      const discoveryRes = await fetch(DISCOVERY_URL);
      const discovery = await discoveryRes.json();
      addLog({
        kind: "response",
        text: `200 OK  name=${discovery.name}  skills=[${discovery.skills.map((s: { id: string }) => s.id).join(", ")}]`,
      });
      await sleep(500);

      addLog({ kind: "info", text: "[agent] authenticating with bearer token…" });
      await sleep(500);

      const acpBody = {
        type: "acp-request",
        from: "demo-agent",
        payload: { operation: "checkout.create", params: {} },
      };
      addLog({
        kind: "request",
        text: `POST ${MESSAGE_URL}\nAuthorization: Bearer ${DEMO_BEARER.slice(0, 12)}…\n${JSON.stringify(acpBody, null, 2)}`,
      });

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
      addLog({
        kind: "response",
        text: `200 OK\n${JSON.stringify(data, null, 2)}`,
      });
      await sleep(400);

      const url = data?.payload?.data?.checkoutUrl;
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
          max-width: 560px;
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
        @media (max-width: 720px) {
          .endpoint-card { grid-template-columns: 1fr; gap: 20px; justify-items: center; }
        }
      `}</style>

      <a href="/" className="back-home">← back to laclawclaw.com</a>

      <section className="agents-hero">
        <span className="eyebrow-tag">Agents only</span>
        <h1>Direct your agent here.</h1>
        <p>
          This endpoint serves A2A &amp; ACP. Your agent discovers skills at{" "}
          <code>/.well-known/agent-card.json</code> and transacts via{" "}
          <code>POST /agent/message</code>. Humans land here by mistake — point
          your agent, don&apos;t point yourself.
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

      <section className="demo-section">
        <h2>
          Don&apos;t have an agent? <span className="light">Watch ours do it live.</span>
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
            logs.map((line, i) => (
              <div key={i} className={`log-${line.kind}`}>
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
            Complete purchase — $1 →
          </a>
        )}
      </section>
    </main>
  );
}
