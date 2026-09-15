import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Headphones,
  Zap,
  Info,
} from 'lucide-react';
import MoodEnvironment from '../components/MoodEnvironment';
import MusicPlayer from '../components/MusicPlayer';
import AudioVisualizer from '../components/AudioVisualizer';
import TrackList from '../components/TrackList';
import { getRecommendedTracks } from '../data/musicTracks';
import { MOODS } from '../utils/moods';
import { cn } from '../utils/cn';

export default function MusicExperiencePage({
  selectedMood,
  emotionalState,
  suggestedExperience,
  noteText,
  onBack,
}) {
  const currentMood = selectedMood || MOODS.find((m) => m.id === 'calm') || MOODS[0];
  const env = currentMood.environment || {};
  const accent = currentMood.accent || {};

  // State holding the HTMLAudioElement from MusicPlayer — triggers re-render when ready
  const [audioElement, setAudioElement] = useState(null);
  const handleAudioRef = useCallback((el) => { if (el) setAudioElement(el); }, []);

  // Get 3-5 curated recommended tracks based on Step 5 analysis
  const recommendedTracks = useMemo(() => {
    return getRecommendedTracks(suggestedExperience, currentMood.id);
  }, [suggestedExperience, currentMood.id]);

  // Track index and playback state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = recommendedTracks[currentTrackIndex] || recommendedTracks[0];

  // Navigation between tracks with auto-looping
  const handleNextTrack = () => {
    if (!recommendedTracks.length) return;
    setCurrentTrackIndex((prev) => (prev + 1) % recommendedTracks.length);
  };

  const handlePrevTrack = () => {
    if (!recommendedTracks.length) return;
    setCurrentTrackIndex((prev) =>
      prev === 0 ? recommendedTracks.length - 1 : prev - 1
    );
  };

  const handleSelectTrack = (track) => {
    const idx = recommendedTracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      if (idx === currentTrackIndex) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentTrackIndex(idx);
        setIsPlaying(true);
      }
    }
  };

  const handleTogglePlay = (nextState) => {
    setIsPlaying(typeof nextState === 'boolean' ? nextState : !isPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden text-white selection:bg-white/30">
      {/* Mood-Adaptive Background */}
      <MoodEnvironment mood={currentMood} />

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b border-white/[0.1] backdrop-blur-2xl transition-colors duration-500',
          env.headerBg
        )}
      >
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors cursor-pointer group px-3 py-1.5 rounded-xl hover:bg-white/[0.1]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Analysis</span>
          </button>

          {/* Mood Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-black/25 backdrop-blur-xl text-xs font-semibold text-white shadow-sm">
            <span>{currentMood.emoji}</span>
            <span>{currentMood.label}</span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium">
            <Headphones className="w-3.5 h-3.5 text-white/40" />
            <span className="hidden sm:inline">Personalized Soundscape</span>
            <span className="sm:hidden">Music</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-8 sm:py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full space-y-8"
        >
          {/* Top Context Section: Selected Mood + Detected State + Suggested Experience */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-2 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/[0.06] text-xs font-semibold text-white/80 backdrop-blur-md mb-2">
                <Sparkles className="w-3 h-3 text-white/60" />
                <span>Tailored for your wavelength</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                Here's something to match your mood.
              </h1>
              <p className="text-sm text-white/60 mt-1">
                A soothing ambient soundscape personalized to your current emotional frequency.
              </p>
            </div>

            {/* Context Pill Summary */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
              {emotionalState && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-black/25 backdrop-blur-md text-xs font-medium text-white/80">
                  <Zap className={cn('w-3.5 h-3.5', accent.iconColor || 'text-white')} />
                  <span>{emotionalState}</span>
                </div>
              )}
              {suggestedExperience && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-black/25 backdrop-blur-md text-xs font-semibold text-white capitalize">
                  <span>Experience: {suggestedExperience}</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Music Player Component */}
          <MusicPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            mood={currentMood}
            emotionalState={emotionalState}
            suggestedExperience={suggestedExperience}
            onAudioRef={handleAudioRef}
          />

          {/* Real-Time Audio Visualizer */}
          <div
            className={cn(
              'w-full rounded-2xl border backdrop-blur-xl px-4 py-5 transition-all duration-500',
              env.cardBorder || 'border-white/20',
              env.cardBg    || 'bg-black/30'
            )}
          >
            <AudioVisualizer
              audioElement={audioElement}
              isPlaying={isPlaying}
              mood={currentMood}
            />
          </div>

          {/* Recommended Tracks List Component */}
          <div
            className={cn(
              'w-full rounded-3xl border backdrop-blur-2xl p-6 sm:p-7 shadow-2xl transition-all duration-500',
              env.cardBorder || 'border-white/20',
              env.cardBg || 'bg-black/30'
            )}
          >
            <TrackList
              tracks={recommendedTracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onSelectTrack={handleSelectTrack}
              mood={currentMood}
            />
          </div>

          {/* Local Audio Asset Notice Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-black/20 text-xs text-white/60 leading-relaxed backdrop-blur-md">
            <Info className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white/80">Local Audio Asset System: </span>
              MoodWave uses local royalty-free ambient tracks. If live audio files have not been placed in{' '}
              <code className="bg-white/10 px-1 py-0.5 rounded text-white/90">public/audio/</code>, the audio player provides smooth state handling and prompts gracefully without interrupting the experience.
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className={cn(
          'relative z-10 w-full border-t border-white/[0.1] py-5 text-center text-xs text-white/50 backdrop-blur-xl',
          env.headerBg
        )}
      >
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} MoodWave. All rights reserved.</p>
          <p className="text-white/40">Your mood. Your space.</p>
        </div>
      </footer>
    </div>
  );
}
