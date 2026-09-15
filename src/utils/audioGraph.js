/**
 * audioGraph.js
 *
 * Centralized Web Audio API graph management for MoodWave.
 * Enforces:
 *  - Exact W3C graph: HTMLAudioElement -> MediaElementSource -> AnalyserNode -> AudioContext.destination
 *  - Exactly ONE MediaElementSourceNode per HTMLAudioElement (using module-level WeakMap)
 *  - Synchronous AudioContext creation/resumption inside user gestures
 *  - Safe fallback if Web Audio API is unavailable
 */

const audioGraphMap = new WeakMap();

/**
 * getOrCreateAudioGraph
 * Returns existing graph or creates a new graph connected to destination.
 * Must be called during user gestures (click/play) to guarantee AudioContext runs.
 *
 * @param {HTMLAudioElement} audioEl
 * @returns {{ ctx: AudioContext, source: MediaElementAudioSourceNode, analyser: AnalyserNode } | null}
 */
export function getOrCreateAudioGraph(audioEl) {
  if (!audioEl) return null;
  if (audioGraphMap.has(audioEl)) {
    return audioGraphMap.get(audioEl);
  }

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    window.__moodwaveAudioCtx = ctx;

    const source = ctx.createMediaElementSource(audioEl);
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 192; // 48 frequency bars * 4
    analyser.smoothingTimeConstant = 0.80;

    // Strict Web Audio routing:
    // HTMLAudioElement -> MediaElementSource -> AnalyserNode -> AudioContext.destination
    source.connect(analyser);
    analyser.connect(ctx.destination);

    const graph = { ctx, source, analyser };
    audioGraphMap.set(audioEl, graph);
    return graph;
  } catch (err) {
    console.warn('[MoodWave] Web Audio initialization error:', err);
    return null;
  }
}

/**
 * getAudioGraph
 * Retrieves graph for the audio element without creating a new one.
 */
export function getAudioGraph(audioEl) {
  if (!audioEl) return null;
  return audioGraphMap.get(audioEl) || null;
}
