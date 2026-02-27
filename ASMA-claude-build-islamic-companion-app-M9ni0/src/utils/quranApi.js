const BASE_URL = 'https://api.quran.com/api/v4';
const CACHE_PREFIX = 'asma-quran-';

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

function setCache(key, data, ttlMs) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, expiry: Date.now() + ttlMs }));
  } catch { /* quota exceeded */ }
}

const TTL_24H = 24 * 60 * 60 * 1000;
const TTL_7D = 7 * 24 * 60 * 60 * 1000;

export async function fetchChapters() {
  const cached = getCached('chapters');
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/chapters?language=en`);
  if (!res.ok) throw new Error('Failed to fetch chapters');
  const { chapters } = await res.json();

  const simplified = chapters.map(ch => ({
    id: ch.id,
    nameArabic: ch.name_arabic,
    nameSimple: ch.name_simple,
    nameTranslated: ch.translated_name.name,
    revelationType: ch.revelation_place,
    versesCount: ch.verses_count,
  }));

  setCache('chapters', simplified, TTL_24H);
  return simplified;
}

export async function fetchVerses(chapterId, page = 1, perPage = 20) {
  const cacheKey = `verses-${chapterId}-${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `${BASE_URL}/verses/by_chapter/${chapterId}?language=en&words=true&translations=131&fields=text_uthmani&page=${page}&per_page=${perPage}`
  );
  if (!res.ok) throw new Error('Failed to fetch verses');
  const data = await res.json();

  const result = {
    verses: data.verses.map(v => ({
      id: v.id,
      verseNumber: v.verse_number,
      verseKey: v.verse_key,
      textUthmani: v.text_uthmani,
      words: v.words?.map(w => ({
        id: w.id,
        text: w.text_uthmani || w.text,
        translation: w.translation?.text || '',
        transliteration: w.transliteration?.text || '',
      })) || [],
      translation: v.translations?.[0]?.text || '',
    })),
    pagination: data.pagination,
  };

  setCache(cacheKey, result, TTL_7D);
  return result;
}

export async function searchQuran(query) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&size=20&language=en`);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.search?.results || [];
}

export function getAudioUrl(verseKey, reciterId = 7) {
  // Reciter 7 = Mishary Rashid Alafasy
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verseKey.replace(':', '')}.mp3`;
}

export const RECITERS = [
  { id: 7, name: 'Mishary Rashid Alafasy', nameAr: 'مشاري راشد العفاسي' },
  { id: 1, name: 'Abdul Basit Abdul Samad', nameAr: 'عبد الباسط عبد الصمد' },
  { id: 3, name: 'Abdul Rahman Al-Sudais', nameAr: 'عبد الرحمن السديس' },
];
