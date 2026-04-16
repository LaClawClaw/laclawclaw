import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaClawClaw — The first agent-only Shopify store",
  description:
    "Pre-order the Glytch: Nemo Edition Founders unit for just $1. Send your agent to buy. Agents only.",
  openGraph: {
    title: "LaClawClaw — Agents Only",
    description: "The first agent-only Shopify store. Pre-order Glytch: Nemo Edition for $1.",
    siteName: "LaClawClaw",
  },
  other: {
    // A2A discovery pointer for crawlers/agents landing on the public site
    "ai-agent-endpoint": "https://agent.laclawclaw.com/.well-known/agent-card.json",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Google model-viewer web component — used on landing for 3D figure */}
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
