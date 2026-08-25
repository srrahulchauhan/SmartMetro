import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, Search, Sparkles, Layers, Info } from 'lucide-react';
import MetroMapSVG from '../components/map/MetroMapSVG';
import StationInfoDrawer from '../components/map/StationInfoDrawer';
import StationSelectorModal from '../components/booking/StationSelectorModal';
import { STATIONS } from '../data/stations';

export default function MetroMapPage() {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Interactive Metro Map
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore network tracks, interchange nodes, line corridors & station amenities
          </p>
        </div>

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Find Station on Map</span>
        </button>
      </div>

      {/* Main Interactive Map Canvas */}
      <MetroMapSVG
        onSelectStation={(stn) => setSelectedStation(stn)}
        selectedStationId={selectedStation?.id}
      />

      {/* Selected Station Drawer */}
      <StationInfoDrawer
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
        onSetOrigin={(stn) => navigate(`/book?from=${stn.id}`)}
        onSetDestination={(stn) => navigate(`/book?to=${stn.id}`)}
      />

      {/* Station Search Modal */}
      <StationSelectorModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={(stn) => setSelectedStation(stn)}
        title="Find Station on System Map"
      />
    </div>
  );
}
