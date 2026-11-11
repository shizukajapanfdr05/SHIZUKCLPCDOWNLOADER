import React from 'react';
import { Youtube, ExternalLink } from 'lucide-react';

interface YouTubeButtonProps {
  channelUrl: string;
  size?: 'sm' | 'md';
}

export const YouTubeButton: React.FC<YouTubeButtonProps> = ({
  channelUrl,
  size = 'md',
}) => {
  const isSmall = size === 'sm';

  return (
    <a
      href={channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit Gaming With Shizuka on YouTube"
      className={`group inline-flex items-center gap-2.5 rounded-xl font-bold text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-red-400/40 select-none ${
        isSmall
          ? 'px-3 py-1.5 text-xs'
          : 'px-4 sm:px-5 py-2.5 text-xs sm:text-sm shadow-md hover:shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
      }`}
      style={{
        background: 'linear-gradient(135deg, #ff2e2e 0%, #e60000 45%, #b80000 100%)',
      }}
    >
      {/* Official YouTube Play Icon with crisp container */}
      <span className="flex items-center justify-center rounded-lg bg-white/20 p-1 group-hover:bg-white/30 transition-colors shrink-0">
        <Youtube className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill-current text-white`} />
      </span>

      <span className="flex items-center gap-1.5 whitespace-nowrap tracking-wide">
        <span className={isSmall ? 'hidden xs:inline' : ''}>Gaming With Shizuka</span>
        {isSmall && <span className="xs:hidden">Shizuka</span>}
        {!isSmall && (
          <span className="text-[10px] font-mono opacity-80 font-normal hidden sm:inline">
            (@gamingwithshizuka)
          </span>
        )}
      </span>

      <ExternalLink className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} opacity-75 group-hover:opacity-100 transition-opacity shrink-0`} />
    </a>
  );
};
