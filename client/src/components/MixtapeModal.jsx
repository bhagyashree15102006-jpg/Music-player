import React, { useState } from 'react';

export default function MixtapeModal({
  isOpen,
  onClose,
  likedTracks = [],
  mixtapes = [],
  onCreateMixtape,
  onLoadMixtape,
  onPlayTrack
}) {
  const [activeTab, setActiveTab] = useState('liked'); // 'liked' | 'mixtapes'
  const [newMixtapeName, setNewMixtapeName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newMixtapeName.trim()) return;
    onCreateMixtape(newMixtapeName.trim());
    setNewMixtapeName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-[480px] bg-[#c0c0c0] win-bevel-raised p-1 shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <header className="bg-[#0e6f3b] text-white px-2 py-0.5 flex items-center justify-between font-bitmap tracking-wider shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide">
              📼 Local Analog Collection • No Account Required
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

        {/* Tab Strip */}
        <div className="flex gap-1 border-b border-neutral-600 px-2 pt-1 text-xs font-pixel">
          <button
            onClick={() => setActiveTab('liked')}
            className={`px-2 py-0.5 ${
              activeTab === 'liked' ? 'win-tab-active font-bold text-black' : 'win-tab-inactive text-neutral-700'
            }`}
          >
            ♥ Liked Songs ({likedTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('mixtapes')}
            className={`px-2 py-0.5 ${
              activeTab === 'mixtapes' ? 'win-tab-active font-bold text-black' : 'win-tab-inactive text-neutral-700'
            }`}
          >
            📼 My Cassette Mixtapes ({mixtapes.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-2 overflow-y-auto min-h-[180px] max-h-[320px]">
          {activeTab === 'liked' ? (
            <div className="bg-white win-bevel-sunken p-1 h-full min-h-[180px] overflow-y-auto text-xs font-pixel">
              {likedTracks.length === 0 ? (
                <div className="p-6 text-center text-neutral-500">
                  No liked tracks yet! Click the ♥ heart button on the player while listening to save tracks to your local mixtape.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-neutral-100">
                  {likedTracks.map((track, i) => (
                    <div
                      key={`${track.id}-${i}`}
                      className="flex items-center justify-between p-1 hover:bg-[#e8f0fe] cursor-pointer"
                      onClick={() => {
                        onPlayTrack(track);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-rose-600 font-bold">♥</span>
                        <span className="font-bold text-black truncate">{track.title}</span>
                        <span className="text-neutral-500 truncate">- {track.artist}</span>
                      </div>
                      <span className="win-button px-1.5 py-0.2 text-[10px] font-bold text-teal-900">
                        ▶ Play
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2 h-full">
              {/* Create Mixtape form */}
              <form onSubmit={handleCreate} className="flex gap-1.5 items-center">
                <div className="flex-1 bg-white win-bevel-sunken h-6 px-1.5 flex items-center">
                  <input
                    type="text"
                    value={newMixtapeName}
                    onChange={(e) => setNewMixtapeName(e.target.value)}
                    placeholder="New Mixtape Title (e.g. 90s Soul Jam)..."
                    className="w-full bg-transparent border-none text-black text-xs font-pixel outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="win-button px-2 h-6 text-xs font-pixel font-bold active:translate-y-px"
                >
                  + Create Tape
                </button>
              </form>

              {/* Mixtape list */}
              <div className="bg-white win-bevel-sunken p-1 flex-1 min-h-[140px] overflow-y-auto text-xs font-pixel">
                {mixtapes.length === 0 ? (
                  <div className="p-4 text-center text-neutral-500">
                    No mixtapes created yet. Enter a name above to create your first analog tape!
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-neutral-100">
                    {mixtapes.map((tape, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-1.5 hover:bg-[#e8f0fe]"
                      >
                        <div>
                          <div className="font-bold text-black">📼 {tape.name}</div>
                          <div className="text-[10px] text-neutral-500">
                            {tape.tracks ? tape.tracks.length : 0} tracks recorded
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onLoadMixtape(tape);
                            onClose();
                          }}
                          className="win-button px-2 py-0.5 text-[10px] font-bold text-teal-900"
                        >
                          ▶ Load Tape
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-1 px-2 flex justify-between items-center text-[10px] font-pixel text-neutral-600 border-t border-[#808080]">
          <span>STORED BROWSER-LOCAL • NO TRACKING</span>
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
