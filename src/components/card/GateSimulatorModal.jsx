import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { useMetro } from '../../context/MetroContext';
import { STATIONS } from '../../data/stations';

export default function GateSimulatorModal({ isOpen, onClose }) {
  const { card, simulateGateTap } = useMetro();
  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);
  const [gateStatus, setGateStatus] = useState('IDLE'); // IDLE | SCANNING | OPEN | DENIED
  const [fareDeducted, setFareDeducted] = useState(25);

  if (!isOpen) return null;

  const handleTap = () => {
    if (gateStatus === 'SCANNING') return;
    setGateStatus('SCANNING');

    setTimeout(() => {
      const res = simulateGateTap(selectedStation.name, fareDeducted);
      if (res.success) {
        setGateStatus('OPEN');
        setTimeout(() => {
          setGateStatus('IDLE');
        }, 3000);
      } else {
        setGateStatus('DENIED');
        setTimeout(() => {
          setGateStatus('IDLE');
        }, 3000);
      }
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-6 text-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            AFC Smart Turnstile Gate Simulator
          </h3>
          <p className="text-xs text-slate-400">
            Simulate contactless NFC Metro Pass gate tap at automated transit barriers
          </p>
        </div>

        {/* Station Selector for Gate Simulation */}
        <div className="text-left space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Station Gate Location
          </label>
          <select
            value={selectedStation.id}
            onChange={(e) => setSelectedStation(STATIONS.find(s => s.id === e.target.value) || STATIONS[0])}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATIONS.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.lineName}) — Platform 1 & 2
              </option>
            ))}
          </select>
        </div>

        {/* Realistic Gate Visual Graphic */}
        <div className="relative p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
          {/* Gate Barrier Flaps */}
          <div className="flex items-center justify-between w-full max-w-[200px] mb-6">
            <motion.div
              className="w-16 h-4 bg-rose-500 rounded-r-full shadow-lg"
              animate={gateStatus === 'OPEN' ? { rotate: -60, x: -10 } : { rotate: 0, x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-16 h-4 bg-rose-500 rounded-l-full shadow-lg"
              animate={gateStatus === 'OPEN' ? { rotate: 60, x: 10 } : { rotate: 0, x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Glowing Scanner Pad */}
          <motion.div
            onClick={handleTap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 transition-all relative ${
              gateStatus === 'OPEN'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : gateStatus === 'DENIED'
                ? 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                : gateStatus === 'SCANNING'
                ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.6)] animate-pulse'
                : 'bg-indigo-900/40 border-indigo-500/50 text-indigo-400 hover:border-indigo-400'
            }`}
          >
            <Wifi className="w-8 h-8 rotate-90" />
            <span className="text-[10px] font-mono font-bold mt-1 tracking-wider">
              {gateStatus === 'OPEN' ? 'GATE OPEN' : gateStatus === 'DENIED' ? 'DENIED' : 'TAP HERE'}
            </span>
          </motion.div>

          {/* Dynamic Message */}
          <div className="mt-4 text-xs font-semibold">
            {gateStatus === 'OPEN' && (
              <span className="text-emerald-400 flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="w-4 h-4" /> Please proceed through Gate 03 (₹{fareDeducted} deducted)
              </span>
            )}
            {gateStatus === 'DENIED' && (
              <span className="text-rose-400 flex items-center gap-1.5 justify-center">
                <XCircle className="w-4 h-4" /> Card is frozen or balance insufficient
              </span>
            )}
            {gateStatus === 'SCANNING' && (
              <span className="text-indigo-300 animate-pulse">
                Validating NFC Token with Central AFC...
              </span>
            )}
            {gateStatus === 'IDLE' && (
              <span className="text-slate-400">
                Click the sensor pad to simulate a contactless turnstile swipe
              </span>
            )}
          </div>
        </div>

        {/* Card info strip */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Card Balance</span>
            <span className="font-bold text-slate-900 dark:text-white">₹{card?.balance.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase">Card Status</span>
            <span className={`font-bold ${card?.isFrozen ? 'text-rose-500' : 'text-emerald-500'}`}>
              {card?.isFrozen ? 'FROZEN' : 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Tap Action Button */}
        <button
          type="button"
          onClick={handleTap}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Wifi className="w-4 h-4 rotate-90" />
          <span>Tap Metro Card at {selectedStation.name}</span>
        </button>
      </div>
    </Modal>
  );
}
