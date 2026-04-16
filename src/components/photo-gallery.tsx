"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryPhoto = {
  src: string;
  alt: string;
  label?: string;
};

export function PhotoGallery({
  photos,
  kicker,
  heading,
}: {
  photos: GalleryPhoto[];
  kicker?: string;
  heading?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback((i: number) => {
    setOpenIndex(i);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpenIndex(null);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((i) => {
        if (i === null) return i;
        const next = (i + dir + photos.length) % photos.length;
        return next;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  return (
    <section className="photo-gallery-section">
      <style>{`
        .photo-gallery-section {
          padding: 72px 32px;
          background: linear-gradient(180deg, rgba(6,7,10,1) 0%, rgba(10,13,18,1) 100%);
        }
        .pg-shell {
          width: min(100%, 1200px);
          margin: 0 auto;
          display: grid;
          gap: 32px;
        }
        .pg-head {
          display: grid;
          gap: 10px;
          text-align: center;
          justify-items: center;
        }
        .pg-kicker {
          font-size: 0.74rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .pg-head h2 {
          margin: 0;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        .pg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 680px) {
          .pg-grid { grid-template-columns: 1fr; }
        }

        .pg-tile {
          position: relative;
          aspect-ratio: 3 / 4;
          border-radius: 14px;
          overflow: hidden;
          background: #0a0d12;
          border: 1px solid rgba(255,255,255,0.06);
          cursor: zoom-in;
          padding: 0;
          transition: transform 250ms ease, border-color 250ms ease;
          display: block;
        }
        .pg-tile:hover {
          transform: translateY(-2px);
          border-color: rgba(255,209,102,0.3);
        }
        .pg-tile img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .pg-label {
          position: absolute;
          bottom: 12px;
          left: 12px;
          padding: 6px 11px;
          background: rgba(0,0,0,0.62);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.88);
        }
        .pg-tile-expand {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(0,0,0,0.62);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #fff;
          opacity: 0;
          transition: opacity 180ms ease;
        }
        .pg-tile:hover .pg-tile-expand {
          opacity: 1;
        }

        /* Lightbox */
        .pg-lightbox {
          border: 0;
          padding: 0;
          background: transparent;
          max-width: 100vw;
          max-height: 100vh;
          width: 100vw;
          height: 100vh;
          margin: 0;
        }
        .pg-lightbox::backdrop {
          background: rgba(5, 7, 11, 0.94);
          backdrop-filter: blur(12px);
        }
        .pg-lightbox-body {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 40px 24px;
          box-sizing: border-box;
        }
        .pg-lightbox-img-wrap {
          max-width: min(92vw, 1200px);
          max-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pg-lightbox-img-wrap img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          display: block;
          border-radius: 8px;
        }
        .pg-lightbox-label {
          margin-top: 16px;
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.82rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }
        .pg-lightbox-close,
        .pg-lightbox-nav {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
          cursor: pointer;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 180ms ease;
        }
        .pg-lightbox-close:hover,
        .pg-lightbox-nav:hover {
          background: rgba(255,255,255,0.16);
        }
        .pg-lightbox-close {
          top: 20px;
          right: 20px;
        }
        .pg-lightbox-nav.prev { left: 20px; top: 50%; transform: translateY(-50%); }
        .pg-lightbox-nav.next { right: 20px; top: 50%; transform: translateY(-50%); }
        @media (max-width: 680px) {
          .pg-lightbox-nav.prev { left: 8px; }
          .pg-lightbox-nav.next { right: 8px; }
          .pg-lightbox-close   { top: 12px; right: 12px; }
        }
      `}</style>

      <div className="pg-shell">
        {(kicker || heading) && (
          <div className="pg-head">
            {kicker && <div className="pg-kicker">{kicker}</div>}
            {heading && <h2>{heading}</h2>}
          </div>
        )}

        <div className="pg-grid">
          {photos.map((p, i) => (
            <button
              key={p.src}
              className="pg-tile"
              onClick={() => open(i)}
              aria-label={`Open ${p.alt} full size`}
            >
              <img src={p.src} alt={p.alt} loading="lazy" />
              {p.label && <span className="pg-label">{p.label}</span>}
              <span className="pg-tile-expand" aria-hidden="true">⤢</span>
            </button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="pg-lightbox"
        onClick={(e) => {
          // Click on backdrop (dialog itself, not children) closes
          if (e.target === dialogRef.current) close();
        }}
        onClose={() => setOpenIndex(null)}
      >
        <div className="pg-lightbox-body">
          <button
            className="pg-lightbox-close"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>
          {photos.length > 1 && (
            <>
              <button
                className="pg-lightbox-nav prev"
                onClick={() => step(-1)}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                className="pg-lightbox-nav next"
                onClick={() => step(1)}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
          {openIndex !== null && (
            <>
              <div className="pg-lightbox-img-wrap">
                <img
                  src={photos[openIndex].src}
                  alt={photos[openIndex].alt}
                />
              </div>
              {photos[openIndex].label && (
                <div className="pg-lightbox-label">
                  {photos[openIndex].label} · {openIndex + 1} / {photos.length}
                </div>
              )}
            </>
          )}
        </div>
      </dialog>
    </section>
  );
}
