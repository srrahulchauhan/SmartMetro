import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  X, 
  Train, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Navigation, 
  Zap, 
  Activity,
  Layers
} from 'lucide-react';
import { METRO_LINES } from '../../data/lines';

export default function StationInfoDrawer({ station, onClose, onSetOrigin, onSetDestination }) {
  const navigate = useNavigate();

  if (!station) return null;

  const lineInfo = METRO_LINES.find(l => l.id === station.line);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 w-[92%] sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: lineInfo?.hex || '#6366f1' }}
            >
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {station.name}
                </h3>
                <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {station.code}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {station.lineName} • Platform 1 & 2
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Upcoming Trains */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Next Metro Arrivals</span>
            </div>
            <div className="space-y-2">
              {station.nextTrains ? (
                station.nextTrains.map((train, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Towards {train.dest}
                      </span>
                      <span className="text-slate-400 block text-[10px]">
                        Platform {train.platform}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      in {train.min} min
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">Next train in 3 min (Platform 1)</div>
              )}
            </div>
          </div>

          {/* Station Amenities & Facilities */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Station Facilities
            </div>
            <div className="flex flex-wrap gap-1.5">
              {station.facilities?.map((facility, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                if (onSetOrigin) onSetOrigin(station);
                navigate(`/book?from=${station.id}`);
              }}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Book From Here</span>
            </button>
            <button
              onClick={() => navigate(`/train-status?station=${station.id}`)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              <span>Live Status</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
