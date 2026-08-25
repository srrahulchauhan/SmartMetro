import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Calendar, Users, Search, Clock, Zap } from 'lucide-react';
import { STATIONS } from '../../data/stations';
import { findRoute } from '../../data/routes';

export default function JourneySearchCard({ 
  initialFromId = 'noida-electronic-city', 
  initialToId = 'sec-16',
  onSearchComplete
}) {
  const navigate = useNavigate();
  const [fromStationId, setFromStationId] = useState(initialFromId);
  const [toStationId, setToStationId] = useState(initialToId);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [passengerCount, setPassengerCount] = useState(1);

  const fromStation = STATIONS.find(s => s.id === fromStationId) || STATIONS[0];
  const toStation = STATIONS.find(s => s.id === toStationId) || STATIONS[5];

  // Route calculation
  const routePreview = findRoute(fromStationId, toStationId);
  const estimatedFare = routePreview.success ? Math.round(routePreview.fare * passengerCount) : 40;

  const handleSwap = () => {
    setFromStationId(toStationId);
    setToStationId(fromStationId);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    const queryParams = new URLSearchParams({
      from: fromStationId,
      to: toStationId,
      date,
      passengers: passengerCount.toString()
    });

    if (onSearchComplete) {
      onSearchComplete({
        fromStation,
        toStation,
        date,
        passengerCount,
        routePreview
      });
    } else {
      navigate(`/book?${queryParams.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* From and To Station Selection */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* From Station */}
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            From Station
          </label>
          <select
            value={fromStationId}
            onChange={(e) => setFromStationId(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {STATIONS.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === toStationId}>
                {s.name} ({s.lineName})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-2 flex justify-center pb-0.5">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap stations"
            className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span className="md:hidden">Swap</span>
          </button>
        </div>

        {/* To Station */}
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            To Station
          </label>
          <select
            value={toStationId}
            onChange={(e) => setToStationId(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {STATIONS.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === fromStationId}>
                {s.name} ({s.lineName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date & Passengers Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Passenger Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Passengers
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              className="w-full pl-9 pr-3 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Passenger (Adult)' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fare Preview & Submit Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            ~{routePreview.durationMins || 18} mins
          </span>
          <span className="font-semibold text-slate-800 dark:text-white">
            Estimated Fare: <span className="text-blue-600 font-bold">₹{estimatedFare}</span>
          </span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search Metro</span>
        </button>
      </div>
    </form>
  );
}
