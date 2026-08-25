import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/common/BottomNav';
import ToastContainer from '../components/common/ToastContainer';
import LiveSimulatorPill from '../components/common/LiveSimulatorPill';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Fixed Header */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex">
        {/* Desktop Sidebar / Mobile Drawer */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Viewport */}
        <main className="flex-1 lg:pl-64 w-full min-w-0 flex flex-col">
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Live Journey Destination Alert Pill */}
      <LiveSimulatorPill />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}
