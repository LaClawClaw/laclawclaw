"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";

interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

type CheckoutState =
  | "loading"
  | "empty"
  | "ready"         // cart has items, waiting for agent
  | "connecting"    // agent connection in progress
  | "connected"     // agent authenticated
  | "purchasing"    // agent completing purchase
  | "success"       // purchase complete
  | "onboarding";   // no agent, showing setup guide

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [state, setState] = useState<CheckoutState>("loading");
  const [agentName, setAgentName] = useState("");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lcc-cart") || "[]");
    setCart(stored);

    if (searchParams.get("onboard") === "true") {
      setState("onboarding");
    } else if (stored.length === 0) {
      setState("empty");
    } else {
      setState("ready");
    }
  }, [searchParams]);

  // Animated dots for connecting/purchasing states
  useEffect(() => {
    if (state === "connecting" || state === "purchasing") {
      const interval = setInterval(() => {
        setDots((d) => (d.length >= 3 ? "" : d + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Simulate agent connection flow
  const simulateAgentConnect = () => {
    setState("connecting");
    setTimeout(() => {
      setAgentName("ClawBot Agent v1");
      setState("connected");
    }, 2500);
  };

  const simulatePurchase = () => {
    setState("purchasing");
    setTimeout(() => {
      setState("success");
      localStorage.removeItem("lcc-cart");
    }, 3000);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 pt-28 pb-24">
        {/* Empty cart */}
        {state === "empty" && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-6xl mb-6">🎪</p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-3">
              Nothing to grab
            </h2>
            <p className="text-gray-400 mb-6">
              Add some plushies to your cart first.
            </p>
            <a
              href="/#products"
              className="inline-flex rounded-full bg-neon-pink px-6 py-3 font-semibold text-white"
            >
              Browse prizes
            </a>
          </div>
        )}

        {/* AGENT GATE — The Hero Moment */}
        {state === "ready" && (
          <div className="text-center">
            {/* The reveal animation container */}
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-neon-pink/5 rounded-full blur-[100px]" />

              <div className="relative glass rounded-3xl p-10 border-2 border-neon-pink/20 overflow-hidden scanlines">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue" />

                <p className="font-mono text-xs text-neon-green mb-6 tracking-widest">
                  AGENT CHECKOUT TERMINAL
                </p>

                <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-4">
                  Ready for the{" "}
                  <span className="text-neon-pink glow-pink">claw</span>
                </h1>

                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Your cart is loaded. Now connect your AI agent to complete the
                  purchase. The agent handles payment, shipping, and
                  confirmation.
                </p>

                {/* Cart summary */}
                <div className="glass rounded-xl p-4 mb-8 text-left">
                  {cart.map((item) => (
                    <div
                      key={item.sku}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">
                        {item.name}{" "}
                        <span className="text-gray-500">&times;{item.quantity}</span>
                      </span>
                      <span className="font-mono text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-arcade-border mt-2 pt-2 flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Connect agent button */}
                <button
                  onClick={simulateAgentConnect}
                  className="w-full rounded-full bg-gradient-to-r from-neon-pink to-neon-purple py-4 font-semibold text-lg text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,45,123,0.3)]"
                >
                  Connect your AI agent
                </button>

                <button
                  onClick={() => setState("onboarding")}
                  className="mt-4 text-sm text-gray-500 hover:text-neon-purple transition-colors"
                >
                  Don&apos;t have an agent? Get started &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connecting */}
        {state === "connecting" && (
          <div className="text-center">
            <div className="glass rounded-3xl p-12 border-2 border-neon-blue/20">
              <div className="mx-auto mb-8 h-24 w-24 rounded-full border-2 border-neon-blue/30 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border-2 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-3">
                Connecting agent{dots}
              </h2>
              <p className="text-gray-400 font-mono text-sm">
                Waiting for agent handshake
              </p>

              <div className="mt-8 space-y-2 text-left max-w-xs mx-auto font-mono text-xs">
                <p className="text-neon-green">
                  &gt; Agent discovery{" "}
                  <span className="text-gray-500">... OK</span>
                </p>
                <p className="text-neon-blue">
                  &gt; Authenticating{" "}
                  <span className="text-gray-500">... OK</span>
                </p>
                <p className="text-gray-400 animate-pulse">
                  &gt; Verifying permissions{dots}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connected — agent ready to buy */}
        {state === "connected" && (
          <div className="text-center">
            <div className="glass rounded-3xl p-12 border-2 border-neon-green/20">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-neon-green/10 border-2 border-neon-green/30 flex items-center justify-center">
                <span className="text-4xl">&#10003;</span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-2">
                Agent connected
              </h2>
              <p className="text-neon-green font-mono text-sm mb-8">
                {agentName}
              </p>

              {/* Cart summary */}
              <div className="glass rounded-xl p-4 mb-8 text-left max-w-sm mx-auto">
                {cart.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span>{item.name} &times;{item.quantity}</span>
                    <span className="font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-arcade-border mt-2 pt-2 flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={simulatePurchase}
                className="w-full max-w-sm mx-auto rounded-full bg-neon-green py-4 font-semibold text-lg text-arcade-dark transition-all hover:scale-[1.02]"
              >
                Let the agent grab it
              </button>
            </div>
          </div>
        )}

        {/* Purchasing */}
        {state === "purchasing" && (
          <div className="text-center">
            <div className="glass rounded-3xl p-12 border-2 border-neon-purple/20">
              <div className="mx-auto mb-8">
                <div className="relative w-32 h-40 mx-auto">
                  {/* Mini claw animation */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-claw origin-top">
                    <div className="mx-auto h-12 w-0.5 bg-neon-purple" />
                    <div className="mx-auto h-5 w-6 border-l-2 border-r-2 border-b-2 border-neon-purple rounded-b-lg" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <div className="h-8 w-8 rounded-full bg-neon-pink/20 border border-neon-pink/30" />
                  </div>
                </div>
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-3">
                Agent is grabbing{dots}
              </h2>

              <div className="mt-6 space-y-2 text-left max-w-xs mx-auto font-mono text-xs">
                <p className="text-neon-green">
                  &gt; Creating Shopify checkout... OK
                </p>
                <p className="text-neon-green">
                  &gt; Applying payment method... OK
                </p>
                <p className="text-neon-blue animate-pulse">
                  &gt; Completing purchase{dots}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {state === "success" && (
          <div className="text-center">
            <div className="glass rounded-3xl p-12 border-2 border-neon-green/20">
              <div className="text-6xl mb-6">🎉</div>

              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-3">
                Grabbed!
              </h2>
              <p className="text-gray-400 mb-2">
                Your agent completed the purchase.
              </p>
              <p className="text-neon-green font-mono text-sm mb-8">
                Order confirmed &mdash; check your agent&apos;s webhook for details
              </p>

              <div className="glass rounded-xl p-6 max-w-sm mx-auto mb-8 text-left font-mono text-xs space-y-1">
                <p>
                  <span className="text-gray-500">order_id:</span>{" "}
                  ord_{Date.now().toString(36)}
                </p>
                <p>
                  <span className="text-gray-500">status:</span>{" "}
                  <span className="text-neon-green">confirmed</span>
                </p>
                <p>
                  <span className="text-gray-500">agent:</span> {agentName}
                </p>
                <p>
                  <span className="text-gray-500">shipping:</span> 3-5 business
                  days
                </p>
              </div>

              <a
                href="/"
                className="inline-flex rounded-full border border-arcade-border px-6 py-3 font-semibold text-gray-300 hover:text-white hover:border-white transition-all"
              >
                Back to the arcade
              </a>
            </div>
          </div>
        )}

        {/* Onboarding — no agent */}
        {state === "onboarding" && (
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-4 text-center">
              Get your first{" "}
              <span className="text-neon-purple glow-purple">AI agent</span>
            </h1>
            <p className="text-gray-400 text-center mb-12 max-w-lg mx-auto">
              An AI agent is software that acts on your behalf. Once set up,
              it can shop at LaClawClaw and any other agent-compatible store.
            </p>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Choose an agent platform",
                  description:
                    "Pick any compatible agent framework — OpenClaw, AutoGPT, CrewAI, or build your own with the LaClawClaw API docs.",
                  color: "neon-pink",
                },
                {
                  step: "2",
                  title: "Register your agent",
                  description:
                    "Use the LaClawClaw API to register your agent. You'll get an API key that lets it browse and purchase.",
                  color: "neon-blue",
                  code: `curl -X POST https://api.laclawclaw.com/v1/agents/register \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '{"agent_name": "MyBot", "operator_email": "you@example.com"}'`,
                },
                {
                  step: "3",
                  title: "Connect at checkout",
                  description:
                    "When you're ready to buy, your agent authenticates at checkout and completes the purchase.",
                  color: "neon-green",
                },
              ].map((item) => (
                <div key={item.step} className="glass rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <span
                      className={`font-mono text-2xl font-bold text-${item.color} shrink-0`}
                    >
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.code && (
                        <pre className="mt-4 rounded-lg bg-arcade-dark/80 p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                          {item.code}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="/#products"
                className="inline-flex rounded-full bg-neon-purple px-8 py-3.5 font-semibold text-white transition-all hover:scale-105"
              >
                Browse prizes while you set up
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
