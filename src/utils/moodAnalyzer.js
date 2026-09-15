/**
 * moodAnalyzer.js
 *
 * Mood analysis service for MoodWave.
 * Accepts selectedMood + noteText and returns structured emotional insight.
 *
 * Primary:  Gemini API (if VITE_GEMINI_API_KEY is configured in .env)
 * Fallback: Local rule-based analysis (always works offline, zero external dependencies)
 *
 * IMPORTANT: No API key is ever hard-coded in the source code.
 */

// ─── Emotional State Definitions ─────────────────────────────────────────────

export const EMOTIONAL_STATES = [
  'Joyful',
  'Motivated',
  'Peaceful',
  'Relaxed',
  'Stressed',
  'Low Energy',
  'Frustrated',
  'Excited',
  'Overwhelmed',
  'Reflective',
];

// Suggested experience → used by later steps for music and visual ambiance
export const SUGGESTED_EXPERIENCES = {
  Joyful:      'uplifting',
  Motivated:   'energizing',
  Peaceful:    'calming',
  Relaxed:     'relaxing',
  Stressed:    'soothing',
  'Low Energy': 'relaxing',
  Frustrated:  'cooling',
  Excited:     'energizing',
  Overwhelmed: 'calming',
  Reflective:  'soothing',
};

// Mood → default state when note is empty or purely mood-driven
export const MOOD_DEFAULT_STATE = {
  happy:     'Joyful',
  calm:      'Peaceful',
  sad:       'Reflective',
  angry:     'Frustrated',
  tired:     'Low Energy',
  energetic: 'Excited',
};

// ─── Local Keyword Signals ────────────────────────────────────────────────────

const KEYWORD_MAP = [
  { words: ['happy', 'joy', 'great', 'amazing', 'wonderful', 'love', 'laugh', 'smile', 'fantastic', 'blessed', 'grateful', 'thrilled', 'delight', 'positive', 'good', 'cheerful'], state: 'Joyful' },
  { words: ['motivated', 'focus', 'goal', 'achieve', 'productive', 'driven', 'purpose', 'energy', 'ready', 'determined', 'accomplish'], state: 'Motivated' },
  { words: ['calm', 'peace', 'quiet', 'still', 'breathe', 'serene', 'gentle', 'meditate', 'balance', 'center'], state: 'Peaceful' },
  { words: ['relax', 'rest', 'chill', 'unwind', 'comfortable', 'easygoing', 'light', 'content', 'fine'], state: 'Relaxed' },
  { words: ['stress', 'pressure', 'deadline', 'anxious', 'worry', 'overwhelmed', 'panic', 'nervous', 'tense', 'burden'], state: 'Stressed' },
  { words: ['tired', 'exhausted', 'exhaustion', 'sleepy', 'drained', 'weary', 'fatigue', 'low', 'sluggish', 'worn', 'heavy'], state: 'Low Energy' },
  { words: ['angry', 'frustrated', 'frustration', 'annoy', 'mad', 'rage', 'irritat', 'upset', 'furious', 'resentful', 'bitter'], state: 'Frustrated' },
  { words: ['excited', 'thrill', "can't wait", 'pump', 'buzz', 'hyped', 'electric', 'vibrant', 'surge'], state: 'Excited' },
  { words: ['overwhelmed', 'too much', "can't cope", 'falling apart', 'breaking', 'lost', 'drowning', 'numb'], state: 'Overwhelmed' },
  { words: ['think', 'wonder', 'reflect', 'remember', 'nostalgic', 'ponder', 'question', 'learn', 'realize', 'understand', 'deep'], state: 'Reflective' },
];

// ─── Local Rule-Based Analysis ────────────────────────────────────────────────

function buildLocalInsight(emotionalState, moodLabel, noteProvided) {
  const prefix = noteProvided
    ? "Based on what you shared, it sounds like"
    : "Based on your selected mood, it feels like";

  const insights = {
    Joyful:      `${prefix} you are carrying a wonderful lightness today. Let this uplifting energy brighten your space and flow into everything you do.`,
    Motivated:   `${prefix} you are in a powerful state of drive and intention. Channel this focused momentum into what matters most to you.`,
    Peaceful:    `${prefix} you are in a state of quiet equilibrium. Honour this tranquility by moving through your day with steady, mindful presence.`,
    Relaxed:     `${prefix} you have given yourself permission to unwind. Taking this pause is a restorative strength worth celebrating.`,
    Stressed:    `${prefix} there is a weight you are carrying right now. A calm, uncluttered space with gentle pacing may help you decompress.`,
    'Low Energy': `${prefix} your mind and body are gently asking for restorative rest. A soothing, low-intensity atmosphere can help you recharge comfortably.`,
    Frustrated:  `${prefix} something has created friction for you. A cooling, grounding space can provide room to release tension and regain clarity.`,
    Excited:     `${prefix} you are buzzing with anticipation and vitality. This kinetic energy can be a vibrant catalyst for creativity and flow.`,
    Overwhelmed: `${prefix} you may be holding a lot at once right now. Giving yourself permission to pause and simplify can help you find your footing.`,
    Reflective:  `${prefix} you are in a thoughtful, contemplative space. Allow yourself the grace to process your thoughts without any rush or pressure.`,
  };

  return (
    insights[emotionalState] ||
    `${prefix} you are navigating a unique emotional moment. MoodWave is here to provide a comfortable, adaptive space.`
  );
}

