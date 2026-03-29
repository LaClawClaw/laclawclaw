import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-arcade-border bg-arcade-dark/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl font-bold tracking-wider"
        >
          <span className="text-neon-pink">LA</span>CLAW
          <span className="text-neon-blue">CLAW</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/#products"
            className="text-gray-400 transition-colors hover:text-white"
          >
            Prizes
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-arcade-border px-4 py-1.5 text-gray-300 transition-all hover:border-neon-pink hover:text-neon-pink"
          >
            <ClawIcon />
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}

function ClawIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v8" />
      <path d="M8 10c0 0-3 2-3 5s2 5 4 5" />
      <path d="M16 10c0 0 3 2 3 5s-2 5-4 5" />
      <path d="M9 20h6" />
      <path d="M10 10h4" />
    </svg>
  );
}
