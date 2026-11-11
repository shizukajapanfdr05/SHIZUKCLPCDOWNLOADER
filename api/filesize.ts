import type { IncomingMessage, ServerResponse } from 'http';
import { KNOWN_EXE_SIZE } from '../src/data/seedData.ts';

const GARENA_CDN_BASE = 'https://dl-cdn.craftlandstudio.com/live/public_stable/web/';
const UPSTREAM_MIRROR = 'https://vk.gt.tc/CLPC/index.php';

export default async function handler(req: IncomingMessage & { query?: Record<string, string>; url?: string }, res: ServerResponse & { setHeader: (k: string, v: string) => any }) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '', 'http://localhost');
  const filePath = urlObj.searchParams.get('path') || req.query?.path || '';

  if (!filePath) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Missing path parameter' }));
    return;
  }

  // Tier 1: Direct HEAD to Garena CDN
  try {
    const headRes = await fetch(`${GARENA_CDN_BASE}${filePath}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3500),
    });
    if (headRes.ok) {
      const cl = headRes.headers.get('content-length');
      if (cl) {
        const size = parseInt(cl, 10);
        res.end(JSON.stringify({ size, source: 'direct-garena-cdn' }));
        return;
      }
    }
  } catch {
    // fallback
  }

  // Tier 2: Mirror
  try {
    const mirrorRes = await fetch(
      `${UPSTREAM_MIRROR}?type=filesize&path=${encodeURIComponent(filePath)}&v=${Date.now()}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(3500),
      }
    );
    if (mirrorRes.ok) {
      const data = (await mirrorRes.json()) as { size: number };
      if (typeof data.size === 'number') {
        res.end(JSON.stringify({ size: data.size, source: 'upstream-mirror' }));
        return;
      }
    }
  } catch {
    // fallback
  }

  res.end(JSON.stringify({ size: KNOWN_EXE_SIZE, source: 'offline-cache' }));
}
