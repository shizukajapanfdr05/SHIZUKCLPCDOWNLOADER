import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCSV,
  parseDate,
  formatBytes,
  formatDate,
  extractItems,
  formatContentSections,
  parseYAML,
  parseReleaseNotes,
} from './parser';

test('parseCSV handles comma separated values with quoted fields', () => {
  const csv = 'col1,col2\n"hello, world",second\n"with ""quotes""",third';
  const rows = parseCSV(csv);
  assert.equal(rows.length, 3);
  assert.deepEqual(rows[0], ['col1', 'col2']);
  assert.deepEqual(rows[1], ['hello, world', 'second']);
  assert.deepEqual(rows[2], ['with "quotes"', 'third']);
});

test('parseDate handles YYYY/MM/DD and YYYY-MM-DD', () => {
  const t1 = parseDate('2026/10/22');
  const t2 = parseDate('2026-10-22');
  assert.equal(t1, t2);
  assert.ok(t1 > 0);
  assert.equal(parseDate(''), 0);
  assert.equal(parseDate(null), 0);
});

test('formatBytes formats sizes accurately', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(721112), '704.21 KB');
  assert.equal(formatBytes(2442732081), '2.27 GB');
  assert.equal(formatBytes(null), '-');
});

test('formatDate produces readable strings', () => {
  const formatted = formatDate('2026-10-22T04:02:06.972Z');
  assert.ok(formatted.includes('2026'));
  assert.ok(formatted.includes('Oct'));
  assert.equal(formatDate(''), '-');
});

test('extractItems parses numbered lists correctly', () => {
  const text = '1. First update item\n2. Second update item\n3. Third item';
  const items = extractItems(text);
  assert.equal(items.length, 3);
  assert.equal(items[0], 'First update item');
  assert.equal(items[1], 'Second update item');
});

test('formatContentSections handles markdown ## headers and lists', () => {
  const body = '## Editor Update\n1. Added cool feature\n2. Fixed bug\n\n## Script Update\nSome single line text';
  const sections = formatContentSections(body);
  assert.equal(sections.length, 2);
  assert.equal(sections[0].title, 'Editor Update');
  assert.equal(sections[0].items.length, 2);
  assert.equal(sections[1].title, 'Script Update');
});

test('parseYAML extracts version, exe, and package fields', () => {
  const yaml = `version: 1.19.4689915
files:
  - url: 1.19.4689915/CraftlandStudio_Web_Setup_1.19.4689915.exe
    sha512: mocksha512
path: CraftlandStudio_Web_Setup_1.19.4689915.exe
sha512: mocksha512
packages:
  x64:
    size: 2442732081
    sha512: pkgsha512
    blockMapSize: 2426631
    path: 1.19.4689915/FE-1.19.4689915-x64.nsis.7z
    file: FE-1.19.4689915-x64.nsis.7z
releaseDate: '2026-10-22T04:02:06.972Z'
`;
  const result = parseYAML(yaml);
  assert.equal(result.version, '1.19.4689915');
  assert.equal(result.exe.fileName, 'CraftlandStudio_Web_Setup_1.19.4689915.exe');
  assert.equal(result.pkg.fileName, 'FE-1.19.4689915-x64.nsis.7z');
  assert.equal(result.pkg.size, 2442732081);
  assert.equal(result.pkg.blockMapSize, 2426631);
});

test('parseReleaseNotes filters template rows and sorts newest first', () => {
  const csv = `version,showVersion,date,content
真正版本,显示版本号,更新日期,内容模板
1.13.0,1.13.0,2025/05/21,"1. Old feature"
1.19.0,1.19.0,2026/09/16,"## New Features\n1. AI Assistant"
`;
  const releases = parseReleaseNotes(csv);
  assert.equal(releases.length, 2);
  assert.equal(releases[0].version, '1.19.0'); // Newest first
  assert.equal(releases[1].version, '1.13.0');
});
