export interface Product {
  slug: string;
  sku: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  image: string; // placeholder until real product photos
  color: string; // accent color for card
  available: boolean;
}

export const PRODUCTS: Product[] = [
  {
    slug: "claw-bot",
    sku: "LCC-PLUSH-001",
    name: "Claw Bot",
    tagline: "The original arcade agent",
    description:
      "A soft, squishy plushie shaped like a classic claw machine arm — but with a friendly face and LED-glow stitching. The one that started it all. Comes with a tiny golden token sewn into its paw.",
    price: 34.99,
    currency: "USD",
    image: "/placeholder-claw-bot.svg",
    color: "neon-pink",
    available: true,
  },
  {
    slug: "pixel-paw",
    sku: "LCC-PLUSH-002",
    name: "Pixel Paw",
    tagline: "8-bit charm, infinite cuddles",
    description:
      "A retro-inspired plushie with pixel-art features and velvety fur. Part game character, part comfort object. Its eyes are embroidered arcade screens. Squeeze it and feel the nostalgia.",
    price: 39.99,
    currency: "USD",
    image: "/placeholder-pixel-paw.svg",
    color: "neon-blue",
    available: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
