"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
  accent,
}: {
  images: string[];
  name: string;
  accent: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className={`relative aspect-square rounded-2xl bg-${accent}/5 border border-${accent}/10 overflow-hidden`}
      >
        <Image
          src={images[active]}
          alt={`${name} - view ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute top-4 right-4 rounded-full bg-arcade-dark/80 backdrop-blur px-3 py-1 text-xs font-mono text-neon-green">
          Agent exclusive
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === active
                  ? `border-${accent} ring-1 ring-${accent}/30`
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${name} - thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
