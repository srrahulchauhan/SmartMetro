import React from 'react';
import { MapPin, ArrowDown, Footprints, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { METRO_LINES } from '../../data/lines';

export default function RouteTimeline({ path = [], interchanges = [] }) {
  if (!path || path.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Visual Station Timeline
          </h3>
          <p className="text-xs text-slate-400">Step-by-step navigation path</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
          {path.length} Stations
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6">
        {/* Continuous Connecting Line */}
        <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-1 bg-gradient-to-b from-indigo-500 via-cyan-400 to-indigo-600 rounded-full" />

        {path.map((station, index) => {
          const isFirst = index === 0;
          const isLast = index === path.length - 1;
          const lineInfo = METRO_LINES.find(l => l.id === station.line);
          const hasInterchange = station.interchange && station.interchange.length > 0;

          return (
            <div key={`${station.id}-${index}`} className="relative group">
              {/* Station Node Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md ${
                  isFirst
                    ? 'bg-indigo-600 ring-4 ring-indigo-500/20'
                    : isLast
                    ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-500'
                }`}
              >
                {isFirst && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                {isLast && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              {/* Station Row Content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isFirst || isLast ? 'text-indigo-600 dark:text-indigo-400 text-base' : 'text-slate-900 dark:text-white'}`}>
                      {station.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {station.code}
                    </span>
                    {isFirst && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        Board Here
                      </span>
                    )}
                    {isLast && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        Alight
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lineInfo?.hex || '#6366f1' }} />
                      {station.lineName}
                    </span>
                    <span>• Platform {station.platforms ? 1 : 2}</span>
                  </div>
                </div>

                {/* Interchange Notice */}
                {hasInterchange && !isFirst && !isLast && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Change Line</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
