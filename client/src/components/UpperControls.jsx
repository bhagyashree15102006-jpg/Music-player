import React from 'react';

export default function UpperControls({ 
  isPlaying, 
  volume, 
  onVolumeUp, 
  onVolumeDown,
  vuLevel = 8
}) {
  // Volume scale from 0 to 11
  // Calculate how many LED segments are lit (0 to 11)
  const activeSegments = isPlaying ? Math.min(11, Math.max(1, Math.round(vuLevel * (volume / 100)))) : 0;

  return (
    <div className="flex-1 flex flex-col justify-between" data-purpose="upper-controls">
      {/* Sub-row: CD Icon, Tape Player Icon, and Volume Slider with +/- */}
      <div className="flex justify-between items-start gap-1">
        {/* Left Stack: Spun CD Icon & Cassette/Mini-Disc Deck */}
        <div className="flex flex-col items-center justify-around h-full py-1 gap-2">
          {/* Iridescent 90s CD Graphic */}
          <div
            className={`relative w-11 h-11 rounded-full border border-neutral-600 bg-gradient-to-tr from-amber-100 via-sky-200 to-rose-200 flex items-center justify-center shadow-sm ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            }`}
            title="Compact Disc Audio"
          >
            <div className="w-5 h-5 rounded-full border border-neutral-500 bg-neutral-300 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c0c0c0] border border-neutral-600" />
            </div>
            {/* CD sheen highlights */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none" />
          </div>

          {/* 90s Mini Hi-Fi Tape/MD Component Graphic */}
          <div className="w-14 h-7 bg-[#d4d4d4] win-bevel-raised p-0.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between px-0.5 pt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full bg-red-600 shadow-inner inline-block ${
                  isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
              />
              <span className="text-[6px] font-mono text-neutral-600 font-bold uppercase tracking-tighter">
                {isPlaying ? 'TAPE-ON' : 'STOP'}
              </span>
            </div>
            {/* Eject Slot */}
            <div className="w-full h-2 bg-neutral-900 border border-neutral-600 rounded-[1px] flex items-center justify-center">
              <div className="w-3/4 h-[1px] bg-neutral-400" />
            </div>
            <div className="flex justify-end gap-0.5 pb-0.5 pr-0.5">
              <div className="w-1 h-1 bg-neutral-500" />
              <div className="w-1 h-1 bg-neutral-500" />
            </div>
          </div>
        </div>

        {/* Right Stack: Classic Retro Vertical Volume Control (Plus/Minus & VU bar) */}
        <div className="flex items-center gap-1 bg-[#c0c0c0]" data-purpose="volume-stepper-cluster">
          {/* Beveled Stepper Buttons [+] and [-] */}
          <div className="flex flex-col gap-1">
            <button
              className="w-7 h-6 win-button flex items-center justify-center text-sm font-bold text-neutral-900 active:translate-y-px"
              id="btn-vol-up"
              onClick={onVolumeUp}
              title={`Volume Up (${volume}%)`}
              type="button"
            >
              +
            </button>
            <button
              className="w-7 h-6 win-button flex items-center justify-center text-base font-bold text-neutral-900 active:translate-y-px"
              id="btn-vol-down"
              onClick={onVolumeDown}
              title={`Volume Down (${volume}%)`}
              type="button"
            >
              −
            </button>
          </div>

          {/* Vertical Segmented LED Level Meter / Sunken Well (11 segments) */}
          <div
            className="w-2.5 h-[58px] bg-black win-bevel-sunken flex flex-col justify-end p-[1px] gap-[1px]"
            title={`Output Level: ${volume}%`}
          >
            {Array.from({ length: 11 })
              .map((_, i) => 11 - 1 - i) // reversed so top is 10, bottom is 0
              .map((segIndex) => {
                const isLit = segIndex < activeSegments;
                // Top 2 segments are red, next 2 are amber, rest are emerald green
                let litColor = "bg-emerald-400 shadow-[0_0_2px_#34d399]";
                if (segIndex >= 9) litColor = "bg-rose-500 shadow-[0_0_2px_#f43f5e]";
                else if (segIndex >= 7) litColor = "bg-amber-400 shadow-[0_0_2px_#fbbf24]";

                return (
                  <span
                    key={segIndex}
                    className={`h-1 w-full block transition-colors duration-75 ${
                      isLit ? litColor : 'bg-neutral-800'
                    }`}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
