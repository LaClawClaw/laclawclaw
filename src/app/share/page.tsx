"use client";

import { useState, useEffect } from "react";

const HOMEPAGE = "https://laclawclaw.com";
const AGENT_URL = "https://agent.laclawclaw.com";
const CAPTION =
  "My agent bought this. I didn't type a card number. I didn't click checkout. First agent-only Shopify store. laclawclaw.com";

// Fallback to the Glytch product photo until Alex drops the custom 1080×1080
// share graphic at /share/glytch-founder.png
const GRAPHIC_CUSTOM = "/share/glytch-founder.png";
const GRAPHIC_FALLBACK = "/products/glytch-nemo-front.jpg";

const encode = (s: string) => encodeURIComponent(s);

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const [webShareSupported, setWebShareSupported] = useState(false);
  const [graphicSrc, setGraphicSrc] = useState(GRAPHIC_CUSTOM);

  useEffect(() => {
    setWebShareSupported(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(`${CAPTION} ${HOMEPAGE}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({
        title: "LaClawClaw — my agent bought this",
        text: CAPTION,
        url: HOMEPAGE,
      });
    } catch {
      // user cancelled or unsupported
    }
  };

  const shareLinks = {
    x: `https://x.com/intent/tweet?text=${encode(CAPTION)}&url=${encode(HOMEPAGE)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(HOMEPAGE)}`,
    whatsapp: `https://wa.me/?text=${encode(`${CAPTION} ${HOMEPAGE}`)}`,
    threads: `https://www.threads.net/intent/post?text=${encode(`${CAPTION} ${HOMEPAGE}`)}`,
  };

  return (
    <main className="share-page">
      <style>{`
        body { background: #05070b; color: #f5f7fb; }
        .share-page {
          min-height: 100vh;
          padding: 48px 24px 96px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          display: grid;
          gap: 36px;
          justify-items: center;
          max-width: 760px;
          margin: 0 auto;
        }
        .confirm-pill {
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 0.78rem;
          color: #9be7c9;
          padding: 8px 14px;
          border: 1px solid rgba(155,231,201,0.3);
          background: rgba(155,231,201,0.06);
          border-radius: 999px;
        }
        .share-hero {
          text-align: center;
          display: grid;
          gap: 14px;
        }
        .share-hero h1 {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3.4rem);
          line-height: 1.05;
          letter-spacing: -0.04em;
        }
        .share-hero p {
          margin: 0;
          color: rgba(255,255,255,0.7);
          font-size: clamp(1rem, 1.4vw, 1.1rem);
          line-height: 1.55;
        }
        .graphic-frame {
          width: 100%;
          max-width: 520px;
          aspect-ratio: 1/1;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          display: grid;
          place-items: center;
          position: relative;
        }
        .graphic-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .graphic-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 28px;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%);
          text-align: center;
        }
        .graphic-caption {
          color: #fff;
          font-size: clamp(1rem, 2vw, 1.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.3;
          text-shadow: 0 4px 16px rgba(0,0,0,0.6);
        }
        .graphic-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 6px;
        }
        .section-label {
          font-size: 0.76rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          text-align: center;
          width: 100%;
        }
        .share-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          width: 100%;
        }
        .share-btn {
          appearance: none;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: #fff;
          font: inherit;
          font-weight: 600;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: background 180ms, border-color 180ms, transform 180ms;
          font-size: 0.95rem;
        }
        .share-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }
        .share-btn .emoji { display: block; font-size: 1.3rem; margin-bottom: 4px; }
        .caption-box {
          width: 100%;
          background: #0a0d12;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 18px;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.92rem;
          line-height: 1.55;
          color: rgba(255,255,255,0.85);
        }
        .caption-actions { display: flex; gap: 10px; width: 100%; flex-wrap: wrap; }
        .caption-actions button, .caption-actions a {
          flex: 1;
          min-width: 140px;
          appearance: none;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: #fff;
          font: inherit;
          font-weight: 600;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          font-size: 0.92rem;
        }
        .caption-actions button:hover, .caption-actions a:hover {
          background: rgba(255,255,255,0.08);
        }
        .caption-actions .copied { color: #9be7c9; border-color: #9be7c9; }
        .back-home {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.88rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .back-home:hover { color: #fff; }
      `}</style>

      <span className="confirm-pill">✓ Order received</span>

      <div className="share-hero">
        <h1>Your agent bought this.</h1>
        <p>
          Show off what your agent pulled. Share the moment — every post
          brings another human to laclawclaw.com to point their agent here.
        </p>
      </div>

      <div className="graphic-frame">
        <img
          src={graphicSrc}
          alt="Glytch: Nemo Edition"
          onError={() => setGraphicSrc(GRAPHIC_FALLBACK)}
        />
        <div className="graphic-overlay">
          <div>
            <div className="graphic-caption">My agent bought this.</div>
            <div className="graphic-sub">laclawclaw.com — agents only</div>
          </div>
        </div>
      </div>

      <div className="section-label">Share in one tap</div>

      <div className="share-grid">
        <a className="share-btn" href={shareLinks.x} target="_blank" rel="noopener noreferrer">
          <span className="emoji">𝕏</span>Post on X
        </a>
        <a className="share-btn" href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <span className="emoji">in</span>LinkedIn
        </a>
        <a className="share-btn" href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
          <span className="emoji">💬</span>WhatsApp
        </a>
        <a className="share-btn" href={shareLinks.threads} target="_blank" rel="noopener noreferrer">
          <span className="emoji">@</span>Threads
        </a>
        {webShareSupported && (
          <button className="share-btn" onClick={nativeShare}>
            <span className="emoji">📤</span>Share…
          </button>
        )}
        <a className="share-btn" href={graphicSrc} download="laclawclaw-agent-buy.png">
          <span className="emoji">⬇</span>Download for IG
        </a>
      </div>

      <div className="section-label">Caption</div>

      <div className="caption-box">
        {CAPTION} {HOMEPAGE}
      </div>

      <div className="caption-actions">
        <button onClick={copyCaption} className={copied ? "copied" : ""}>
          {copied ? "✓ Copied" : "Copy caption"}
        </button>
        <a href={AGENT_URL} target="_blank" rel="noopener noreferrer">
          Agent endpoint →
        </a>
      </div>

      <a href="/" className="back-home">← back to laclawclaw.com</a>
    </main>
  );
}
