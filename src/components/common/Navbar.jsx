import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Train, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  CreditCard, 
  Plus, 
  Menu, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  User,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useMetro } from '../../context/MetroContext';
import { useAuth } from '../../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { card, notifications } = useMetro();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Left: Brand & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Train className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Smart <span className="text-indigo-600 dark:text-indigo-400">Metro</span>
                </span>
              </div>
            </Link>

            {/* Live Service Status Pill (Desktop) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold ml-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Lines Normal Service</span>
            </div>
          </div>

          {/* Center / Search Bar Trigger */}
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-sm group shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                <span>Search stations, tickets, routes...</span>
              </span>
              <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shadow-sm">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search icon for mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Metro Card Balance Pill */}
            {card && (
              <Link
                to="/card"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200 group"
              >
                <CreditCard className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
                <span>₹{card.balance.toFixed(0)}</span>
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] ml-0.5">
                  <Plus className="w-3 h-3" />
                </span>
              </Link>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <Link
                to="/notifications"
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors flex items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-950 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile Pill */}
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-1 sm:pl-2 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className="hidden xl:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user.name.split(' ')[0]}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
