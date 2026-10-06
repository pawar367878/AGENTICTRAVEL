import React, { useState, useEffect } from 'react';
import {
  Ticket,
  QrCode,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  Printer,
  Copy,
  Calendar,
  User,
  CreditCard,
  Building,
  RefreshCw,
  Share2,
  X,
  ArrowRight,
} from 'lucide-react';
import { BookingData, PaymentData } from '../types';
import { api } from '../services/api';

interface BookingsTabProps {
  onOpenPaymentModal: (booking: BookingData) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({ onOpenPaymentModal }) => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{
    booking: BookingData;
    payment?: PaymentData;
    qrCodeDataUrl: string;
  } | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'>('ALL');
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicket = async (bookingId: string) => {
    try {
      const details = await api.getBookingDetails(bookingId);
      setSelectedTicket(details);
      setTicketModalOpen(true);
    } catch (err) {
      alert('Failed to load ticket details');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking and initiate sandbox refund?')) return;
    try {
      await api.cancelBooking(bookingId);
      await loadBookings();
    } catch (err: any) {
      alert(`Cancellation error: ${err.message}`);
    }
  };

  const handleCopyPnr = (pnr: string) => {
    navigator.clipboard.writeText(pnr);
    setCopiedPnr(pnr);
    setTimeout(() => setCopiedPnr(null), 2000);
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'ALL') return true;
    return b.bookingStatus === activeFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">My Bookings & QR Boarding Passes</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Confirmed reservations with cryptographically verified digital QR tokens
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-2">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={loadBookings}
            title="Refresh bookings list"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Fetching passenger bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-300">No bookings in this filter</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book a hotel, train, or activity from the AI Planner or Explore tab to generate a confirmed QR pass.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Booking Info */}
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {b.bookingType}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center space-x-1 ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : b.bookingStatus === 'PENDING'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {b.bookingStatus === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {b.bookingStatus === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                    {b.bookingStatus === 'CANCELLED' && <XCircle className="w-3 h-3 mr-1" />}
                    <span>{b.bookingStatus}</span>
                  </span>

                  <div className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                    <span>PNR:</span>
                    <strong className="text-cyan-300 font-mono">{b.pnrNumber}</strong>
                    <button
                      onClick={() => handleCopyPnr(b.pnrNumber)}
                      title="Copy PNR"
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {copiedPnr === b.pnrNumber && <span className="text-[10px] text-emerald-400">Copied!</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white truncate">{b.itemTitle}</h3>
                  {b.itemSubtitle && <p className="text-xs text-slate-400 truncate">{b.itemSubtitle}</p>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Date</span>
                    <strong>{b.startDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Travellers</span>
                    <strong>{b.passengersCount} Guest(s)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Allocation</span>
                    <strong className="truncate block">{b.seatsOrRooms || 'Standard'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contact</span>
                    <strong>{b.contactName || b.userName}</strong>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="text-left md:text-right">
                  <div className="text-xl font-black text-cyan-400 font-mono">
                    ₹{b.totalPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500">Sandbox Transaction</div>
                </div>

                <div className="flex items-center space-x-2">
                  {b.bookingStatus === 'PENDING' && (
                    <button
                      onClick={() => onOpenPaymentModal(b)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <span>Pay (Sandbox)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {b.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => handleOpenTicket(b.id)}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all flex items-center space-x-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View QR Ticket</span>
                    </button>
                  )}

                  {b.bookingStatus !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      title="Cancel and trigger refund"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital QR Boarding Pass Modal */}
      {ticketModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
            {/* Modal Top Strip */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Ticket className="w-6 h-6" />
                <div>
                  <h3 className="text-base font-bold font-['Outfit']">Digital Boarding Pass & QR Voucher</h3>
                  <p className="text-[11px] text-cyan-100">Agentic Multi-Agent Booking System</p>
                </div>
              </div>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Boarding Pass Body */}
            <div className="p-6 space-y-6 bg-slate-900">
              {/* Item Details */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {selectedTicket.booking.bookingType}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> CONFIRMED
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mt-2">{selectedTicket.booking.itemTitle}</h4>
                {selectedTicket.booking.itemSubtitle && (
                  <p className="text-xs text-slate-400">{selectedTicket.booking.itemSubtitle}</p>
                )}
              </div>

              {/* QR Code Presentation Box */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                <div className="bg-white p-3 rounded-2xl shadow-xl">
                  <img
                    src={selectedTicket.qrCodeDataUrl}
                    alt="Digital Pass QR Code"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                </div>
                <div className="mt-3 text-center">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
                    Permanent PNR Reference
                  </span>
                  <span className="text-sm font-black font-mono text-cyan-400 tracking-wider">
                    {selectedTicket.booking.pnrNumber}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-2 max-w-xs">
                  Scan at transport gate or hotel front-desk with the platform QR Verifier for instant clearance.
                </p>
              </div>

              {/* Pass Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Guest / Passenger</span>
                  <strong className="text-white">{selectedTicket.booking.userName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Travel Date</span>
                  <strong className="text-white">{selectedTicket.booking.startDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Seat / Room Allocation</span>
                  <strong className="text-slate-200">{selectedTicket.booking.seatsOrRooms || 'Standard'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sandbox Payment Ref</span>
                  <strong className="text-cyan-300 font-mono text-[11px]">
                    {selectedTicket.payment?.transactionReference || 'TXN-90827'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print e-Ticket</span>
              </button>

              <button
                onClick={() => setTicketModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
