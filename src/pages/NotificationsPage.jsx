import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Train, 
  Ticket, 
  CreditCard, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Gift
} from 'lucide-react';
import { useMetro } from '../context/MetroContext';

export default function NotificationsPage() {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useMetro();

  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'Journey', 'Ticket', 'Payment', 'Service', 'Offers'];

  const filtered = notifications.filter(n => {
    return activeCategory === 'ALL' || n.category === activeCategory;
  });

  const getIcon = (category, type) => {
    switch (category) {
      case 'Journey': return <Train className="w-5 h-5 text-indigo-500" />;
      case 'Ticket': return <Ticket className="w-5 h-5 text-emerald-500" />;
      case 'Payment': return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'Service': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'Offers': return <Gift className="w-5 h-5 text-fuchsia-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time transit alerts, destination proximity chimes, ticket bookings and wallet updates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Alerts' : cat}
          </button>
        ))}
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 shadow-sm ring-1 ring-indigo-500/20'
                  : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.category, notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {notif.category}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notif.id);
                }}
                className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
