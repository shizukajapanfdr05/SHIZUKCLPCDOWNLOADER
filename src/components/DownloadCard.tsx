import React from 'react';
import { Download, Calendar, ShieldCheck, CheckCircle2, ArrowDownToLine, Sparkles } from 'lucide-react';
import { DownloadData } from '../types';
import { formatDate } from '../utils/parser';

interface DownloadCardProps {
  data: DownloadData | null;
  isLoading: boolean;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({ data, isLoading }) => {
  const version = data?.version || (isLoading ? 'Checking…' : '1.19.4689915');
  const releaseDate = data?.releaseDate ? formatDate(data.releaseDate) : 'Oct 22, 2026, 04:02 AM';
  const downloadUrl =
    data?.exe?.url ||
    'https://dl-cdn.craftlandstudio.com/live/public_stable/web/1.19.4689915/CraftlandStudio_Web_Setup_1.19.4689915.exe';

  return (
    <div className="rainbow-glass rainbow-glass-glow p-6 sm:p-8 mb-8 text-left transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-500">
              Latest Build
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stable Windows x64
            </span>
          </div>

          {/* Big Version Stamp with Rainbow Gradient */}
          <div className="text-4xl sm:text-5xl md:text-6xl font-black font-['Space_Grotesk'] tracking-tight mb-2">
            <span className="rainbow-text">{version}</span>
          </div>

          {/* Date stamp */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{releaseDate}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Official Garena Build
            </span>
          </div>
        </div>

        {/* Big Action Download Button */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5">
          <a
            href={downloadUrl}
            download
            className="rainbow-btn inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold tracking-wide text-white transition-all transform active:scale-95 text-center shadow-lg"
          >
            <ArrowDownToLine className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span>Download for Windows</span>
          </a>

          <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Direct CDN binary · Safe & Untouched</span>
          </div>
        </div>
      </div>
    </div>
  );
};
