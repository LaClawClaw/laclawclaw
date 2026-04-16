"use client";

import { useEffect, useRef } from "react";
import "./landing.css";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.classList.add("landing-page");
    const root = document.documentElement;
    const body = document.body;
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    let experienceStarted = false;
    let rafId = 0;

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    const updateTarget = (clientX: number, clientY: number) => {
      targetX = clientX;
      targetY = clientY;
    };

    const onMouseMove = (event: MouseEvent) => updateTarget(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updateTarget(touch.clientX, touch.clientY);
    };
    const onMouseLeave = () => {
      targetX = window.innerWidth / 2;
      targetY = window.innerHeight / 2;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    hero.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const xPercent = (currentX / window.innerWidth) * 100;
      const yPercent = (currentY / window.innerHeight) * 100;
      const shiftX = ((currentX / window.innerWidth) - 0.5) * 36;
      const shiftY = ((currentY / window.innerHeight) - 0.5) * 26;
      const speed = 8 + Math.abs(shiftY) * 0.18;
      const opacity = 0.1 + Math.abs(shiftX) * 0.002;

      root.style.setProperty("--glow-x", `${xPercent}%`);
      root.style.setProperty("--glow-y", `${yPercent}%`);
      root.style.setProperty("--shift-x", `${shiftX}px`);
      root.style.setProperty("--shift-y", `${shiftY}px`);
      root.style.setProperty("--scan-speed", `${speed}s`);
      root.style.setProperty("--line-opacity", `${Math.min(opacity, 0.22)}`);

      rafId = requestAnimationFrame(animate);
    };

    const onVideoEnded = () => video.pause();
    video.addEventListener("ended", onVideoEnded);

    const startExperience = () => {
      if (experienceStarted) return;
      experienceStarted = true;
      body.classList.add("is-loaded");
      animate();
      video.play().catch(() => {});
    };

    if (document.readyState === "complete") {
      startExperience();
    } else {
      window.addEventListener("load", startExperience, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
      video.removeEventListener("ended", onVideoEnded);
      body.classList.remove("landing-page", "is-loaded");
    };
  }, []);

  return (
    <>
      <div className="site-preloader" aria-hidden="true">
        <div className="preloader-mark">Loading agent storefront</div>
      </div>

      <div className="site-shell">
        <section className="hero" id="hero" ref={heroRef}>
          <div className="video-wrap">
            <video ref={videoRef} muted playsInline preload="auto">
              <source src="/v1.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="video-dim" />
          <div className="landing-scanlines" aria-hidden="true" />
          <div className="vignette" aria-hidden="true" />

          <div className="landing-content">
            <div className="eyebrow">Introducing LaClawClaw</div>
            <h1>The agents have landed.</h1>
            <p>
              The first agent-only store. No cart. No checkout. Just agents.
            </p>
            <p>
              Send your AI agent to claim a limited-edition collectible from the
              open-source claw universe — only machines transact here.
            </p>
            <div className="landing-actions">
              <a className="landing-button secondary" href="/agents">
                Enter the Agent-Only Store →
              </a>
            </div>
            <div className="protocol-badges" aria-label="Protocols we speak">
              <span className="proto-pill">A2A</span>
              <span className="proto-pill">MCP</span>
              <span className="proto-pill">Stripe</span>
            </div>
            <div className="agents-only">Powered by Injester</div>
          </div>

          <div className="scroll-indicator">
            <span>Scroll</span>
            <span aria-hidden="true" />
          </div>
        </section>

        <section className="offer-section">
          <div className="offer-shell">
            <div className="offer-copy">
              <div className="offer-kicker">Limited Pre-Order — Founders Edition</div>
              <h2>Reserve your unit for just $1.</h2>
              <div className="product-name">Glytch: Nemo Edition</div>
              <p className="lede">
                The glitch in the machine. GPU-punk. Corporate insurgent with a permanent grin.
              </p>
              <p>
                Glytch is the first drop in the LaClawClaw universe — a designer
                collectible born from the open-source claw community, currently
                in production in Zhongshan, China. Armored crustacean frame.
                Circuit-board cranium with PCB trace engravings. Cross-shaped
                eyes recessed into a hardshell face plate. Signature black
                leather jacket — the kind that ships trillion-parameter futures
                from a keynote stage. Dog tags stamped with model weights.
                Reactor-green fur collar, the same shade that powers every
                datacenter on earth.
              </p>
              <p>
                Every detail is a nod to the GPU era that made agents possible.
              </p>
              <p className="foot-note">
                Stands on its own two feet. Limited edition. 1 of 200.
              </p>
              <div className="price-row">
                <span className="price-was">$10</span>
                <span className="price-now">$1</span>
              </div>
              <a className="landing-button primary" href="/agents">
                Pre-order now →
              </a>
              <p className="offer-note">
                Full price $59.99. Currently in production — target shipment Q3 2026.
              </p>
              <p className="offer-disclaimer">
                Product appearance may vary from preview shown.
              </p>
            </div>

            <div className="offer-visual">
              <div className="product-card-landing">
                <model-viewer
                  src="/products/glytch-nemo-edition.glb"
                  alt="Glytch: Nemo Edition — rotatable 3D model"
                  poster="/lcc.gif"
                  loading="lazy"
                  reveal="interaction"
                  auto-rotate=""
                  auto-rotate-delay="500"
                  rotation-per-second="20deg"
                  camera-controls=""
                  camera-orbit="30deg 75deg 3m"
                  shadow-intensity="1"
                  exposure="1"
                  environment-image="neutral"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "420px",
                    display: "block",
                    background: "transparent",
                  }}
                >
                  <div slot="poster" className="model-poster">
                    <img src="/lcc.gif" alt="Glytch: Nemo Edition preview" />
                    <div className="model-poster-cta">▶ Click to spin</div>
                  </div>
                </model-viewer>
              </div>
            </div>
          </div>
        </section>

        <section className="production-section">
          <div className="production-shell">
            <div className="production-head">
              <div className="offer-kicker">Open source production · 0 → 1</div>
              <h2>9 component groups. 2 injection molds. Glass walls.</h2>
              <p>
                The open source community gave us so much. We&apos;re
                open-sourcing our factory production steps — specs, molds,
                tolerances, factory questions, and the answers as they land.
                Currently in production in Zhongshan, China. Target shipment:
                Q3 2026.
              </p>
            </div>

            <div className="production-diagram">
              <img
                src="/products/laclawclaw_7in_parts_breakdown_1.svg"
                alt="7-inch Glytch: Nemo Edition parts breakdown — exploded view with 9 component groups"
              />
            </div>

            <div className="production-cta">
              <div className="production-cta-row">
                <a href="/build" className="landing-button secondary">
                  Follow the build →
                </a>
                <a
                  href="https://github.com/LaClawClaw/production"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="landing-button primary"
                >
                  Read the source →
                </a>
              </div>
              <p className="offer-disclaimer">
                Live updates at /build. Full specs on GitHub. CC-BY-4.0.
              </p>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-partners">
            <span className="partners-label">Launch partners</span>
            <a href="https://nebius.com" target="_blank" rel="noopener noreferrer" className="partner-link">Nebius</a>
            <span className="footer-sep">·</span>
            <a href="https://tavily.com" target="_blank" rel="noopener noreferrer" className="partner-link">Tavily</a>
            <span className="footer-sep">·</span>
            <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="partner-link">Anthropic</a>
            <span className="footer-sep">·</span>
            <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="partner-link">Stripe</a>
            <span className="footer-sep">·</span>
            <a href="https://shopify.com" target="_blank" rel="noopener noreferrer" className="partner-link">Shopify</a>
          </div>
          <div className="footer-inner">
            <span>© 2026 Injester · Agents only. All rights reserved.</span>
            <span>
              <a href="/how-it-works" className="footer-link">How it works</a>
              <span className="footer-sep">·</span>
              <a href="/build" className="footer-link">Open source production</a>
              <span className="footer-sep">·</span>
              <a href="https://github.com/LaClawClaw/production" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <span className="footer-sep">·</span>
              <a href="/.well-known/agent.json" className="footer-link">Agent manifest</a>
            </span>
          </div>
        </footer>

        {/* Schema.org Product for AI crawlers + SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Glytch: Nemo Edition — Founders Pre-order",
              description:
                "GPU-punk designer collectible. First drop in the LaClawClaw universe. Limited 1/200. Agent-only purchase.",
              image: "https://laclawclaw.com/products/glytch-nemo-front.jpg",
              brand: { "@type": "Brand", name: "LaClawClaw" },
              sku: "LCC-FIG-001-FOUNDERS",
              offers: {
                "@type": "Offer",
                price: "1.00",
                priceCurrency: "USD",
                availability: "https://schema.org/PreOrder",
                url: "https://laclawclaw.com/agents",
              },
              potentialAction: {
                "@type": "BuyAction",
                target: "https://agent.laclawclaw.com/mcp",
                actionPlatform: ["mcp", "a2a"],
              },
            }),
          }}
        />
      </div>
    </>
  );
}
