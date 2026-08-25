import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_TICKETS, INITIAL_CARD, INITIAL_SAVED_ROUTES, INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { STATIONS } from '../data/stations';
import { loadStorage, saveStorage } from '../utils/storage';
import { soundFx } from '../utils/sound';
import { generateTicketId } from '../utils/formatters';

const MetroContext = createContext();

export function MetroProvider({ children }) {
  // Core State
  const [tickets, setTickets] = useState(() => loadStorage('metro_tickets', INITIAL_TICKETS));
  const [card, setCard] = useState(() => loadStorage('metro_card', INITIAL_CARD));
  const [savedRoutes, setSavedRoutes] = useState(() => loadStorage('metro_saved_routes', INITIAL_SAVED_ROUTES));
  const [transactions, setTransactions] = useState(() => loadStorage('metro_transactions', INITIAL_TRANSACTIONS));
  const [notifications, setNotifications] = useState(() => loadStorage('metro_notifications', INITIAL_NOTIFICATIONS));
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Active Journey Simulation State
  const [activeJourney, setActiveJourney] = useState(() => loadStorage('metro_active_journey', null));
  const simulationIntervalRef = useRef(null);

  // Sync to local storage
  useEffect(() => saveStorage('metro_tickets', tickets), [tickets]);
  useEffect(() => saveStorage('metro_card', card), [card]);
  useEffect(() => saveStorage('metro_saved_routes', savedRoutes), [savedRoutes]);
  useEffect(() => saveStorage('metro_transactions', transactions), [transactions]);
  useEffect(() => saveStorage('metro_notifications', notifications), [notifications]);
  useEffect(() => saveStorage('metro_active_journey', activeJourney), [activeJourney]);

  // Toast Dispatcher
  const showToast = ({ title, message, type = 'info', duration = 4500 }) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, title, message, type };
    
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    if (type === 'success') soundFx.playSuccess();
    else if (type === 'alert') soundFx.playDestinationAlert();
    else if (type === 'scan') soundFx.playScanBeep();
    else soundFx.playMetroChime();

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Notification helper
  const addNotification = ({ category, title, message, type = 'info' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      category,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Ticket Operations
  const createBooking = (bookingData) => {
    const newTicketId = generateTicketId();
    const newTicket = {
      id: newTicketId,
      ...bookingData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 3600000).toISOString(),
      qrData: `METROGO:${newTicketId}:${bookingData.fromStationId}:${bookingData.toStationId}:${bookingData.fare}:ACTIVE`
    };

    setTickets(prev => [newTicket, ...prev]);

    // Record Transaction
    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      type: 'DEBIT',
      category: 'Ticket Booking',
      title: `Ticket: ${bookingData.fromStationName} → ${bookingData.toStationName}`,
      ticketId: newTicketId,
      amount: bookingData.fare,
      status: 'Completed',
      paymentMethod: bookingData.paymentMethod || 'UPI'
    };
    setTransactions(prev => [newTxn, ...prev]);

    // If paid via Metro Card, deduct balance
    if (bookingData.paymentMethod === 'Virtual Metro Card' && card) {
      setCard(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance - bookingData.fare),
        dailyCapUsed: (prev.dailyCapUsed || 0) + bookingData.fare
      }));
    }

    // Trigger alert & toast
    showToast({
      title: 'Ticket Generated Successfully! 🎟️',
      message: `Booking confirmed (${newTicketId}) for ${bookingData.fromStationName} to ${bookingData.toStationName}`,
      type: 'success'
    });

    addNotification({
      category: 'Ticket',
      title: 'Ticket Confirmed ✓',
      message: `Booking confirmed for ${bookingData.fromStationName} → ${bookingData.toStationName}. Ticket ID: ${newTicketId}.`,
      type: 'success'
    });

    return newTicket;
  };

  const cancelTicket = (ticketId) => {
    const target = tickets.find(t => t.id === ticketId);
    if (!target) return false;

    const refundAmount = target.fare;
    const refundId = `RF-${Math.floor(100000 + Math.random() * 900000)}`;

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'CANCELLED',
          refundStatus: `Refund Credited (₹${refundAmount.toFixed(2)})`,
          refundId
        };
      }
      return t;
    }));

    // Record Refund Transaction
    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      type: 'REFUND',
      category: 'Ticket Refund',
      title: `Refund for ${target.id} (${target.fromStationName} → ${target.toStationName})`,
      ticketId: target.id,
      amount: refundAmount,
      status: 'Credited',
      paymentMethod: 'Refund to Source'
    };
    setTransactions(prev => [newTxn, ...prev]);

    showToast({
      title: 'Ticket Cancelled',
      message: `₹${refundAmount.toFixed(2)} refund initiated for ${ticketId}.`,
      type: 'info'
    });

    addNotification({
      category: 'Payment',
      title: 'Ticket Refund Processed',
      message: `₹${refundAmount.toFixed(2)} refund processed for ${ticketId} (Ref: ${refundId}).`,
      type: 'info'
    });

    return true;
  };

  // Virtual Metro Card Operations
  const rechargeCard = (amount, method = 'UPI') => {
    if (!card) return;
    const topUpAmount = parseFloat(amount);
    setCard(prev => ({
      ...prev,
      balance: prev.balance + topUpAmount,
      cashbackEarned: (prev.cashbackEarned || 0) + Math.round(topUpAmount * 0.05)
    }));

    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      type: 'CREDIT',
      category: 'Metro Card Recharge',
      title: `Virtual Pass Recharge (+₹${topUpAmount.toFixed(2)})`,
      amount: topUpAmount,
      status: 'Completed',
      paymentMethod: method
    };
    setTransactions(prev => [newTxn, ...prev]);

    showToast({
      title: 'Recharge Successful! 💳',
      message: `Added ₹${topUpAmount.toFixed(2)} to your Virtual Metro Card.`,
      type: 'success'
    });

    addNotification({
      category: 'Payment',
      title: 'Card Recharged Successfully',
      message: `₹${topUpAmount.toFixed(2)} added to your Virtual Metro Card. New Balance: ₹${(card.balance + topUpAmount).toFixed(2)}.`,
      type: 'success'
    });
  };

  const toggleFreezeCard = () => {
    if (!card) return;
    const newStatus = !card.isFrozen;
    setCard(prev => ({ ...prev, isFrozen: newStatus }));

    showToast({
      title: newStatus ? 'Card Frozen ❄️' : 'Card Unfrozen 🔓',
      message: newStatus ? 'Your Virtual Metro Card is now locked for security.' : 'Your Virtual Metro Card is active and ready for travel.',
      type: newStatus ? 'warning' : 'success'
    });
  };

  const toggleAutoRecharge = () => {
    if (!card) return;
    setCard(prev => ({ ...prev, autoRecharge: !prev.autoRecharge }));
  };

  const simulateGateTap = (stationName, fare = 20) => {
    if (!card) return { success: false, reason: 'No active card' };
    if (card.isFrozen) {
      showToast({
        title: 'Gate Access Denied 🚫',
        message: 'Your Virtual Card is frozen. Unfreeze in the app to tap.',
        type: 'warning'
      });
      return { success: false, reason: 'Card Frozen' };
    }
    if (card.balance < fare) {
      showToast({
        title: 'Low Balance ⚠️',
        message: `Insufficient balance (₹${card.balance.toFixed(2)}). Please recharge.`,
        type: 'warning'
      });
      return { success: false, reason: 'Low Balance' };
    }

    soundFx.playGateTap();

    setCard(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - fare),
      dailyCapUsed: (prev.dailyCapUsed || 0) + fare
    }));

    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      type: 'DEBIT',
      category: 'Journey Fare',
      title: `NFC Gate Tap: ${stationName}`,
      amount: fare,
      status: 'Completed',
      paymentMethod: 'Virtual Metro Card Tap'
    };
    setTransactions(prev => [newTxn, ...prev]);

    showToast({
      title: 'Gate Flap Opened! 🟢',
      message: `NFC Tap at ${stationName} (₹${fare.toFixed(2)} deducted). Balance: ₹${(card.balance - fare).toFixed(2)}`,
      type: 'scan'
    });

    return { success: true };
  };

  // Saved Routes Operations
  const addSavedRoute = (routeData) => {
    const newRoute = {
      id: `sr-${Date.now()}`,
      ...routeData
    };
    setSavedRoutes(prev => [newRoute, ...prev]);
    showToast({
      title: 'Route Saved ⭐',
      message: `${routeData.name} added to your shortcuts.`,
      type: 'success'
    });
    return newRoute;
  };

  const removeSavedRoute = (id) => {
    setSavedRoutes(prev => prev.filter(r => r.id !== id));
    showToast({
      title: 'Route Removed',
      message: 'Saved shortcut removed.',
      type: 'info'
    });
  };

  // Live Journey Simulation Engine
  const startJourneySimulation = (fromStationId, toStationId, routeStations = null) => {
    let path = routeStations;
    if (!path || path.length < 2) {
      const fromStn = STATIONS.find(s => s.id === fromStationId) || STATIONS[0];
      const toStn = STATIONS.find(s => s.id === toStationId) || STATIONS[4];
      path = [fromStn, STATIONS[1], STATIONS[2], STATIONS[3], toStn];
    }

    const newJourney = {
      id: `sim-${Date.now()}`,
      fromStation: path[0],
      toStation: path[path.length - 1],
      stations: path,
      currentIndex: 0,
      currentStation: path[0],
      status: 'IN_PROGRESS', // IN_PROGRESS | COMPLETED | PAUSED
      startedAt: new Date().toISOString(),
      totalStations: path.length,
      nextStation: path[1] || null
    };

    setActiveJourney(newJourney);

    showToast({
      title: 'Journey Simulation Started 🚇',
      message: `Travelling on ${path[0].name} → ${path[path.length - 1].name}`,
      type: 'info'
    });

    soundFx.playMetroChime();
  };

  const advanceSimulationStep = () => {
    setActiveJourney(prev => {
      if (!prev || prev.status === 'COMPLETED') return prev;
      
      const nextIdx = prev.currentIndex + 1;
      
      if (nextIdx >= prev.stations.length) {
        // Journey Completed
        showToast({
          title: 'Destination Reached! 🎉',
          message: `You have arrived at ${prev.toStation.name}. Have a pleasant journey!`,
          type: 'success'
        });
        addNotification({
          category: 'Journey',
          title: 'Journey Completed ✓',
          message: `Arrived at ${prev.toStation.name}. Total stations traversed: ${prev.stations.length}.`,
          type: 'success'
        });
        soundFx.playSuccess();
        return {
          ...prev,
          currentIndex: prev.stations.length - 1,
          currentStation: prev.stations[prev.stations.length - 1],
          nextStation: null,
          status: 'COMPLETED'
        };
      }

      const currentStn = prev.stations[nextIdx];
      const nextStn = prev.stations[nextIdx + 1] || null;
      const stationsRemaining = prev.stations.length - 1 - nextIdx;

      // Destination Alert triggers when 1 station away!
      if (stationsRemaining === 1) {
        showToast({
          title: '🚇 Destination Alert',
          message: `You are approaching ${prev.toStation.name}. Your destination is 1 station away. Please prepare to exit on Platform ${currentStn.platforms ? 2 : 1}.`,
          type: 'alert',
          duration: 6000
        });
        addNotification({
          category: 'Journey',
          title: 'Destination Approaching ⚠️',
          message: `Approaching ${prev.toStation.name} (1 station away). Prepare to alight at Platform 2.`,
          type: 'alert'
        });
      } else if (currentStn.interchange && currentStn.interchange.length > 0 && nextIdx < prev.stations.length - 1) {
        showToast({
          title: '🔄 Interchange Station Ahead',
          message: `Approaching ${currentStn.name}. Interchange available for ${currentStn.interchange.join(', ')} lines.`,
          type: 'info'
        });
      } else {
        showToast({
          title: `Now At: ${currentStn.name}`,
          message: nextStn ? `Next Station: ${nextStn.name}` : `Destination: ${prev.toStation.name}`,
          type: 'info'
        });
      }

      return {
        ...prev,
        currentIndex: nextIdx,
        currentStation: currentStn,
        nextStation: nextStn
      };
    });
  };

  const stopJourneySimulation = () => {
    setActiveJourney(null);
    showToast({
      title: 'Simulation Stopped',
      message: 'Active journey cleared.',
      type: 'info'
    });
  };

  return (
    <MetroContext.Provider value={{
      tickets,
      createBooking,
      cancelTicket,
      card,
      rechargeCard,
      toggleFreezeCard,
      toggleAutoRecharge,
      simulateGateTap,
      savedRoutes,
      addSavedRoute,
      removeSavedRoute,
      transactions,
      notifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      clearAllNotifications,
      toasts,
      showToast,
      removeToast,
      activeJourney,
      startJourneySimulation,
      advanceSimulationStep,
      stopJourneySimulation
    }}>
      {children}
    </MetroContext.Provider>
  );
}

export const useMetro = () => useContext(MetroContext);
