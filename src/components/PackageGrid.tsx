import React, { useState } from 'react';
import { Copy, Check, FileDown, Layers, Hash, HardDrive } from 'lucide-react';
import { DownloadData } from '../types';
import { formatBytes } from '../utils/parser';

interface PackageGridProps {
  data: DownloadData | null;
  exeSize: number | null;
}

export const PackageGrid: React.FC<PackageGridProps> = ({ data, exeSize }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const exeFileName = data?.exe?.fileName || 'CraftlandStudio_Web_Setup_1.19.4689915.exe';
  const exeUrl =
    data?.exe?.url ||
    `https://dl-cdn.craftlandstudio.com/live/public_stable/web/1.19.4689915/${exeFileName}`;
  const exeSha =
    data?.exe?.sha512 ||
    'e2p4VJwSmDBO7nsYtcCS5dfsY4s+8iBo5cCnRWrkBbdZ7V4thjqy/GF7ubDDFjkKhLyozE7h0/n3fA7NdYKXRw==';
  const exeDisplaySize = exeSize ? formatBytes(exeSize) : '704.21 KB';

  const pkgFileName = data?.pkg?.fileName || 'FE-1.19.4689915-x64.nsis.7z';
  const pkgUrl =
    data?.pkg?.url ||
    `https://dl-cdn.craftlandstudio.com/live/public_stable/web/1.19.4689915/${pkgFileName}`;
  const pkgSize = data?.pkg?.size ? formatBytes(data.pkg.size) : '2.27 GB';
  const blockMapSize = data?.pkg?.blockMapSize ? formatBytes(data.pkg.blockMapSize) : '2.31 MB';
  const pkgSha =
    data?.pkg?.sha512 ||
    'acjWL4VBjJ2kYsYtjl6sENtue0acnWulz+gEuECggTQcwx0GiYYRrJbsMq+BfuZc+dG/ygSNgvnhAhkzpearCw==';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 text-left">
      {/* Setup Installer Card */}
      <div className="rainbow-glass p-5 sm:p-6 transition-all hover:shadow-md border border-slate-200/80 bg-white/80">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <FileDown className="w-4 h-4" />
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-slate-800 text-base">
              Setup Installer
            </h3>
          </div>
          <span className="badge-rainbow-sky font-mono text-[11px] font-bold px-2 py-0.5 rounded">
            EXE
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
              File
            </div>
            <div className="text-slate-800 font-medium break-all select-all bg-slate-50 p-1.5 rounded border border-slate-100">
              {exeFileName}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
              Size
            </div>
            <div className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
              {exeDisplaySize}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
              <span>SHA-512 Checksum</span>
              <button
                onClick={() => copyToClipboard(exeSha, 'exe')}
                className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-sans normal-case text-xs font-medium cursor-pointer"
              >
                {copiedKey === 'exe' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-[11px] text-slate-600 break-all select-all bg-slate-50 p-2 rounded border border-slate-100 max-h-16 overflow-y-auto font-mono">
              {exeSha}
            </div>
          </div>

          <div className="pt-2">
            <a
              href={exeUrl}
              download
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium font-sans text-xs border border-sky-200 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              Direct Download (.exe)
            </a>
          </div>
        </div>
      </div>

      {/* Update Package Card */}
      <div className="rainbow-glass p-5 sm:p-6 transition-all hover:shadow-md border border-slate-200/80 bg-white/80">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-['Space_Grotesk'] font-bold text-slate-800 text-base">
              Update Package
            </h3>
          </div>
          <span className="badge-rainbow-amber font-mono text-[11px] font-bold px-2 py-0.5 rounded">
            x64 · 7z
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
              File
            </div>
            <div className="text-slate-800 font-medium break-all select-all bg-slate-50 p-1.5 rounded border border-slate-100">
              {pkgFileName}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
                Size
              </div>
              <div className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                {pkgSize}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
                Block Map Size
              </div>
              <div className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
                {blockMapSize}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
              <span>SHA-512 Checksum</span>
              <button
                onClick={() => copyToClipboard(pkgSha, 'pkg')}
                className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-sans normal-case text-xs font-medium cursor-pointer"
              >
                {copiedKey === 'pkg' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-[11px] text-slate-600 break-all select-all bg-slate-50 p-2 rounded border border-slate-100 max-h-16 overflow-y-auto font-mono">
              {pkgSha}
            </div>
          </div>

          <div className="pt-2">
            <a
              href={pkgUrl}
              download
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium font-sans text-xs border border-amber-200 transition-colors"
            >
              <HardDrive className="w-3.5 h-3.5" />
              Direct Download Archive (.7z)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
