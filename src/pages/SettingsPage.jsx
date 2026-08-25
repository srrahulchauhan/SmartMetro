import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Volume2, 
  VolumeX, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useMetro } from '../context/MetroContext';
import { STATIONS } from '../data/stations';
import { soundFx } from '../utils/sound';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function SettingsPage() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { preferences, updatePreferences } = useAuth();
  const { showToast } = useMetro();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleToggleSound = () => {
    const newVal = !preferences.soundEffects;
    updatePreferences({ soundEffects: newVal });
    soundFx.setEnabled(newVal);
    if (newVal) soundFx.playMetroChime();
  };

  const handleToggleNotif = () => {
    updatePreferences({ liveJourneyAlerts: !preferences.liveJourneyAlerts });
  };

  const handleLanguageChange = (e) => {
    updatePreferences({ language: e.target.value });
    showToast({
      title: 'Language Updated 🌐',
      message: `System language set to ${e.target.value}`,
      type: 'info'
    });
  };

  const handleDefaultStationChange = (e) => {
    updatePreferences({ defaultStationId: e.target.value });
    showToast({
      title: 'Default Station Set 📍',
      message: 'Quick booking origin updated.',
      type: 'success'
    });
  };

  const handleResetData = () => {
    localStorage.clear();
    showToast({
      title: 'Data Reset ↺',
      message: 'Local storage wiped. Reloading fresh demo state...',
      type: 'info'
    });
    setTimeout(() => {
      window.location.href = '/';
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize UI theme, transit sound synthesis, audio alerts, and localization
        </p>
      </div>

      {/* Settings Sections */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Appearance / Theme */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Theme Mode</div>
              <div className="text-xs text-slate-400">Switch between Dark and Light display</div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            {isDark ? 'Dark Theme 🌙' : 'Light Theme ☀️'}
          </button>
        </div>

        {/* Audio Sound Effects */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {preferences.soundEffects ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Web Audio Sound FX</div>
              <div className="text-xs text-slate-400">Gate chimes, destination alerts & ticket scanner beeps</div>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              preferences.soundEffects
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {preferences.soundEffects ? 'Enabled ✓' : 'Muted'}
          </button>
        </div>

        {/* Live Journey Alerts */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Smart Destination Alerts</div>
              <div className="text-xs text-slate-400">Proximity notifications when 1 station away from destination</div>
            </div>
          </div>

          <button
            onClick={handleToggleNotif}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              preferences.liveJourneyAlerts
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {preferences.liveJourneyAlerts ? 'Active ✓' : 'Off'}
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Transit Language</div>
              <div className="text-xs text-slate-400">Station announcements & interface language</div>
            </div>
          </div>

          <select
            value={preferences.language || 'English'}
            onChange={handleLanguageChange}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="English">English (EN)</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Spanish">Español (ES)</option>
            <option value="French">Français (FR)</option>
          </select>
        </div>

        {/* Default Station Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Default Station</div>
              <div className="text-xs text-slate-400">Preferred boarding station for 1-click booking</div>
            </div>
          </div>

          <select
            value={preferences.defaultStationId || 'noida-electronic-city'}
            onChange={handleDefaultStationChange}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            {STATIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        {/* Reset Demo Data */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Reset Local Mock Data</div>
              <div className="text-xs text-slate-400">Restore factory demo state & refresh cards and tickets</div>
            </div>
          </div>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
        title="Reset Demo Data?"
        message="This will clear your local storage tickets, virtual card balance, and restore initial sample datasets."
        confirmText="Yes, Reset Everything"
        isDestructive={true}
      />
    </div>
  );
}
