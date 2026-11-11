import type { IncomingMessage, ServerResponse } from 'http';
import { FALLBACK_RELEASES_CSV } from '../src/data/seedData.ts';
import { parseReleaseNotes } from '../src/utils/parser.ts';

const UPSTREAM_MIRROR = 'https://vk.gt.tc/CLPC/index.php';

export default async function handler(req: IncomingMessage & { query?: Record<string, string>; url?: string }, res: ServerResponse & { setHeader: (k: string, v: string) => any }) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '', 'http://localhost');
  const format = urlObj.searchParams.get('format') || req.query?.format;

  let csvText = '';
  let source = 'upstream-mirror';

  try {
    const mirrorRes = await fetch(`${UPSTREAM_MIRROR}?type=releases&v=${Date.now()}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(3500),
    });
    if (mirrorRes.ok) {
      const text = await mirrorRes.text();
      if (text && text.trim().length > 100) {
        csvText = text;
        source = 'upstream-mirror';
      }
    }
  } catch {
    // fallback
  }

  if (!csvText) {
    csvText = FALLBACK_RELEASES_CSV;
    source = 'offline-cache';
  }

  if (format === 'json') {
    const notes = parseReleaseNotes(csvText);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        source,
        count: notes.length,
        releases: notes,
      })
    );
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Data-Source', source);
    res.end(csvText);
  }
}
