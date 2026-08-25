import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { 
  Train, 
  Download, 
  Share2, 
  Heart, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Play,
  Copy,
  Layers
} from 'lucide-react';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useMetro } from '../../context/MetroContext';
import { formatTime, formatDate } from '../../utils/formatters';

export default function DigitalTicketModal({
  isOpen,
  onClose,
  ticket,
  onStartSimulation
}) {
  const { cancelTicket, showToast, addSavedRoute } = useMetro();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (!ticket) return null;

  const isActive = ticket.status === 'ACTIVE';
  const isCancelled = ticket.status === 'CANCELLED';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `/my-tickets?ticket=${ticket.id}`);
    showToast({
      title: 'Ticket Link Copied 📋',
      message: `Shareable QR ticket link for ${ticket.id} copied to clipboard.`,
      type: 'success'
    });
  };

  const handleDownload = () => {
    showToast({
      title: 'Ticket Saved 📥',
      message: `PDF Digital Pass for ${ticket.id} downloaded successfully.`,
      type: 'success'
    });
  };

  const handleFavoriteRoute = () => {
    addSavedRoute({
      name: `${ticket.fromStationName} → ${ticket.toStationName}`,
      fromStationId: ticket.fromStationId,
      toStationId: ticket.toStationId,
      fromName: ticket.fromStationName,
      toName: ticket.toStationName,
      fare: ticket.fare,
      line: ticket.line || 'blue'
    });
  };

  const handleConfirmCancel = () => {
    cancelTicket(ticket.id);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={true}>
        <div className="space-y-5">
          {/* Digital Ticket Container */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white p-6 shadow-2xl border border-indigo-500/30 overflow-hidden">
            {/* Background Hologram watermark */}
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Logo & Status Badge */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black tracking-tight">SMART METRO PASS</div>
                  <div className="text-[10px] text-indigo-400 font-mono font-bold">DIGITAL AFC TICKET</div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase border ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isCancelled
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                {ticket.status}
              </span>
            </div>

            {/* Stations Journey Banner */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Boarding Station</div>
                  <div className="text-base font-extrabold text-white">{ticket.fromStationName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Destination Station</div>
                  <div className="text-base font-extrabold text-indigo-300">{ticket.toStationName}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/60 px-3 py-2 rounded-xl">
                <span>{formatDate(ticket.date)} • {ticket.time}</span>
                <span>{ticket.stopsCount || 6} Stops (~{ticket.durationMins || 18}m)</span>
              </div>
            </div>

            {/* QR Code Section with Laser Scan Animation */}
            <div className="relative flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-inner my-4">
              <div className="relative">
                <QRCodeSVG
                  value={ticket.qrData || `METROGO:${ticket.id}`}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
                {/* Simulated Laser Scanner line for Active tickets */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"
                    animate={{ top: ['0%', '98%', '0%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>

              <div className="text-center mt-3">
                <div className="text-xs font-mono font-bold text-slate-900 tracking-wider">
                  {ticket.id}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isActive ? 'Scan at automated gate turnstile reader' : `Ticket ${ticket.status}`}
                </div>
              </div>
            </div>

            {/* Passengers & Fare Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Passenger(s)</span>
                <span className="font-semibold text-slate-200">
                  {ticket.passengers ? ticket.passengers.map(p => p.name).join(', ') : 'Rahul Chauhan'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Total Fare Paid</span>
                <span className="font-black text-emerald-400 text-sm">₹{ticket.fare?.toFixed(2)}</span>
              </div>
            </div>

            {/* Refund banner if cancelled */}
            {isCancelled && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs">
                <span className="font-bold">Refund Status:</span> {ticket.refundStatus || 'Refund Initiated'}
              </div>
            )}
          </div>

          {/* Ticket Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleDownload}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 mb-1 text-indigo-500" />
              <span>Download</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-4 h-4 mb-1 text-indigo-500" />
              <span>Share</span>
            </button>

            <button
              onClick={handleFavoriteRoute}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <Heart className="w-4 h-4 mb-1 text-rose-500" />
              <span>Save Route</span>
            </button>

            {isActive && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
              >
                <X className="w-4 h-4 mb-1 text-rose-500" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          {/* Quick "Simulate This Journey" CTA */}
          {isActive && onStartSimulation && (
            <button
              type="button"
              onClick={() => {
                onStartSimulation(ticket);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Simulate Live Journey & Destination Alerts</span>
            </button>
          )}
        </div>
      </Modal>

      {/* Cancellation Modal */}
      <ConfirmDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Metro Ticket?"
        message="Are you sure you want to cancel this ticket? 100% refund of the fare will be processed back to your source account."
        confirmText="Yes, Cancel Ticket"
        cancelText="Keep Ticket"
        isDestructive={true}
        details={
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div><strong>Ticket ID:</strong> {ticket.id}</div>
            <div><strong>Journey:</strong> {ticket.fromStationName} → {ticket.toStationName}</div>
            <div><strong>Refund Amount:</strong> ₹{ticket.fare?.toFixed(2)}</div>
          </div>
        }
      />
    </>
  );
}
