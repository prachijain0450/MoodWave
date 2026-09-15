import React from 'react';
import { Waves } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#06070d]/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090b14] rounded-[11px] flex items-center justify-center">
              <Waves className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              MoodWave
            </span>
          </div>
        </div>

        {/* Adaptive Status Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Adaptive Canvas Ready</span>
          <span className="sm:hidden">Ready</span>
        </div>
      </div>
    </header>
  );
}
