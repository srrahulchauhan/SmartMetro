import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Navigation, ArrowRight, Play, CheckCircle2, XCircle, BellRing } from 'lucide-react';
import { useMetro } from '../../context/MetroContext';

export default function LiveSimulatorPill() {
  const { activeJourney, advanceSimulationStep, stopJourneySimulation } = useMetro();

  if (!activeJourney) return null;

  const isCompleted = activeJourney.status === 'COMPLETED';
  const progressPercent = Math.round(((activeJourney.currentIndex + 1) / activeJourney.totalStations) * 100);
  const remainingStops = activeJourney.totalStations - 1 - activeJourney.currentIndex;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl"
      >
        <div className="bg-slate-900/95 text-white border border-indigo-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl ring-1 ring-indigo-500/20">
          {/* Top Status Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-indigo-400" />
                Live Journey Simulator
              </span>
              {remainingStops === 1 && !isCompleted && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 animate-pulse">
                  Alight Next Stop!
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <span>{activeJourney.currentIndex + 1} of {activeJourney.totalStations} stops</span>
              <button
                onClick={stopJourneySimulation}
                title="Stop Simulation"
                className="p-1 hover:text-rose-400 text-slate-400 transition-colors ml-1"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Station Details */}
          <div className="flex items-center justify-between gap-3 my-2">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-slate-400 uppercase font-medium">Current Station</div>
              <div className="text-sm sm:text-base font-bold text-white truncate">
                {activeJourney.currentStation?.name || 'In Transit'}
              </div>
            </div>

            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-400 shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1 text-right">
              <div className="text-[11px] text-slate-400 uppercase font-medium">
                {isCompleted ? 'Destination Reached' : 'Next Station'}
              </div>
              <div className="text-sm sm:text-base font-bold text-indigo-300 truncate">
                {isCompleted ? activeJourney.toStation?.name : (activeJourney.nextStation?.name || activeJourney.toStation?.name)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2.5">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-indigo-400" />
              <span>Auto Audio Alerts Active</span>
            </div>

            {isCompleted ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Arrived
              </span>
            ) : (
              <button
                onClick={advanceSimulationStep}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Simulate Next Stop
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
