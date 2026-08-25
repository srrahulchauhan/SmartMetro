import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import MyTicketsPage from './pages/MyTicketsPage';
import VirtualCardPage from './pages/VirtualCardPage';
import JourneyPlannerPage from './pages/JourneyPlannerPage';
import TrainStatusPage from './pages/TrainStatusPage';
import MetroMapPage from './pages/MetroMapPage';
import SavedRoutesPage from './pages/SavedRoutesPage';
import TransactionsPage from './pages/TransactionsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/card" element={<VirtualCardPage />} />
        <Route path="/planner" element={<JourneyPlannerPage />} />
        <Route path="/train-status" element={<TrainStatusPage />} />
        <Route path="/map" element={<MetroMapPage />} />
        <Route path="/saved-routes" element={<SavedRoutesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help-support" element={<HelpSupportPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
