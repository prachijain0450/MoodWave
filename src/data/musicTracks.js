/**
 * musicTracks.js
 *
 * Curated local royalty-free instrumental music tracks catalog for MoodWave.
 * Categorized by experience states: calming, uplifting, relaxing, energizing, soothing, cooling.
 *
 * Audio assets are referenced from the local `/audio/` directory.
 * If audio assets have not yet been placed in `public/audio/`,
 * the player will display a graceful notification:
 * "This track isn't available right now. Try another track."
 */

export const MUSIC_TRACKS = [
  // ── CALMING ────────────────────────────────────────────────────────────────
  {
    id: 'calm-01',
    title: 'Ocean Breathing',
    artist: 'MoodWave Sanctuary',
    category: 'calming',
    mood: 'calm',
    duration: 215, // 3:35
    src: '/audio/calm-01.mp3',
    description: 'Gentle oceanic swell with binaural alpha waves for deep stillness.',
  },
  {
    id: 'calm-02',
    title: 'Still Water Ripples',
    artist: 'Aura Soundscapes',
    category: 'calming',
    mood: 'calm',
    duration: 184, // 3:04
    src: '/audio/calm-02.mp3',
    description: 'Minimalist warm acoustic chimes floating on quiet pond textures.',
  },
  {
    id: 'calm-03',
    title: 'Emerald Canopy',
    artist: 'Solace Sound Lab',
    category: 'calming',
    mood: 'calm',
    duration: 240, // 4:00
    src: '/audio/calm-03.mp3',
    description: 'Soft wind murmurs through bamboo leaves and velvet acoustic drones.',
  },

  // ── UPLIFTING ──────────────────────────────────────────────────────────────
  {
    id: 'uplift-01',
    title: 'Golden Horizon',
    artist: 'Sunlight Ensemble',
    category: 'uplifting',
    mood: 'happy',
    duration: 198, // 3:18
    src: '/audio/uplifting-01.mp3',
    description: 'Warm, acoustic guitar fingerpicking and bright Rhodes harmonies.',
  },
  {
    id: 'uplift-02',
    title: 'Daybreak Blossom',
    artist: 'Solar Radiance',
    category: 'uplifting',
    mood: 'happy',
    duration: 172, // 2:52
    src: '/audio/uplifting-02.mp3',
    description: 'Joyful light percussion, melodic marimba, and buoyant chords.',
  },
  {
    id: 'uplift-03',
    title: 'Amber Glow',
    artist: 'Lumina Quartet',
    category: 'uplifting',
    mood: 'happy',
    duration: 210, // 3:30
    src: '/audio/uplifting-03.mp3',
    description: 'Celebratory orchestral swells and sparkling piano arpeggios.',
  },

  // ── RELAXING ───────────────────────────────────────────────────────────────
  {
    id: 'relax-01',
    title: 'Velvet Twilight',
    artist: 'Nocturne Drift',
    category: 'relaxing',
    mood: 'tired',
    duration: 226, // 3:46
    src: '/audio/relaxing-01.mp3',
    description: 'Slow-poured ambient synthesizers and warm Rhodes electric piano.',
  },
  {
    id: 'relax-02',
    title: 'Starlight Silence',
    artist: 'Slumber Space',
    category: 'relaxing',
    mood: 'tired',
    duration: 255, // 4:15
    src: '/audio/relaxing-02.mp3',
    description: 'Distant celestial chimes and sub-bass heartbeat pulse.',
  },
  {
    id: 'relax-03',
    title: 'Dusk Lullaby',
    artist: 'Soothe Collective',
    category: 'relaxing',
    mood: 'tired',
    duration: 204, // 3:24
    src: '/audio/relaxing-03.mp3',
    description: 'Soft felt piano melody echoing into tranquil purple stillness.',
  },

  // ── ENERGIZING ─────────────────────────────────────────────────────────────
  {
    id: 'energy-01',
    title: 'Kinetic Surge',
    artist: 'Pulsewave Lab',
    category: 'energizing',
    mood: 'energetic',
    duration: 165, // 2:45
    src: '/audio/energizing-01.mp3',
    description: 'High-tempo rhythmic arpeggios, driving kick, and shimmering hi-hats.',
  },
  {
    id: 'energy-02',
    title: 'Neon Horizon',
    artist: 'Flux Dynamics',
    category: 'energizing',
    mood: 'energetic',
    duration: 190, // 3:10
    src: '/audio/energizing-02.mp3',
    description: 'Electric synth-wave pulses and driving forward momentum.',
  },
  {
    id: 'energy-03',
    title: 'Ascension Rush',
    artist: 'Volt Sequence',
    category: 'energizing',
    mood: 'energetic',
    duration: 178, // 2:58
    src: '/audio/energizing-03.mp3',
    description: 'Propulsive polyrhythmic grooves and exhilarating brass stabs.',
  },

  // ── SOOTHING ───────────────────────────────────────────────────────────────
  {
    id: 'soothe-01',
    title: 'Gentle Rain Repose',
    artist: 'Cloud Mist Sanctuary',
    category: 'soothing',
    mood: 'sad',
    duration: 232, // 3:52
    src: '/audio/soothing-01.mp3',
    description: 'Whispering rainfall over gentle muted cello and tender felt keys.',
  },
  {
    id: 'soothe-02',
    title: 'Tender Echoes',
    artist: 'Quiet Waters',
    category: 'soothing',
    mood: 'sad',
    duration: 218, // 3:38
    src: '/audio/soothing-02.mp3',
    description: 'Warm reverberant strings offering comforting reassurance and space.',
  },
  {
    id: 'soothe-03',
    title: 'Shelter in the Mist',
    artist: 'Reflect Ensemble',
    category: 'soothing',
    mood: 'sad',
    duration: 245, // 4:05
    src: '/audio/soothing-03.mp3',
    description: 'Gentle atmospheric chords and soft acoustic reassurance.',
  },

  // ── COOLING ────────────────────────────────────────────────────────────────
  {
    id: 'cool-01',
    title: 'Glacial Stream',
    artist: 'Cryo Soundscape',
    category: 'cooling',
    mood: 'angry',
    duration: 208, // 3:28
    src: '/audio/cooling-01.mp3',
    description: 'Crystal-clear alpine water flow and cooling harmonic resonance.',
  },
  {
    id: 'cool-02',
    title: 'Clear Horizons',
    artist: 'Breeze Project',
    category: 'cooling',
    mood: 'angry',
    duration: 195, // 3:15
    src: '/audio/cooling-02.mp3',
    description: 'Gentle cooling winds and grounding acoustic bass tones.',
  },
  {
    id: 'cool-03',
    title: 'Tempered Steel',
    artist: 'Equanimity Lab',
    category: 'cooling',
    mood: 'angry',
    duration: 222, // 3:42
    src: '/audio/cooling-03.mp3',
    description: 'Deep resonant bowls washing away heat into serene mountain clarity.',
  },
];

// Fallback mapping if analysis data is unavailable
export const MOOD_EXPERIENCE_FALLBACK = {
  happy: 'uplifting',
  calm: 'calming',
  sad: 'soothing',
  angry: 'cooling',
  tired: 'relaxing',
  energetic: 'energizing',
};

/**
 * getRecommendedTracks
 * Filters and returns tracks strictly belonging to the target experience category.
 * Target category is derived from suggestedExperience, falling back to selectedMood mapping.
 * Never fills recommendation slots with tracks from other categories.
 *
 * @param {string} suggestedExperience
 * @param {string|object} moodId
 * @returns {Array} Array of recommended track objects
 */
export function getRecommendedTracks(suggestedExperience, moodId) {
  const normalizedMoodId =
    typeof moodId === 'string' ? moodId.toLowerCase() : moodId?.id?.toLowerCase();
  const targetCategory =
    (suggestedExperience ? suggestedExperience.trim().toLowerCase() : null) ||
    MOOD_EXPERIENCE_FALLBACK[normalizedMoodId] ||
    'calming';

  // Strictly filter by target category — no cross-category fallbacks or filler tracks
  return MUSIC_TRACKS.filter(
    (t) => t.category.toLowerCase() === targetCategory
  );
}
