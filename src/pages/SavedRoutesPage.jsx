import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookmarkCheck, 
  Plus, 
  Trash2, 
  Play, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Briefcase, 
  Home, 
  ShoppingBag, 
  GraduationCap 
} from 'lucide-react';
import Modal from '../components/common/Modal';
import StationSelectorModal from '../components/booking/StationSelectorModal';
import { STATIONS } from '../data/stations';
import { useMetro } from '../context/MetroContext';

export default function SavedRoutesPage() {
  const navigate = useNavigate();
  const { savedRoutes, addSavedRoute, removeSavedRoute, startJourneySimulation } = useMetro();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [fromStation, setFromStation] = useState(STATIONS[0]);
  const [toStation, setToStation] = useState(STATIONS[4]);
  const [iconType, setIconType] = useState('briefcase');

  const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
  const [isToPickerOpen, setIsToPickerOpen] = useState(false);

  const handleSaveNewRoute = (e) => {
    e.preventDefault();
    if (!routeName.trim()) return;

    addSavedRoute({
      name: routeName,
      fromStationId: fromStation.id,
      toStationId: toStation.id,
      fromName: fromStation.name,
      toName: toStation.name,
      estimatedTime: '22 min',
      fare: 35,
      line: fromStation.line,
      icon: iconType
    });

    setIsAddModalOpen(false);
    setRouteName('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'shopping-bag': return <ShoppingBag className="w-5 h-5" />;
      case 'education': return <GraduationCap className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Saved Routes & Commutes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            One-tap shortcuts for your daily office, home, and transit journeys
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Save New Route</span>
        </button>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedRoutes.map((route) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    {getIcon(route.icon)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {route.name}
                    </h3>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      Est. Fare: ₹{route.fare || 35}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeSavedRoute(route.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                  title="Delete shortcut"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stations Path */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{route.fromName}</span>
                </div>
                <div className="pl-1 text-slate-400 text-[10px]">↓ ~{route.estimatedTime || '20 min'}</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{route.toName}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => startJourneySimulation(route.fromStationId, route.toStationId)}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate</span>
              </button>

              <button
                onClick={() => navigate(`/book?from=${route.fromStationId}&to=${route.toStationId}`)}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Saved Route Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="max-w-md">
        <form onSubmit={handleSaveNewRoute} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Route Shortcut
            </h3>
            <p className="text-xs text-slate-400">
              Save frequent commute paths for 1-click booking
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Shortcut Title
            </label>
            <input
              type="text"
              required
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="e.g. Home to Sector 16 Office"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              From Station
            </label>
            <button
              type="button"
              onClick={() => setIsFromPickerOpen(true)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-left text-xs font-bold text-slate-900 dark:text-white flex justify-between items-center"
            >
              <span>{fromStation.name}</span>
              <span className="text-indigo-600 dark:text-indigo-400">Change</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              To Station
            </label>
            <button
              type="button"
              onClick={() => setIsToPickerOpen(true)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-left text-xs font-bold text-slate-900 dark:text-white flex justify-between items-center"
            >
              <span>{toStation.name}</span>
              <span className="text-indigo-600 dark:text-indigo-400">Change</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Shortcut Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'briefcase', label: 'Office' },
                { id: 'home', label: 'Home' },
                { id: 'shopping-bag', label: 'Shop' },
                { id: 'education', label: 'College' }
              ].map(ic => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setIconType(ic.id)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    iconType === ic.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all mt-2"
          >
            Save Route Shortcut
          </button>
        </form>
      </Modal>

      {/* Station Pickers */}
      <StationSelectorModal
        isOpen={isFromPickerOpen}
        onClose={() => setIsFromPickerOpen(false)}
        onSelect={setFromStation}
        selectedStationId={fromStation.id}
      />
      <StationSelectorModal
        isOpen={isToPickerOpen}
        onClose={() => setIsToPickerOpen(false)}
        onSelect={setToStation}
        selectedStationId={toStation.id}
      />
    </div>
  );
}
