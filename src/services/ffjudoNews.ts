import fs from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';

const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'ffjudo-news.json');
const CACHE_TTL = 1000 * 60 * 60; // 1 heure
const SOURCE_URL = 'https://www.ffjudo.com/actualites';

export type NewsItem = {
  title: string;
  date: string;
  image: string;
  link: string;
  summary: string;
  category: string;
};

type CacheData = {
  timestamp: number;
  items: NewsItem[];
};

async function readCache(): Promise<CacheData | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8');
    const cache = JSON.parse(raw) as CacheData;
    if (!cache?.timestamp || !Array.isArray(cache.items)) return null;
    return cache;
  } catch {
    return null;
  }
}

async function writeCache(items: NewsItem[]) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), items }, null, 2), 'utf-8');
  } catch {
    // ignore cache write errors
  }
}

function normalizeText(text?: string) {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

function resolveUrl(value: string) {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  try {
    return new URL(value, SOURCE_URL).toString();
  } catch {
    return value;
  }
}

export async function getFranceJudoNews(limit = 4): Promise<NewsItem[]> {
  const cached = await readCache();
  // If cache exists and is fresh and contains enough items, return it.
  if (cached && Date.now() - cached.timestamp < CACHE_TTL && Array.isArray(cached.items) && cached.items.length >= limit) {
    return cached.items.slice(0, limit);
  }

  let items: NewsItem[] = [];

  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to fetch France Judo news: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    $('a.card-actu').each((_, element) => {
      if (items.length >= limit) return;
      const anchor = $(element);
      const link = resolveUrl(anchor.attr('href') ?? '');
      const title = normalizeText(anchor.find('h2.h3').text() || anchor.find('h2').text());
      const date = normalizeText(anchor.find('p.date').text());
      const summary = normalizeText(anchor.find('p.desc').text());
      const image = resolveUrl(anchor.find('figure img').attr('src') ?? '');
      const category = normalizeText(anchor.find('.categorie span').text());

      if (!title || !link) return;

      items.push({ title, date, image, link, summary, category });
    });

    if (items.length > 0) {
      await writeCache(items);
    }
  } catch (error) {
    if (cached) {
      return cached.items.slice(0, limit);
    }
    throw error;
  }

  return items.length > 0 ? items : cached?.items.slice(0, limit) ?? [];
}