export function runLocalAnalysis({ selectedMood, noteText }) {
  const moodId = selectedMood?.id || 'calm';
  const note = (noteText || '').toLowerCase().trim();
  const noteProvided = note.length > 0;

  let emotionalState = null;

  if (noteProvided) {
    // Check specific contextual pairings first
    if (moodId === 'sad' && (note.includes('tired') || note.includes('stress') || note.includes('exhaust') || note.includes('drain') || note.includes('low'))) {
      emotionalState = 'Low Energy';
    } else if (moodId === 'happy' && (note.includes('positive') || note.includes('good') || note.includes('joy') || note.includes('happy') || note.includes('great') || note.includes('smile'))) {
      emotionalState = 'Joyful';
    } else if (moodId === 'calm' && (note.includes('relax') || note.includes('peace') || note.includes('calm') || note.includes('chill') || note.includes('quiet'))) {
      emotionalState = 'Peaceful';
    } else if (moodId === 'angry' && (note.includes('frustrat') || note.includes('mad') || note.includes('annoy') || note.includes('irritat') || note.includes('rage') || note.includes('upset'))) {
      emotionalState = 'Frustrated';
    } else if (moodId === 'tired' && (note.includes('exhaust') || note.includes('tired') || note.includes('sleep') || note.includes('fatigue') || note.includes('weary'))) {
      emotionalState = 'Low Energy';
    } else if (moodId === 'energetic' && (note.includes('excit') || note.includes('positive') || note.includes('pump') || note.includes('hyped') || note.includes('buzz'))) {
      emotionalState = 'Excited';
    }

    // General keyword frequency matching if no direct contextual match
    if (!emotionalState) {
      let maxMatches = 0;
      for (const { words, state } of KEYWORD_MAP) {
        const count = words.filter((w) => note.includes(w)).length;
        if (count > maxMatches) {
          maxMatches = count;
          emotionalState = state;
        }
      }
    }
  }

  // If no keywords matched or note was empty, use mood default
  if (!emotionalState) {
    emotionalState = MOOD_DEFAULT_STATE[moodId] || 'Peaceful';
  }

  const insight = buildLocalInsight(emotionalState, selectedMood?.label || 'Calm', noteProvided);
  const suggestedExperience = SUGGESTED_EXPERIENCES[emotionalState] || 'calming';

  return { emotionalState, insight, suggestedExperience };
}

// ─── Gemini API Analysis ──────────────────────────────────────────────────────

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function runGeminiAnalysis({ selectedMood, noteText }) {
  const apiKey =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not configured');

  const moodLabel = selectedMood?.label || 'Calm';
  const note = noteText?.trim() || '(the user did not provide a note)';

  const prompt = `You are a supportive, empathetic UI personalization assistant for MoodWave, an emotional wellness app.

A user has selected the mood "${moodLabel}" and written the following personal note:
"${note}"

Your task is to analyze this and return a JSON object with EXACTLY this structure:
{
  "emotionalState": "<one of: Joyful, Motivated, Peaceful, Relaxed, Stressed, Low Energy, Frustrated, Excited, Overwhelmed, Reflective>",
  "insight": "<2-3 sentence supportive, non-medical interpretation. Start with 'Based on what you shared' or 'It sounds like'. Never diagnose. Frame as UI personalization.>",
  "suggestedExperience": "<one of: calming, uplifting, relaxing, energizing, soothing, cooling>"
}

Rules:
- Return ONLY valid JSON. No markdown, no explanation, no extra text.
- Do NOT diagnose or mention any medical/psychological condition or disorder.
- Be warm, supportive, and concise.
- If the note is empty, base the analysis on the selected mood only.`;

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 256,
        responseMimeType: 'application/json',
      },
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  let parsed;
  try {
    parsed = JSON.parse(rawText.trim());
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }

  // Validate required fields
  if (!parsed.emotionalState || !parsed.insight || !parsed.suggestedExperience) {
    throw new Error('Gemini response missing required fields');
  }

  // Sanitize to known values to prevent invalid states
  if (!EMOTIONAL_STATES.includes(parsed.emotionalState)) {
    parsed.emotionalState = MOOD_DEFAULT_STATE[selectedMood?.id] || 'Reflective';
  }
  const validExperiences = Object.values(SUGGESTED_EXPERIENCES);
  if (!validExperiences.includes(parsed.suggestedExperience)) {
    parsed.suggestedExperience = SUGGESTED_EXPERIENCES[parsed.emotionalState] || 'calming';
  }

  return parsed;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * analyzeMood
 *
 * Analyzes selectedMood + noteText.
 * Uses Gemini if configured, otherwise falls back to local rule-based analysis.
 *
 * @param {{ selectedMood: object, noteText: string }} params
 * @returns {Promise<{ emotionalState: string, insight: string, suggestedExperience: string, source: 'gemini'|'local' }>}
 */
export async function analyzeMood({ selectedMood, noteText }) {
  const hasApiKey = Boolean(
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY
  );

  if (hasApiKey) {
    try {
      const result = await runGeminiAnalysis({ selectedMood, noteText });
      return { ...result, source: 'gemini' };
    } catch (err) {
      console.warn('[MoodWave] Gemini analysis failed, using local fallback:', err.message);
      // Fall through to local fallback
    }
  }

  const result = runLocalAnalysis({ selectedMood, noteText });
  return { ...result, source: 'local' };
}
