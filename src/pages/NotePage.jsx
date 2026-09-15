import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, PenLine, Mic, Sparkles } from 'lucide-react';
import MoodEnvironment from '../components/MoodEnvironment';
import NoteInput from '../components/NoteInput';
import VoiceInput from '../components/VoiceInput';
import { MOODS } from '../utils/moods';
import { cn } from '../utils/cn';

const INPUT_MODES = [
  { id: 'text', label: 'Write', icon: PenLine },
  { id: 'voice', label: 'Speak', icon: Mic },
];

export default function NotePage({
  selectedMood,
  initialNoteText = '',
  initialInputMode = 'text',
  onBack,
  onContinue,
}) {
  const [noteText, setNoteText] = useState(initialNoteText);
  const [inputMode, setInputMode] = useState(initialInputMode);

  const currentMood = selectedMood || MOODS.find((m) => m.id === 'calm') || MOODS[0];
  const env = currentMood.environment;
  const Icon = currentMood.icon;

  // Speech-to-text appends recognized speech to existing note text
  const handleTranscript = (text) => {
    setNoteText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${text}` : text;
    });
  };

  const handleContinue = () => {
    const payload = {
      selectedMood: currentMood,
      noteText: noteText.trim(),
      inputMethod: inputMode,
    };
    if (onContinue) {
      onContinue(payload);
    }
  };

  const headingByMood = {
    happy: "What's making you smile?",
    calm: "What's bringing you peace right now?",
    sad: 'What would you like to let go of?',
    angry: "What's weighing on your mind?",
    tired: 'What would bring you comfort right now?',
    energetic: "What's driving your energy today?",
  };

  const heading =
    headingByMood[currentMood.id] || 'How are you feeling right now?';

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden text-white selection:bg-white/30">
      {/* Reuse Mood Environment as Background */}
      <MoodEnvironment mood={currentMood} />

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b border-white/[0.1] backdrop-blur-2xl transition-colors duration-500',
          env.headerBg
        )}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          {/* Mood Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/25 backdrop-blur-xl text-xs font-semibold text-white shadow-sm">
            <span className="select-none">{currentMood.emoji}</span>
            <span>{currentMood.label}</span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-white/50" />
            <span className="hidden sm:inline">Step 2 of 3: Your Note</span>
            <span className="sm:hidden">Step 2</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-6 py-10 sm:py-14 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key="note-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Mood Mini Emblem */}
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-xl backdrop-blur-xl animate-float-3',
                env.cardBorder,
                env.cardBg
              )}
            >
              <span className="text-2xl select-none">{currentMood.emoji}</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white text-center mb-2 drop-shadow-md">
              {heading}
            </h1>
            <p className="text-sm sm:text-base text-white/70 text-center mb-8 max-w-lg leading-relaxed">
              Express it in your own words.{' '}
              <span className="text-white/90 font-medium">You can type or speak.</span>
            </p>

            {/* Input Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full border border-white/15 bg-black/30 backdrop-blur-xl mb-6 shadow-inner">
              {INPUT_MODES.map(({ id, label, icon: ModeIcon }) => {
                const active = inputMode === id;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => setInputMode(id)}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/30',
                      active
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <ModeIcon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Main Input Card */}
            <div
              className={cn(
                'w-full rounded-3xl border backdrop-blur-2xl shadow-2xl p-6 sm:p-8 mb-6 transition-all duration-500 animate-float-1',
                env.cardBorder,
                env.cardBg
              )}
            >
              <AnimatePresence mode="wait">
                {inputMode === 'text' ? (
                  <motion.div
                    key="text-mode"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <PenLine className={cn('w-4 h-4', currentMood.accent.iconColor)} />
                      <span className="text-sm font-semibold text-white">Write your note</span>
                    </div>
                    <NoteInput
                      value={noteText}
                      onChange={setNoteText}
                      mood={currentMood}
                      placeholder="Tell MoodWave what's on your mind…"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="voice-mode"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="flex items-center gap-2 w-full mb-2">
                      <Mic className={cn('w-4 h-4', currentMood.accent.iconColor)} />
                      <span className="text-sm font-semibold text-white">Speak your note</span>
                    </div>

                    <VoiceInput onTranscript={handleTranscript} mood={currentMood} />

                    {/* Recognized note preview */}
                    {noteText && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full mt-2"
                      >
                        <p className="text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Recognized note:</p>
                        <div
                          className={cn(
                            'w-full px-4 py-3 rounded-xl text-sm text-white/90 border leading-relaxed',
                            env.cardBorder,
                            'bg-white/[0.04]'
                          )}
                        >
                          {noteText}
                        </div>
                        <button
                          type="button"
                          onClick={() => setNoteText('')}
                          className="mt-2 text-xs text-white/40 hover:text-white/70 underline cursor-pointer transition-colors"
                        >
                          Clear recognized text
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:justify-center">
              {/* Skip / Continue without note */}
              <button
                type="button"
                onClick={() => {
                  if (onContinue) {
                    onContinue({ selectedMood: currentMood, noteText: '', inputMethod: inputMode });
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 bg-black/25 hover:bg-black/40 text-white/70 hover:text-white text-sm font-semibold transition-all duration-200 cursor-pointer backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Skip for now
              </button>

              {/* Continue with note */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className={cn(
                  'group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r text-white font-bold text-sm shadow-xl transition-all duration-200 cursor-pointer border border-white/25 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white/40',
                  env.buttonGradient
                )}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className={cn(
          'relative z-10 w-full border-t border-white/[0.1] py-5 text-center text-xs text-white/50 backdrop-blur-xl',
          env.headerBg
        )}
      >
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} MoodWave. All rights reserved.</p>
          <p className="text-white/40">Your mood. Your space.</p>
        </div>
      </footer>
    </div>
  );
}
