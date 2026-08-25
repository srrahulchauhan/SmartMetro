import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  Zap, 
  Users, 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Edit3,
  BookmarkCheck,
  ShieldCheck
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useMetro } from '../context/MetroContext';

export default function ProfilePage() {
  const { user, updateUser, savedPassengers, addSavedPassenger, removeSavedPassenger } = useAuth();
  const { card, tickets, showToast } = useMetro();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPassengerOpen, setIsAddPassengerOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });

  const [newPassengerForm, setNewPassengerForm] = useState({
    name: '',
    age: '',
    phone: '',
    gender: 'Male'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser(editForm);
    setIsEditModalOpen(false);
    showToast({
      title: 'Profile Updated ✓',
      message: 'Your commuter details have been saved.',
      type: 'success'
    });
  };

  const handleAddPassenger = (e) => {
    e.preventDefault();
    if (!newPassengerForm.name || !newPassengerForm.phone) return;

    addSavedPassenger(newPassengerForm);
    setIsAddPassengerOpen(false);
    setNewPassengerForm({ name: '', age: '', phone: '', gender: 'Male' });
    showToast({
      title: 'Passenger Added 👥',
      message: `${newPassengerForm.name} saved for 1-click booking.`,
      type: 'success'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-indigo-500/30 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  {user.membershipTier}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-0.5 mt-1">
                <div>{user.phone} • {user.email}</div>
                <div className="text-slate-400 text-[11px]">Member Since: {user.memberSince}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Transit Statistics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 block font-medium">Total Journeys</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{user.totalJourneys || 142}</span>
          <span className="text-[11px] text-emerald-500 block font-semibold mt-0.5">Top 5% Commuter</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 block font-medium">CO₂ Saved</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{user.co2SavedKg || 84.6} kg</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Equal to 4 trees planted</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 block font-medium">Green Commute Credits</span>
          <span className="text-2xl font-black text-amber-500">{user.carbonCredits || 280} pts</span>
          <span className="text-[11px] text-indigo-500 block font-semibold mt-0.5">Redeemable for passes</span>
        </div>
      </div>

      {/* Saved Frequent Passengers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Saved Frequent Passengers
            </h3>
            <p className="text-xs text-slate-400">
              Quickly auto-fill passengers when booking metro tickets
            </p>
          </div>

          <button
            onClick={() => setIsAddPassengerOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Passenger</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedPassengers.map(passenger => (
            <div
              key={passenger.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  {passenger.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {passenger.name}
                    </span>
                    {passenger.isSelf && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        Self
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {passenger.age} yrs • {passenger.phone}
                  </div>
                </div>
              </div>

              {!passenger.isSelf && (
                <button
                  onClick={() => removeSavedPassenger(passenger.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="max-w-md">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Commuter Profile
            </h3>
            <p className="text-xs text-slate-400">Update your transit account contact details</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all mt-2"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Add Passenger Modal */}
      <Modal isOpen={isAddPassengerOpen} onClose={() => setIsAddPassengerOpen(false)} maxWidth="max-w-md">
        <form onSubmit={handleAddPassenger} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Add Frequent Passenger
            </h3>
            <p className="text-xs text-slate-400">Save family member or colleague for rapid booking</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Passenger Name
            </label>
            <input
              type="text"
              required
              value={newPassengerForm.name}
              onChange={(e) => setNewPassengerForm({ ...newPassengerForm, name: e.target.value })}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Age
              </label>
              <input
                type="number"
                min="5"
                max="100"
                required
                value={newPassengerForm.age}
                onChange={(e) => setNewPassengerForm({ ...newPassengerForm, age: e.target.value })}
                placeholder="26"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Gender
              </label>
              <select
                value={newPassengerForm.gender}
                onChange={(e) => setNewPassengerForm({ ...newPassengerForm, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              value={newPassengerForm.phone}
              onChange={(e) => setNewPassengerForm({ ...newPassengerForm, phone: e.target.value })}
              placeholder="+91 98123 45678"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all mt-2"
          >
            Save Passenger
          </button>
        </form>
      </Modal>
    </div>
  );
}
