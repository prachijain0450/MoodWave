import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

const MAX_CHARS = 500;

/**
 * NoteInput
 * Premium auto-resizing textarea with character counter, clear button,
 * and mood-tinted glassmorphism styling.
 */
export default function NoteInput({ value, onChange, mood, placeholder }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  const env = mood?.environment || {};
  const charsLeft = MAX_CHARS - value.length;
  const isNearLimit = charsLeft <= 50;
  const isOverLimit = charsLeft < 0;

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'relative w-full rounded-2xl border backdrop-blur-2xl overflow-hidden transition-all duration-300',
          env.cardBorder || 'border-white/20',
          env.cardBg || 'bg-black/30',
          'focus-within:ring-2 focus-within:ring-white/30 focus-within:border-white/40',
          value.length > 0 ? 'ring-1 ring-white/20' : ''
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              onChange(e.target.value);
            }
          }}
          placeholder={placeholder || 'Tell MoodWave what\'s on your mind…'}
          rows={4}
          className="w-full bg-transparent resize-none text-white placeholder-white/40 text-sm sm:text-base leading-relaxed px-5 py-4 outline-none font-medium"
          style={{ minHeight: '120px', maxHeight: '240px' }}
          aria-label="Mood note text input"
        />

        {/* Clear Button */}
        {value.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Clear note"
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* Character Counter */}
      <div className="flex justify-end mt-2 pr-1">
        <span
          className={cn(
            'text-xs font-medium transition-colors',
            isOverLimit
              ? 'text-rose-400'
              : isNearLimit
              ? 'text-amber-400'
              : 'text-white/40'
          )}
        >
          {value.length} / {MAX_CHARS}
        </span>
      </div>
    </div>
  );
}
