import React from 'react';

export default function TransportButtons({
  isPlaying,
  isShuffle,
  repeatMode, // 'off' | 'all' | 'one'
  isLiked,
  onPlayPause,
  onShuffleToggle,
  onRepeatToggle,
  onPrev,
  onRewind,
  onFastForward,
  onNext,
  onLikeToggle
}) {
  return (
    <div className="flex flex-col gap-1 mt-1" data-purpose="transport-buttons">
      {/* Top Row: Pause/Play, Shuffle, Repeat */}
      <div className="grid grid-cols-3 gap-1">
        {/* Pause / Play */}
        <button
          className="h-6 win-button flex items-center justify-center text-xs font-bold text-neutral-900"
          id="btn-play-pause"
          onClick={onPlayPause}
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          type="button"
        >
          {isPlaying ? (
            <span className="font-mono text-sm tracking-tighter">❚❚</span>
          ) : (
            <span className="font-sans text-xs">▶</span>
          )}
        </button>

        {/* Shuffle */}
        <button
          className={`h-6 win-button flex items-center justify-center text-xs ${
            isShuffle ? 'active font-bold text-teal-800' : 'text-neutral-800'
          }`}
          onClick={onShuffleToggle}
          title={`Shuffle: ${isShuffle ? 'ON' : 'OFF'}`}
          type="button"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" x2="21" y1="20" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" x2="21" y1="15" y2="21" />
            <line x1="4" x2="9" y1="4" y2="9" />
          </svg>
        </button>

        {/* Repeat */}
        <button
          className={`h-6 win-button flex items-center justify-center text-xs ${
            repeatMode !== 'off' ? 'active font-bold text-teal-800' : 'text-neutral-800'
          }`}
          onClick={onRepeatToggle}
          title={`Repeat: ${repeatMode.toUpperCase()}`}
          type="button"
        >
          <div className="relative flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <polyline points="3 3 3 8 8 8" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <polyline points="16 21 21 21 21 16" />
            </svg>
            {repeatMode === 'one' && (
              <span className="absolute text-[8px] font-bold text-teal-900 -bottom-1">1</span>
            )}
          </div>
        </button>
      </div>

      {/* Bottom Row: Prev, Rewind, Fast Forward, Next, Favorite Heart */}
      <div className="grid grid-cols-5 gap-1">
        {/* Prev Track */}
        <button
          className="h-6 win-button flex items-center justify-center text-[11px] font-bold"
          onClick={onPrev}
          title="Previous Track"
          type="button"
        >
          |◄
        </button>

        {/* Rewind 10s */}
        <button
          className="h-6 win-button flex items-center justify-center text-[10px] font-bold"
          onClick={onRewind}
          title="Rewind 10s"
          type="button"
        >
          ◄◄
        </button>

        {/* Fast-Forward 10s */}
        <button
          className="h-6 win-button flex items-center justify-center text-[10px] font-bold"
          onClick={onFastForward}
          title="Fast Forward 10s"
          type="button"
        >
          ►►
        </button>

        {/* Next Track */}
        <button
          className="h-6 win-button flex items-center justify-center text-[11px] font-bold"
          onClick={onNext}
          title="Next Track"
          type="button"
        >
          ►|
        </button>

        {/* Heart / Favorite */}
        <button
          className={`h-6 win-button flex items-center justify-center text-xs active:text-rose-900 ${
            isLiked ? 'text-rose-600 font-bold active' : 'text-neutral-500'
          }`}
          onClick={onLikeToggle}
          title={isLiked ? "Saved in Local Mixtape" : "Like Song"}
          type="button"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
