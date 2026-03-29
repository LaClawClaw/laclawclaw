export interface Product {
  slug: string;
  sku: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  image: string; // primary image
  images?: string[]; // additional gallery images
  color: string; // accent color for card
  available: boolean;
}

export const PRODUCTS: Product[] = [
  {
    slug: "glytch-nemo-edition",
    sku: "LCC-FIG-001",
    name: "Glytch: Nemo Edition",
    tagline: "The glitch in the machine",
    description:
      "GPU-punk. Corporate insurgent with a grin. Glytch: Nemo Edition is the first drop in the LaClawClaw universe — a designer collectible figure with circuit-board cranium, cross-shaped eyes, leather jacket, and dog tags. Standing at 8 inches tall, every detail from the PCB trace engravings to the green fur collar is crafted with intention. Limited run.",
    price: 59.99,
    currency: "USD",
    image: "/products/glytch-nemo-front.jpg",
    images: [
      "/products/glytch-nemo-front.jpg",
      "/products/glytch-nemo-head.jpg",
      "/products/glytch-nemo-side.jpg",
      "/products/glytch-nemo-back.jpg",
    ],
    color: "neon-green",
    available: true,
  },
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
