import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  AlertCircle,
  Music,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { getOrCreateAudioGraph, getAudioGraph } from '../utils/audioGraph';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function MusicPlayer({
  currentTrack,
  isPlaying: controlledIsPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  mood,
  emotionalState: _emotionalState,
  suggestedExperience,
  onAudioRef,
}) {
  const audioRef = useRef(null);

  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying =
    controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;

  const setPlayingState = useCallback(
    (nextState) => {
      if (onTogglePlay) {
        onTogglePlay(nextState);
      } else {
        setInternalIsPlaying(nextState);
      }
    },
    [onTogglePlay]
  );

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack?.duration || 0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const env = mood?.environment || {};
  const accent = mood?.accent || {};

  // Handle track changes: reset time and continue playback if active
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    setCurrentTime(0);
    setAudioError(null);

    if (isPlaying) {
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setAudioError(null))
          .catch((err) => {
            if (err.name !== 'AbortError') {
              setAudioError("This track isn't available right now. Try another track.");
              setPlayingState(false);
            }
          });
      }
    }
  }, [currentTrack]);

  // Handle Play/Pause sync
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;

    if (isPlaying) {
      // Resume AudioContext if it was previously created (safety net — primary resume is in handleToggle)
      const existingGraph = getAudioGraph(audio);
      if (existingGraph?.ctx && existingGraph.ctx.state === 'suspended') {
        existingGraph.ctx.resume().catch(() => {});
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setAudioError(null))
          .catch((err) => {
            if (err.name !== 'AbortError') {
              setAudioError("This track isn't available right now. Try another track.");
              setPlayingState(false);
            }
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Initial volume setup + expose audio element to parent for visualizer
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (onAudioRef) onAudioRef(audioRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = () => {
    // CRITICAL: AudioContext MUST be created AND resumed synchronously inside user gesture.
    // Chrome blocks audio until a user gesture allows context creation/resumption.
    if (audioRef.current) {
      const graph = getOrCreateAudioGraph(audioRef.current);
      if (graph?.ctx) {
        // resume() is synchronous enough — Chrome allows this inside click handler
        graph.ctx.resume().catch(() => {});
      }
    }
    setPlayingState(!isPlaying);
  };

  // Time update listener
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  // Track ended -> auto loop to next with continuous playback
  const handleEnded = () => {
    if (onNextTrack) {
      onNextTrack();
      setPlayingState(true);
    } else {
      setPlayingState(false);
    }
  };

  // Audio loading error
  const handleError = () => {
    setPlayingState(false);
    setAudioError("This track isn't available right now. Try another track.");
  };

  // Seek handler
  const handleSeek = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Keep audio element volume and mute state in sync with React state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted || volume === 0;
    }
  }, [volume, isMuted]);

  // Mute toggle – also updates audio element muted flag
  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  // Volume slider change handler
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
    }
    if (newVol > 0 && isMuted) setIsMuted(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        'w-full rounded-3xl border backdrop-blur-2xl p-6 sm:p-8 shadow-2xl transition-all duration-500',
        env.cardBorder || 'border-white/20',
        env.cardBg || 'bg-black/30'
      )}
    >
      {/* Hidden native HTML5 Audio element */}
      {/* NOTE: crossOrigin is intentionally omitted — Vite does not add CORS headers for
           static assets served from public/, so crossOrigin="anonymous" would silently
           block audio loading. Same-origin audio works fine without it. The Web Audio API
           MediaElementSourceNode is created only after the user's first Play gesture,
           which satisfies Chrome's autoplay policy without requiring crossOrigin. */}
      <audio
        ref={audioRef}
        src={currentTrack?.src || ''}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        onDurationChange={(e) => {
          if (e.target.duration && !isNaN(e.target.duration)) {
            setDuration(e.target.duration);
          }
        }}
        onLoadedMetadata={(e) => {
          if (e.target.duration && !isNaN(e.target.duration)) {
            setDuration(e.target.duration);
          }
        }}
      />

      {/* Top: Current Track Header & Mini Equalizer */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Animated Vinyl / Artwork disk */}
          <div className="relative shrink-0">
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className={cn(
                'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border shadow-xl backdrop-blur-xl',
                env.cardBorder,
                accent.bgSelected || 'bg-white/10'
              )}
            >
              <Music className={cn('w-6 h-6 sm:w-7 sm:h-7', accent.iconColor || 'text-white')} />
            </motion.div>

            {/* Glowing active pip */}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
            )}
          </div>

          {/* Title & Artist */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Now Playing
              </span>
              {suggestedExperience && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 bg-white/[0.06] text-white/70 capitalize">
                  {suggestedExperience}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white truncate drop-shadow-sm mt-0.5">
              {currentTrack?.title || 'Select a Track'}
            </h2>
            <p className="text-xs sm:text-sm text-white/60 truncate">
              {currentTrack?.artist || 'MoodWave Sanctuary'}
            </p>
          </div>
        </div>

        {/* Small Animated Playback Indicator (Equalizer) */}
        {isPlaying && (
          <div className="hidden sm:flex items-end gap-1 h-6 px-3 py-1.5 rounded-xl bg-black/25 border border-white/10 shrink-0">
            {[0.8, 1.2, 0.6, 1.0].map((speed, i) => (
              <motion.span
                key={i}
                animate={{ height: ['4px', '18px', '8px', '20px', '4px'] }}
                transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                className="w-1 bg-white/90 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Track Description / Atmosphere Hint */}
      {currentTrack?.description && (
        <p className="text-xs text-white/50 mb-5 italic line-clamp-2">
          &ldquo;{currentTrack.description}&rdquo;
        </p>
      )}

      {/* Error Message if Audio is missing/unavailable */}
      <AnimatePresence>
        {audioError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-rose-500/15 border border-rose-400/30 text-xs sm:text-sm text-rose-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{audioError}</p>
              <p className="text-[11px] text-rose-200/70 mt-0.5">
                Place local royalty-free MP3 files in <code className="bg-black/30 px-1 py-0.5 rounded text-rose-100">public/audio/</code> to hear live playback.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress & Seek Bar */}
      <div className="space-y-1.5 mb-8">
        <div className="relative w-full flex items-center group">
          {/* Custom Track Background */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className={cn(
                'h-full transition-all duration-100 rounded-full bg-gradient-to-r',
                env.buttonGradient || 'from-white to-white/70'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Native Range for Accessibility & Touch */}
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek track"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Timestamps */}
        <div className="flex justify-between text-xs text-white/50 font-mono px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Bar: Prev, Play/Pause, Next & Volume */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-4">
          {/* Previous Track */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={onPrevTrack}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
            aria-label="Previous track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </motion.button>

          {/* Main Play/Pause Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleToggle}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 cursor-pointer border border-white/30 bg-gradient-to-r',
              env.buttonGradient || 'from-white/20 to-white/40',
              accent.glow || 'shadow-white/20'
            )}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </motion.button>

          {/* Next Track */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={onNextTrack}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </motion.button>
        </div>

        {/* Volume & Mute Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Volume Slider */}
          <div className="relative flex items-center w-28 sm:w-24 group">
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
              <div
                className="h-full bg-white/70 rounded-full"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[11px] font-mono text-white/40 w-7 text-right">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
