import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CreditCard, Smartphone, Building2, ShieldCheck, Loader2, CheckCircle2, Zap } from 'lucide-react';
import Modal from '../common/Modal';
import { useMetro } from '../../context/MetroContext';

export default function RechargeModal({ isOpen, onClose }) {
  const { rechargeCard, card } = useMetro();
  const [amount, setAmount] = useState('500');
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = ['100', '200', '500', '1000'];

  const handleSelectPreset = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val) setAmount(val);
  };

  const handleRecharge = () => {
    const finalAmount = parseFloat(customAmount || amount);
    if (!finalAmount || finalAmount < 10) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      rechargeCard(finalAmount, method.toUpperCase());
      
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      onClose();
    }, 1200);
  };

  const finalVal = parseFloat(customAmount || amount) || 0;

  return (
    <Modal isOpen={isOpen} onClose={isProcessing ? () => {} : onClose} maxWidth="max-w-md" showClose={!isProcessing}>
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recharge Virtual Metro Card
          </h3>
          <p className="text-xs text-slate-400">
            Instant balance top-up with 5% cashback reward
          </p>
        </div>

        {/* Current Balance & Top-up Amount Preview */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Current Balance</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              ₹{card?.balance.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold block">After Recharge</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              ₹{((card?.balance || 0) + finalVal).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quick Amount Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Top-up Amount
          </label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                  amount === p && !customAmount
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                ₹{p}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="pt-2">
            <input
              type="number"
              min="10"
              max="10000"
              placeholder="Or enter custom amount (e.g. ₹750)"
              value={customAmount}
              onChange={handleCustomChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'upi', label: 'UPI / QR', icon: Smartphone },
              { id: 'card', label: 'Debit/Credit', icon: CreditCard },
              { id: 'netbanking', label: 'Net Banking', icon: Building2 }
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  method === m.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-500'
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <m.icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cashback pill */}
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
          <Zap className="w-4 h-4 shrink-0" />
          <span>You will receive <strong>₹{Math.round(finalVal * 0.05)} transit cashback</strong> credited to your card balance!</span>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          disabled={isProcessing || finalVal < 10}
          onClick={handleRecharge}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Adding ₹{finalVal} to Card...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Proceed to Pay ₹{finalVal}</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
