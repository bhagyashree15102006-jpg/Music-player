import React, { useState, useEffect } from 'react';

export default function VibeEngineModal({
  isOpen,
  onClose,
  currentTrack,
  onAppendToQueue,
  onPlayTrack,
  activeMode = 'keep',
  onSetVibeMode
}) {
  const [mode, setMode] = useState(activeMode);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async (selectedMode) => {
    setIsLoading(true);
    try {
      const artist = currentTrack?.artist || 'Silk Sonic';
      const title = currentTrack?.title || '';
      const res = await fetch(`/api/recommendations/next?mode=${selectedMode}&artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (err) {
      console.error("Vibe Engine recommendation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations(mode);
    }
  }, [isOpen, currentTrack]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    onSetVibeMode(newMode);
    fetchRecommendations(newMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-[500px] bg-[#c0c0c0] win-bevel-raised p-1 shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <header className="bg-[#0e6f3b] text-white px-2 py-0.5 flex items-center justify-between font-bitmap tracking-wider shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide">
              🎛️ Aura Vibe Engine • Session Recommendations
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

        {/* Current Anchor Track Header */}
        <div className="p-2 bg-[#dfdfdf] border-b border-[#808080] flex items-center justify-between text-xs font-pixel">
          <div className="truncate">
            <span className="text-neutral-600">Current Anchor: </span>
            <span className="font-bold text-black">{currentTrack?.title}</span>
            <span className="text-neutral-700"> by {currentTrack?.artist}</span>
          </div>
          <span className="bg-emerald-100 border border-emerald-500 text-emerald-900 px-1 font-bold text-[10px]">
            SESSION ACTIVE
          </span>
        </div>

        {/* Vibe Mode Selectors (PRD Section 6) */}
        <div className="p-2 flex flex-col gap-1.5">
          <label className="text-xs font-pixel font-bold text-neutral-800">
            Select Next Song Vibe Vector:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs font-pixel">
            <button
              onClick={() => handleModeChange('keep')}
              className={`win-button py-1 text-center font-bold ${
                mode === 'keep' ? 'active bg-[#b0b0b0] text-emerald-900' : 'text-neutral-900'
              }`}
            >
              🎛️ Keep Vibe
            </button>
            <button
              onClick={() => handleModeChange('energetic')}
              className={`win-button py-1 text-center font-bold ${
                mode === 'energetic' ? 'active bg-[#b0b0b0] text-amber-900' : 'text-neutral-900'
              }`}
            >
              ⚡ Energetic
            </button>
            <button
              onClick={() => handleModeChange('chill')}
              className={`win-button py-1 text-center font-bold ${
                mode === 'chill' ? 'active bg-[#b0b0b0] text-blue-900' : 'text-neutral-900'
              }`}
            >
              🍵 Chill
            </button>
            <button
              onClick={() => handleModeChange('surprise')}
              className={`win-button py-1 text-center font-bold ${
                mode === 'surprise' ? 'active bg-[#b0b0b0] text-purple-900' : 'text-neutral-900'
              }`}
            >
              🎲 Surprise Me
            </button>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="flex-1 p-2 overflow-y-auto min-h-[160px] max-h-[300px]">
          <div className="bg-white win-bevel-sunken p-1 h-full min-h-[160px] overflow-y-auto text-xs font-pixel">
            {isLoading ? (
              <div className="p-6 text-center text-neutral-600 font-pixel">
                <div className="inline-block animate-spin text-xl mb-1">🎛️</div>
                <div>Computing acoustic mood vectors and harmonic compatibility...</div>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 font-pixel">
                No next track recommendations found for this vector.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-neutral-100">
                {recommendations.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-1.5 hover:bg-[#e8f0fe] transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={track.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&q=80"}
                        alt={track.title}
                        className="w-8 h-8 object-cover win-bevel-sunken shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-bold text-black truncate">{track.title}</div>
                        <div className="text-[10px] text-neutral-600 truncate">{track.artist}</div>
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1 inline-block mt-0.5">
                          {track.vibeExplanation || "94% vibe match"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          onPlayTrack(track);
                          onClose();
                        }}
                        className="win-button px-2 py-0.5 text-[10px] font-bold text-teal-900"
                        title="Play immediately"
                      >
                        ▶ Play
                      </button>
                      <button
                        onClick={() => onAppendToQueue([track])}
                        className="win-button px-2 py-0.5 text-[10px] text-neutral-800"
                        title="Add to queue"
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

        {/* Actions Footer */}
        <div className="p-1 px-2 flex justify-between items-center text-xs font-pixel border-t border-[#808080]">
          <button
            onClick={() => {
              if (recommendations.length > 0) {
                onAppendToQueue(recommendations);
                onClose();
              }
            }}
            disabled={recommendations.length === 0}
            className="win-button px-3 py-0.5 font-bold text-teal-950 flex items-center gap-1 active:translate-y-px"
          >
            ➕ Append All to Smart Queue
          </button>
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
