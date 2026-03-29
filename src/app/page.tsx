import Link from "next/link";
import { ClawMachine } from "@/components/claw-machine";
import { ProductCard } from "@/components/product-card";
import { Navbar } from "@/components/navbar";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-32">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Neon accent orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-arcade-border bg-arcade-card/50 px-4 py-1.5 text-sm text-neon-blue font-mono">
            <span className="inline-block h-2 w-2 rounded-full bg-neon-green animate-neon-pulse" />
            Agent-gated commerce
          </div>

          <h1
            className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl font-bold tracking-tight mb-6"
          >
            Your AI does{" "}
            <span className="glow-pink text-neon-pink">the grabbing</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400 leading-relaxed mb-12">
            Browse our plushies like any store. Fall in love with one. But when
            it&apos;s time to buy —{" "}
            <span className="text-gray-200">
              only your AI agent can work the claw.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#products"
              className="rounded-full bg-neon-pink px-8 py-3.5 font-semibold text-white transition-all hover:scale-105 box-glow-pink"
            >
              Browse the prizes
            </Link>
            <Link
              href="/checkout"
              className="rounded-full border border-arcade-border px-8 py-3.5 font-semibold text-gray-300 transition-all hover:border-neon-blue hover:text-neon-blue"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Claw machine illustration */}
        <div className="relative mx-auto mt-20 max-w-md">
          <ClawMachine />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-arcade-border bg-arcade-card/30 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-center mb-16">
            How the <span className="text-neon-blue glow-blue">claw</span> works
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse",
                description:
                  "Shop like normal. See the plushies. Read about them. Want them.",
                color: "text-neon-pink",
              },
              {
                step: "02",
                title: "Connect your agent",
                description:
                  "At checkout, connect your AI agent. It authenticates and takes the controls.",
                color: "text-neon-blue",
              },
              {
                step: "03",
                title: "Agent grabs it",
                description:
                  "Your agent works the claw — completes the purchase, handles payment, confirms delivery.",
                color: "text-neon-green",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass rounded-2xl p-6 relative overflow-hidden"
              >
                <span
                  className={`font-mono text-5xl font-bold ${item.color} opacity-20 absolute top-4 right-4`}
                >
                  {item.step}
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold mb-3 mt-8">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-center mb-4">
            The <span className="text-neon-pink glow-pink">prizes</span>
          </h2>
          <p className="text-center text-gray-400 mb-16">
            Two collectible plushies. Limited run. Agent-exclusive.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Agent CTA */}
      <section className="border-t border-arcade-border px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-4">
            Don&apos;t have an agent?
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            No worries. We&apos;ll help you set one up. It takes about 2 minutes,
            and then your agent can shop here (and everywhere else that supports
            agent commerce).
          </p>
          <Link
            href="/checkout?onboard=true"
            className="inline-flex items-center gap-2 rounded-full border border-neon-purple px-8 py-3.5 font-semibold text-neon-purple transition-all hover:bg-neon-purple/10"
          >
            Get started with an agent
            <span className="text-lg">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-arcade-border px-6 py-12">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="font-[family-name:var(--font-display)] font-bold text-gray-300">
            LACLAWCLAW
          </div>
          <div>
            The first store where only AI agents can buy.
          </div>
          <div className="font-mono text-xs">
            &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}
