# Aura Music — Retro Analog Music Experience Platform
> **Windows 95 / Winamp-Era Audio Workstation & Vibe Recommendation Platform**

Built strictly using the approved **Stitch ZIP** visual design tokens and the **Antigravity PRD** specifications.

---

## 📻 Key Features

1. **Approved Stitch Retro Aesthetics**:
   - Classic Windows 95 3D raised and sunken bevels (`--win-gray`, `--win-light`, `--win-mid-gray`, `--win-dark`).
   - Authentic emerald green `#0e6f3b` title bar with bitmap pixel iconography.
   - Vintage typography (`VT323`, `Silkscreen`, `Wix Madefor Text`).
   - Sunken album-art well with real high-resolution covers.
   - Spun compact disc animation, Hi-Fi tape/MD deck graphic with flashing LED.
   - 11-segment LED level VU meter and 10-band DSP graphic equalizer rack.
   - Subtle drifting dry leaves and faint analog CRT scanlines behind the workstation.

2. **Open-Access Music Discovery (Zero Auth / No Login)**:
   - No login, passwords, email, profile creation, or OAuth walls.
   - Fully open catalog browsing and instant playback.

3. **Auto-Suggest++ Search Engine**:
   - Debounced instant query suggestions as you type.
   - Instant track, artist, and album results.
   - Stored recent searches (browser-local).

4. **Vibe Engine & Smart Queue ("Side B")**:
   - Recommendation vector tuning:
     - 🎛️ **Keep the Vibe** (Smooth harmonic continuity)
     - ⚡ **More Energetic** (Upbeat tempo boost)
     - 🍵 **More Chill** (Low-tempo mellow groove)
     - 🎲 **Surprise Me** (Eclectic discovery)
   - Real-time match rationale (e.g. *"94% vibe match"*, *"Harmonic key transition"*).
   - One-click appending of recommendations to the active queue.

5. **Audio Playback Engine**:
   - Real HTML5 Audio playback stream with seek, pause/play, volume stepper, repeat, shuffle, and skip.
   - Graceful fallback: If a catalog entry has no playable stream, playback is cleanly noted without fake playback (PRD Section 296).

6. **Local Mixtapes & Liked Songs**:
   - Favorite heart button stores songs to local storage.
   - Create custom retro cassette mixtapes and load them directly into the deck.

---

## 🛠️ Architecture

- **Frontend (`/client`)**:
  - React 19 + Tailwind CSS + Vite
  - Modular component architecture (`TitleBar`, `AlbumArtWell`, `UpperControls`, `TransportButtons`, `EqualizerRack`, `PlaylistQueue`, `SearchModal`, `VibeEngineModal`, `MixtapeModal`, `AtmosphericBackground`).
  - Vite dev server proxying `/api` requests to backend on port 5000.
- **Backend (`/server`)**:
  - Node.js + Express
  - SpotAPI Python provider bridge (`spotapi_bridge.py`) for unauthenticated Spotify catalog querying.
  - iTunes preview fallback & audio stream resolution adapter.
  - Vibe recommendation scoring module.

---

## 🚀 Running the Project

### 1. Start Backend Server
```powershell
cd server
npm start
# Runs Express on http://localhost:5000
```

### 2. Start Frontend Client
```powershell
cd client
npm run dev
# Opens Vite dev server on http://localhost:5173
```

---

## ⚙️ Provider Notes & Limitations
- **SpotAPI**: SpotAPI is an unofficial wrapper around Spotify's unauthenticated catalog endpoints. If upstream rate-limits occur, the backend automatically falls back to secondary audio preview adapters to ensure continuous functionality.
- **Playback Audio**: Audio previews (AAC 256kbps) are played for catalog tracks. Obscure tracks without permitted audio streams are marked as *Catalog Only*.
