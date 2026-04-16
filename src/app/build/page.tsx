import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open source production · LaClawClaw · 0 → 1",
  description:
    "The open source community gave us so much. We're open-sourcing our factory production steps from 0 → 1. Every stage from spec to shipment, published live.",
};

type Entry = {
  date: string;
  label: string;
  title: string;
  body: string;
  asset?: { src: string; alt: string };
  draft?: boolean;
};

// Reverse-chronological — newest first.
const ENTRIES: Entry[] = [
  {
    date: "2026-04-16",
    label: "Spec",
    title: "Parts breakdown — 9 component groups",
    body:
      "The full exploded view for the 7-inch Glytch: Nemo Edition is locked. Two injection molds (scalp cap + face plate, PVC). Four sourced components (D-pad eyes in ABS, antennae, keychain ring, dog tag chain). Three soft goods (plush body with iron-wire armature, PU leather claws, clothing + shoes). Parting line hidden at the equator, under the fur collar. Tongue-and-groove fit between scalp cap and face plate.",
    asset: {
      src: "/products/laclawclaw_7in_parts_breakdown_1.svg",
      alt: "7-inch Glytch: Nemo Edition parts breakdown",
    },
  },
  {
    date: "— pending —",
    label: "Mold",
    title: "First mold samples — PVC pulls",
    body:
      "Placeholder: first PVC pulls from scalp-cap and face-plate molds. Parting line inspection, surface texture QC, tolerance check on the tongue-and-groove fit. Photos from the factory floor go here.",
    draft: true,
  },
  {
    date: "— pending —",
    label: "Soft goods",
    title: "Plush body + armature prototype",
    body:
      "Placeholder: 95% polyester / 5% iron wire armature first sample. Neck opening for head assembly, claw attachment points, collar coverage over the mold parting line.",
    draft: true,
  },
  {
    date: "— pending —",
    label: "Assembly",
    title: "First complete unit",
    body:
      "Placeholder: all 9 component groups assembled into a single unit. Side-by-side with the original industrial design render.",
    draft: true,
  },
  {
    date: "Q3 2026",
    label: "Ship",
    title: "Founders Edition ships — 1 of 200",
    body:
      "The first Glytch ships. Each unit hand-numbered. Pre-orders fulfilled in order received.",
    draft: true,
  },
];

