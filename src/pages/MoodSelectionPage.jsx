import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import MoodCard from '../components/MoodCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { MOODS } from '../utils/moods';

export default function MoodSelectionPage({
  selectedMood,
  onSelectMood,
  onContinue,
  onBack,
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <AnimatedBackground />

      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#06070d]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.04] text-xs font-medium text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Step 1 of 3: Mood Alignment</span>
          </div>
        </div>
      </header>

      {/* Main Mood Selection Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex flex-col items-center">
        {/* Header Heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Emotional Check-In</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            How are you feeling right now?
          </h1>
          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed max-w-xl mx-auto font-normal">
            Select the mood that best reflects your current headspace. MoodWave will tune its digital space to resonate with you.
          </p>
        </motion.div>

        {/* 6 Mood Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mb-8 sm:mb-12">
          {MOODS.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              isSelected={selectedMood?.id === mood.id}
              onSelect={onSelectMood}
            />
          ))}
        </div>

        {/* Action & Feedback Drawer */}
        <div className="w-full max-w-2xl min-h-[120px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {selectedMood ? (
              <motion.div
                key={selectedMood.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-2xl"
              >
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <span className="text-lg select-none">{selectedMood.emoji}</span>
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Selected: <span className="text-white font-bold">{selectedMood.label}</span>
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed italic">
                    “{selectedMood.message}”
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={() => onContinue(selectedMood)}
                  className="group w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/30 shrink-0"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs sm:text-sm text-slate-400 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400/60 animate-ping" />
                <span>Select a mood above to unlock your personalized space.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-white/[0.05] py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MoodWave. All rights reserved.</p>
          <p className="text-slate-600">Your mood. Your space.</p>
        </div>
      </footer>
    </div>
  );
}
