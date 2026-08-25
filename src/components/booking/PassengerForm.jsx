import React from 'react';
import { User, Phone, Plus, Trash2, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PassengerForm({ passengers, onChange }) {
  const { savedPassengers, addSavedPassenger } = useAuth();

  const handleUpdate = (index, field, value) => {
    const updated = passengers.map((p, i) => {
      if (i === index) {
        return { ...p, [field]: value };
      }
      return p;
    });
    onChange(updated);
  };

  const handleAddPassenger = () => {
    if (passengers.length >= 6) return;
    onChange([
      ...passengers,
      { name: '', age: '', phone: '', gender: 'Male' }
    ]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length <= 1) return;
    onChange(passengers.filter((_, i) => i !== index));
  };

  const handleSelectSaved = (index, saved) => {
    const updated = passengers.map((p, i) => {
      if (i === index) {
        return {
          name: saved.name,
          age: saved.age,
          phone: saved.phone,
          gender: saved.gender || 'Male'
        };
      }
      return p;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Passenger Details ({passengers.length})
          </h3>
          <p className="text-xs text-slate-400">
            Digital QR tickets will be generated for each traveller
          </p>
        </div>

        {passengers.length < 6 && (
          <button
            type="button"
            onClick={handleAddPassenger}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Passenger</span>
          </button>
        )}
      </div>

      {/* Dynamic Passenger Cards */}
      <div className="space-y-4">
        {passengers.map((passenger, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Passenger {idx + 1} {idx === 0 ? '(Primary Commuter)' : ''}
                </span>
              </div>

              {/* Quick Select Saved Passenger Pills */}
              {savedPassengers.length > 0 && (
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Quick fill:</span>
                  {savedPassengers.map(sp => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => handleSelectSaved(idx, sp)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/40 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {sp.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              )}

              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePassenger(idx)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                  title="Remove passenger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={passenger.name}
                    onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                    placeholder="e.g. Rahul Chauhan"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  required
                  value={passenger.age}
                  onChange={(e) => handleUpdate(idx, 'age', e.target.value)}
                  placeholder="28"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Mobile Number */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Mobile Number (for SMS & QR link) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={passenger.phone}
                    onChange={(e) => handleUpdate(idx, 'phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Gender
                </label>
                <select
                  value={passenger.gender || 'Male'}
                  onChange={(e) => handleUpdate(idx, 'gender', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Save to Profile Helper */}
            {passenger.name && passenger.phone && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => addSavedPassenger(passenger)}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Save to frequent passengers</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
