import React from 'react';

export default function TitleBar({ 
  title = "Song", 
  onSearchClick, 
  onVibeClick, 
  onMixtapeClick,
  onMinimize,
  onMaximize,
  isMaximized 
}) {
  return (
    <div className="flex flex-col">
      {/* Green authentic OS window header matching reference 'Song' style */}
      <header 
        className="bg-[#0e6f3b] text-white px-2 py-0.5 flex items-center justify-between font-bitmap tracking-wider shadow-inner" 
        data-purpose="window-title-bar"
      >
        <div className="flex items-center gap-1.5">
          {/* Pixel Disc Mini-Icon */}
          <svg className="w-3.5 h-3.5 fill-current text-emerald-200" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="none" r="7" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="8" fill="currentColor" r="2" />
          </svg>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">{title}</span>
        </div>
        {/* Classic Windows 95 title buttons: [ _ ] [ □ ] [ X ] */}
        <div className="flex items-center gap-1">
          <button 
            aria-label="Minimize" 
            onClick={onMinimize}
            className="w-4 h-4 bg-[#c0c0c0] win-button text-black flex items-center justify-center text-[9px] font-bold pb-1 leading-none" 
            type="button"
          >
            _
          </button>
          <button 
            aria-label="Maximize" 
            onClick={onMaximize}
            className="w-4 h-4 bg-[#c0c0c0] win-button text-black flex items-center justify-center text-[8px] font-bold leading-none" 
            type="button"
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button 
            aria-label="Close" 
            onClick={onMinimize}
            className="w-4 h-4 bg-[#c0c0c0] win-button text-black flex items-center justify-center text-[10px] font-bold leading-none" 
            type="button"
          >
            ×
          </button>
        </div>
      </header>

      {/* Windows 95 System Menu Bar */}
      <nav className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-0.5 flex items-center gap-3 text-xs font-pixel text-black select-none">
        <button 
          onClick={onSearchClick} 
          className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer underline-offset-2 hover:underline"
        >
          🔍 <u>F</u>ind Music...
        </button>
        <button 
          onClick={onVibeClick} 
          className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer hover:underline"
        >
          🎛️ <u>V</u>ibe Engine
        </button>
        <button 
          onClick={onMixtapeClick} 
          className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer hover:underline"
        >
          📼 <u>M</u>ixtapes / Favs
        </button>
      </nav>
    </div>
  );
}
