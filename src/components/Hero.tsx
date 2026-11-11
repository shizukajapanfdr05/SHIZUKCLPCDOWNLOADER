import React from 'react';
import { Sparkles, Globe, ShieldCheck, Monitor, Flame } from 'lucide-react';
import { YouTubeButton } from './YouTubeButton';

interface HeroProps {
  channelUrl: string;
}

export const Hero: React.FC<HeroProps> = ({ channelUrl }) => {
  return (
    <div className="mb-8 text-left">
      {/* Top row with Eyebrow and Landscape YouTube button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 via-purple-100 to-sky-100 border border-purple-200/70 text-xs font-mono font-semibold text-purple-900 shadow-xs w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-wide uppercase text-[11px]">Official Live Build Feed</span>
          <span className="text-purple-300">|</span>
          <span className="text-[11px] text-purple-700 font-mono">Windows x64</span>
        </div>

        {/* Small Landscape Red Gradient YouTube Button */}
        <div className="w-fit">
          <YouTubeButton channelUrl={channelUrl} size="md" />
        </div>
      </div>

      {/* Main Title: Shizuka Craftland Studio PC Downloader */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-['Space_Grotesk'] mb-3">
        Shizuka Craftland Studio <span className="rainbow-text">PC Downloader</span>
      </h1>

      {/* Clean, professional subtitle */}
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mb-5 font-normal">
        Desktop build releases and update packages for the Craftland map editor, delivered straight from the official high-speed distribution network. Always stable, verified, and ready to install.
      </p>

      {/* Clean Feature Badges (no clone or anti-ban text) */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/80 border border-slate-200/80 shadow-xs">
          <Globe className="w-3.5 h-3.5 text-sky-500" />
          <span>Direct Garena CDN</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/80 border border-slate-200/80 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>SHA-512 Hash Verified</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/80 border border-slate-200/80 shadow-xs">
          <Monitor className="w-3.5 h-3.5 text-purple-500" />
          <span>Windows 10 / 11 (64-bit)</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/80 border border-slate-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Light Rainbow Theme</span>
        </div>
      </div>
    </div>
  );
};
