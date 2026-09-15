import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, PenLine, RefreshCw } from 'lucide-react';
import MoodEnvironment from '../components/MoodEnvironment';
import { MOODS } from '../utils/moods';
import { cn } from '../utils/cn';

export default function MoodExperiencePage({
  selectedMood,
  onSelectMood,
  onChangeMood,
  onContinueNext,
}) {
  // Fallback to Calm if none selected
  const currentMood = selectedMood || MOODS.find((m) => m.id === 'calm') || MOODS[0];
  const Icon = currentMood.icon;
  const env = currentMood.environment;
  const pace = currentMood.breathingPace || 4;

  const handleActionClick = () => {
    // Navigate directly to note screen
    if (onContinueNext) {
      onContinueNext(currentMood);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden text-white selection:bg-white/30 selection:text-white">
      {/* Full-Page Dynamic Visual Atmosphere */}
      <MoodEnvironment mood={currentMood} />

      {/* Top Header Bar with Mood Tinted Glass */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b border-white/[0.1] backdrop-blur-2xl transition-colors duration-700',
          env.headerBg
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Change Mood Button */}
          <button
            type="button"
            onClick={onChangeMood}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer group px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Change Mood</span>
          </button>

          {/* Quick Mood Switcher Pills for Instant Previews */}
          <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full border border-white/[0.15] bg-black/30 backdrop-blur-xl shadow-inner">
            {MOODS.map((m) => {
              const isActive = currentMood.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectMood(m);
                  }}
                  className={cn(
                    'px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5',
                    isActive
                      ? 'bg-white text-slate-950 shadow-lg scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.1]'
                  )}
                >
                  <span className="text-sm select-none">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Current Status Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/25 text-xs font-semibold text-white backdrop-blur-xl shrink-0 shadow-sm">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: env.pulseColor }}
            />
            <span className="hidden sm:inline">{currentMood.statusTag}</span>
            <span className="sm:hidden">{currentMood.label}</span>
          </div>
        </div>
      </header>

      {/* Main Experience Sanctuary */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-6 py-10 sm:py-14 w-full flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMood.id}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -15 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Center Breathing / Resonance Emblem */}
            <div className="relative mb-8 sm:mb-10 flex items-center justify-center">
              {/* Outer Breathing Pulse Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.35, 0.8, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: pace,
                  ease: 'easeInOut',
                }}
                className={cn(
                  'absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 shadow-2xl',
                  env.accentRing
                )}
              />

              {/* Second Echo Ring */}
              <motion.div
                animate={{
                  scale: [1.1, 1.5, 1.1],
                  opacity: [0.2, 0.55, 0.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: pace,
                  delay: pace * 0.25,
                  ease: 'easeInOut',
                }}
                className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-white/20"
              />

              {/* Inner Glowing Center Hub */}
              <div
                className={cn(
                  'relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1 shadow-2xl backdrop-blur-2xl flex items-center justify-center border',
                  env.cardBorder,
                  currentMood.accent.glow
                )}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%)',
                }}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <span className="text-4xl sm:text-5xl select-none filter drop-shadow-lg">
                    {currentMood.emoji}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Icon className={cn('w-4 h-4', currentMood.accent.iconColor)} />
                    <span className="text-xs uppercase font-extrabold tracking-widest text-white drop-shadow-sm">
                      {currentMood.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/25 backdrop-blur-xl text-xs sm:text-sm font-semibold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{currentMood.statusTag}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 drop-shadow-md">
              You are feeling{' '}
              <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-white underline decoration-white/40 underline-offset-8">
                {currentMood.label}
              </span>
            </h1>

            {/* Personalized Restorative Atmosphere Card */}
            <div
              className={cn(
                'w-full max-w-2xl p-6 sm:p-8 rounded-3xl border backdrop-blur-2xl shadow-2xl text-left mb-10 transition-all duration-500',
                env.cardBorder,
                env.cardBg
              )}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={cn(
                    'p-2.5 rounded-xl border border-white/20 shrink-0 shadow-md',
                    currentMood.accent.bgSelected
                  )}
                >
                  <Icon className={cn('w-5 h-5', currentMood.accent.iconColor)} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white mb-1 drop-shadow-sm">
                    Atmospheric Reflection
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 font-medium">
                    Paced at {pace}s breathing cadence for emotional resonance
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg text-white leading-relaxed font-normal drop-shadow-sm">
                {currentMood.experienceMessage}
              </p>
            </div>

            {/* Interactive Action Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {/* Change Mood Button */}
              <button
                type="button"
                onClick={onChangeMood}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 bg-black/30 hover:bg-black/45 text-white text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/40 shadow-lg"
              >
                <RefreshCw className="w-4 h-4 text-white/80" />
                <span>Change Mood</span>
              </button>

              {/* Primary Action Button: Add Note / Continue */}
              <button
                type="button"
                onClick={handleActionClick}
                className={cn(
                  'group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-white/30 drop-shadow-sm',
                  env.buttonGradient
                )}
              >
                <PenLine className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Add Your Note</span>
              </button>
            </div>


          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with Mood Tinted Glass */}
      <footer
        className={cn(
          'relative z-10 w-full border-t border-white/[0.1] py-6 text-center text-xs text-white/70 backdrop-blur-xl transition-colors duration-700',
          env.headerBg
        )}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MoodWave. All rights reserved.</p>
          <p className="text-white/60 font-medium">Your mood. Your space.</p>
        </div>
      </footer>
    </div>
  );
}
