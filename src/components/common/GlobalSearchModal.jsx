import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Train, Ticket, CreditCard, MapPin, Compass, ShieldAlert, ArrowRight, X, Sparkles } from 'lucide-react';
import { STATIONS } from '../../data/stations';
import { METRO_LINES } from '../../data/lines';
import { FAQS } from '../../data/faqs';
import { useMetro } from '../../context/MetroContext';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { tickets, card } = useMetro();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const matchedStations = STATIONS.filter(s =>
      s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.lineName.toLowerCase().includes(q)
    ).map(s => ({
      type: 'Station',
      id: s.id,
      title: s.name,
      subtitle: `${s.lineName} • Platform 1 & 2`,
      icon: MapPin,
      badge: s.code,
      action: () => {
        navigate(`/train-status?station=${s.id}`);
        onClose();
      }
    }));

    const matchedTickets = tickets.filter(t =>
      t.id.toLowerCase().includes(q) || t.fromStationName.toLowerCase().includes(q) || t.toStationName.toLowerCase().includes(q)
    ).map(t => ({
      type: 'Ticket',
      id: t.id,
      title: `${t.fromStationName} → ${t.toStationName}`,
      subtitle: `Ticket ID: ${t.id} • ${t.status}`,
      icon: Ticket,
      badge: `₹${t.fare}`,
      action: () => {
        navigate(`/my-tickets?ticket=${t.id}`);
        onClose();
      }
    }));

    const matchedFaqs = FAQS.filter(f =>
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    ).map((f, i) => ({
      type: 'Help & FAQ',
      id: `faq-${i}`,
      title: f.question,
      subtitle: f.category,
      icon: Sparkles,
      action: () => {
        navigate('/help-support');
        onClose();
      }
    }));

    const quickLinks = [
      { name: 'Book Metro Ticket', path: '/book', icon: Ticket, desc: 'Single, Return & Group tickets' },
      { name: 'Virtual Metro Card', path: '/card', icon: CreditCard, desc: 'Balance, recharge & pass settings' },
      { name: 'Interactive Metro Map', path: '/map', icon: Compass, desc: 'Network map & route lines' },
      { name: 'Live Train Status', path: '/train-status', icon: Train, desc: 'Headway & departure timings' }
    ].filter(item => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q))
    .map(item => ({
      type: 'Navigation',
      id: item.path,
      title: item.name,
      subtitle: item.desc,
      icon: item.icon,
      action: () => {
        navigate(item.path);
        onClose();
      }
    }));

    return [...matchedStations, ...matchedTickets, ...quickLinks, ...matchedFaqs].slice(0, 8);
  }, [query, tickets, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stations, tickets, routes, recharge, help... (e.g. 'Sector 16' or 'Ticket')"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="p-4 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Popular Quick Actions</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Book Ticket', path: '/book', icon: Ticket, sub: 'Single/Return/Group' },
                  { label: 'Virtual Metro Card', path: '/card', icon: CreditCard, sub: `Balance: ₹${card?.balance || 0}` },
                  { label: 'Live Train Tracker', path: '/train-status', icon: Train, sub: 'Arrival countdowns' },
                  { label: 'Network Metro Map', path: '/map', icon: Compass, sub: 'Interactive diagram' }
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-200 dark:hover:border-indigo-800/50 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1.5">
              {results.map((item, idx) => (
                <button
                  key={`${item.type}-${item.id || idx}`}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No results found for "<span className="text-indigo-500 font-semibold">{query}</span>"
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
