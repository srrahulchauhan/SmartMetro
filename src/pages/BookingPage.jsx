import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Ticket, 
  Sparkles,
  QrCode,
  Users,
  Train
} from 'lucide-react';
import JourneySearchCard from '../components/booking/JourneySearchCard';
import RouteCard from '../components/booking/RouteCard';
import RouteTimeline from '../components/booking/RouteTimeline';
import PassengerForm from '../components/booking/PassengerForm';
import PaymentModal from '../components/booking/PaymentModal';
import DigitalTicketModal from '../components/booking/DigitalTicketModal';
import { STATIONS } from '../data/stations';
import { findRoute } from '../data/routes';
import { useMetro } from '../context/MetroContext';
import { useAuth } from '../context/AuthContext';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createBooking, startJourneySimulation } = useMetro();
  const { user } = useAuth();

  // Current Wizard Step (1: Select Journey, 2: Select Route, 3: Passenger Info, 4: Confirmed Ticket)
  const [currentStep, setCurrentStep] = useState(1);

  // Booking details state
  const [fromStationId, setFromStationId] = useState(() => searchParams.get('from') || 'noida-electronic-city');
  const [toStationId, setToStationId] = useState(() => searchParams.get('to') || 'sec-16');
  const [date, setDate] = useState(() => searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [journeyType, setJourneyType] = useState(() => searchParams.get('type') || 'Single Journey');

  // Passenger state
  const [passengers, setPassengers] = useState([
    { name: user.name || 'Rahul Chauhan', age: 28, phone: user.phone || '+91 98765 43210', gender: 'Male' }
  ]);

  // Selected route from route results
  const [routeResult, setRouteResult] = useState(() => findRoute(fromStationId, toStationId));
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  useEffect(() => {
    const from = searchParams.get('from') || fromStationId;
    const to = searchParams.get('to') || toStationId;
    setFromStationId(from);
    setToStationId(to);
    const res = findRoute(from, to);
    setRouteResult(res);
    if (res.success && res.routes && res.routes.length > 0) {
      setSelectedRoute(res.routes[0]);
    }
  }, [searchParams]);

  // Total Fare computation
  const baseFare = selectedRoute?.fare || (routeResult.success ? routeResult.fare : 35);
  const multiplier = journeyType === 'Return Journey' ? 1.8 : 1;
  const totalAmount = Math.round(baseFare * passengers.length * multiplier);

  const handleSearchComplete = ({ fromStation, toStation, date: d, passengerCount, journeyType: jt, routePreview }) => {
    setFromStationId(fromStation.id);
    setToStationId(toStation.id);
    setDate(d);
    setJourneyType(jt);
    setRouteResult(routePreview);
    if (routePreview.success && routePreview.routes) {
      setSelectedRoute(routePreview.routes[0]);
    }

    // Sync passengers count
    if (passengers.length !== passengerCount) {
      const newPassengers = Array.from({ length: passengerCount }, (_, i) => 
        passengers[i] || { name: '', age: '', phone: '', gender: 'Male' }
      );
      setPassengers(newPassengers);
    }

    setCurrentStep(2);
  };

  const handleProceedToPassengers = () => {
    if (!selectedRoute) return;
    setCurrentStep(3);
  };

  const handleOpenPayment = (e) => {
    e?.preventDefault();
    // Validate passengers
    const hasEmpty = passengers.some(p => !p.name.trim() || !p.phone.trim());
    if (hasEmpty) {
      alert('Please fill all passenger names and mobile numbers to proceed.');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentResult) => {
    const fromStn = STATIONS.find(s => s.id === fromStationId) || STATIONS[0];
    const toStn = STATIONS.find(s => s.id === toStationId) || STATIONS[1];

    const ticketData = {
      fromStationId: fromStn.id,
      toStationId: toStn.id,
      fromStationName: fromStn.name,
      toStationName: toStn.name,
      journeyType,
      date,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      passengers,
      fare: paymentResult.amountPaid,
      stopsCount: selectedRoute?.stopsCount || routeResult.stopsCount || 6,
      durationMins: selectedRoute?.durationMins || routeResult.durationMins || 18,
      line: fromStn.line,
      paymentMethod: paymentResult.paymentMethod
    };

    const newTicket = createBooking(ticketData);
    setIsPaymentModalOpen(false);
    setConfirmedTicket(newTicket);
    setCurrentStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header & Stepper Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Metro Ticket Booking
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fast & instant AFC digital ticket generation for urban rapid transit
        </p>

        {/* Stepper Wizard Progress */}
        <div className="flex items-center justify-between mt-6 p-2 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { num: 1, label: 'Select Journey' },
            { num: 2, label: 'Choose Route' },
            { num: 3, label: 'Passenger Info' },
            { num: 4, label: 'Confirmed Ticket' }
          ].map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Select Journey */}
      {currentStep === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <JourneySearchCard
            initialFromId={fromStationId}
            initialToId={toStationId}
            onSearchComplete={handleSearchComplete}
          />
        </motion.div>
      )}

      {/* Step 2: Choose Route Results */}
      {currentStep === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Stations</span>
            </button>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {routeResult.routes?.length || 1} Route Option(s) Available
            </span>
          </div>

          {/* Route Result Cards */}
          <div className="space-y-4">
            {routeResult.routes?.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={selectedRoute?.id === route.id}
                onSelect={() => setSelectedRoute(route)}
                onContinue={handleProceedToPassengers}
              />
            ))}
          </div>

          {/* Station Visual Route Timeline */}
          {selectedRoute && (
            <RouteTimeline path={selectedRoute.path} />
          )}

          {/* Continue CTA */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleProceedToPassengers}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
            >
              <span>Continue to Passenger Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Passenger Details */}
      {currentStep === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <button
            onClick={() => setCurrentStep(2)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Routes</span>
          </button>

          {/* Summary Mini Bar */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Selected Route</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {STATIONS.find(s => s.id === fromStationId)?.name} → {STATIONS.find(s => s.id === toStationId)?.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Journey Type</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{journeyType}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 block">Total Fare</span>
              <span className="text-base font-black text-slate-900 dark:text-white">₹{totalAmount}</span>
            </div>
          </div>

          {/* Dynamic Passenger Form */}
          <PassengerForm passengers={passengers} onChange={setPassengers} />

          {/* CTA: Proceed to Payment */}
          <button
            onClick={handleOpenPayment}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 transition-all"
          >
            <CreditCard className="w-5 h-5" />
            <span>Proceed to Payment (₹{totalAmount})</span>
          </button>
        </motion.div>
      )}

      {/* Step 4: Booking Confirmation & Digital QR Ticket Screen */}
      {currentStep === 4 && confirmedTicket && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
            <Check className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Payment Successful & Booking Confirmed! ✓
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your digital QR ticket has been issued and saved to your wallet.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <button
              onClick={() => setConfirmedTicket({ ...confirmedTicket })}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all mb-3"
            >
              <QrCode className="w-5 h-5" />
              <span>View Fullscreen QR Gate Pass</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => startJourneySimulation(confirmedTicket.fromStationId, confirmedTicket.toStationId)}
                className="py-3 rounded-2xl border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              >
                Simulate Live Journey
              </button>
              <button
                onClick={() => navigate('/my-tickets')}
                className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Go to My Tickets
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalAmount}
        bookingDetails={{
          fromStationName: STATIONS.find(s => s.id === fromStationId)?.name,
          toStationName: STATIONS.find(s => s.id === toStationId)?.name,
          passengers
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Digital Ticket Modal */}
      {confirmedTicket && (
        <DigitalTicketModal
          isOpen={currentStep === 4 && !!confirmedTicket}
          onClose={() => {}}
          ticket={confirmedTicket}
          onStartSimulation={(t) => startJourneySimulation(t.fromStationId, t.toStationId)}
        />
      )}
    </div>
  );
}
