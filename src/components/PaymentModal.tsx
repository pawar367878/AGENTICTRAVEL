import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Smartphone,
  Building2,
  Wallet,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { BookingData } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingData | null;
  onPaymentSuccess: (bookingId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  const [upiId, setUpiId] = useState('traveller@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState('Vivek Pawar');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [shouldFailSimulation, setShouldFailSimulation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(120);
      setErrorMessage(null);
      setIsProcessing(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simulate network verification
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const result = await api.verifySandboxPayment({
        bookingId: booking.id,
        paymentMethod: selectedMethod,
        cardLast4: selectedMethod === 'CARD' ? '4242' : undefined,
        upiId: selectedMethod === 'UPI' ? upiId : undefined,
        bankName: selectedMethod === 'NET_BANKING' ? selectedBank : undefined,
        shouldFail: shouldFailSimulation,
      });

      if (result.success) {
        onPaymentSuccess(booking.id);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment simulation failed. Try another method or disable failure toggle.');
    } finally {
      setIsProcessing(false);
    }
  };

  const autoFillDemoCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/29');
    setCardCvv('921');
    setCardHolder('Vivek Pawar');
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Sandbox Header Alert */}
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <strong className="font-semibold">TEST SANDBOX ENVIRONMENT:</strong>
            <span>No real money will be charged. Academic Demonstration Mode.</span>
          </div>
          <div className="font-mono text-xs bg-amber-950/60 px-2 py-0.5 rounded text-amber-300">
            Session: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
        </div>

        {/* Modal Main Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Simulated Payment Gateway</h3>
            <p className="text-xs text-slate-400">
              Booking: <strong className="text-slate-200">{booking.itemTitle}</strong> ({booking.pnrNumber})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Order Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Payable Amount</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                ₹{booking.totalPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {booking.passengersCount} Traveller(s) • {booking.bookingType} • {booking.startDate}
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                INR Guaranteed
              </span>
              <div className="text-[10px] text-slate-500 mt-1">Instant QR Issuance</div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                { id: 'CARD', label: 'Card (Demo)', icon: CreditCard },
                { id: 'NET_BANKING', label: 'NetBanking', icon: Building2 },
                { id: 'WALLET', label: 'Wallet', icon: Wallet },
              ].map((m) => {
                const Icon = m.icon;
                const isSel = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSel
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Payment Method View */}
          {selectedMethod === 'UPI' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">UPI Virtual Payment Address</span>
                <span className="text-[11px] text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Instant Auto-Approve
                </span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okhdfcbank"
                  className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Quick Demo Handles:</span>
                {['traveller@okhdfcbank', 'student@paytm', 'project@upi'].map((demo) => (
                  <button
                    key={demo}
                    type="button"
                    onClick={() => setUpiId(demo)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-300 rounded border border-slate-700 font-mono"
                  >
                    {demo.split('@')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedMethod === 'CARD' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Demo Card Credentials</span>
                <button
                  type="button"
                  onClick={autoFillDemoCard}
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold underline flex items-center"
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Auto-fill Sandbox Card
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'NET_BANKING' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Select Demo Bank</label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                      selectedBank === bank
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedMethod === 'WALLET' && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Demo Student Travel Balance:</span>
                <strong className="text-emerald-400 font-mono">₹50,000.00</strong>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulated pre-loaded travel credit balance allocated for student testing and viva demonstration.
              </p>
            </div>
          )}

          {/* Demo Failure Toggle for Viva Testing */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Simulate Payment Failure?</div>
                <div className="text-[11px] text-slate-400">
                  Enable to demonstrate the exception handling & failed state workflow
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={shouldFailSimulation}
              onChange={(e) => setShouldFailSimulation(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 border-slate-600 focus:ring-cyan-500 bg-slate-700"
            />
          </div>

          {/* Error Message Box if failure simulated */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong>Payment Failed:</strong> {errorMessage}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Sandbox Protocol</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              id="confirm-sandbox-payment-btn"
              type="button"
              onClick={handlePayNow}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Test Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{booking.totalPrice.toLocaleString('en-IN')} (Sandbox)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
