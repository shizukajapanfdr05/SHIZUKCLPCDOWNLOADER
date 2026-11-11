import React from 'react';
import { RefreshCw, Monitor, CheckCircle2 } from 'lucide-react';
import { YouTubeButton } from './YouTubeButton';

interface HeaderProps {
  channelUrl: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  channelUrl,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-slate-200/70 shadow-xs transition-all">
      <div className="max-w-[960px] mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-pink-500 via-amber-400 to-sky-400 flex items-center justify-center text-white shadow-sm font-black text-xs sm:text-sm shrink-0">
            SC
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 text-xs sm:text-base tracking-tight font-['Space_Grotesk'] leading-tight">
                Shizuka Craftland
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                <Monitor className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-600" /> PC
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono hidden md:block">
              Official Desktop Client & Release Notes
            </p>
          </div>
        </div>

        {/* Right Action: Landscape Red YouTube Button + Refresh */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <YouTubeButton channelUrl={channelUrl} size="sm" />

          {/* Refresh Feed Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Refresh latest releases and download package"
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-50 border border-slate-200/70 bg-white shadow-xs shrink-0"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
