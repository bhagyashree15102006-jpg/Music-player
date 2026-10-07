import React from 'react';

export default function PlaylistQueue({
  queue = [],
  currentTrack,
  onSelectTrack,
  onRemoveTrack,
  onOpenVibeEngine,
  vibeMode = 'keep'
}) {
  const formatTime = (ms) => {
    if (!ms) return "03:00";
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <footer className="bg-[#c0c0c0] win-bevel-raised p-1 shadow-lg" data-purpose="playlist-drawer">
      {/* Drawer Header Toolbar */}
      <div className="flex justify-between items-center px-1 pb-1 text-[11px] font-pixel border-b border-[#808080] mb-1">
        <div className="flex items-center gap-1 font-bold">
          <span>SIDE A: NOW PLAYING & QUEUE</span>
        </div>
        <button
          onClick={onOpenVibeEngine}
          className="win-button px-1.5 py-0.2 text-[10px] text-teal-950 font-bold hover:bg-[#dfdfdf]"
          title="Open Vibe Engine to generate next tracks"
        >
          ⚡ Smart Next ({vibeMode})
        </button>
      </div>

      {/* Sunken File / Tracklist Browser */}
      <div className="bg-white win-bevel-sunken p-1 max-h-28 overflow-y-auto text-xs font-pixel leading-tight">
        {queue.length === 0 ? (
          <div className="p-2 text-neutral-500 text-center">No tracks in queue. Search to add songs!</div>
        ) : (
          queue.map((track, idx) => {
            const isCurrent = currentTrack && currentTrack.id === track.id;
            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => onSelectTrack(track)}
                className={`flex justify-between items-center px-1 py-0.5 select-none transition-colors ${
                  isCurrent
                    ? 'bg-[#000080] text-white font-bold'
                    : 'hover:bg-neutral-200 text-neutral-900 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-1 truncate pr-2">
                  <span className="w-4 shrink-0 text-right opacity-80">{idx + 1}.</span>
                  <span className="truncate">
                    {track.artist} - {track.title}
                  </span>
                  {track.vibeExplanation && (
                    <span className={`text-[9px] px-1 ml-1 rounded-none border ${
                      isCurrent 
                        ? 'bg-blue-900 border-blue-400 text-emerald-200' 
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    }`}>
                      {track.vibeExplanation}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span>{formatTime(track.durationMs)}</span>
                  {queue.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTrack(idx);
                      }}
                      className={`text-[9px] px-1 hover:text-red-500 ${isCurrent ? 'text-white' : 'text-neutral-500'}`}
                      title="Remove from queue"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Status bar at window bottom */}
      <div className="flex justify-between items-center px-1 pt-1 text-[10px] font-pixel text-neutral-700">
        <span>{queue.length} TRACK{queue.length === 1 ? '' : 'S'} IN QUEUE</span>
        <span className="tracking-widest uppercase">STEREO 16-BIT • ANALOG DSP</span>
      </div>
    </footer>
  );
}
