import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DownloadCard } from './components/DownloadCard';
import { PackageGrid } from './components/PackageGrid';
import { ReleaseHistory } from './components/ReleaseHistory';
import { DownloadData, ReleaseNote } from './types';
import { parseYAML, parseReleaseNotes } from './utils/parser';
import { FALLBACK_LATEST_YAML, FALLBACK_RELEASES_CSV, KNOWN_EXE_SIZE } from './data/seedData';
import { Youtube, ShieldCheck } from 'lucide-react';

const YT_CHANNEL_URL = 'https://youtube.com/@gamingwithshizuka_11421?si=GmtIsqV_4yY3fKFV';

export default function App() {
  const [downloadData, setDownloadData] = useState<DownloadData | null>(() => {
    try {
      return parseYAML(FALLBACK_LATEST_YAML);
    } catch {
      return null;
    }
  });
  const [exeSize, setExeSize] = useState<number | null>(KNOWN_EXE_SIZE);
  const [releases, setReleases] = useState<ReleaseNote[]>(() => {
    try {
      return parseReleaseNotes(FALLBACK_RELEASES_CSV);
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch download package metadata
  const fetchDownload = useCallback(async () => {
    try {
      const res = await fetch('/api/download?format=json');
      if (res.ok) {
        const data = (await res.json()) as DownloadData;
        setDownloadData(data);
        if (data.exe?.path) {
          fetchExeSize(data.exe.path);
        }
        return;
      }
    } catch {
      // Continue to direct CDN fallback
    }

    try {
      const cdnRes = await fetch('https://dl-cdn.craftlandstudio.com/live/public_stable/web/latest.yml');
      if (cdnRes.ok) {
        const yaml = await cdnRes.text();
        const data = parseYAML(yaml);
        setDownloadData(data);
      }
    } catch {
      // Automatically uses pre-loaded FALLBACK_LATEST_YAML
    }
  }, []);

  // Fetch exe size
  const fetchExeSize = async (filePath: string) => {
    try {
      const res = await fetch(`/api/filesize?path=${encodeURIComponent(filePath)}`);
      if (res.ok) {
        const data = (await res.json()) as { size: number };
        if (typeof data.size === 'number') {
          setExeSize(data.size);
        }
      }
    } catch (err) {
      console.warn('Using fallback for exe size:', err);
    }
  };

  // Fetch releases
  const fetchReleases = useCallback(async () => {
    try {
      const res = await fetch('/api/releases?format=json');
      if (res.ok) {
        const data = (await res.json()) as { releases: ReleaseNote[] };
        if (Array.isArray(data.releases) && data.releases.length > 0) {
          setReleases(data.releases);
        }
      }
    } catch (err) {
      console.warn('Using client fallback for releases:', err);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    await Promise.allSettled([fetchDownload(), fetchReleases()]);
    setIsLoading(false);
  }, [fetchDownload, fetchReleases]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      {/* Top sticky header with branding, landscape YouTube button, and refresh */}
      <Header
        channelUrl={YT_CHANNEL_URL}
        onRefresh={loadAllData}
        isLoading={isLoading}
      />

      {/* Main container */}
      <main className="flex-1 max-w-[960px] w-full mx-auto px-4 py-8 sm:py-10">
        {/* Hero Section with Shizuka Craftland Studio PC Downloader branding and landscape YouTube button */}
        <Hero channelUrl={YT_CHANNEL_URL} />

        {/* Latest Download Card */}
        <DownloadCard data={downloadData} isLoading={isLoading} />

        {/* Package Grid (Setup EXE & 7z Update package) */}
        <PackageGrid data={downloadData} exeSize={exeSize} />

        {/* Full Historical Release Notes with Search & Category Filters */}
        <ReleaseHistory releases={releases} isLoading={isLoading} />
      </main>

      {/* Clean, authentic footer */}
      <footer className="mt-auto py-8 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm text-center text-xs text-slate-500">
        <div className="max-w-[960px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-['Space_Grotesk'] text-sm">
              Shizuka Craftland Studio PC Downloader
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Verified Official Build Feed
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={YT_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold transition-colors"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Subscribe: Gaming With Shizuka</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
