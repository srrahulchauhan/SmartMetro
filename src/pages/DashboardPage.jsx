import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Train, 
  Ticket, 
  CreditCard, 
  Route, 
  Activity, 
  MapPin, 
  Clock, 
  ArrowRight, 
  QrCode,
  CheckCircle2,
  Calendar,
  Users
} from 'lucide-react';
import JourneySearchCard from '../components/booking/JourneySearchCard';
import DigitalTicketModal from '../components/booking/DigitalTicketModal';
import { STATIONS } from '../data/stations';
import { useMetro } from '../context/MetroContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tickets, card, startJourneySimulation } = useMetro();
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const activeTicket = tickets.find(t => t.status === 'ACTIVE');
  const recentTickets = tickets.slice(0, 3);
  const nearestStation = STATIONS[0];

  const quickActions = [
    { title: 'Book Ticket', desc: 'Book QR travel pass', icon: Ticket, path: '/book', color: 'bg-blue-600' },
    { title: 'Metro Card', desc: `Balance: ₹${card?.balance.toFixed(0) || 0}`, icon: CreditCard, path: '/card', color: 'bg-indigo-600' },
    { title: 'Route Planner', desc: 'Find fastest route', icon: Route, path: '/planner', color: 'bg-emerald-600' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
            Good Morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Book your metro ticket, check live arrivals, and manage your travel card.
          </p>
        </div>

        {activeTicket && (
          <button
            onClick={() => setSelectedTicket(activeTicket)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <QrCode className="w-4 h-4" />
            <span>Active Ticket (QR)</span>
          </button>
        )}
      </div>

      {/* Main Section: Search Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-blue-600" />
          <span>Book Your Metro Ticket</span>
        </h2>
        <JourneySearchCard />
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm transition-all flex items-center gap-3.5 group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Next Metro & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Metro Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Train className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Next Metro Arrival</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              Live
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 dark:text-white">
                {nearestStation.name} → Sector 16
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {nearestStation.lineName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Next Train</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">5 min</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Platform</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">Platform 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Recent Tickets</h2>
            </div>
            <Link to="/my-tickets" className="text-xs text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentTickets.length > 0 ? (
              recentTickets.map((t) => (
                <div 
                  key={t.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white">
                      {t.fromStationName} → {t.toStationName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Today • ₹{t.fare}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    View Ticket
                  </button>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">
                No recent tickets found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Digital Ticket Modal */}
      <DigitalTicketModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onStartSimulation={(t) => startJourneySimulation(t.fromStationId, t.toStationId)}
      />
    </div>
  );
}
