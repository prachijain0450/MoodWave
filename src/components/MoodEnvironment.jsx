import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MoodEnvironment
 * Immersive, full-page dynamic visual atmosphere generator.
 * Smoothly morphs the entire viewport color and particle flow based on the selected mood.
 */
export default function MoodEnvironment({ mood }) {
  if (!mood) return null;

  const env = mood.environment;
  const pace = mood.breathingPace || 4;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Full-Page Viewport Background (Image or Gradient) with Smooth Crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-layer-${mood.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {mood.bgImage ? (
            <div className="relative w-full h-full">
              {/* Full-screen cover background image */}
              <img
                src={mood.bgImage}
                alt=""
                className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
              />
              {/* Subtle dark tint & mood-colored ambient overlay to maintain text readability & glassmorphism */}
              <div className={`absolute inset-0 bg-gradient-to-br ${env.bgBase} opacity-65 mix-blend-multiply`} />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px]" />
            </div>
          ) : (
            /* Fallback to existing mood background (used by Energetic) */
            <div className={`w-full h-full bg-gradient-to-br ${env.bgBase}`} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Primary Atmospheric Radiant Mesh (Top/Center) */}
      <motion.div
        key={`primary-${mood.id}`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.75, 0.95, 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: pace,
          ease: 'easeInOut',
        }}
        className={`absolute -top-[15%] left-[5%] w-[85vw] h-[85vw] min-w-[500px] min-h-[500px] rounded-full bg-gradient-to-br ${env.primaryGlow} blur-[120px]`}
      />

      {/* Secondary Ambient Sweeper Mesh (Bottom/Right) */}
      <motion.div
        key={`secondary-${mood.id}`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{
          scale: [1.12, 0.95, 1.12],
          opacity: [0.65, 0.9, 0.65],
        }}
        transition={{
          repeat: Infinity,
          duration: pace * 1.25,
          ease: 'easeInOut',
        }}
        className={`absolute top-[30%] -right-[15%] w-[80vw] h-[80vw] min-w-[460px] min-h-[460px] rounded-full bg-gradient-to-bl ${env.secondaryGlow} blur-[130px]`}
      />

      {/* Central Radiance Accent */}
      <motion.div
        key={`center-${mood.id}`}
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: pace * 0.9,
          ease: 'easeInOut',
        }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] min-w-[380px] min-h-[380px] rounded-full bg-gradient-to-r ${env.primaryGlow} blur-[140px]`}
      />

      {/* Mood-Specific Ambient Visual Effects */}
      <AnimatePresence mode="wait">
        {mood.particleType === 'bubbles' && <HappyBubbles key="happy-bubbles" />}
        {mood.particleType === 'waves' && <CalmWaves key="calm-waves" pace={pace} />}
        {mood.particleType === 'mist' && <SadMist key="sad-mist" />}
        {mood.particleType === 'embers' && <AngryEmbers key="angry-embers" />}
        {mood.particleType === 'stars' && <TiredStars key="tired-stars" />}
        {mood.particleType === 'kinetic' && <EnergeticKinetic key="energetic-kinetic" />}
      </AnimatePresence>

      {/* Gentle Edge Vignette (Keeps full viewport colorful while anchoring edges) */}
      <div className="absolute inset-0 bg-radial-[ellipse_90%_75%_at_50%_50%] from-transparent via-transparent to-black/35" />

      {/* Subtle Tactile Organic Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}

/* 😊 HAPPY: Warm golden floating bubbles drifting upwards */
function HappyBubbles() {
  const bubbles = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {bubbles.map((_, i) => {
        const left = 5 + (i * 5.5);
        const size = 16 + (i % 4) * 14;
        const duration = 5.5 + (i % 5) * 1.8;
        const delay = (i % 6) * 0.9;

        return (
          <motion.div
            key={i}
            initial={{ y: '105vh', opacity: 0, x: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.85, 0.95, 0],
              x: [(i % 2 === 0 ? 20 : -20), (i % 2 === 0 ? -25 : 25)],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
            className="absolute rounded-full bg-gradient-to-tr from-amber-300/50 via-yellow-200/40 to-orange-400/30 blur-[1px] shadow-[0_0_18px_rgba(251,191,36,0.6)]"
          />
        );
      })}
    </div>
  );
}

/* 😌 CALM: Soft concentric breathing aquatic ripples */
function CalmWaves({ pace }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{
            scale: [0.75, 1.55, 2.0],
            opacity: [0.55, 0.35, 0],
          }}
          transition={{
            duration: pace * 1.8,
            repeat: Infinity,
            delay: (index - 1) * (pace * 0.45),
            ease: 'easeOut',
          }}
          className="absolute w-[45vw] h-[45vw] min-w-[360px] min-h-[360px] rounded-full border-2 border-emerald-300/30 bg-emerald-400/[0.025] blur-[1px] shadow-[0_0_30px_rgba(52,211,153,0.2)]"
        />
      ))}
    </div>
  );
}

/* 😔 SAD: Gentle descending twilight periwinkle mist */
function SadMist() {
  const drops = Array.from({ length: 24 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {drops.map((_, i) => {
        const left = 4 + (i * 4);
        const duration = 4.5 + (i % 4) * 1.2;
        const delay = (i % 6) * 0.6;
        const height = 30 + (i % 3) * 20;

        return (
          <motion.div
            key={i}
            initial={{ y: '-10vh', opacity: 0 }}
            animate={{
              y: '105vh',
              opacity: [0, 0.65, 0.85, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'linear',
            }}
            style={{
              left: `${left}%`,
              height: `${height}px`,
            }}
            className="absolute w-[2px] rounded-full bg-gradient-to-b from-transparent via-sky-300/50 to-indigo-300/30 shadow-[0_0_8px_rgba(56,189,248,0.4)]"
          />
        );
      })}
    </div>
  );
}

/* 😡 ANGRY: Expanding energetic shockwave rings and warm fiery ember pulses */
function AngryEmbers() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {[1, 2, 3, 4].map((ring) => (
        <motion.div
          key={ring}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.65, 1.35, 1.85],
            opacity: [0.75, 0.4, 0],
            rotate: [0, ring % 2 === 0 ? 60 : -60],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: (ring - 1) * 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute w-[50vw] h-[50vw] min-w-[380px] min-h-[380px] rounded-[38%] border-2 border-rose-400/40 bg-rose-500/[0.04] blur-[1px] shadow-[0_0_40px_rgba(244,63,94,0.35)]"
        />
      ))}
    </div>
  );
}

/* 😴 TIRED: Soft drifting starlight and deep dusk celestial motes */
function TiredStars() {
  const stars = Array.from({ length: 28 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((_, i) => {
        const top = 8 + (i * 3.5) + ((i % 5) * 5);
        const left = 4 + (i * 3.4);
        const duration = 5.5 + (i % 4) * 1.8;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0.15, scale: 0.6 }}
            animate={{
              opacity: [0.15, 0.85, 0.15],
              scale: [0.6, 1.3, 0.6],
              y: [0, (i % 2 === 0 ? 10 : -10), 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: (i % 7) * 0.8,
              ease: 'easeInOut',
            }}
            style={{
              top: `${top % 90}%`,
              left: `${left % 94}%`,
            }}
            className="absolute w-2 h-2 rounded-full bg-purple-200/70 shadow-[0_0_12px_rgba(216,180,254,0.8)]"
          />
        );
      })}
    </div>
  );
}

/* ⚡ ENERGETIC: Dynamic kinetic pulses and vibrant orbital electric waves */
function EnergeticKinetic() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {[1, 2, 3, 4].map((pulse) => (
        <motion.div
          key={pulse}
          initial={{ scale: 0.45, opacity: 0 }}
          animate={{
            scale: [0.55, 1.35, 2.05],
            opacity: [0.85, 0.45, 0],
          }}
          transition={{
            duration: 2.0,
            repeat: Infinity,
            delay: (pulse - 1) * 0.5,
            ease: 'easeOut',
          }}
          className="absolute w-[42vw] h-[42vw] min-w-[340px] min-h-[340px] rounded-full border-2 border-cyan-300/60 shadow-[0_0_35px_rgba(34,211,238,0.45)]"
        />
      ))}
    </div>
  );
}
