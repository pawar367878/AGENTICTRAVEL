import React, { useState } from 'react';
import {
  X,
  QrCode,
  CheckCircle2,
  XCircle,
  Search,
  ShieldCheck,
  Calendar,
  User,
  Ticket,
  CreditCard,
  Building,
} from 'lucide-react';
import { api } from '../services/api';

interface QrVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrVerifierModal: React.FC<QrVerifierModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('HTL-SEA00124');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (pnrToSearch?: string) => {
    const target = pnrToSearch || query;
    if (!target.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await api.verifyBookingQr(target.trim());
      setResult(data);
    } catch (err) {
      setResult({ valid: false, message: 'Ticket verification request failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Digital Ticket QR Verifier</h3>
              <p className="text-xs text-slate-400">Platform Check-in & Gate Authentication Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-xs text-slate-300">
            Simulates a handheld conductor / hotel reception verification terminal. Enter any issued PNR or scan the QR code to validate registration against the centralized MySQL store.
          </p>

          {/* Quick Demo PNR Pills */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Quick Test PNRs:</span>
            {['HTL-SEA00124', 'BUS-VRL00841'].map((pnr) => (
              <button
                key={pnr}
                type="button"
                onClick={() => {
                  setQuery(pnr);
                  handleVerify(pnr);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs"
              >
                {pnr}
              </button>
            ))}
          </div>

          {/* Input & Search Button */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                id="pnr-verifier-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter PNR or Booking ID (e.g. HTL-SEA00124)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono uppercase"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <button
              id="submit-pnr-verify-btn"
              onClick={() => handleVerify()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Authenticate'}
            </button>
          </div>

          {/* Verification Result Area */}
          {searched && (
            <div className="animate-fadeIn">
              {result && result.valid ? (
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <div>
                        <div className="text-sm font-bold text-emerald-300">AUTHENTIC TICKET VERIFIED</div>
                        <div className="text-[11px] text-emerald-400/80 font-mono">
                          Digital Gate Validation Status: VALID
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      CONFIRMED
                    </span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Item / Service</span>
                      <strong className="text-white">{result.booking.item}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">PNR / Reference</span>
                      <strong className="text-cyan-300 font-mono">{result.booking.pnr}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Passenger / Guest</span>
                      <strong className="text-slate-200">{result.booking.passenger}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Scheduled Date</span>
                      <strong className="text-slate-200">{result.booking.date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Allocated Seats / Rooms</span>
                      <strong className="text-slate-200">{result.booking.seats || 'Standard'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Amount Paid</span>
                      <strong className="text-emerald-400 font-mono">
                        ₹{result.booking.amount?.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Txn Ref: <strong className="text-slate-300 font-mono">{result.booking.transactionId}</strong></span>
                    <span className="text-emerald-400">Digital Gate Cleared ✅</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-2">
                  <XCircle className="w-8 h-8 text-rose-400 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-300">Ticket Not Found / Invalid</h4>
                  <p className="text-xs text-slate-400">
                    No active record found for identifier &quot;{query}&quot;. Please verify the PNR code or generate a booking in the sandbox.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
          >
            Close Verifier
          </button>
        </div>
      </div>
    </div>
  );
};
