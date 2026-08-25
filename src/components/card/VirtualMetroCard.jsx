import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Wifi, 
  Sparkles, 
  Lock, 
  RotateCw, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { useMetro } from '../../context/MetroContext';

export default function VirtualMetroCard({ card, onRechargeClick, onFreezeToggle, onAutoRechargeToggle }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* 3D Perspective Card Container */}
      <div className="perspective-1000">
        <motion.div
          className="relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl transition-transform duration-500 transform-style-3d cursor-pointer select-none overflow-hidden"
          style={{
            background: card.isFrozen
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
            boxShadow: card.isFrozen
              ? '0 20px 40px -15px rgba(15, 23, 42, 0.5)'
              : '0 25px 50px -12px rgba(99, 102, 241, 0.4)'
          }}
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Subtle Background Circuit pattern & light glare */}
          <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-32 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />

          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="h-full flex flex-col justify-between relative z-10">
              {/* Top Row: Network Name + NFC Contactless Icon + Freeze status */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg tracking-wider">METRO PASS</span>
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-400/30">
                      PLATINUM
                    </span>
                  </div>
                  <div className="text-[10px] text-indigo-300 font-mono tracking-widest mt-0.5">
                    NATIONAL TRANSIT SMARTCARD
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {card.isFrozen ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                      <Lock className="w-3 h-3" /> Frozen
                    </span>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                      <Wifi className="w-4 h-4 rotate-90" />
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: EMV Chip + Hologram + Balance */}
              <div className="flex items-center justify-between my-auto">
                <div className="flex items-center gap-3">
                  {/* Gold EMV Chip */}
                  <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/60 shadow-inner flex items-center justify-center">
                    <div className="w-7 h-5 border border-amber-600/30 rounded-sm" />
                  </div>
                  <div className="hidden sm:block text-[10px] text-indigo-200 font-medium leading-tight">
                    NFC Enabled<br />Auto-Gate Pass
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-indigo-200 uppercase font-semibold">Available Balance</div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ₹{card.balance.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Bottom: Card Number + Cardholder + Expiry */}
              <div>
                <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-slate-100 mb-2">
                  {card.cardNumber}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-indigo-300">Cardholder</div>
                    <div className="font-bold text-white uppercase">{card.holderName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-indigo-300">Valid Thru</div>
                    <div className="font-mono font-bold text-white">{card.validUntil || '12/29'}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-300">
                    <RotateCw className="w-3 h-3" />
                    <span>Flip for QR</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* BACK OF CARD: QR Code & Security Info */
            <div className="h-full flex items-center justify-between relative z-10 px-2">
              <div className="space-y-2 max-w-[55%]">
                <div className="text-sm font-bold text-white">Digital Pass Barcode</div>
                <p className="text-[11px] text-indigo-200 leading-tight">
                  Hold near the AFC scanner sensor or display to station marshals for visual validation.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-indigo-300 block">CARD UID</span>
                  <span className="text-xs font-mono font-bold text-white">{card.cardNumber}</span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-2xl shadow-lg flex flex-col items-center">
                <QRCodeSVG value={card.qrCode || card.cardNumber} size={90} />
                <span className="text-[9px] font-mono font-bold text-slate-900 mt-1">TAP / SCAN</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
        <button
          onClick={onRechargeClick}
          className="py-3 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all shadow-md shadow-indigo-600/20"
        >
          <CreditCard className="w-4 h-4" />
          <span>Add Money</span>
        </button>

        <button
          onClick={onFreezeToggle}
          className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
            card.isFrozen
              ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>{card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
        </button>

        <button
          onClick={onAutoRechargeToggle}
          className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
            card.autoRecharge
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Auto-Recharge {card.autoRecharge ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
}
