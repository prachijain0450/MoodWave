import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music, Disc } from 'lucide-react';
import { cn } from '../utils/cn';

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  mood,
}) {
  const env = mood?.environment || {};
  const accent = mood?.accent || {};

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-white/50" />
          <span>Recommended Tracks</span>
        </h3>
        <span className="text-[11px] text-white/40 font-medium">
          {tracks.length} tracks curated
        </span>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => {
          const isActive = currentTrack?.id === track.id;

          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectTrack(track)}
              className={cn(
                'group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer',
                isActive
                  ? cn(
                      'border-white/30 bg-white/[0.12] shadow-lg',
                      accent.glow || 'shadow-white/10'
                    )
                  : cn(
                      'border-white/10 bg-black/20 hover:bg-white/[0.06] hover:border-white/20'
                    )
              )}
            >
              {/* Left: Play/Pause Icon + Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Play button circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 border',
                    isActive
                      ? cn(accent.badge || 'bg-white/20 text-white', 'border-white/30')
                      : 'bg-white/[0.05] border-white/10 text-white/70 group-hover:text-white'
                  )}
                >
                  {isActive && isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </div>

                {/* Track Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-sm font-semibold truncate transition-colors',
                        isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                      )}
                    >
                      {track.title}
                    </p>
                    {isActive && (
                      <span className="shrink-0 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium border border-white/20">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Right: Category badge + Animated Equalizer or Duration */}
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="hidden sm:inline text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-white/60 capitalize">
                  {track.category}
                </span>

                {/* Equalizer indicator if active and playing */}
                {isActive && isPlaying ? (
                  <div className="flex items-end gap-0.5 h-4 w-5 justify-center">
                    <motion.span
                      animate={{ height: ['4px', '16px', '6px', '14px', '4px'] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-1 bg-white rounded-full"
                    />
                    <motion.span
                      animate={{ height: ['12px', '4px', '16px', '8px', '12px'] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.15, ease: 'easeInOut' }}
                      className="w-1 bg-white/80 rounded-full"
                    />
                    <motion.span
                      animate={{ height: ['8px', '14px', '4px', '16px', '8px'] }}
                      transition={{ duration: 1.0, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}
                      className="w-1 bg-white/90 rounded-full"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-white/40 font-mono">
                    {formatDuration(track.duration)}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
