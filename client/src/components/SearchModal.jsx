import React, { useState, useEffect, useRef } from 'react';

export default function SearchModal({ 
  isOpen, 
  onClose, 
  onPlayTrack, 
  onAddToQueue,
  initialQuery = '' 
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura_bollywood_recent_searches') || '[]');
    } catch {
      return ['Arijit Singh', 'Tum Hi Ho', 'Chaiyya Chaiyya', 'Kishore Kumar', 'Kesariya', 'Shreya Ghoshal'];
    }
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (initialQuery) {
        setQuery(initialQuery);
        performSearch(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  // Debounced auto-suggest while typing (Bollywood-scoped)
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error("Auto-suggest error:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchTerm) => {
    const q = searchTerm || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setSuggestions([]);

    // Save to recent Bollywood searches
    const updatedRecents = [q, ...recentSearches.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, 8);
    setRecentSearches(updatedRecents);
    localStorage.setItem('aura_bollywood_recent_searches', JSON.stringify(updatedRecents));

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=15`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.tracks || []);
      }
    } catch (err) {
      console.error("Bollywood search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-[520px] bg-[#c0c0c0] win-bevel-raised p-1 shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <header className="bg-[#0e6f3b] text-white px-2 py-0.5 flex items-center justify-between font-bitmap tracking-wider shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide">
              🔍 Auto-Suggest++ Bollywood Music Catalog Search
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] win-button text-black flex items-center justify-center text-[10px] font-bold leading-none"
            type="button"
          >
            ×
          </button>
        </header>

        {/* Search Controls Toolbar */}
        <div className="p-2 flex flex-col gap-2">
          <div className="flex gap-1.5 items-center">
            <div className="flex-1 bg-white win-bevel-sunken relative flex items-center h-7 px-1.5">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Hindi / Bollywood songs, singers (e.g. Arijit, Kishore, Chaiyya)..."
                className="w-full bg-transparent border-none text-black text-xs font-pixel outline-none"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setSuggestions([]); }}
                  className="text-xs text-neutral-500 hover:text-black font-bold px-1"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={() => performSearch(query)}
              disabled={isLoading}
              className="win-button px-3 h-7 text-xs font-pixel font-bold flex items-center gap-1 active:translate-y-px"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Instant Auto-Suggest Dropdown */}
          {suggestions.length > 0 && (
            <div className="bg-white win-bevel-sunken p-1 max-h-36 overflow-y-auto text-xs font-pixel shadow-md border border-neutral-400">
              <div className="text-[10px] text-neutral-500 px-1 font-bold border-b border-neutral-200 pb-0.5">
                BOLLYWOOD AUTO-SUGGESTIONS
              </div>
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setQuery(`${item.artist} - ${item.title}`);
                    onPlayTrack(item);
                    onClose();
                  }}
                  className="flex items-center justify-between px-1.5 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px] opacity-70">🎵</span>
                    <span className="font-bold">{item.title}</span>
                    <span className="text-neutral-500 hover:text-neutral-300 truncate">by {item.artist}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 border border-emerald-300">
                    Play
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Recent Searches Pills */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-[11px] font-pixel text-neutral-700">
              <span className="font-bold">Recent:</span>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(term);
                    performSearch(term);
                  }}
                  className="bg-[#dfdfdf] win-sunken-shallow px-1.5 py-0.5 hover:bg-neutral-200 cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results List */}
        <div className="flex-1 p-2 overflow-y-auto min-h-[160px] max-h-[340px]">
          <div className="bg-white win-bevel-sunken p-1 h-full min-h-[160px] overflow-y-auto text-xs font-pixel">
            {isLoading ? (
              <div className="p-6 text-center text-neutral-600 font-pixel">
                <div className="inline-block animate-spin text-xl mb-1">💿</div>
                <div>Searching Bollywood catalog & resolving audio streams...</div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center text-neutral-500 font-pixel">
                Type any Bollywood song, movie, or artist title above and press Search.
                <div className="text-[10px] text-neutral-400 mt-1">Exclusive Bollywood Catalog Mode Active.</div>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-neutral-100">
                {results.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-1 hover:bg-[#e8f0fe] transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={track.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&q=80"}
                        alt={track.title}
                        className="w-7 h-7 object-cover win-bevel-sunken shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-bold text-black truncate">{track.title}</div>
                        <div className="text-[10px] text-neutral-600 truncate">
                          {track.artist} {track.album ? `• ${track.album}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          onPlayTrack(track);
                          onClose();
                        }}
                        className="win-button px-2 py-0.5 text-[10px] font-bold text-teal-900 active:translate-y-px"
                        title="Play immediately"
                      >
                        ▶ Play
                      </button>
                      <button
                        onClick={() => onAddToQueue(track)}
                        className="win-button px-2 py-0.5 text-[10px] text-neutral-800 active:translate-y-px"
                        title="Add to Smart Queue"
                      >
                        + Queue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-1 px-2 flex justify-between items-center text-[10px] font-pixel text-neutral-600 border-t border-[#808080]">
          <span>{results.length} BOLLYWOOD TRACKS FOUND</span>
          <button
            onClick={onClose}
            className="win-button px-3 py-0.5 text-black font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
