import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Lock, 
  Unlock, 
  Zap, 
  ShieldCheck, 
  ReceiptText, 
  Wifi, 
  Gift, 
  Percent, 
  RotateCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import VirtualMetroCard from '../components/card/VirtualMetroCard';
import RechargeModal from '../components/card/RechargeModal';
import GateSimulatorModal from '../components/card/GateSimulatorModal';
import { useMetro } from '../context/MetroContext';
import { formatDate } from '../utils/formatters';

export default function VirtualCardPage() {
  const { card, toggleFreezeCard, toggleAutoRecharge, transactions } = useMetro();
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isGateSimulatorOpen, setIsGateSimulatorOpen] = useState(false);

  const cardTransactions = transactions.filter(t => 
    t.paymentMethod?.includes('Card') || t.category?.includes('Card') || t.category?.includes('Recharge') || t.category?.includes('Gate Tap')
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Virtual Metro Smartcard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Contactless NFC transit pass with auto-capping and 10% commuter discounts
          </p>
        </div>

        <button
          onClick={() => setIsGateSimulatorOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Wifi className="w-4 h-4 rotate-90" />
          <span>Simulate Gate Entry</span>
        </button>
      </div>

      {/* 3D Virtual Card Container */}
      <VirtualMetroCard
        card={card}
        onRechargeClick={() => setIsRechargeOpen(true)}
        onFreezeToggle={toggleFreezeCard}
        onAutoRechargeToggle={toggleAutoRecharge}
      />

      {/* Card Perks & Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              10% Commuter Discount
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Enjoy flat 10% off on all journeys + 20% off in non-peak hours.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Fare Capping
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Ride unlimited after reaching ₹200 daily cap. Free transfers across lines.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Instant Fraud Freeze
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              1-click instant security lock to safeguard your wallet balance.
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Recharge Settings Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Auto-Recharge Protection
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automatically top-up ₹500 via UPI AutoPay whenever balance drops below ₹100
          </p>
        </div>

        <button
          onClick={toggleAutoRecharge}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            card.autoRecharge
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          {card.autoRecharge ? 'Enabled ✓' : 'Disabled'}
        </button>
      </div>

      {/* Card Activity & Statements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Card Transaction Activity
          </h3>
          <span className="text-xs text-slate-400">
            {cardTransactions.length} recorded events
          </span>
        </div>

        <div className="p-2 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          {cardTransactions.length > 0 ? (
            cardTransactions.map(txn => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {txn.title}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {formatDate(txn.date)} • {txn.id}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-black ${
                    txn.type === 'CREDIT' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                  }`}>
                    {txn.type === 'CREDIT' ? '+' : '-'} ₹{txn.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {txn.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No recent smartcard transactions.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
      <GateSimulatorModal isOpen={isGateSimulatorOpen} onClose={() => setIsGateSimulatorOpen(false)} />
    </div>
  );
}
