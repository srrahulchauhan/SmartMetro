import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  Lock, 
  ArrowRight,
  Wallet
} from 'lucide-react';
import Modal from '../common/Modal';
import { useMetro } from '../../context/MetroContext';

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  bookingDetails,
  onPaymentSuccess
}) {
  const { card } = useMetro();
  const [selectedMethod, setSelectedMethod] = useState(card && card.balance >= totalAmount ? 'metro_card' : 'upi');
  const [upiOption, setUpiOption] = useState('gpay'); // gpay | phonepe | paytm | qr
  const [upiId, setUpiId] = useState('');
  const [cardForm, setCardForm] = useState({
    number: '4532 •••• •••• 8821',
    expiry: '09/28',
    cvv: '•••',
    name: 'Rahul Chauhan'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessing, setIsProcessing] = useState(false);

  // Discount calculation for Metro Card
  const isMetroCard = selectedMethod === 'metro_card';
  const metroCardDiscount = isMetroCard ? Math.round(totalAmount * 0.1) : 0;
  const finalPayable = totalAmount - metroCardDiscount;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      onPaymentSuccess({
        paymentMethod: isMetroCard
          ? 'Virtual Metro Card'
          : selectedMethod === 'upi'
          ? `UPI (${upiOption.toUpperCase()})`
          : selectedMethod === 'card'
          ? 'Credit / Debit Card'
          : `Net Banking (${selectedBank})`,
        amountPaid: finalPayable,
        discountApplied: metroCardDiscount,
        timestamp: new Date().toISOString()
      });
    }, 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={isProcessing ? () => {} : onClose} maxWidth="max-w-xl" showClose={!isProcessing}>
      <div className="space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Secure Checkout
            </h3>
            <p className="text-xs text-slate-400">
              Encrypted 256-bit Transit Payment Simulation
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL Secured</span>
          </div>
        </div>

        {/* Order Breakdown Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Route: {bookingDetails?.fromStationName} → {bookingDetails?.toStationName}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {bookingDetails?.passengers?.length || 1} Passenger(s)
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Base Transit Fare</span>
            <span>₹{totalAmount}</span>
          </div>
          {isMetroCard && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Virtual Card 10% Discount</span>
              </span>
              <span>- ₹{metroCardDiscount}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
            <span>Total Payable Amount</span>
            <span className="text-lg text-indigo-600 dark:text-indigo-400">₹{finalPayable}</span>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Payment Method
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'metro_card', label: 'Metro Card', icon: Wallet, badge: '10% OFF' },
              { id: 'upi', label: 'UPI / Apps', icon: Smartphone },
              { id: 'card', label: 'Debit / Credit', icon: CreditCard },
              { id: 'netbanking', label: 'Net Banking', icon: Building2 }
            ].map(method => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                  selectedMethod === method.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                {method.badge && (
                  <span className="absolute -top-2 right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-black tracking-wider">
                    {method.badge}
                  </span>
                )}
                <method.icon className="w-5 h-5 mb-1.5" />
                <span>{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Method Details Panel */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {/* Method: Virtual Metro Card */}
          {selectedMethod === 'metro_card' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Virtual Metro Pass
                    </div>
                    <div className="text-xs text-slate-400">
                      Card No: {card?.cardNumber || '•••• 2489'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Current Balance</div>
                  <div className={`text-base font-extrabold ${card?.balance >= finalPayable ? 'text-emerald-500' : 'text-rose-500'}`}>
                    ₹{card?.balance?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>

              {card?.balance < finalPayable ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between">
                  <span>Insufficient balance to complete booking.</span>
                  <button type="button" onClick={() => setSelectedMethod('upi')} className="font-bold underline">
                    Use UPI instead
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant 1-Click payment deduction with 10% commuter reward.</span>
                </div>
              )}
            </div>
          )}

          {/* Method: UPI */}
          {selectedMethod === 'upi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gpay', label: 'Google Pay' },
                  { id: 'phonepe', label: 'PhonePe' },
                  { id: 'paytm', label: 'Paytm' },
                  { id: 'qr', label: 'UPI QR' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setUpiOption(opt.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                      upiOption === opt.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {upiOption === 'qr' ? (
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-2 flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@okhdfcbank"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Method: Card */}
          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardForm.number}
                  onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                  placeholder="4532 0000 0000 0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength="3"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    placeholder="123"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Method: Net Banking */}
          {selectedMethod === 'netbanking' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB'].map(bank => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    selectedBank === bank
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {bank} Bank
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          disabled={isProcessing || (selectedMethod === 'metro_card' && card?.balance < finalPayable)}
          onClick={handlePay}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authorizing Payment (₹{finalPayable})...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Pay ₹{finalPayable} & Generate QR Ticket</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
