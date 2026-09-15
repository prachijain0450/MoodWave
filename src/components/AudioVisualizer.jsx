/**
 * AudioVisualizer.jsx
 *
 * Real-time Web Audio API frequency-bar visualizer.
 *
 * Safety rules enforced here:
 *  - Only ONE MediaElementSourceNode is ever created per HTMLAudioElement.
 *    A module-level WeakMap (`sourceNodeMap`) is the single source of truth.
 *  - Only ONE AudioContext is created per audio element (stored in `ctxMap`).
 *  - requestAnimationFrame handles are always cancelled on pause/unmount.
 *  - Canvas is DPR-aware for sharp rendering on high-density screens.
 *  - If Web Audio API is unavailable the component renders a graceful CSS fallback.
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { getAudioGraph } from '../utils/audioGraph';

// ─── Mood → visual config ────────────────────────────────────────────────────
const MOOD_VIZ_CONFIG = {
  happy:     { speed: 1.0,  smoothing: 0.80, barGap: 0.25 },
  calm:      { speed: 0.55, smoothing: 0.88, barGap: 0.28 },
  sad:       { speed: 0.6,  smoothing: 0.87, barGap: 0.28 },
  angry:     { speed: 1.2,  smoothing: 0.72, barGap: 0.22 },
  tired:     { speed: 0.45, smoothing: 0.90, barGap: 0.30 },
  energetic: { speed: 1.4,  smoothing: 0.70, barGap: 0.20 },
};

const DEFAULT_VIZ_CONFIG = { speed: 0.8, smoothing: 0.80, barGap: 0.25 };

const BAR_COUNT = 48;

// ─── Fallback CSS bars for no-audio / no-WebAudio situations ─────────────────
function IdleFallback({ mood }) {
  const pulseColor = mood?.environment?.pulseColor || '#a78bfa';
  const bars = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className="w-full flex items-end justify-center gap-[3px]"
      style={{ height: 64 }}
    >
      {bars.map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 6,
            background: pulseColor,
            opacity: 0.25 + (Math.sin(i * 0.4) * 0.1),
            height: 4 + Math.abs(Math.sin(i * 0.5)) * 20,
            transition: 'height 0.8s ease',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AudioVisualizer({ audioElement, isPlaying, mood }) {
  const canvasRef   = useRef(null);
  const rafRef      = useRef(null);
  const barsRef     = useRef(new Float32Array(BAR_COUNT).fill(0)); // smoothed heights
  const hasWebAudio = typeof window !== 'undefined' &&
    !!(window.AudioContext || window.webkitAudioContext);

  const moodId    = mood?.id || 'calm';
  const vizConfig = MOOD_VIZ_CONFIG[moodId] || DEFAULT_VIZ_CONFIG;

  // Derived colors from the mood's pulseColor
  const pulseColor = mood?.environment?.pulseColor || '#a78bfa';

  // ── Draw loop ────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.offsetWidth;
    const H   = canvas.offsetHeight;

    // Resize canvas buffer to match CSS size × DPR
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cW = canvas.width;
    const cH = canvas.height;

    // Get frequency data from Web Audio
    let dataArray = null;
    const graph = getAudioGraph(audioElement);
    if (graph?.analyser) {
      graph.analyser.smoothingTimeConstant = vizConfig.smoothing;
      dataArray = new Uint8Array(graph.analyser.frequencyBinCount);
      graph.analyser.getByteFrequencyData(dataArray);
    }

    const gap        = Math.round(cW * vizConfig.barGap * 0.015);
    const barWidth   = Math.max(2, (cW - gap * (BAR_COUNT + 1)) / BAR_COUNT);
    const maxBarH    = cH * 0.88;
    const minBarH    = Math.ceil(cH * 0.03);
    const cornerR    = Math.min(barWidth / 2, 5) * dpr;

    // Parse pulseColor into RGBA components for gradient building
    // (pulseColor is a hex like #f59e0b)
    const hex = pulseColor.replace('#', '');
    const r   = parseInt(hex.substring(0, 2), 16);
    const g   = parseInt(hex.substring(2, 4), 16);
    const b   = parseInt(hex.substring(4, 6), 16);

    for (let i = 0; i < BAR_COUNT; i++) {
      // Raw normalised amplitude [0..1]
      let raw = 0;
      if (dataArray) {
        // Pick a frequency bin — map bars logarithmically for more bass response
        const binIndex = Math.floor(
          Math.pow(i / BAR_COUNT, 1.4) * dataArray.length * 0.85
        );
        raw = (dataArray[Math.min(binIndex, dataArray.length - 1)] || 0) / 255;
      }

      // Smooth with per-bar decay
      const prev     = barsRef.current[i];
      const target   = raw * vizConfig.speed;
      const smoothed = isPlaying
        ? Math.max(target, prev * 0.82)     // fast rise, moderate decay
        : prev * 0.88;                       // when paused: settle slowly

      barsRef.current[i] = smoothed;

      const barH = Math.max(minBarH, smoothed * maxBarH);
      const x    = gap + i * (barWidth + gap);
      const y    = cH - barH;

      // Gradient: bottom (opaque pulse color) → top (lighter / more transparent)
      const grad = ctx.createLinearGradient(0, y, 0, cH);
      grad.addColorStop(0,   `rgba(${r},${g},${b},0.90)`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},0.55)`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0.20)`);

      ctx.fillStyle = grad;

      // Rounded top bar
      ctx.beginPath();
      const bx = x;
      const by = y;
      const bw = barWidth;
      const bh = barH;
      const cr = Math.min(cornerR, bw / 2, bh / 2);

      ctx.moveTo(bx + cr, by);
      ctx.lineTo(bx + bw - cr, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + cr);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx, by + cr);
      ctx.quadraticCurveTo(bx, by, bx + cr, by);
      ctx.closePath();
      ctx.fill();

      // Subtle glow on taller bars
      if (smoothed > 0.45) {
        ctx.shadowColor = `rgba(${r},${g},${b},0.55)`;
        ctx.shadowBlur  = 8 * dpr;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }
    }

    // Baseline line
    ctx.strokeStyle = `rgba(${r},${g},${b},0.18)`;
    ctx.lineWidth   = dpr;
    ctx.beginPath();
    ctx.moveTo(0, cH - 0.5);
    ctx.lineTo(cW, cH - 0.5);
    ctx.stroke();
  }, [audioElement, isPlaying, vizConfig, pulseColor]);

  // ── Animation loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasWebAudio) return;

    const loop = () => {
      draw();
      if (isPlaying || barsRef.current.some((v) => v > 0.005)) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        // All bars have settled — one final clear
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx2d = canvas.getContext('2d');
          if (ctx2d) ctx2d.clearRect(0, 0, canvas.width, canvas.height);
          // Draw idle baseline
          draw();
        }
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw, isPlaying, hasWebAudio]);

  // Ensure AudioContext is resumed when playing starts.
  // IMPORTANT: We only READ the existing graph here (getAudioGraph), never create one.
  // The graph is created exclusively in MusicPlayer's Play button click handler,
  // which is the only user-gesture context where Chrome allows AudioContext creation.
  useEffect(() => {
    if (!audioElement || !hasWebAudio) return;

    if (isPlaying) {
      const graph = getAudioGraph(audioElement);
      if (graph?.ctx && graph.ctx.state === 'suspended') {
        graph.ctx.resume().catch(() => {});
      }
    }
  }, [isPlaying, audioElement, hasWebAudio]);

  // ── Fallback: no Web Audio support ───────────────────────────────────────────
  if (!hasWebAudio) {
    return (
      <div
        aria-label="Audio visualizer (not supported in this browser)"
        className="w-full flex items-end justify-center py-2"
        style={{ height: 72 }}
      >
        <IdleFallback mood={mood} />
      </div>
    );
  }

  const pulseHex = pulseColor.replace('#', '');
  const pr       = parseInt(pulseHex.substring(0, 2), 16);
  const pg       = parseInt(pulseHex.substring(2, 4), 16);
  const pb       = parseInt(pulseHex.substring(4, 6), 16);

  return (
    <div
      aria-label="Real-time audio frequency visualizer"
      role="img"
      className="w-full relative"
      style={{ height: 80 }}
    >
      {/* Subtle ambient glow behind the canvas */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '60%',
          background: `radial-gradient(ellipse 70% 100% at 50% 100%, rgba(${pr},${pg},${pb},0.12) 0%, transparent 80%)`,
        }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10"
        style={{ display: 'block' }}
        aria-hidden="true"
      />
    </div>
  );
}
