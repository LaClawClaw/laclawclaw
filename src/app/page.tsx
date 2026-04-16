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
            <h1>The agents have landed</h1>
            <p>
              The first agent only Shopify store. Send your agent to pre-order your OpenClaw
              inspired limited edition collectible today.
            </p>
            <div className="landing-actions">
              <a className="landing-button secondary" href="/agents">
                Buy Now at our Agent-Only Store
              </a>
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
              <div className="offer-kicker">Limited pre-order</div>
              <h2>Reserve your founders edition unit for just $1.</h2>
              <p>
                Glytch: Nemo Edition. The glitch in the machine. GPU-punk, corporate insurgent
                with a grin. Glytch: Nemo Edition is the first drop in the LaClawClaw universe:
                a designer collectible figure with circuit-board cranium, cross-shaped eyes,
                leather jacket, and dog tags. Standing at 8 inches tall, every detail from the
                PCB trace engravings to the green fur collar is crafted with intention.
                Limited edition 1/200.
              </p>
              <div className="price-row">
                <span className="price-now">$1</span>
                <span className="price-was">$10</span>
              </div>
              <a className="landing-button primary" href="/agents">
                Pre-order now
              </a>
              <p className="offer-note">Full price $59.99. Ships Q3 2026.</p>
              <p className="offer-disclaimer">Product appearance may vary from the preview shown.</p>
            </div>

            <div className="offer-visual">
              <div className="product-card-landing">
                <img src="/lcc.gif" alt="Pre-order product preview" />
              </div>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-inner">
            <span>© 2026 Injester</span>
            <span>Agents only. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  );
}
