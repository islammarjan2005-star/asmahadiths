const CACHE_PREFIX = 'asma-visual-';
const TTL_24H = 24 * 60 * 60 * 1000;

function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, expiry: Date.now() + TTL_24H }));
  } catch { /* quota exceeded */ }
}

async function callClaude(systemPrompt, userPrompt) {
  const apiKey = localStorage.getItem('anthropic_api_key') || '';
  if (!apiKey) return null;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.content?.[0]?.text || null;
}

export async function generateVerseInsight(arabic, translation, reference) {
  const cacheKey = `insight-${reference}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const system = `You are a Quranic scholar writing for an educated general audience. Write in flowing prose — no bullet points, no numbered lists. Be scholarly but accessible. Never fabricate hadith or scholarly opinions. Keep your response to 2-3 paragraphs.`;

  const prompt = `Provide a rich insight for this Quranic verse:

Reference: ${reference}
Arabic: ${arabic}
Translation: ${translation}

Include:
1. Historical context — when/why this was revealed (asbab al-nuzul if known)
2. Key Arabic root words and their deeper meanings
3. How classical scholars (Ibn Kathir, Al-Qurtubi, etc.) interpreted this verse

Write as flowing prose, not a list.`;

  try {
    const text = await callClaude(system, prompt);
    if (!text) return { insight: null };
    const result = { insight: text };
    setCache(cacheKey, result);
    return result;
  } catch {
    return { insight: null };
  }
}

export async function analyzeRootWord(word, verseReference) {
  const cacheKey = `root-${word}-${verseReference}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const system = `You are an Arabic linguistic scholar. Respond ONLY with valid JSON. No markdown, no code blocks.`;

  const prompt = `Analyze this Arabic word from ${verseReference}:

Word: ${word}

Return JSON with this exact structure:
{"root":"three letter root","meaning":"root meaning","relatedWords":[{"word":"Arabic word","meaning":"its meaning","reference":"where in Quran"}]}

Include 3-5 related Quranic words sharing the same root. Only reference real Quranic occurrences.`;

  try {
    const text = await callClaude(system, prompt);
    if (!text) return { root: '', meaning: '', relatedWords: [] };
    const result = JSON.parse(text.trim());
    setCache(cacheKey, result);
    return result;
  } catch {
    return { root: '', meaning: '', relatedWords: [] };
  }
}

export async function findRelatedVerses(arabic, translation, reference) {
  const cacheKey = `related-${reference}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const system = `You are a Quranic scholar identifying thematic connections. Respond ONLY with valid JSON array. No markdown, no code blocks.`;

  const prompt = `Find 3 Quranic verses thematically related to:

Reference: ${reference}
Translation: ${translation}

Return a JSON array with exactly 3 items:
[{"reference":"surah:ayah","arabic":"Arabic text","translation":"brief translation","connection":"one sentence explaining the thematic connection"}]

Only reference real, verifiable Quranic verses.`;

  try {
    const text = await callClaude(system, prompt);
    if (!text) return [];
    const result = JSON.parse(text.trim());
    setCache(cacheKey, result);
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
}

export async function generateArtDescription(translation, reference) {
  const cacheKey = `artdesc-${reference}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const system = `You are an Islamic art historian. Write one evocative sentence. No lists.`;

  const prompt = `This Quranic verse's themes are being represented through Islamic geometric art:

"${translation}" (${reference})

Write one poetic sentence (max 30 words) describing how geometric patterns symbolically reflect the verse's meaning — connecting mathematical harmony to divine truth.`;

  try {
    const text = await callClaude(system, prompt);
    if (!text) return { description: null };
    const result = { description: text.trim() };
    setCache(cacheKey, result);
    return result;
  } catch {
    return { description: null };
  }
}
