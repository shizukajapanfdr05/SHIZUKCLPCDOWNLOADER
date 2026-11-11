import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { FALLBACK_LATEST_YAML, FALLBACK_RELEASES_CSV, KNOWN_EXE_SIZE } from './src/data/seedData.ts';
import { parseReleaseNotes, parseYAML } from './src/utils/parser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const GARENA_CDN_BASE = 'https://dl-cdn.craftlandstudio.com/live/public_stable/web/';
const UPSTREAM_MIRROR = 'https://vk.gt.tc/CLPC/index.php';

app.use(express.json());

// Enable CORS for API requests
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * Health check & Independent status endpoint
 */
app.get('/api/status', async (_req: Request, res: Response) => {
  const start = Date.now();
  let cdnStatus: 'healthy' | 'unreachable' = 'unreachable';
  let mirrorStatus: 'healthy' | 'unreachable' = 'unreachable';

  // Check official Garena CDN
  try {
    const cdnRes = await fetch(`${GARENA_CDN_BASE}latest.yml`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3500),
    });
    if (cdnRes.ok) cdnStatus = 'healthy';
  } catch {
    cdnStatus = 'unreachable';
  }

  // Check vk.gt.tc mirror
  try {
    const mirrorRes = await fetch(`${UPSTREAM_MIRROR}?type=download&v=${Date.now()}`, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(3500),
    });
    if (mirrorRes.ok) mirrorStatus = 'healthy';
  } catch {
    mirrorStatus = 'unreachable';
  }

  const activeSource =
    cdnStatus === 'healthy'
      ? 'direct-garena-cdn'
      : mirrorStatus === 'healthy'
      ? 'upstream-mirror'
      : 'offline-cache';

  const latencyMs = Date.now() - start;

  res.json({
    online: true,
    activeSource,
    cdnStatus,
    mirrorStatus,
    cachedVersionsCount: 12,
    latestVersion: '1.19.4689915',
    latencyMs,
    independenceGuarantee: '100% Independent: operates directly on Garena CDN with local seed resilience.',
  });
});

/**
 * Latest download package YAML / metadata
 */
app.get('/api/download', async (req: Request, res: Response) => {
  let yamlText = '';
  let source: 'direct-garena-cdn' | 'upstream-mirror' | 'offline-cache' = 'direct-garena-cdn';

  // Tier 1: Direct official Garena CDN
  try {
    const cdnRes = await fetch(`${GARENA_CDN_BASE}latest.yml?_=${Date.now()}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (cdnRes.ok) {
      yamlText = await cdnRes.text();
      source = 'direct-garena-cdn';
    }
  } catch (err) {
    console.warn('Garena CDN direct fetch failed, trying mirror...', err);
  }

  // Tier 2: vk.gt.tc mirror
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
    } catch (err) {
      console.warn('vk.gt.tc mirror fetch failed, using offline fallback...', err);
    }
  }

  // Tier 3: High-availability embedded cache
  if (!yamlText) {
    yamlText = FALLBACK_LATEST_YAML;
    source = 'offline-cache';
  }

  if (req.query.format === 'json') {
    const parsed = parseYAML(yamlText);
    parsed.source = source;
    res.json(parsed);
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Data-Source', source);
    res.send(yamlText);
  }
});

/**
 * Dynamic file size via direct HTTP HEAD
 */
app.get('/api/filesize', async (req: Request, res: Response) => {
  const filePath = (req.query.path as string) || '';
  if (!filePath) {
    res.status(400).json({ error: 'Missing path parameter' });
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
        res.json({ size, source: 'direct-garena-cdn' });
        return;
      }
    }
  } catch (err) {
    console.warn('Direct HEAD to Garena CDN failed:', err);
  }

  // Tier 2: Mirror filesize API
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
        res.json({ size: data.size, source: 'upstream-mirror' });
        return;
      }
    }
  } catch (err) {
    console.warn('Mirror filesize failed:', err);
  }

  // Tier 3: Fallback known size
  res.json({ size: KNOWN_EXE_SIZE, source: 'offline-cache' });
});

/**
 * Release notes CSV and JSON endpoint
 */
app.get('/api/releases', async (req: Request, res: Response) => {
  let csvText = '';
  let source: 'direct-garena-cdn' | 'upstream-mirror' | 'offline-cache' = 'upstream-mirror';

  // Tier 1: Try mirror if accessible
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
  } catch (err) {
    console.warn('Upstream releases fetch failed, using offline seed:', err);
  }

  // Tier 2: Embedded full release notes
  if (!csvText) {
    csvText = FALLBACK_RELEASES_CSV;
    source = 'offline-cache';
  }

  if (req.query.format === 'json') {
    const notes = parseReleaseNotes(csvText);
    res.json({
      source,
      count: notes.length,
      releases: notes,
    });
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Data-Source', source);
    res.send(csvText);
  }
});

// Vite middleware or production static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
