export function ClawMachine() {
  return (
    <div className="relative mx-auto w-64 h-72">
      {/* Machine body */}
      <div className="absolute inset-0 glass rounded-2xl border-2 border-arcade-border overflow-hidden scanlines">
        {/* Top rail */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-arcade-card border-b border-arcade-border flex items-center justify-center">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-neon-pink animate-neon-pulse" />
            <div className="h-2 w-2 rounded-full bg-neon-blue animate-neon-pulse [animation-delay:0.3s]" />
            <div className="h-2 w-2 rounded-full bg-neon-green animate-neon-pulse [animation-delay:0.6s]" />
          </div>
        </div>

        {/* Claw arm */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 animate-claw origin-top">
          {/* Rod */}
          <div className="mx-auto h-16 w-0.5 bg-gray-400" />
          {/* Claw prongs */}
          <div className="relative -mt-1">
            <div className="mx-auto h-6 w-8 border-l-2 border-r-2 border-b-2 border-neon-pink rounded-b-lg" />
          </div>
        </div>

        {/* Prizes inside */}
        <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-3 p-4">
          <div className="h-10 w-10 rounded-full bg-neon-pink/20 border border-neon-pink/30" />
          <div className="h-8 w-8 rounded-lg bg-neon-blue/20 border border-neon-blue/30" />
          <div className="h-9 w-9 rounded-full bg-neon-purple/20 border border-neon-purple/30" />
          <div className="h-7 w-10 rounded-lg bg-neon-green/20 border border-neon-green/30" />
        </div>
      </div>

      {/* Machine label */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <p className="font-mono text-xs text-gray-500 tracking-widest">
          INSERT AGENT TO PLAY
        </p>
      </div>
    </div>
  );
}
