import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, AlertCircle, WifiOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { cn } from '../utils/cn';

/**
 * VoiceInput
 * Microphone recording component using the Web Speech API.
 * Shows live recording state, interim transcript, errors, and unsupported fallback.
 */
export default function VoiceInput({ onTranscript, mood }) {
  const env = mood?.environment || {};

  const { isListening, isSupported, interimText, error, startListening, stopListening } =
    useSpeechRecognition({
      onResult: (text) => {
        if (onTranscript) onTranscript(text);
      },
    });

  if (!isSupported) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white/70">
        <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>Voice input is not supported in this browser. Please use text input.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Mic Button with Animated Recording Indicator */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ripple Rings when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              {[1, 2].map((ring) => (
                <motion.div
                  key={ring}
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ scale: 1.8 + ring * 0.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: ring * 0.35,
                    ease: 'easeOut',
                  }}
                  className="absolute w-20 h-20 rounded-full border-2 border-rose-400/50"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Microphone Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={isListening ? stopListening : startListening}
          className={cn(
            'relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border-2 shadow-2xl focus:outline-none focus:ring-4',
            isListening
              ? 'bg-rose-500/80 border-rose-300/60 shadow-rose-500/40 focus:ring-rose-400/40'
              : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 shadow-black/30 focus:ring-white/30'
          )}
          aria-label={isListening ? 'Stop recording' : 'Start voice input'}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="stop"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-1"
              >
                <Square className="w-6 h-6 text-white fill-white" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Mic className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status Text */}
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.div
            key="listening"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 text-sm font-semibold text-white"
          >
            {/* Animated recording dot */}
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"
            />
            <span>🎙️ Listening…</span>
          </motion.div>
        ) : (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-white/50 text-center"
          >
            Tap the microphone and speak naturally.
            <br />
            Your words will appear in the note area.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Interim Text Preview */}
      <AnimatePresence>
        {interimText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'w-full px-4 py-3 rounded-xl text-sm italic text-white/70 border',
              env.cardBorder || 'border-white/15',
              env.cardBg || 'bg-black/20'
            )}
          >
            {interimText}…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/25 text-sm text-rose-200 w-full"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
