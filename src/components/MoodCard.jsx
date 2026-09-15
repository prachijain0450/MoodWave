import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * Reusable MoodCard component
 */
export default function MoodCard({ mood, isSelected, onSelect }) {
  const Icon = mood.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(mood)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group relative w-full text-left p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300',
        'backdrop-blur-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60',
        isSelected
          ? cn('bg-white/[0.08] shadow-2xl ring-1 ring-white/30', mood.accent.border, mood.accent.glow)
          : 'bg-white/[0.025] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.20]'
      )}
      aria-pressed={isSelected}
    >
      {/* Selection Glow Layer */}
      {isSelected && (
        <motion.div
          layoutId="selectedGlow"
          className={cn(
            'absolute inset-0 rounded-2xl pointer-events-none -z-10',
            mood.accent.bgSelected
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Mood Icon & Emoji */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105',
              isSelected ? mood.accent.badge : 'bg-white/[0.05] border border-white/[0.08]'
            )}
          >
            <Icon className={cn('w-6 h-6', isSelected ? mood.accent.iconColor : 'text-slate-300')} />
          </div>
          <span className="text-2xl select-none" role="img" aria-label={mood.label}>
            {mood.emoji}
          </span>
        </div>

        {/* Selected Checkmark Badge */}
        <div
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300',
            isSelected
              ? 'bg-white text-slate-900 scale-100 opacity-100 shadow-md'
              : 'border border-white/20 opacity-0 scale-75 group-hover:opacity-40'
          )}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </div>

      {/* Mood Name */}
      <h3
        className={cn(
          'text-lg sm:text-xl font-bold tracking-tight mb-1 transition-colors',
          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
        )}
      >
        {mood.label}
      </h3>

      {/* Short Description */}
      <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
        {mood.description}
      </p>
    </motion.button>
  );
}
