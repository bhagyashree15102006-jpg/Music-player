import React, { useState, useEffect, useRef, useCallback } from 'react';
import AtmosphericBackground from './components/AtmosphericBackground';
import TitleBar from './components/TitleBar';
import AlbumArtWell from './components/AlbumArtWell';
import UpperControls from './components/UpperControls';
import TransportButtons from './components/TransportButtons';
import TrackMetadataSelect from './components/TrackMetadataSelect';
import SeekBar from './components/SeekBar';
import EqualizerRack from './components/EqualizerRack';
import PlaylistQueue from './components/PlaylistQueue';
import SearchModal from './components/SearchModal';
import VibeEngineModal from './components/VibeEngineModal';
import MixtapeModal from './components/MixtapeModal';

const BOLLYWOOD_INITIAL_TRACKS = [
  {
    id: "1130322151",
    title: "Chaiyya Chaiyya",
    artist: "Sukhwinder Singh & Sapna Awasthi",
    album: "Dil Se (Original Motion Picture Soundtrack)",
    durationMs: 406849,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8e/f8/85/8ef88544-a6c7-018b-0a75-dc3b6b024fa0/cover.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/81/6c/e7/816ce721-3a37-0e57-3aa7-c3e180c4b38c/mzaf_10595670915474775723.plus.aac.p.m4a"
  },
  {
    id: "1073359419",
    title: "Tum Hi Ho",
    artist: "Arijit Singh & Mithoon",
    album: "Aashiqui 2 (Original Motion Picture Soundtrack)",
    durationMs: 261974,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3a/8c/9b/3a8c9b0b-2def-750a-f615-1555bf941edf/mzaf_17229496441442805917.plus.aac.p.m4a"
  },
  {
    id: "1635014240",
    title: "Kesariya (From \"Brahmastra\")",
    artist: "Pritam & Arijit Singh",
    album: "Kesariya (From \"Brahmastra\")",
    durationMs: 268165,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a"
  },
  {
    id: "1699625167",
    title: "Yeh Shaam Mastani (Retro Vibe)",
    artist: "Kishore Kumar",
    album: "Kati Patang / Celebrating Kishore",
    durationMs: 160052,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/65/89/4d/65894d61-902d-dd00-5a87-faab1167d3de/197189475641.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a8/80/30/a88030d4-f72c-bf46-686f-aeb1c4503075/mzaf_4928083911726403101.plus.aac.p.m4a"
  }
];

