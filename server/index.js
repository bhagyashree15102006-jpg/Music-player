import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory cache for search & metadata results (TTL: 1 hour)
const cache = new Map();
function getCached(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < 3600000) {
    return item.data;
  }
  return null;
}
function setCached(key, data) {
  cache.set(key, { timestamp: Date.now(), data });
}

// Curated Starter Catalog: Iconic Bollywood & Hindi Classics
const BOLLYWOOD_DEFAULT_TRACKS = [
  {
    id: "1130322151",
    title: "Chaiyya Chaiyya",
    artist: "Sukhwinder Singh & Sapna Awasthi",
    album: "Dil Se (Original Motion Picture Soundtrack)",
    durationMs: 406849,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/8e/f8/85/8ef88544-a6c7-018b-0a75-dc3b6b024fa0/cover.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/81/6c/e7/816ce721-3a37-0e57-3aa7-c3e180c4b38c/mzaf_10595670915474775723.plus.aac.p.m4a",
    energy: 92,
    mood: "energetic",
    tempo: 120
  },
  {
    id: "1073359419",
    title: "Tum Hi Ho",
    artist: "Arijit Singh & Mithoon",
    album: "Aashiqui 2 (Original Motion Picture Soundtrack)",
    durationMs: 261974,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3a/8c/9b/3a8c9b0b-2def-750a-f615-1555bf941edf/mzaf_17229496441442805917.plus.aac.p.m4a",
    energy: 65,
    mood: "romantic",
    tempo: 85
  },
  {
    id: "1635014240",
    title: "Kesariya (From \"Brahmastra\")",
    artist: "Pritam & Arijit Singh",
    album: "Kesariya (From \"Brahmastra\")",
    durationMs: 268165,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a",
    energy: 78,
    mood: "soulful",
    tempo: 96
  },
  {
    id: "1699625167",
    title: "Yeh Shaam Mastani (Retro Vibe)",
    artist: "Kishore Kumar",
    album: "Kati Patang / Celebrating Kishore",
    durationMs: 160052,
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/65/89/4d/65894d61-902d-dd00-5a87-faab1167d3de/197189475641.jpg/600x600bb.jpg",
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a8/80/30/a88030d4-f72c-bf46-686f-aeb1c4503075/mzaf_4928083911726403101.plus.aac.p.m4a",
    energy: 58,
    mood: "vintage-retro",
    tempo: 75
  }
];

// Enforce Bollywood scope for all search queries
function formatBollywoodQuery(rawQuery) {
  const cleaned = (rawQuery || '').trim();
  if (!cleaned) return 'bollywood hits';
  const lower = cleaned.toLowerCase();
  if (lower.includes('bollywood') || lower.includes('hindi')) {
    return cleaned;
  }
  return `${cleaned} bollywood`;
}

// Helper: Run Python SpotAPI search scoped to Bollywood
async function searchSpotApi(query, limit = 10) {
  const bollywoodQuery = formatBollywoodQuery(query);
  return new Promise((resolve) => {
    const pythonProc = spawn('python', ['spotapi_bridge.py', 'search', bollywoodQuery, String(limit)], {
      cwd: __dirname,
      timeout: 10000
    });

    let stdout = '';
    let stderr = '';

    pythonProc.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf-8');
    });

    pythonProc.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf-8');
    });

    pythonProc.on('close', (code) => {
      if (code === 0 && stdout) {
        try {
          const parsed = JSON.parse(stdout);
          if (parsed && parsed.success && Array.isArray(parsed.tracks)) {
            return resolve(parsed.tracks);
          }
        } catch (e) {
          console.error("JSON parse error from SpotAPI bridge:", e);
        }
      }
      resolve([]);
    });

    pythonProc.on('error', (err) => {
      console.error("Failed to run spotapi_bridge.py:", err);
      resolve([]);
    });
  });
}

// Helper: Query iTunes India store for Bollywood music catalog & AAC audio previews
async function searchBollywoodItunes(query, limit = 12) {
  try {
    const bollywoodQuery = formatBollywoodQuery(query);
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(bollywoodQuery)}&country=IN&entity=song&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(item => ({
      id: String(item.trackId),
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName || 'Bollywood Soundtrack',
      durationMs: item.trackTimeMillis || 240000,
      coverUrl: (item.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
      audioUrl: item.previewUrl || null,
      energy: Math.floor(Math.random() * 35) + 55,
      mood: 'bollywood',
      tempo: 95
    }));
  } catch (e) {
    console.error("Bollywood iTunes search error:", e);
    return [];
  }
}

// Playback Resolver
async function resolveAudio(artist, title) {
  try {
    const query = `${artist} ${title} bollywood`;
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=IN&entity=song&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].previewUrl || null;
    }
  } catch (err) {
    console.error("Error resolving audio stream:", err);
  }
  return null;
}

