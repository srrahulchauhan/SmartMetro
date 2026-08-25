import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Layers, 
  CreditCard, 
  Route, 
  Activity, 
  Compass, 
  ReceiptText, 
  Bell, 
  HelpCircle, 
  User, 
  Settings, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useMetro } from '../../context/MetroContext';

export default function Sidebar({ isOpen, onClose }) {
  const { tickets } = useMetro();

  const activeTicketsCount = tickets.filter(t => t.status === 'ACTIVE').length;

  const mainNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Book Ticket', path: '/book', icon: Ticket, highlight: true },
    { name: 'My Tickets', path: '/my-tickets', icon: Layers, badge: activeTicketsCount > 0 ? activeTicketsCount : null, badgeColor: 'bg-emerald-500 text-white' },
    { name: 'Virtual Metro Card', path: '/card', icon: CreditCard },
    { name: 'Journey Planner', path: '/planner', icon: Route },
    { name: 'Train Status', path: '/train-status', icon: Activity },
    { name: 'Metro Map', path: '/map', icon: Compass },
    { name: 'Transactions', path: '/transactions', icon: ReceiptText },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const secondaryNav = [
    { name: 'Help & Support', path: '/help-support', icon: HelpCircle },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Commute & Mobility
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                        : item.highlight
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-indigo-700' : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              System & Preferences
            </div>
            <nav className="space-y-1">
              {secondaryNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white text-indigo-700' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Eco Commute Badge at bottom of Sidebar */}
        <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50/50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Green Commuter</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            You've saved <strong className="text-emerald-600 dark:text-emerald-400">84.6 kg CO₂</strong> riding electric metro trains!
          </p>
        </div>
      </aside>
    </>
  );
}