export default function App() {
  const [queue, setQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_bollywood_queue');
      return saved ? JSON.parse(saved) : BOLLYWOOD_INITIAL_TRACKS;
    } catch {
      return BOLLYWOOD_INITIAL_TRACKS;
    }
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = queue[currentTrackIndex] || queue[0] || BOLLYWOOD_INITIAL_TRACKS[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(260);
  const [volume, setVolume] = useState(80);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [vibeMode, setVibeMode] = useState('keep');

  // Modals & Panels
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isVibeOpen, setIsVibeOpen] = useState(false);
  const [isMixtapeOpen, setIsMixtapeOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [statusNotification, setStatusNotification] = useState(null);

  // Local collection
  const [likedTracks, setLikedTracks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura_bollywood_liked_tracks') || '[]');
    } catch {
      return [BOLLYWOOD_INITIAL_TRACKS[0]];
    }
  });

  const [mixtapes, setMixtapes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aura_bollywood_mixtapes') || '[]');
    } catch {
      return [
        { name: "Bollywood 90s & 2000s Cassette Tape", tracks: BOLLYWOOD_INITIAL_TRACKS }
      ];
    }
  });

  const audioRef = useRef(null);

  // Sync queue to local storage
  useEffect(() => {
    localStorage.setItem('aura_bollywood_queue', JSON.stringify(queue));
  }, [queue]);

  // Sync liked tracks
  useEffect(() => {
    localStorage.setItem('aura_bollywood_liked_tracks', JSON.stringify(likedTracks));
  }, [likedTracks]);

  // Sync mixtapes
  useEffect(() => {
    localStorage.setItem('aura_bollywood_mixtapes', JSON.stringify(mixtapes));
  }, [mixtapes]);

  // Handle Play/Pause
  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!currentTrack.audioUrl) {
        try {
          const res = await fetch(`/api/tracks/${currentTrack.id}/playback?artist=${encodeURIComponent(currentTrack.artist)}&title=${encodeURIComponent(currentTrack.title)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.playable && data.playbackUrl) {
              currentTrack.audioUrl = data.playbackUrl;
            }
          }
        } catch (e) {
          console.error("Failed to resolve Bollywood audio preview:", e);
        }
      }

      if (currentTrack.audioUrl) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Audio play blocked by browser policy:", err);
          setIsPlaying(false);
        }
      } else {
        showNotification("Bollywood audio preview not available for this catalog entry. Metadata preserved.");
      }
    }
  }, [isPlaying, currentTrack]);

  const showNotification = (msg) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  // Skip Next
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;
    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * queue.length);
      setCurrentTrackIndex(nextIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % queue.length);
    }
    setIsPlaying(true);
  }, [queue.length, isShuffle]);

  // Skip Prev
  const handlePrev = useCallback(() => {
    if (queue.length === 0) return;
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + queue.length) % queue.length);
      setIsPlaying(true);
    }
  }, [queue.length, currentTime]);

  // Rewind / Fast-forward
  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  // Volume
  const handleVolumeUp = () => {
    const newVol = Math.min(100, volume + 10);
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol / 100;
  };

  const handleVolumeDown = () => {
    const newVol = Math.max(0, volume - 10);
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol / 100;
  };

  // Seek
  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Like track toggle
  const isCurrentLiked = likedTracks.some(t => t.id === currentTrack?.id);
  const handleLikeToggle = () => {
    if (!currentTrack) return;
    if (isCurrentLiked) {
      setLikedTracks(likedTracks.filter(t => t.id !== currentTrack.id));
      showNotification(`Removed "${currentTrack.title}" from liked songs.`);
    } else {
      setLikedTracks([currentTrack, ...likedTracks]);
      showNotification(`Saved "${currentTrack.title}" to Bollywood favorites!`);
    }
  };

  // Track selection from catalog / queue
  const handlePlayTrack = async (track) => {
    let resolvedTrack = { ...track };
    if (!resolvedTrack.audioUrl) {
      try {
        const res = await fetch(`/api/tracks/${track.id}/playback?artist=${encodeURIComponent(track.artist)}&title=${encodeURIComponent(track.title)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.playable && data.playbackUrl) {
            resolvedTrack.audioUrl = data.playbackUrl;
          }
        }
      } catch (err) {
        console.error("Playback lookup error:", err);
      }
    }

    const existingIndex = queue.findIndex(t => t.id === resolvedTrack.id);
    if (existingIndex >= 0) {
      setCurrentTrackIndex(existingIndex);
    } else {
      const newQueue = [resolvedTrack, ...queue];
      setQueue(newQueue);
      setCurrentTrackIndex(0);
    }
    setIsPlaying(true);
  };

  const handleAddToQueue = (track) => {
    setQueue([...queue, track]);
    showNotification(`Added "${track.title}" to Smart Queue.`);
  };

  const handleAppendMultipleToQueue = (newTracks) => {
    setQueue([...queue, ...newTracks]);
    showNotification(`Appended ${newTracks.length} Bollywood tracks to queue!`);
  };

  const handleRemoveFromQueue = (index) => {
    if (queue.length <= 1) return;
    const newQueue = queue.filter((_, i) => i !== index);
    setQueue(newQueue);
    if (index === currentTrackIndex) {
      setCurrentTrackIndex(Math.min(index, newQueue.length - 1));
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  // Create & load mixtapes
  const handleCreateMixtape = (name) => {
    const newTape = {
      name,
      tracks: queue
    };
    setMixtapes([...mixtapes, newTape]);
    showNotification(`Recorded Bollywood mixtape "${name}"!`);
  };

  const handleLoadMixtape = (tape) => {
    if (tape && tape.tracks && tape.tracks.length > 0) {
      setQueue(tape.tracks);
      setCurrentTrackIndex(0);
      setIsPlaying(true);
      showNotification(`Loaded tape "${tape.name}" into deck!`);
    }
  };

  // Audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 260);
    const onEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || queue.length > 1) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [handleNext, repeatMode, queue.length, volume]);

  // Load new audio source when track changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (currentTrack?.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    } else {
      audioRef.current.removeAttribute('src');
    }
  }, [currentTrack]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        handleFastForward();
      } else if (e.code === 'ArrowLeft') {
        handleRewind();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeUp();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeDown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, volume]);

  return (
    <div className="min-h-screen text-slate-900 flex flex-col items-center justify-center p-2 sm:p-4 select-none relative">
      {/* Hidden HTML5 Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Atmospheric Background with Drifting Leaves & Film Grain */}
      <AtmosphericBackground />

      {/* Retro Notification Popup */}
      {statusNotification && (
        <div className="fixed top-4 z-50 bg-[#ffffcc] text-black win-bevel-raised px-3 py-1 text-xs font-pixel flex items-center gap-2 shadow-xl animate-bounce">
          <span>ℹ️</span>
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main Desktop Container */}
      <main
        className={`w-full transition-all duration-200 z-10 flex flex-col gap-2 ${
          isMaximized ? 'max-w-[760px]' : 'max-w-[420px]'
        }`}
        data-purpose="audio-player-container"
      >
        {/* BEGIN: MainWindow */}
        <div className="bg-[#c0c0c0] win-bevel-raised p-1 shadow-2xl" id="main-player-window">
          {/* Title Bar with green header & retro menus */}
          <TitleBar
            title="Song - Aura Bollywood Audio Workstation"
            isMaximized={isMaximized}
            onMaximize={() => setIsMaximized(!isMaximized)}
            onMinimize={() => showNotification("Aura Bollywood Player is docked to desktop.")}
            onSearchClick={() => setIsSearchOpen(true)}
            onVibeClick={() => setIsVibeOpen(true)}
            onMixtapeClick={() => setIsMixtapeOpen(true)}
          />

          {/* Player Core Body matching Stitch 1:1 */}
          <section className="p-2 flex flex-col gap-2.5" data-purpose="player-core">
            {/* Top Section: Album Cover & Side Controls */}
            <div className="flex gap-2.5 items-stretch">
              <AlbumArtWell
                currentTrack={currentTrack}
                onCoverClick={() => setIsSearchOpen(true)}
              />

              <UpperControls
                isPlaying={isPlaying}
                volume={volume}
                onVolumeUp={handleVolumeUp}
                onVolumeDown={handleVolumeDown}
                vuLevel={isPlaying ? 9 : 0}
              />
            </div>

            {/* Transport & Function Pad */}
            <TransportButtons
              isPlaying={isPlaying}
              isShuffle={isShuffle}
              repeatMode={repeatMode}
              isLiked={isCurrentLiked}
              onPlayPause={togglePlayPause}
              onShuffleToggle={() => setIsShuffle(!isShuffle)}
              onRepeatToggle={() => {
                const modes = ['off', 'all', 'one'];
                const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
                setRepeatMode(nextMode);
              }}
              onPrev={handlePrev}
              onRewind={handleRewind}
              onFastForward={handleFastForward}
              onNext={handleNext}
              onLikeToggle={handleLikeToggle}
            />

            {/* Retro Dropdowns for Artist & Title */}
            <TrackMetadataSelect
              currentTrack={currentTrack}
              queue={queue}
              onSelectTrack={handlePlayTrack}
              onOpenSearch={(term) => {
                setSearchInitialQuery(typeof term === 'string' ? term : '');
                setIsSearchOpen(true);
              }}
            />

            {/* Seek Track & Time Markers */}
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          </section>
        </div>
        {/* END: MainWindow */}

        {/* BEGIN: Equalizer Expansion Unit (Winamp DSP Rack) */}
        <EqualizerRack
          onEqChange={(preset) => {
            showNotification(`Bollywood DSP Profile: Preamp ${preset.pre}% active`);
          }}
        />
        {/* END: Equalizer Expansion Unit */}

        {/* BEGIN: Playlist Drawer / Side B */}
        <PlaylistQueue
          queue={queue}
          currentTrack={currentTrack}
          onSelectTrack={handlePlayTrack}
          onRemoveTrack={handleRemoveFromQueue}
          onOpenVibeEngine={() => setIsVibeOpen(true)}
          vibeMode={vibeMode}
        />
        {/* END: Playlist Drawer */}
      </main>

      {/* Auto-Suggest++ Bollywood Search Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPlayTrack={handlePlayTrack}
        onAddToQueue={handleAddToQueue}
        initialQuery={searchInitialQuery}
      />

      {/* Bollywood Vibe Engine Modal */}
      <VibeEngineModal
        isOpen={isVibeOpen}
        onClose={() => setIsVibeOpen(false)}
        currentTrack={currentTrack}
        onPlayTrack={handlePlayTrack}
        onAppendToQueue={handleAppendMultipleToQueue}
        activeMode={vibeMode}
        onSetVibeMode={(mode) => setVibeMode(mode)}
      />

      {/* Local Mixtapes & Liked Songs Modal */}
      <MixtapeModal
        isOpen={isMixtapeOpen}
        onClose={() => setIsMixtapeOpen(false)}
        likedTracks={likedTracks}
        mixtapes={mixtapes}
        onCreateMixtape={handleCreateMixtape}
        onLoadMixtape={handleLoadMixtape}
        onPlayTrack={handlePlayTrack}
      />
    </div>
  );
}
