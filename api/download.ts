import type { IncomingMessage, ServerResponse } from 'http';
import { FALLBACK_LATEST_YAML } from '../src/data/seedData.ts';
import { parseYAML } from '../src/utils/parser.ts';

const GARENA_CDN_BASE = 'https://dl-cdn.craftlandstudio.com/live/public_stable/web/';
const UPSTREAM_MIRROR = 'https://vk.gt.tc/CLPC/index.php';

export default async function handler(req: IncomingMessage & { query?: Record<string, string>; url?: string }, res: ServerResponse & { status: (code: number) => any; json: (data: any) => any; send: (data: any) => any; setHeader: (k: string, v: string) => any }) {
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

  let yamlText = '';
  let source = 'direct-garena-cdn';

  try {
    const cdnRes = await fetch(`${GARENA_CDN_BASE}latest.yml?_=${Date.now()}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (cdnRes.ok) {
      yamlText = await cdnRes.text();
      source = 'direct-garena-cdn';
    }
  } catch {
    // fallback
  }

  if (!yamlText) {
    try {
      const mirrorRes = await fetch(`${UPSTREAM_MIRROR}?type=download&noCache=${Math.random()}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(4000),
      });
      if (mirrorRes.ok) {
        yamlText = await mirrorRes.text();
        source = 'upstream-mirror';
      }
    } catch {
      // fallback
    }
  }

  if (!yamlText) {
    yamlText = FALLBACK_LATEST_YAML;
    source = 'offline-cache';
  }

  if (format === 'json') {
    const parsed = parseYAML(yamlText);
    parsed.source = source as any;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(parsed));
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Data-Source', source);
    res.end(yamlText);
  }
}
