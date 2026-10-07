import React, { useRef } from 'react';

export default function SeekBar({ currentTime, duration, onSeek }) {
  const progressBarRef = useRef(null);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleSeekClick = (e) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(newFraction * duration);
  };

  return (
    <div className="flex items-center gap-2 pt-0.5" data-purpose="playback-progress-bar">
      <span className="text-xs font-pixel font-bold text-neutral-800 w-8 text-left shrink-0 select-none">
        {formatTime(currentTime)}
      </span>

      {/* Sunken Slider Track with Raised Metallic Thumb Slider */}
      <div
        ref={progressBarRef}
        className="relative flex-1 h-5 bg-[#808080] win-bevel-sunken p-[1px] flex items-center cursor-pointer select-none"
        onClick={handleSeekClick}
        title="Click or drag to seek"
      >
        {/* Filled Progress Area */}
        <div
          className="h-full bg-[#505050] relative transition-all duration-75"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Raised Slider Thumb */}
        <div
          className="w-3.5 h-full bg-[#c0c0c0] win-button -ml-1 cursor-grab shadow-sm shrink-0"
          style={{
            position: 'absolute',
            left: `calc(${progressPercent}% - 6px)`
          }}
        />
      </div>

      <span className="text-xs font-pixel font-bold text-neutral-800 w-8 text-right shrink-0 select-none">
        {formatTime(duration || 180)}
      </span>
    </div>
  );
}
