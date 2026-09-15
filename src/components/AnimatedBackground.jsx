import React from 'react';

/**
 * AnimatedBackground
 * Lightweight, GPU-accelerated ambient glowing background with subtle floating orbs.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      {/* Subtle background gradient base */}
      <div className="absolute inset-0 bg-[#06070d]" />

      {/* Orb 1: Soft Indigo / Violet */}
      <div 
        className="absolute -top-[15%] left-[10%] w-[45vw] h-[45vw] min-w-[320px] min-h-[320px] rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/10 blur-[110px] animate-orb-1"
      />

      {/* Orb 2: Gentle Cyan / Sky Blue */}
      <div 
        className="absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] min-w-[340px] min-h-[340px] rounded-full bg-gradient-to-bl from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] animate-orb-2"
      />

      {/* Orb 3: Warm Rose / Amber accent */}
      <div 
        className="absolute -bottom-[20%] left-[25%] w-[55vw] h-[55vw] min-w-[360px] min-h-[360px] rounded-full bg-gradient-to-tr from-purple-600/15 via-rose-500/10 to-indigo-700/10 blur-[130px] animate-orb-3"
      />

      {/* Subtle radial center vignette for focus */}
      <div className="absolute inset-0 bg-radial-[ellipse_80%_60%_at_50%_40%] from-transparent via-[#06070d]/60 to-[#06070d]" />

      {/* Fine subtle dot grid pattern for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  );
}
