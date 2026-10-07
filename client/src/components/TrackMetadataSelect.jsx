import React from 'react';

export default function TrackMetadataSelect({ 
  currentTrack, 
  queue, 
  onSelectTrack,
  onOpenSearch 
}) {
  return (
    <div className="flex flex-col gap-1.5 pt-1" data-purpose="track-metadata-inputs">
      {/* Artist Selector */}
      <div className="flex items-center gap-1.5">
        <label 
          className="text-xs font-pixel text-neutral-800 w-11 shrink-0 font-bold select-none cursor-pointer" 
          htmlFor="artist-select"
          onClick={onOpenSearch}
          title="Click to search catalog"
        >
          Artist:
        </label>
        <div className="flex-1 bg-white win-bevel-sunken relative flex items-center h-6">
          <select
            className="w-full h-full bg-transparent border-0 text-black text-sm font-pixel pl-1.5 pr-6 py-0 appearance-none focus:outline-none focus:ring-0 leading-tight cursor-pointer"
            id="artist-select"
            value={currentTrack?.artist || ''}
            onChange={(e) => {
              const selectedArtist = e.target.value;
              const found = queue.find(t => t.artist === selectedArtist);
              if (found) onSelectTrack(found);
              else onOpenSearch(selectedArtist);
            }}
          >
            {/* List unique artists in queue */}
            {Array.from(new Set([currentTrack?.artist, ...queue.map(t => t.artist)])).filter(Boolean).map((artist, idx) => (
              <option key={idx} value={artist}>
                {artist}
              </option>
            ))}
          </select>
          {/* Retro 3D Dropdown Arrow Button */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#c0c0c0] win-button flex items-center justify-center pointer-events-none">
            <span className="text-[8px] text-black">▼</span>
          </div>
        </div>
      </div>

      {/* Title Selector */}
      <div className="flex items-center gap-1.5">
        <label 
          className="text-xs font-pixel text-neutral-800 w-11 shrink-0 font-bold select-none cursor-pointer" 
          htmlFor="title-select"
          onClick={onOpenSearch}
          title="Click to search catalog"
        >
          Title:
        </label>
        <div className="flex-1 bg-white win-bevel-sunken relative flex items-center h-6">
          <select
            className="w-full h-full bg-transparent border-0 text-black text-sm font-pixel pl-1.5 pr-6 py-0 appearance-none focus:outline-none focus:ring-0 leading-tight cursor-pointer"
            id="title-select"
            value={currentTrack?.id || ''}
            onChange={(e) => {
              const found = queue.find(t => t.id === e.target.value);
              if (found) onSelectTrack(found);
            }}
          >
            {/* List tracks currently in queue */}
            {queue.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          {/* Retro 3D Dropdown Arrow Button */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#c0c0c0] win-button flex items-center justify-center pointer-events-none">
            <span className="text-[8px] text-black">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}
