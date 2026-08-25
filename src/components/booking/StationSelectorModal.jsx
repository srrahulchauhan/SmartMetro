import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Train, Check, Navigation, Sparkles } from 'lucide-react';
import { STATIONS } from '../../data/stations';
import { METRO_LINES } from '../../data/lines';

export default function StationSelectorModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Station',
  selectedStationId,
  excludeStationId
}) {
  const [search, setSearch] = useState('');
  const [selectedLine, setSelectedLine] = useState('all');

  const filteredStations = useMemo(() => {
    return STATIONS.filter(stn => {
      if (excludeStationId && stn.id === excludeStationId) return false;
      const matchesLine = selectedLine === 'all' || stn.line === selectedLine;
      const matchesSearch = stn.name.toLowerCase().includes(search.toLowerCase()) ||
                            stn.code.toLowerCase().includes(search.toLowerCase()) ||
                            stn.lineName.toLowerCase().includes(search.toLowerCase());
      return matchesLine && matchesSearch;
    });
  }, [search, selectedLine, excludeStationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-xs text-slate-400">Select starting or destination metro terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by station name or code (e.g. Sector 16, NEC)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Line Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedLine('all')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedLine === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Lines
            </button>
            {METRO_LINES.map(line => (
              <button
                key={line.id}
                onClick={() => setSelectedLine(line.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedLine === line.id
                    ? 'ring-2 ring-indigo-500 bg-slate-100 dark:bg-slate-800 font-semibold'
                    : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line.hex }} />
                <span>{line.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Station List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredStations.length > 0 ? (
            filteredStations.map(stn => {
              const isSelected = stn.id === selectedStationId;
              const lineMeta = METRO_LINES.find(l => l.id === stn.line);

              return (
                <button
                  key={stn.id}
                  onClick={() => {
                    onSelect(stn);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-500'
                      : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white dark:ring-slate-900"
                      style={{ backgroundColor: lineMeta?.hex || '#6366f1' }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {stn.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                          {stn.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>{stn.lineName}</span>
                        {stn.interchange && stn.interchange.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-[10px]">
                            Interchange Hub
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Select →
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No stations matching your search.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
