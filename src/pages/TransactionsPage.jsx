import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ReceiptText, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw, 
  CheckCircle2, 
  CreditCard, 
  Ticket, 
  Wallet 
} from 'lucide-react';
import { useMetro } from '../context/MetroContext';
import { formatDate } from '../utils/formatters';

export default function TransactionsPage() {
  const { transactions, showToast } = useMetro();
  const [filterType, setFilterType] = useState('ALL'); // ALL | DEBIT | CREDIT | REFUND
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(txn => {
    const matchesType = filterType === 'ALL' || txn.type === filterType;
    const matchesSearch = search === '' ||
      txn.id.toLowerCase().includes(search.toLowerCase()) ||
      txn.title.toLowerCase().includes(search.toLowerCase()) ||
      txn.category?.toLowerCase().includes(search.toLowerCase()) ||
      txn.paymentMethod?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportStatement = () => {
    showToast({
      title: 'Statement Exported 📄',
      message: 'Monthly Transit Transaction Statement (PDF) downloaded successfully.',
      type: 'success'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Transit Ledger & Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete record of ticket bookings, smartcard recharges, AFC turnstile debits and refunds
          </p>
        </div>

        <button
          onClick={handleExportStatement}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:border-indigo-500 transition-all"
        >
          <Download className="w-4 h-4 text-indigo-500" />
          <span>Export Statement (PDF)</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
          {['ALL', 'DEBIT', 'CREDIT', 'REFUND'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'All Transactions' : type}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID or description..."
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-2 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        {filtered.length > 0 ? (
          filtered.map(txn => {
            const isCredit = txn.type === 'CREDIT';
            const isRefund = txn.type === 'REFUND';

            return (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCredit
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : isRefund
                      ? 'bg-indigo-500/10 text-indigo-500'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : isRefund ? <RotateCcw className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {txn.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{formatDate(txn.date)}</span>
                      <span>• {txn.id}</span>
                      {txn.paymentMethod && (
                        <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">
                          {txn.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className={`text-sm sm:text-base font-black ${
                    isCredit ? 'text-emerald-500' : isRefund ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {isCredit ? '+' : isRefund ? '↺' : '-'} ₹{txn.amount.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {txn.status || 'Completed'}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No transactions matching criteria.
          </div>
        )}
      </div>
    </div>
  );
}
