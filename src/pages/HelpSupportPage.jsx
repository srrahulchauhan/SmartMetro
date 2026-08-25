import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  PhoneCall, 
  ShieldAlert, 
  MessageSquare, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  HeartHandshake 
} from 'lucide-react';
import { FAQS, EMERGENCY_CONTACTS } from '../data/faqs';
import Modal from '../components/common/Modal';
import { useMetro } from '../context/MetroContext';

export default function HelpSupportPage() {
  const { showToast } = useMetro();
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Lost & Found Modal
  const [isLostFoundOpen, setIsLostFoundOpen] = useState(false);
  const [lostFoundForm, setLostFoundForm] = useState({
    itemType: 'Bag / Backpack',
    station: 'Electronic City',
    date: new Date().toISOString().split('T')[0],
    description: '',
    phone: '+91 98765 43210'
  });

  // Interactive Live Chat State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello Rahul! I am your 24/7 Smart Metro AI Commuter Assistant. How can I help you with routes, fares, cards, or AFC gates today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const filteredFaqs = FAQS.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Simulate smart bot response
    setTimeout(() => {
      let reply = 'Thank you for reaching out! Smart Metro support is available 24/7. Single journey tickets are valid for 180 minutes, and virtual smartcards offer an automatic 10% fare discount.';
      if (userText.toLowerCase().includes('refund') || userText.toLowerCase().includes('cancel')) {
        reply = 'You can cancel un-scanned tickets within 60 minutes directly from the "My Tickets" section with a 100% instant refund!';
      } else if (userText.toLowerCase().includes('card') || userText.toLowerCase().includes('recharge')) {
        reply = 'You can top up your Virtual Metro Pass in the "Virtual Card" tab using UPI or Cards. Auto-recharge will protect you against low balances.';
      } else if (userText.toLowerCase().includes('lost')) {
        reply = 'If you lost an item on a train or station, submit a report via the "Report Lost & Found" button above to track it at the Central Depot Hub.';
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
    }, 800);
  };

  const handleLostFoundSubmit = (e) => {
    e.preventDefault();
    setIsLostFoundOpen(false);
    showToast({
      title: 'Lost Item Report Registered 📦',
      message: 'Token #LF-9941 created. Central Security has been notified.',
      type: 'success'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Help & Commuter Support
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          24x7 Transit helpline, live AI assistant, Lost & Found registry, and emergency assistance
        </p>
      </div>

      {/* Emergency Contacts Hotbar */}
      <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency & Rapid Response Directory</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EMERGENCY_CONTACTS.slice(0, 3).map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
              <a href={`tel:${item.number}`} className="text-rose-600 dark:text-rose-400 font-black text-sm block mt-1 hover:underline">
                {item.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Live Chat Assistant + Lost & Found Quick Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Interactive Live AI Assistant */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[440px]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transit AI Support Bot</h3>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online (24/7)
                </span>
              </div>
            </div>
          </div>

          {/* Messages Bubble View */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about fares, tickets, delays or lost items..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Lost & Found Quick Card */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lost & Found Center
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Misplaced a bag, wallet, electronics or ID card inside a train or station premises? File an instant recovery claim with CISF marshals.
            </p>
          </div>

          <button
            onClick={() => setIsLostFoundOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Report Lost / Found Item</span>
          </button>
        </div>
      </div>

      {/* Searchable FAQ Accordion */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-400">
              Clear answers regarding digital ticketing, fares, passes and station rules
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-850/50"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lost & Found Report Modal */}
      <Modal isOpen={isLostFoundOpen} onClose={() => setIsLostFoundOpen(false)} maxWidth="max-w-md">
        <form onSubmit={handleLostFoundSubmit} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Report Lost Item
            </h3>
            <p className="text-xs text-slate-400">Enter item details for tracking across station CCTV vaults</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Item Category
            </label>
            <select
              value={lostFoundForm.itemType}
              onChange={(e) => setLostFoundForm({ ...lostFoundForm, itemType: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Bag / Backpack">Bag / Backpack</option>
              <option value="Mobile Phone / Electronics">Mobile Phone / Electronics</option>
              <option value="Wallet / Cash / Cards">Wallet / Cash / Cards</option>
              <option value="Keys / ID Cards">Keys / ID Cards</option>
              <option value="Clothing / Accessories">Clothing / Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Station or Line
            </label>
            <input
              type="text"
              required
              value={lostFoundForm.station}
              onChange={(e) => setLostFoundForm({ ...lostFoundForm, station: e.target.value })}
              placeholder="e.g. Electronic City / Sector 16"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Description & Identifying Marks
            </label>
            <textarea
              rows="3"
              required
              value={lostFoundForm.description}
              onChange={(e) => setLostFoundForm({ ...lostFoundForm, description: e.target.value })}
              placeholder="e.g. Black Lenovo laptop bag with blue keychain, left near door in coach 4"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all mt-2"
          >
            Submit Report & Notify Marshals
          </button>
        </form>
      </Modal>
    </div>
  );
}
