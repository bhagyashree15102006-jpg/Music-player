import React, { useState } from 'react';

const PRESETS = {
  'SOUL / FUNK': { pre: 70, bands: [85, 75, 50, 45, 60, 70, 65, 80, 82, 78] },
  'FLAT': { pre: 50, bands: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
  'CASSETTE': { pre: 60, bands: [40, 55, 65, 70, 60, 55, 50, 40, 35, 30] },
  'VOCAL': { pre: 55, bands: [30, 40, 55, 75, 85, 80, 70, 60, 50, 45] }
};

const FREQ_LABELS = ['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'];

export default function EqualizerRack({ onEqChange }) {
  const [activeTab, setActiveTab] = useState('SOUL / FUNK');
  const [isEqOn, setIsEqOn] = useState(true);
  const [isSpatial, setIsSpatial] = useState(true);
  const [sliders, setSliders] = useState(PRESETS['SOUL / FUNK']);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (PRESETS[tab]) {
      setSliders(PRESETS[tab]);
      if (onEqChange) onEqChange(PRESETS[tab]);
    }
  };

  const handleSliderChange = (bandIndex, value) => {
    const newBands = [...sliders.bands];
    newBands[bandIndex] = Number(value);
    const updated = { ...sliders, bands: newBands };
    setSliders(updated);
    if (onEqChange) onEqChange(updated);
  };

  const handlePreampChange = (value) => {
    const updated = { ...sliders, pre: Number(value) };
    setSliders(updated);
    if (onEqChange) onEqChange(updated);
  };

  const handleReset = () => {
    handleTabClick('FLAT');
  };

  const getDbLabel = (val) => {
    // 50 is 0dB, 100 is +6dB, 0 is -6dB
    const db = Math.round(((val - 50) / 50) * 6);
    return db > 0 ? `+${db}` : `${db}`;
  };

  return (
    <section className="bg-[#c0c0c0] win-bevel-raised p-1 shadow-xl" data-purpose="eq-expansion-rack">
      {/* EQ Window Title Strip */}
      <div className="bg-[#303030] text-[#00ff66] px-2 py-0.5 flex items-center justify-between font-bitmap text-[10px] tracking-wider mb-1">
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full bg-[#00ff66] inline-block ${isEqOn ? 'animate-ping' : 'opacity-40'}`} />
          GRAPHIC EQUALIZER • DSP 10-BAND
        </span>
        <span className="text-neutral-400 font-pixel text-xs">44.1 kHz / 320 KBPS</span>
      </div>

      {/* Presets & Tab Strip (Windows 95 style tabs) */}
      <div className="flex gap-1 border-b border-neutral-600 px-1 pt-1 mb-1.5 text-xs font-pixel">
        {Object.keys(PRESETS).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-2 py-0.5 ${
              activeTab === tab ? 'win-tab-active font-bold text-black' : 'win-tab-inactive text-neutral-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* EQ Sliders Grid */}
      <div className="bg-[#242424] win-bevel-sunken p-2 flex justify-between items-center text-center">
        {/* Preamp Slider */}
        <div className="flex flex-col items-center border-r border-neutral-700 pr-1.5 mr-0.5">
          <span className="text-[9px] font-pixel text-amber-400 font-bold mb-1">PRE</span>
          <input
            aria-label="Preamp"
            className="eq-slider-vertical"
            max="100"
            min="0"
            type="range"
            value={sliders.pre}
            onChange={(e) => handlePreampChange(e.target.value)}
          />
          <span className="text-[8px] font-pixel text-neutral-400 mt-1">
            {getDbLabel(sliders.pre)}dB
          </span>
        </div>

        {/* 10 Frequency Band Sliders */}
        <div className="flex-1 flex justify-around">
          {sliders.bands.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[8px] font-pixel text-neutral-400 mb-1">{FREQ_LABELS[idx]}</span>
              <input
                aria-label={`${FREQ_LABELS[idx]} Hertz`}
                className="eq-slider-vertical"
                max="100"
                min="0"
                type="range"
                value={val}
                onChange={(e) => handleSliderChange(idx, e.target.value)}
              />
              <span className={`text-[8px] font-pixel mt-1 ${val !== 50 ? 'text-[#00ff66]' : 'text-neutral-400'}`}>
                {getDbLabel(val)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Toggle Bar: ON / AUTO / ZERO */}
      <div className="flex items-center justify-between pt-1 px-1 text-[11px] font-pixel">
        <div className="flex gap-1.5 items-center">
          <button
            onClick={() => setIsEqOn(!isEqOn)}
            className={`win-button px-2 py-0.5 text-black font-bold ${isEqOn ? 'active text-emerald-900' : ''}`}
          >
            {isEqOn ? 'EQ ON' : 'EQ OFF'}
          </button>
          <button
            onClick={handleReset}
            className="win-button px-2 py-0.5 text-black font-bold"
          >
            RESET
          </button>
        </div>
        <div className="flex items-center gap-1 text-neutral-800">
          <input
            checked={isSpatial}
            onChange={(e) => setIsSpatial(e.target.checked)}
            className="rounded-none text-teal-800 focus:ring-0 cursor-pointer"
            id="surround-check"
            type="checkbox"
          />
          <label className="cursor-pointer font-bold select-none" htmlFor="surround-check">
            3D SPATIAL
          </label>
        </div>
      </div>
    </section>
  );
}
