import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Route, 
  MapPin, 
  ArrowUpDown, 
  Clock, 
  Coins, 
  Zap, 
  Layers, 
  Footprints, 
  Sparkles, 
  ArrowRight, 
  Play,
  CheckCircle2
} from 'lucide-react';
import StationSelectorModal from '../components/booking/StationSelectorModal';
import RouteTimeline from '../components/booking/RouteTimeline';
import { STATIONS } from '../data/stations';
import { findRoute } from '../data/routes';
import { useMetro } from '../context/MetroContext';

export default function JourneyPlannerPage() {
  const navigate = useNavigate();
  const { startJourneySimulation } = useMetro();

  const [fromStation, setFromStation] = useState(STATIONS[0]);
  const [toStation, setToStation] = useState(STATIONS[6]);
  const [preference, setPreference] = useState('fastest'); // fastest | cheapest | fewest_interchanges

  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);

  const routeResult = findRoute(fromStation.id, toStation.id);

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Smart Journey Planner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Intelligent multi-line pathfinding, fastest route optimization and interchange navigation
        </p>
      </div>

      {/* Origin & Destination Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* From Station */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Start Station
            </label>
            <button
              type="button"
              onClick={() => setIsFromModalOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-left transition-all hover:border-indigo-500"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {fromStation.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {fromStation.lineName}
                  </div>
                </div>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold ml-2">Change</span>
            </button>
          </div>

          {/* Swap Button Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:scale-110 active:rotate-180 transition-all"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* To Station */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Destination
            </label>
            <button
              type="button"
              onClick={() => setIsToModalOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-left transition-all hover:border-indigo-500"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {toStation.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {toStation.lineName}
                  </div>
                </div>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold ml-2">Change</span>
            </button>
          </div>
        </div>

        {/* Preference Filters */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Routing Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'fastest', label: 'Fastest Route', icon: Clock },
              { id: 'cheapest', label: 'Lowest Fare', icon: Coins },
              { id: 'fewest_interchanges', label: 'Direct / Min Transfers', icon: Layers }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreference(p.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  preference === p.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <p.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{p.label}</span>
                <span className="sm:hidden">{p.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculated Route Output */}
      {routeResult.success ? (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Estimated Time</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {routeResult.durationMins} Mins
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Stations Traversed</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {routeResult.stopsCount} Stops
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Single Fare</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                ₹{routeResult.fare}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Interchanges</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {routeResult.interchangesCount === 0 ? 'Direct' : `${routeResult.interchangesCount} Change`}
              </span>
            </div>
          </div>

          {/* Station Visual Route Timeline */}
          <RouteTimeline
            path={routeResult.path}
            interchanges={routeResult.interchangeDetails}
          />

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={() => startJourneySimulation(fromStation.id, toStation.id, routeResult.path)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate This Journey</span>
            </button>

            <button
              onClick={() => navigate(`/book?from=${fromStation.id}&to=${toStation.id}`)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
            >
              <span>Book Ticket for this Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          {routeResult.message}
        </div>
      )}

      {/* Station Selector Modals */}
      <StationSelectorModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        onSelect={setFromStation}
        title="Select Start Station"
        selectedStationId={fromStation.id}
        excludeStationId={toStation.id}
      />

      <StationSelectorModal
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        onSelect={setToStation}
        title="Select Target Destination"
        selectedStationId={toStation.id}
        excludeStationId={fromStation.id}
      />
    </div>
  );
}
