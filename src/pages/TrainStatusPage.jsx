import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  MapPin, 
  Clock, 
  Users, 
  Train, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Zap,
  Sparkles
} from 'lucide-react';
import { STATIONS } from '../data/stations';
import { METRO_LINES } from '../data/lines';
import StationSelectorModal from '../components/booking/StationSelectorModal';

export default function TrainStatusPage() {
  const [searchParams] = useSearchParams();
  const [selectedStation, setSelectedStation] = useState(() => {
    const stnId = searchParams.get('station');
    return stnId ? STATIONS.find(s => s.id === stnId) || STATIONS[0] : STATIONS[0];
  });
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [tickerSecond, setTickerSecond] = useState(0);

  // Live countdown tick effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerSecond(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lineInfo = METRO_LINES.find(l => l.id === selectedStation.line);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Live Train Status & Headway
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time platform departures, incoming train countdowns & coach occupancy
          </p>
        </div>

        {/* Change Station Trigger */}
        <button
          onClick={() => setIsStationModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:border-indigo-500 transition-all"
        >
          <MapPin className="w-4 h-4 text-indigo-500" />
          <span>Switch Station: {selectedStation.name}</span>
        </button>
      </div>

      {/* Selected Station Live Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live Station Board
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Last Sync: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {selectedStation.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lineInfo?.hex || '#06b6d4' }} />
                <span>{selectedStation.lineName}</span>
                <span>• Code: {selectedStation.code}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Platform Count</span>
                <span className="text-base font-bold text-white">2 Platforms (AFC)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current Crowd</span>
                <span className="text-base font-bold text-amber-400">{selectedStation.crowd || 'Moderate'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Departures List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Upcoming Trains at this Station
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Platform 1 Departure */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                Platform 1 (Downline)
              </span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> On Time
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase font-medium">Terminal Direction</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                Towards Noida Depot / Pari Chowk
              </div>
            </div>

            {/* Arrival countdown */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Arriving in</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    2 min 40 sec
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Next Train</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">in 6 min</span>
              </div>
            </div>

            {/* Train Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1 Station Away</span>
                <span>Approaching Platform</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-indigo-600 h-full rounded-full"
                  animate={{ width: ['40%', '85%', '40%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>

          {/* Platform 2 Departure */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-200 dark:border-cyan-800">
                Platform 2 (Upline)
              </span>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Normal Headway
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase font-medium">Terminal Direction</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                Towards Sector 51 / Central Interchange
              </div>
            </div>

            {/* Arrival countdown */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Arriving in</span>
                  <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                    5 min 15 sec
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Next Train</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">in 9 min</span>
              </div>
            </div>

            {/* Train Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>2 Stations Away</span>
                <span>On Schedule</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-cyan-500 h-full rounded-full"
                  animate={{ width: ['20%', '55%', '20%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Line Health Strip */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Metropolitan Network Line Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {METRO_LINES.map(line => (
            <div
              key={line.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: line.hex }} />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{line.name}</div>
                  <div className="text-[11px] text-slate-400">{line.frequency} frequency</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {line.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Station Selector Modal */}
      <StationSelectorModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        onSelect={setSelectedStation}
        selectedStationId={selectedStation.id}
      />
    </div>
  );
}
