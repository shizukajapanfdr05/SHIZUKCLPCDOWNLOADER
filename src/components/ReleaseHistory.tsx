import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, History, Sparkles, Filter, Tag } from 'lucide-react';
import { ReleaseNote } from '../types';

interface ReleaseHistoryProps {
  releases: ReleaseNote[];
  isLoading: boolean;
}

export const ReleaseHistory: React.FC<ReleaseHistoryProps> = ({ releases, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({
    // Expand top 2 releases by default
    '1.19.4646566': true,
    '1.17.4368367': true,
  });

  const toggleExpand = (version: string) => {
    setExpandedVersions((prev) => ({
      ...prev,
      [version]: !prev[version],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    releases.forEach((r) => {
      next[r.version] = true;
    });
    setExpandedVersions(next);
  };

  const collapseAll = () => {
    setExpandedVersions({});
  };

  // Filter releases by search query and tags
  const filteredReleases = useMemo(() => {
    return releases.filter((rel) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rel.version.toLowerCase().includes(q) ||
        rel.showVersion.toLowerCase().includes(q) ||
        rel.date.toLowerCase().includes(q) ||
        rel.rawContent.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedTag === 'All') return true;
      if (selectedTag === 'AI') return rel.rawContent.toLowerCase().includes('ai');
      if (selectedTag === 'Animation') return rel.rawContent.toLowerCase().includes('animation');
      if (selectedTag === 'Script') return rel.rawContent.toLowerCase().includes('script');
      if (selectedTag === 'UI') return rel.rawContent.toLowerCase().includes('ui');
      if (selectedTag === 'Physics') return rel.rawContent.toLowerCase().includes('physics');

      return true;
    });
  }, [releases, searchQuery, selectedTag]);

  return (
    <div className="text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-600" />
          <h2 className="font-['Space_Grotesk'] text-sm sm:text-base font-bold uppercase tracking-wider text-slate-700">
            Release History ({filteredReleases.length})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors font-medium"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors font-medium"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rainbow-glass p-3 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white/70">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search releases (e.g., 1.19, AI Smith, Camera, Script, Joystick)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-slate-800 placeholder-slate-400 font-sans"
          />
        </div>

        {/* Quick Filter Tag Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {['All', 'AI', 'Animation', 'Script', 'UI', 'Physics'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Releases List */}
      {isLoading && releases.length === 0 ? (
        <div className="rainbow-glass p-12 text-center text-slate-500 font-mono text-sm bg-white/60">
          Loading release notes...
        </div>
      ) : filteredReleases.length === 0 ? (
        <div className="rainbow-glass p-12 text-center text-slate-500 bg-white/60">
          <p className="text-sm font-medium mb-1">No release notes found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('All');
            }}
            className="text-xs text-purple-600 font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReleases.map((rel, idx) => {
            const isExpanded = expandedVersions[rel.version] ?? (idx === 0);
            return (
              <div
                key={rel.version}
                className="rainbow-glass p-5 sm:p-6 transition-all duration-200 hover:shadow-md bg-white/85 border border-slate-200/80"
              >
                {/* Release Card Header */}
                <div
                  onClick={() => toggleExpand(rel.version)}
                  className="flex items-center justify-between cursor-pointer select-none group pb-1"
                >
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span className="font-['Space_Grotesk'] font-bold text-lg sm:text-xl text-slate-900 group-hover:text-purple-600 transition-colors">
                      {rel.version}
                    </span>
                    {rel.showVersion && (
                      <span className="badge-rainbow-purple font-mono text-xs font-bold px-2 py-0.5 rounded">
                        {rel.showVersion}
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-500">
                      {rel.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'View changelog'}
                    </span>
                    <button
                      type="button"
                      aria-label={isExpanded ? `Collapse changelog for ${rel.version}` : `Expand changelog for ${rel.version}`}
                      className="p-1 rounded-md text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Release Card Body */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-sm text-slate-700 leading-relaxed">
                    {rel.sections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        {section.title && (
                          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50/70 inline-block px-2 py-0.5 rounded border border-purple-100">
                            {section.title}
                          </h3>
                        )}

                        {section.items && section.items.length > 0 ? (
                          <ol className="list-decimal list-outside pl-5 space-y-1.5 text-slate-700 marker:text-purple-400 marker:font-mono text-xs sm:text-sm">
                            {section.items.map((item, iIdx) => (
                              <li key={iIdx} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ol>
                        ) : section.body ? (
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line pl-1">
                            {section.body}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
