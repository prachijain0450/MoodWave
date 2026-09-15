import React from 'react';
import { ArrowRight, Sparkles, Sliders, ShieldCheck, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function LandingPage({ onStartJourney }) {

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 py-16 sm:py-24 text-center max-w-5xl mx-auto">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-md text-xs sm:text-sm font-medium text-indigo-300 mb-8 animate-wave-glow shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Adaptive Interface</span>
        </div>

        {/* Project Name & Tagline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            MoodWave
          </span>
          <span className="block mt-2 text-2xl sm:text-4xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
            “Your mood. Your space.”
          </span>
        </h1>

        {/* Description explaining mood adaptability */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300/90 leading-relaxed mb-10 font-normal">
          MoodWave is an interactive, emotion-responsive digital sanctuary. The interface continuously 
          adapts its atmosphere, visual tone, and rhythm to harmonize with how you feel — creating a personal space 
          tailored to your present emotional wavelength.
        </p>

        {/* Prominent CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              if (onStartJourney) {
                onStartJourney();
              }
            }}
            className="group relative w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer overflow-hidden border border-indigo-400/30"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            
            <span>Start Your Mood Journey</span>
            <ArrowRight className="w-5 h-5 text-indigo-200 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>

        {/* Architectural Pillars / Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-16 sm:mt-20 w-full text-left">
          <div className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-md hover:bg-white/[0.045] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-indigo-500/5 animate-float-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 tracking-tight">Adaptive Aesthetics</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Visual environments that gracefully transform tones, contrast, and depth to match your energy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-md hover:bg-white/[0.045] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-violet-500/5 animate-float-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 tracking-tight">Emotional Sanctuary</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Designed as a gentle pause for the mind, fostering focus, tranquility, or revitalization as needed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-md hover:bg-white/[0.045] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-cyan-500/5 animate-float-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 tracking-tight">Private & Intentional</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              A private digital canvas crafted purely for your personal wellbeing and mindful experience.
            </p>
          </div>
        </div>
      </main>

      {/* Modern Minimalist Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 sm:py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MoodWave. All rights reserved.</p>
          <p className="text-slate-500 font-medium">Your mood. Your space.</p>
        </div>
      </footer>
    </div>
  );
}
