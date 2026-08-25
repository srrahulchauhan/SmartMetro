import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, CreditCard, Compass, User } from 'lucide-react';
import { useMetro } from '../../context/MetroContext';

export default function BottomNav() {
  const { tickets } = useMetro();
  const activeTicketsCount = tickets.filter(t => t.status === 'ACTIVE').length;

  const items = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'Tickets', path: '/my-tickets', icon: Ticket, badge: activeTicketsCount > 0 ? activeTicketsCount : null },
    { label: 'Card', path: '/card', icon: CreditCard },
    { label: 'Map', path: '/map', icon: Compass },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 lg:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className={`w-5 h-5 ${isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : ''} transition-transform`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