// 1. GET /api/search?q=&limit= (Enforcing Bollywood Only)
app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').trim();
  const limit = parseInt(req.query.limit, 10) || 12;

  if (!query) {
    return res.json({ success: true, tracks: BOLLYWOOD_DEFAULT_TRACKS, query: '' });
  }

  const cacheKey = `bollywood_search:${query}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // 1. Search Bollywood catalog on iTunes India store for instant previews
  const itunesBollywood = await searchBollywoodItunes(query, limit);

  // 2. Fallback or augment with SpotAPI
  let tracks = itunesBollywood;
  if (!tracks || tracks.length === 0) {
    const spotTracks = await searchSpotApi(query, limit);
    if (spotTracks.length > 0) {
      tracks = await Promise.all(spotTracks.map(async (t) => {
        const audioUrl = await resolveAudio(t.artist, t.title);
        return {
          ...t,
          audioUrl,
          energy: 70,
          mood: 'bollywood',
          tempo: 100
        };
      }));
    }
  }

  if (!tracks || tracks.length === 0) {
    tracks = BOLLYWOOD_DEFAULT_TRACKS.filter(t => 
      t.title.toLowerCase().includes(query.toLowerCase()) || 
      t.artist.toLowerCase().includes(query.toLowerCase())
    );
  }

  const response = {
    success: true,
    tracks: tracks.length > 0 ? tracks : BOLLYWOOD_DEFAULT_TRACKS,
    genre: "Bollywood",
    query
  };
  setCached(cacheKey, response);
  res.json(response);
});

// 2. GET /api/search/suggest?q= (Bollywood Auto-Suggest++)
app.get('/api/search/suggest', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) {
    return res.json({ suggestions: [] });
  }

  try {
    const bollywoodQuery = formatBollywoodQuery(query);
    const resData = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(bollywoodQuery)}&country=IN&entity=song&limit=6`);
    if (resData.ok) {
      const data = await resData.json();
      const suggestions = (data.results || []).map(item => ({
        id: String(item.trackId),
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName,
        coverUrl: item.artworkUrl60 || item.artworkUrl100,
        audioUrl: item.previewUrl
      }));
      return res.json({ suggestions });
    }
  } catch (e) {
    console.error("Auto-suggest error:", e);
  }

  const filtered = BOLLYWOOD_DEFAULT_TRACKS.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.artist.toLowerCase().includes(query.toLowerCase())
  );
  res.json({ suggestions: filtered });
});

// 3. GET /api/tracks/:id
app.get('/api/tracks/:id', (req, res) => {
  const { id } = req.params;
  const match = BOLLYWOOD_DEFAULT_TRACKS.find(t => t.id === id);
  if (match) {
    return res.json({ success: true, track: match });
  }
  res.json({
    success: true,
    track: {
      id,
      title: "Bollywood Hit",
      artist: "Selected Bollywood Artist",
      album: "Bollywood Collection",
      durationMs: 240000
    }
  });
});

// 4. GET /api/tracks/:id/playback
app.get('/api/tracks/:id/playback', async (req, res) => {
  const { id } = req.params;
  const artist = req.query.artist || '';
  const title = req.query.title || '';

  const match = BOLLYWOOD_DEFAULT_TRACKS.find(t => t.id === id);
  if (match && match.audioUrl) {
    return res.json({ playable: true, playbackUrl: match.audioUrl, codec: 'AAC 256kbps Bollywood Stereo' });
  }

  if (artist && title) {
    const audioUrl = await resolveAudio(artist, title);
    if (audioUrl) {
      return res.json({ playable: true, playbackUrl: audioUrl, codec: 'AAC 256kbps Bollywood Stereo' });
    }
  }

  res.json({
    playable: false,
    reason: "No permitted Bollywood audio stream found for this catalog entry."
  });
});

// 5. GET /api/recommendations/next?trackId=&mode= (Bollywood Vibe Engine)
app.get('/api/recommendations/next', async (req, res) => {
  const mode = req.query.mode || 'keep'; // keep | energetic | chill | surprise
  const artist = req.query.artist || 'Arijit Singh';
  const title = req.query.title || '';

  let searchSeed = 'bollywood romantic hits';
  if (mode === 'energetic') {
    searchSeed = 'bollywood party dance hits badshah';
  } else if (mode === 'chill') {
    searchSeed = 'bollywood acoustic sufi lofi rahat arijit';
  } else if (mode === 'surprise') {
    searchSeed = 'retro bollywood golden 70s kishore rd burman';
  } else {
    searchSeed = `${artist} bollywood hits`;
  }

  let candidates = await searchBollywoodItunes(searchSeed, 8);
  if (!candidates || candidates.length === 0) {
    candidates = BOLLYWOOD_DEFAULT_TRACKS;
  }

  // Filter out currently playing track
  const filtered = candidates.filter(c => c.title.toLowerCase() !== title.toLowerCase());

  // Rank with Vibe Engine scoring
  const ranked = filtered.map((track, idx) => {
    let vibeScore = 95 - (idx * 3);
    let reason = "95% Bollywood vibe match";

    if (mode === 'energetic') {
      reason = "High tempo Bollywood dance groove";
    } else if (mode === 'chill') {
      reason = "Soulful acoustic Hindi transition";
    } else if (mode === 'surprise') {
      reason = "Golden Era analog Bollywood discovery";
    } else {
      reason = idx === 0 ? "Harmonic Bollywood melody transition" : `${vibeScore}% vibe match`;
    }

    return {
      ...track,
      vibeScore,
      vibeExplanation: reason
    };
  });

  res.json({
    success: true,
    mode,
    genre: "Bollywood",
    recommendations: ranked
  });
});

// 6. POST /api/events (Anonymous session telemetry)
app.post('/api/events', (req, res) => {
  res.json({ status: 'ok', received: true });
});

app.listen(PORT, () => {
  console.log(`[Aura Music Backend] Running on http://localhost:${PORT} (Bollywood Only Mode)`);
});
