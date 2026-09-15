import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Sparkles, Brain, CheckCircle2,
  Zap, RefreshCw
} from 'lucide-react';
import MoodEnvironment from '../components/MoodEnvironment';
import {
  analyzeMood,
  SUGGESTED_EXPERIENCES,
  MOOD_DEFAULT_STATE
} from '../utils/moodAnalyzer';
import { MOODS } from '../utils/moods';
import { cn } from '../utils/cn';

// Map suggested experience label → emoji + readable label
const EXPERIENCE_META = {
  calming:    { emoji: '🌊', label: 'Calming' },
  uplifting:  { emoji: '☀️', label: 'Uplifting' },
  relaxing:   { emoji: '🌙', label: 'Relaxing' },
  energizing: { emoji: '⚡', label: 'Energizing' },
  soothing:   { emoji: '🌿', label: 'Soothing' },
  cooling:    { emoji: '❄️', label: 'Cooling' },
};

const PROCESSING_STEPS = [
  'Reading your emotional wavelength…',
  'Mapping mood to experience…',
  'Crafting your personalized insight…',
];

export default function MoodAnalysisPage({
  selectedMood,
  noteText,
  inputMethod,
  onBack,
  onContinue,
}) {
  const [phase, setPhase]         = useState('processing'); // 'processing' | 'result'
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult]       = useState(null);
  const [saved, setSaved]         = useState(false);

  const currentMood = selectedMood || MOODS.find((m) => m.id === 'calm') || MOODS[0];
  const env         = currentMood.environment;
  const MoodIcon    = currentMood.icon;

  // ── Run Analysis ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // Cycle through processing step labels
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PROCESSING_STEPS.length - 1));
    }, 900);

    // Minimum 2.2s processing UX before showing result
    const minDelay = new Promise((r) => setTimeout(r, 2200));

    analyzeMood({ selectedMood: currentMood, noteText })
      .then(async (res) => {
        await minDelay;
        if (cancelled) return;
        clearInterval(stepTimer);
        setResult(res);
        setPhase('result');
      })
      .catch(async () => {
        await minDelay;
        if (cancelled) return;
        clearInterval(stepTimer);
        // Absolute fallback: use mood default, never show blank screen
        const fallbackState = MOOD_DEFAULT_STATE[currentMood.id] || 'Peaceful';
        setResult({
          emotionalState: fallbackState,
          insight: "We couldn't analyze your note right now, but we can still personalize your experience using your selected mood.",
          suggestedExperience: SUGGESTED_EXPERIENCES[fallbackState] || 'calming',
          source: 'local',
        });
        setPhase('result');
      });

    return () => {
      cancelled = true;
      clearInterval(stepTimer);
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleContinue = () => {
    setSaved(true);
    if (onContinue && result) {
      onContinue({
        selectedMood: currentMood,
        noteText: noteText || '',
        inputMethod: inputMethod || 'text',
        emotionalState:      result.emotionalState,
        insight:             result.insight,
        suggestedExperience: result.suggestedExperience,
        source:              result.source,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden text-white selection:bg-white/30">
      <MoodEnvironment mood={currentMood} />

      {/* Header */}
      <header className={cn('sticky top-0 z-40 w-full border-b border-white/[0.1] backdrop-blur-2xl transition-colors duration-500', env.headerBg)}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/25 backdrop-blur-xl text-xs font-semibold text-white shadow-sm">
            <span className="select-none">{currentMood.emoji}</span>
            <span>{currentMood.label}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
            <Brain className="w-3.5 h-3.5 text-white/50" />
            <span className="hidden sm:inline">Step 3 of 3: Analysis</span>
            <span className="sm:hidden">Step 3</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-10 sm:py-14 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">

          {/* ── PROCESSING ── */}
          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center gap-8 w-full max-w-md"
            >
              {/* Central pulsing mood emblem */}
              <div className="relative flex items-center justify-center">
                {/* Outer breathing ring */}
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className={cn('absolute w-28 h-28 rounded-full border-2', env.accentRing)}
                />
                {/* Second ring */}
                <motion.div
                  animate={{ scale: [1.15, 1.6, 1.15], opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.55, ease: 'easeInOut' }}
                  className="absolute w-28 h-28 rounded-full border border-white/15"
                />
                {/* Inner hub */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className={cn(
                    'relative w-20 h-20 rounded-2xl flex items-center justify-center border shadow-2xl backdrop-blur-2xl',
                    env.cardBorder, env.cardBg
                  )}
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 100%)' }}
                >
                  <span className="text-3xl select-none">{currentMood.emoji}</span>
                </motion.div>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3 drop-shadow-md">
                  Understanding your mood…
                </h1>
                <p className="text-sm text-white/60 leading-relaxed">
                  Give us a moment to understand what you shared.
                </p>
              </div>

              {/* Step labels */}
              <div className={cn('w-full px-6 py-4 rounded-2xl border backdrop-blur-2xl', env.cardBorder, env.cardBg)}>
                {PROCESSING_STEPS.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: i <= stepIndex ? 1 : 0.2, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-3 py-2"
                  >
                    <motion.div
                      animate={i < stepIndex ? {} : i === stepIndex ? { opacity: [1, 0.3, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        i < stepIndex ? 'bg-emerald-400' : i === stepIndex ? 'bg-white' : 'bg-white/20'
                      )}
                    />
                    <span className={cn('text-sm', i <= stepIndex ? 'text-white' : 'text-white/30')}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="w-full flex flex-col items-center gap-6"
            >
              {/* Header pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/25 backdrop-blur-xl text-xs font-semibold text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mood Analysis Complete</span>
              </div>

              {/* Main result card */}
              <div className={cn('w-full rounded-3xl border backdrop-blur-2xl shadow-2xl p-6 sm:p-8', env.cardBorder, env.cardBg)}>

                {/* Selected mood row */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg', env.cardBorder, currentMood.accent.bgSelected)}>
                    <MoodIcon className={cn('w-5 h-5', currentMood.accent.iconColor)} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-0.5">Selected Mood</p>
                    <p className="text-base font-bold text-white flex items-center gap-2">
                      <span>{currentMood.emoji}</span>
                      <span>{currentMood.label}</span>
                    </p>
                  </div>
                </div>

                {/* Detected state */}
                <div className="mb-5">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-2">Detected State</p>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-base',
                      env.cardBorder, currentMood.accent.badge
                    )}
                  >
                    <Zap className={cn('w-4 h-4', currentMood.accent.iconColor)} />
                    <span>{result.emotionalState}</span>
                  </motion.div>
                </div>

                {/* Insight */}
                <div className="mb-5">
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-2">Personalized Insight</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-sm sm:text-base text-white/90 leading-relaxed"
                  >
                    {result.insight}
                  </motion.p>
                </div>

                {/* Suggested experience */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border', env.cardBorder, 'bg-white/[0.04]')}
                >
                  <span className="text-xl">
                    {EXPERIENCE_META[result.suggestedExperience]?.emoji || '✨'}
                  </span>
                  <div>
                    <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">Suggested Experience</p>
                    <p className="text-sm font-bold text-white capitalize">
                      {EXPERIENCE_META[result.suggestedExperience]?.label || result.suggestedExperience}
                    </p>
                  </div>
                </motion.div>

                {/* Source badge (dev/info only, subtle) */}
                {result.source === 'gemini' && (
                  <p className="mt-4 text-right text-[10px] text-white/25 tracking-wide">
                    ✦ Powered by Gemini AI
                  </p>
                )}
              </div>

              {/* If note was provided, show a summary */}
              {noteText?.trim() && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className={cn('w-full px-4 py-3 rounded-2xl border backdrop-blur-xl', env.cardBorder, env.cardBg)}
                >
                  <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Your Note</p>
                  <p className="text-sm text-white/80 italic leading-relaxed">
                    &ldquo;{noteText.trim().length > 160 ? noteText.trim().slice(0, 160) + '…' : noteText.trim()}&rdquo;
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:justify-center"
              >
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 bg-black/25 hover:bg-black/40 text-white/70 hover:text-white text-sm font-semibold transition-all cursor-pointer backdrop-blur-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  className={cn(
                    'group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r text-white font-bold text-sm shadow-xl transition-all cursor-pointer border border-white/25 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white/40',
                    env.buttonGradient
                  )}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </motion.div>

              {/* Saved Confirmation banner */}
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 px-5 py-3 rounded-xl bg-black/40 border border-white/15 text-sm text-white backdrop-blur-xl flex items-center gap-2.5 shadow-xl w-full sm:w-auto"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Analysis saved. Personalized space ready for next stage.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={cn('relative z-10 w-full border-t border-white/[0.1] py-5 text-center text-xs text-white/50 backdrop-blur-xl', env.headerBg)}>
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} MoodWave. All rights reserved.</p>
          <p className="text-white/40">Your mood. Your space.</p>
        </div>
      </footer>
    </div>
  );
}
