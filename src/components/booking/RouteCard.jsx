import React from 'react';
import { Clock, ArrowRight, Layers, ShieldCheck, Zap, Users, CheckCircle2 } from 'lucide-react';
import { METRO_LINES } from '../../data/lines';

export default function RouteCard({ 
  route, 
  isSelected, 
  onSelect, 
  onContinue 
}) {
  const firstStation = route.path[0];
  const lastStation = route.path[route.path.length - 1];

  return (
    <div
      onClick={onSelect}
      className={`relative p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-md'
      }`}
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          {route.tag && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${route.badgeColor || 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'}`}>
              {route.tag}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {route.title || 'Standard Route'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xl font-black text-slate-900 dark:text-white">
            ₹{route.fare}
          </span>
          <span className="text-xs text-slate-400 block -mt-0.5">per person</span>
        </div>
      </div>

      {/* Main Journey Times & Stations */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {firstStation?.name}
          </div>
          <div className="text-xs text-slate-400">
            {firstStation?.lineName}
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 px-4">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{route.durationMins} mins</span>
          </div>
          <div className="w-full relative flex items-center justify-center">
            <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
            <div className="absolute w-2 h-2 rounded-full bg-indigo-600" />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {route.stopsCount} Stops • {route.interchangesCount === 0 ? 'Direct' : `${route.interchangesCount} Interchange`}
          </div>
        </div>

        <div className="text-right">
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {lastStation?.name}
          </div>
          <div className="text-xs text-slate-400">
            {lastStation?.lineName}
          </div>
        </div>
      </div>

      {/* Highlights / Meta pill tags */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Crowd: {route.crowd || 'Moderate'}</span>
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <Zap className="w-3.5 h-3.5" />
          <span>{route.co2SavedKg || '1.8'} kg CO₂ Saved</span>
        </span>
      </div>

      {/* Continue button if selected */}
      {isSelected && onContinue && (
        <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-900/50">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30"
          >
            <span>Continue to Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
