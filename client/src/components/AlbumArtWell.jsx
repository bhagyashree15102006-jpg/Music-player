import React from 'react';

export default function AlbumArtWell({ currentTrack, onCoverClick }) {
  const fallbackCover = "https://lh3.googleusercontent.com/aida-public/AB6AXuCmeNpqcgf-EouH2taKeQyPiGSBSO-2w7wnOEgJpuQPKqFpnYqrnzZpVbMtSfbGF--olegTFXVml27cgpbSsSuJhIpXa_6xFgPFJHYu2rfrAXndrJnouZ-UNQXHBDVDorkrZbIP3s7TCuUrxmT3_wp9Vtw_nP8YH440ZGpckn9lIeVv3X3-0ScX6YvZ-7KHJGzJoQ_MVZHLQ0r3RcEAeoynOdRhEMmV8rxN1mKQ1NeX9uMOUP26QK-3";

  return (
    <div 
      className="w-[155px] h-[155px] sm:w-[165px] sm:h-[165px] shrink-0 bg-neutral-900 win-bevel-sunken p-1 flex items-center justify-center overflow-hidden relative group cursor-pointer"
      data-purpose="album-art-container"
      onClick={onCoverClick}
      title="Click for track & album details"
    >
      <img
        alt={`${currentTrack?.title || 'Track'} Album Art`}
        className="w-full h-full object-cover select-none pointer-events-none transition-transform group-hover:scale-105 duration-200"
        id="album-art-img"
        src={currentTrack?.coverUrl || fallbackCover}
        onError={(e) => {
          e.target.src = fallbackCover;
        }}
      />
      
      {/* Vinyl reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/20 pointer-events-none" />
      
      {/* Play status badge overlay */}
      {currentTrack?.audioUrl ? (
        <div className="absolute bottom-1 right-1 bg-black/80 text-emerald-400 font-pixel text-[9px] px-1 border border-emerald-500/50">
          PREVIEW READY
        </div>
      ) : (
        <div className="absolute bottom-1 right-1 bg-black/80 text-amber-400 font-pixel text-[9px] px-1 border border-amber-500/50">
          CATALOG ONLY
        </div>
      )}
    </div>
  );
}