export default function BuildLog() {
  return (
    <main className="buildlog">
      <style>{`
        body { background: #05070b; color: #f5f7fb; }
        .buildlog {
          max-width: 820px;
          margin: 0 auto;
          padding: 64px 24px 120px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          display: grid;
          gap: 48px;
        }
        .back-home {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 0.82rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .back-home:hover { color: #fff; }

        .build-hero {
          display: grid;
          gap: 16px;
        }
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
        .build-hero h1 {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3.4rem);
          line-height: 1.02;
          letter-spacing: -0.04em;
        }
        .build-hero p {
          margin: 0;
          color: rgba(255,255,255,0.72);
          font-size: clamp(1rem, 1.4vw, 1.15rem);
          line-height: 1.55;
          max-width: 700px;
        }
        .build-hero p.manifesto {
          font-size: clamp(1.1rem, 1.7vw, 1.35rem);
          font-weight: 600;
          color: rgba(255,255,255,0.92);
          letter-spacing: -0.01em;
          line-height: 1.45;
        }

        .source-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 20px 22px;
          background: rgba(155,231,201,0.05);
          border: 1px solid rgba(155,231,201,0.2);
          border-radius: 14px;
        }
        .source-icon {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 1.4rem;
          color: #9be7c9;
          flex-shrink: 0;
          line-height: 1;
          padding-top: 2px;
        }
        .source-title {
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .source-desc {
          color: rgba(255,255,255,0.78);
          font-size: 0.96rem;
          line-height: 1.55;
        }
        .source-desc a {
          color: #9be7c9;
          text-decoration: none;
          font-weight: 600;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.92rem;
        }
        .source-desc a:hover { text-decoration: underline; }

        .notify-row {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 14px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          font-size: 0.92rem;
          color: rgba(255,255,255,0.72);
        }
        .notify-row strong { color: #9be7c9; }

        .timeline {
          display: grid;
          gap: 0;
          position: relative;
          padding-left: 28px;
          border-left: 1px dashed rgba(255,255,255,0.14);
        }

        .entry {
          position: relative;
          padding: 8px 0 40px 24px;
        }
        .entry::before {
          content: "";
          position: absolute;
          left: -35px;
          top: 14px;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #9be7c9;
          border: 3px solid #05070b;
          box-shadow: 0 0 0 1px rgba(155,231,201,0.4);
        }
        .entry.draft::before {
          background: #0a0d12;
          border-color: rgba(255,255,255,0.2);
          box-shadow: none;
        }

        .entry-meta {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }
        .entry-date {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.58);
        }
        .entry.draft .entry-date { color: rgba(255,255,255,0.35); }
        .entry-label {
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9be7c9;
          padding: 3px 8px;
          border: 1px solid rgba(155,231,201,0.25);
          background: rgba(155,231,201,0.05);
          border-radius: 4px;
        }
        .entry.draft .entry-label {
          color: rgba(255,255,255,0.4);
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02);
        }

        .entry-title {
          margin: 0 0 6px;
          font-size: 1.22rem;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .entry.draft .entry-title { color: rgba(255,255,255,0.6); }
        .entry-body {
          margin: 0;
          color: rgba(255,255,255,0.72);
          font-size: 0.96rem;
          line-height: 1.6;
        }
        .entry.draft .entry-body { color: rgba(255,255,255,0.48); }

        .entry-asset {
          margin-top: 16px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }
        .entry-asset img {
          display: block;
          width: 100%;
          height: auto;
          max-width: 620px;
          margin: 0 auto;
        }

        .back-home-bottom {
          margin-top: 8px;
        }
      `}</style>

      <a href="/" className="back-home">← laclawclaw.com</a>

      <section className="build-hero">
        <span className="eyebrow-tag">Open source production · 0 → 1</span>
        <h1>From spec sheet to shelf.</h1>
        <p className="manifesto">
          The open source community has given us so much.
          We&apos;re open-sourcing our factory production steps from 0 → 1.
        </p>
        <p>
          Glytch: Nemo Edition is being manufactured in Zhongshan, China. Every
          mold pull, prototype review, QC pass, and shipment gets posted here —
          raw, real-time, no PR gloss, no NDA. Glass walls. If you pre-ordered,
          this is the receipt trail.
        </p>
      </section>

      <div className="source-row">
        <div className="source-icon">{"{/}"}</div>
        <div className="source-body">
          <div className="source-title">Read the source</div>
          <div className="source-desc">
            Full specs, mold targets, factory questions, and parts diagrams
            live at{" "}
            <a
              href="https://github.com/LaClawClaw/production"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/LaClawClaw/production
            </a>
            . Fork it, learn from it, cite it. CC-BY-4.0.
          </div>
        </div>
      </div>

      <div className="notify-row">
        <strong>Follow along:</strong>
        <span>
          New entries post as stages hit. Want a ping when the first mold sample
          lands? Contact founders@injester.com (email signup coming post-launch).
        </span>
      </div>

      <div className="timeline">
        {ENTRIES.map((e, i) => (
          <article key={i} className={`entry ${e.draft ? "draft" : ""}`}>
            <div className="entry-meta">
              <span className="entry-date">{e.date}</span>
              <span className="entry-label">{e.label}</span>
            </div>
            <h2 className="entry-title">{e.title}</h2>
            <p className="entry-body">{e.body}</p>
            {e.asset && (
              <div className="entry-asset">
                <img src={e.asset.src} alt={e.asset.alt} />
              </div>
            )}
          </article>
        ))}
      </div>

      <a href="/" className="back-home back-home-bottom">← laclawclaw.com</a>
    </main>
  );
}
