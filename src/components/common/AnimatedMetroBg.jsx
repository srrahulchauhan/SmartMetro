import React from 'react';

export default function AnimatedMetroBg({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none rounded-3xl ${className}`}>
      {/* Background Delhi Metro Photo Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-55 mix-blend-overlay scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('/metro_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-indigo-950/80 to-slate-950/90" />

      {/* Animated Metro Line Track */}
      <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-indigo-500/20 bg-slate-900/40 backdrop-blur-sm flex items-center overflow-hidden">
        {/* Track Rails */}
        <div className="absolute top-2 left-0 right-0 h-0.5 bg-slate-700/60" />
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700/60" />

        {/* Animated Passing Metro Train (Streamlined Express Metro SVG) */}
        <div className="absolute top-1 animate-train-pass w-72 flex items-center z-10">
          {/* Train Headlight Glow */}
          <div className="w-4 h-4 rounded-full bg-cyan-400 blur-sm shrink-0" />
          
          {/* Metro Body */}
          <div className="h-4 bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-600 rounded-r-lg rounded-l-sm flex items-center px-2 gap-1 w-full border border-cyan-300/40 shadow-lg shadow-cyan-500/20">
            {/* Windows */}
            <div className="w-3 h-2 bg-slate-950/80 rounded-sm" />
            <div className="w-5 h-2 bg-slate-950/80 rounded-sm" />
            <div className="w-5 h-2 bg-slate-950/80 rounded-sm" />
            <div className="w-5 h-2 bg-slate-950/80 rounded-sm" />
            <div className="w-5 h-2 bg-slate-950/80 rounded-sm" />
            <div className="w-5 h-2 bg-slate-950/80 rounded-sm" />
            <div className="w-3 h-2 bg-slate-950/80 rounded-sm" />
            {/* Tail Light */}
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto shrink-0 animate-pulse" />
          </div>
        </div>

        {/* Opposite Direction Metro Train (Slower/Darker) */}
        <div className="absolute top-3 animate-train-pass-reverse w-64 flex items-center opacity-70 z-0">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
          <div className="h-3 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-800 rounded-l-lg rounded-r-sm flex items-center px-2 gap-1 w-full border border-indigo-400/20">
            <div className="w-4 h-1.5 bg-slate-950/80 rounded-sm" />
            <div className="w-4 h-1.5 bg-slate-950/80 rounded-sm" />
            <div className="w-4 h-1.5 bg-slate-950/80 rounded-sm" />
            <div className="w-4 h-1.5 bg-slate-950/80 rounded-sm" />
            <div className="w-4 h-1.5 bg-slate-950/80 rounded-sm" />
          </div>
          <div className="w-3 h-3 rounded-full bg-amber-400 blur-sm shrink-0" />
        </div>

        {/* Signal Lights along the Track */}
        <div className="absolute right-8 top-1 flex items-center gap-1.5 z-20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Line Active</span>
        </div>
      </div>
    </div>
  );
}
