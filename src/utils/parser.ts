import { DownloadData, ReleaseNote, ReleaseContentSection } from '../types';

export const DOWNLOAD_BASE = 'https://dl-cdn.craftlandstudio.com/live/public_stable/web/';

/**
 * Escapes HTML characters safely.
 */
export function escapeHTML(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Robust CSV parser that handles quotes, escaped quotes, and newlines within fields.
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let quotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];

    if (c === '"') {
      if (quotes && n === '"') {
        value += '"';
        i++;
      } else {
        quotes = !quotes;
      }
    } else if (c === ',' && !quotes) {
      row.push(value);
      value = '';
    } else if ((c === '\r' || c === '\n') && !quotes) {
      if (c === '\r' && n === '\n') {
        i++;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else {
      value += c;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

/**
 * Parses YYYY-MM-DD or YYYY/MM/DD dates into Unix timestamp ms.
 */
export function parseDate(v: unknown): number {
  if (!v) return 0;
  const p = String(v).trim().replace(/\//g, '-').split('-');
  if (p.length !== 3) return 0;
  const y = parseInt(p[0], 10);
  const m = parseInt(p[1], 10);
  const d = parseInt(p[2], 10);
  if (!y || !m || !d) return 0;
  return new Date(y, m - 1, d).getTime();
}

/**
 * Formats byte counts into human-readable strings (e.g. 704.21 KB, 2.27 GB).
 */
export function formatBytes(bytes: number | string | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes === '') return '-';
  const n = Number(bytes);
  if (isNaN(n) || n < 0) return '-';
  if (n === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let size = n;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return size.toFixed(i === 0 ? 0 : 2) + ' ' + units[i];
}

/**
 * Formats date into readable string.
 */
export function formatDate(v: string | number | null | undefined): string {
  if (!v) return '-';
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Extracts numbered items (1. ..., 2. ...) from release text.
 */
export function extractItems(body: string): string[] {
  const items: string[] = [];
  const regex = /(?:^|[\n\s])\d+\.\s+([\s\S]*?)(?=(?:[\n\s]\d+\.\s+)|$)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    const text = match[1].trim();
    if (text) items.push(text);
  }
  return items;
}

/**
 * Formats markdown-like sections (## Title) and lists.
 */
export function formatContentSections(content: string): ReleaseContentSection[] {
  if (!content) return [];
  const cleanContent = String(content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const parts = cleanContent.split(/(?=##\s+)/g);
  const sections: ReleaseContentSection[] = [];

  parts.forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    let title = '';
    let body = trimmed;

    if (trimmed.startsWith('##')) {
      const lines = trimmed.split('\n');
      title = (lines.shift() || '').replace(/^##\s*/, '').trim();
      body = lines.join('\n').trim();
    }

    const items = extractItems(body);
    sections.push({
      title,
      items,
      body: items.length === 0 ? body : undefined,
    });
  });

  return sections;
}

/**
 * Parses YAML text from latest.yml.
 */
export function parseYAML(yaml: string): DownloadData {
  const get = (regex: RegExp): string => {
    const m = yaml.match(regex);
    return m ? m[1].trim() : '';
  };

  const version = get(/^version:\s*(.+)$/m);
  const fileUrl = get(/^\s*-\s*url:\s*(.+)$/m);
  const exePath = get(/^path:\s*(.+)$/m);
  const exeSha512 = get(/^sha512:\s*(.+)$/m);
  const releaseDate = get(/^releaseDate:\s*['"]?([^'"\r\n]+)['"]?$/m);
  const pkgSize = get(/x64:\s*\n\s*size:\s*(\d+)/m);
  const pkgSha512 = get(/x64:\s*\n\s*size:\s*\d+\s*\n\s*sha512:\s*(.+)$/m);
  const pkgBlockMap = get(/x64:[\s\S]*?blockMapSize:\s*(\d+)/m);
  const pkgPath = get(/x64:[\s\S]*?path:\s*(.+)$/m);
  const pkgFile = get(/x64:[\s\S]*?file:\s*(.+)$/m);

  const exeFileName = exePath || fileUrl.split('/').pop() || '';
  const exeDownloadURL = fileUrl ? new URL(fileUrl, DOWNLOAD_BASE).href : '';
  const pkgDownloadURL = pkgPath ? new URL(pkgPath, DOWNLOAD_BASE).href : '';

  return {
    version,
    releaseDate,
    exe: {
      url: exeDownloadURL,
      path: fileUrl || exePath,
      fileName: exeFileName,
      sha512: exeSha512,
    },
    pkg: {
      url: pkgDownloadURL,
      path: pkgPath,
      fileName: pkgFile,
      size: pkgSize ? Number(pkgSize) : 0,
      sha512: pkgSha512,
      blockMapSize: pkgBlockMap ? Number(pkgBlockMap) : 0,
    },
  };
}

/**
 * Parses CSV rows into sorted ReleaseNote objects.
 */
export function parseReleaseNotes(csv: string): ReleaseNote[] {
  const rows = parseCSV(csv);
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map((x) => String(x).trim().toLowerCase());
  const vi = headers.indexOf('version');
  const svi = headers.indexOf('showversion');
  const di = headers.indexOf('date');
  const ci = headers.indexOf('content');

  if (vi < 0 || di < 0 || ci < 0) return [];

  const data = rows.slice(1).filter((row) => {
    if (!row.some((x) => String(x || '').trim() !== '')) return false;
    const text = row.join('|');
    if (
      text.includes('真正版本') ||
      text.includes('显示版本号') ||
      text.includes('更新日期') ||
      text.includes('内容模板')
    ) {
      return false;
    }
    return true;
  });

  data.sort((a, b) => {
    const da = parseDate(a[di]);
    const db = parseDate(b[di]);
    if (da && db) return db - da;
    if (da) return -1;
    if (db) return 1;
    return String(b[vi] || '').localeCompare(String(a[vi] || ''), undefined, { numeric: true });
  });

  return data.map((row) => {
    const version = row[vi] || '';
    const showVersion = svi >= 0 ? row[svi] || '' : '';
    const date = row[di] || '';
    const content = row[ci] || '';

    return {
      version,
      showVersion,
      date,
      rawContent: content,
      sections: formatContentSections(content),
    };
  });
}
