import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Layers, MapPin, Train, Sparkles } from 'lucide-react';
import { STATIONS } from '../../data/stations';
import { METRO_LINES } from '../../data/lines';

export default function MetroMapSVG({ onSelectStation, selectedStationId }) {
  const [zoom, setZoom] = useState(1);
  const [activeFilterLine, setActiveFilterLine] = useState('all');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.7));
  const handleResetZoom = () => setZoom(1);

  // Group stations by line
  const aquaStations = STATIONS.filter(s => s.line === 'aqua');
  const blueStations = STATIONS.filter(s => s.line === 'blue');
  const magentaStations = STATIONS.filter(s => s.line === 'magenta');
  const airportStations = STATIONS.filter(s => s.line === 'airport');

  // Build SVG path strings
  const makePathString = (stations) => {
    return stations.map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${s.mapX} ${s.mapY}`).join(' ');
  };

  return (
    <div className="relative w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Map Header / Line filter controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Line Filter Badges */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 pointer-events-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveFilterLine('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              activeFilterLine === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Lines
          </button>
          {METRO_LINES.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveFilterLine(l.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeFilterLine === l.id
                  ? 'bg-slate-800 text-white ring-2 ring-indigo-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.hex }} />
              <span className="hidden sm:inline">{l.name}</span>
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 pointer-events-auto">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-auto cursor-grab active:cursor-grabbing p-4 min-h-[480px] sm:min-h-[560px] flex items-center justify-center">
        <motion.svg
          viewBox="0 0 850 620"
          className="w-full h-auto max-w-4xl transition-transform"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            {/* Glow Filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.6"/>
            </filter>
            <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.6"/>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="850" height="620" fill="url(#grid)" />

          {/* Metro Network Title & Legend */}
          <text x="30" y="50" fill="#ffffff" fontSize="18" fontWeight="800" letterSpacing="0.05em">
            METROPOLITAN TRANSIT NETWORK
          </text>
          <text x="30" y="70" fill="#94a3b8" fontSize="11" fontWeight="500">
            Interactive System Map • Tap any station node to inspect departures
          </text>

          {/* Inter-station Track Lines */}
          {/* Aqua Line Track */}
          {(activeFilterLine === 'all' || activeFilterLine === 'aqua') && (
            <g>
              <path
                d={makePathString(aquaStations)}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-cyan)"
              />
              <path
                d={makePathString(aquaStations)}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="4 8"
                opacity="0.4"
              />
            </g>
          )}

          {/* Blue Line Track */}
          {(activeFilterLine === 'all' || activeFilterLine === 'blue') && (
            <g>
              <path
                d={makePathString(blueStations)}
                fill="none"
                stroke="#2563eb"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow-blue)"
              />
              <path
                d={makePathString(blueStations)}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="4 8"
                opacity="0.4"
              />
            </g>
          )}

          {/* Magenta Line Track */}
          {(activeFilterLine === 'all' || activeFilterLine === 'magenta') && (
            <g>
              <path
                d={makePathString(magentaStations)}
                fill="none"
                stroke="#d946ef"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* Airport Line Track */}
          {(activeFilterLine === 'all' || activeFilterLine === 'airport') && (
            <g>
              <path
                d="M 130 340 L 60 460"
                fill="none"
                stroke="#f97316"
                strokeWidth="6"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Inter-line connection walkway (Sec 51 <-> Sec 52) */}
          <path
            d="M 380 180 L 370 140"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
            strokeDasharray="3 3"
          />
          <text x="390" y="160" fill="#a5b4fc" fontSize="9" fontWeight="bold">Walkway</text>

          {/* Station Nodes */}
          {STATIONS.map((station) => {
            const isSelected = station.id === selectedStationId;
            const lineMeta = METRO_LINES.find(l => l.id === station.line);
            const isInterchange = station.interchange && station.interchange.length > 0;
            const isVisible = activeFilterLine === 'all' || activeFilterLine === station.line;

            if (!isVisible) return null;

            return (
              <g
                key={station.id}
                onClick={() => onSelectStation(station)}
                className="cursor-pointer group"
                transform={`translate(${station.mapX}, ${station.mapY})`}
              >
                {/* Outer ring for selected station */}
                {isSelected && (
                  <circle
                    r="16"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="animate-ping-slow"
                  />
                )}

                {/* Station Circle */}
                <circle
                  r={isInterchange ? "9" : "7"}
                  fill={isInterchange ? "#ffffff" : "#0f172a"}
                  stroke={lineMeta?.hex || '#ffffff'}
                  strokeWidth={isInterchange ? "4" : "3.5"}
                  className="transition-transform group-hover:scale-125"
                />

                {isInterchange && (
                  <circle r="3" fill={lineMeta?.hex || '#6366f1'} />
                )}

                {/* Station Label */}
                <text
                  x={station.mapX > 400 ? "14" : "-14"}
                  y="4"
                  textAnchor={station.mapX > 400 ? "start" : "end"}
                  fill={isSelected ? "#38bdf8" : "#f1f5f9"}
                  fontSize={isInterchange ? "11" : "10"}
                  fontWeight={isInterchange ? "700" : "500"}
                  className="select-none drop-shadow"
                >
                  {station.name}
                </text>
              </g>
            );
          })}
        </motion.svg>
      </div>

      {/* Map Footer status */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" />
            <span>Aqua Line (Noida Sector 51 - Depot)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
            <span>Blue Line (Electronic City - Rajiv Chowk)</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-indigo-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Click any node to see live departures & amenities</span>
        </div>
      </div>
    </div>
  );
}
