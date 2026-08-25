import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, 
  Search, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  ArrowRight, 
  Download, 
  Share2, 
  Play, 
  X,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DigitalTicketModal from '../components/booking/DigitalTicketModal';
import EmptyState from '../components/common/EmptyState';
import { useMetro } from '../context/MetroContext';
import { formatDate } from '../utils/formatters';

export default function MyTicketsPage() {
  const [searchParams] = useSearchParams();
  const { tickets, cancelTicket, startJourneySimulation } = useMetro();
  const [activeTab, setActiveTab] = useState('ACTIVE'); // ACTIVE | UPCOMING | COMPLETED | CANCELLED
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(() => {
    const ticketId = searchParams.get('ticket');
    return ticketId ? tickets.find(t => t.id === ticketId) || null : null;
  });

  const tabs = [
    { id: 'ACTIVE', label: 'Active Pass', count: tickets.filter(t => t.status === 'ACTIVE').length },
    { id: 'UPCOMING', label: 'Upcoming', count: tickets.filter(t => t.status === 'UPCOMING').length },
    { id: 'COMPLETED', label: 'Completed', count: tickets.filter(t => t.status === 'COMPLETED').length },
    { id: 'CANCELLED', label: 'Cancelled', count: tickets.filter(t => t.status === 'CANCELLED').length },
  ];

  const filteredTickets = tickets.filter(t => {
    const matchesTab = t.status === activeTab;
    const matchesSearch = searchQuery === '' || 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.fromStationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.toStationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Metro Tickets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your digital AFC transit passes, live QR codes and journey history
          </p>
        </div>

        <Link
          to="/book"
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Ticket</span>
        </Link>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by station or ID..."
            className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Top Row: Ticket ID & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    {ticket.id}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {ticket.journeyType}
                  </span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                  ticket.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : ticket.status === 'UPCOMING'
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                    : ticket.status === 'COMPLETED'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}>
                  {ticket.status}
                </span>
              </div>

              {/* Station Route Details */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 uppercase font-medium">Boarding</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {ticket.fromStationName}
                  </div>
                </div>

                <div className="flex flex-col items-center px-2">
                  <div className="w-16 sm:w-28 relative flex items-center justify-center">
                    <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
                    <div className="absolute w-2 h-2 rounded-full bg-indigo-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-1">
                    {ticket.stopsCount || 6} Stops (~{ticket.durationMins || 18}m)
                  </span>
                </div>

                <div className="min-w-0 text-right">
                  <div className="text-xs text-slate-400 uppercase font-medium">Destination</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {ticket.toStationName}
                  </div>
                </div>
              </div>

              {/* Meta & Passengers */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span>📅 {formatDate(ticket.date)} at {ticket.time}</span>
                  <span>👥 {ticket.passengers?.length || 1} Passenger(s)</span>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ₹{ticket.fare?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Ticket</span>
                  </button>

                  {ticket.status === 'ACTIVE' && (
                    <button
                      onClick={() => startJourneySimulation(ticket.fromStationId, ticket.toStationId)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Journey</span>
                    </button>
                  )}
                </div>

                {ticket.status === 'ACTIVE' && (
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState
            icon={Ticket}
            title={`No ${activeTab.toLowerCase()} tickets found`}
            description="You don't have any transit tickets in this category."
            actionLabel="Book a New Journey"
            onAction={() => window.location.href = '/book'}
          />
        )}
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
