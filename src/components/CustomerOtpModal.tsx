import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Bike,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';

export const CustomerOtpModal: React.FC = () => {
  const {
    isOtpModalOpen,
    setIsOtpModalOpen,
    activeOrder,
    verifyDeliveryOtp,
    isDeliveryCompleted
  } = useApp();

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const orderId = activeOrder?.id || 'ORD-8553';
  const expectedOtp = activeOrder?.deliveryOtp || '8553';

  // Auto-focus on first input field when modal opens
  useEffect(() => {
    if (isOtpModalOpen) {
      setDigits(['', '', '', '']);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsVerifying(false);
      const timer = setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOtpModalOpen]);

  if (!isOtpModalOpen || isDeliveryCompleted) return null;

  const handleDigitChange = (index: number, value: string) => {
    setErrorMessage(null);
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    // If user pasted a 4-digit code into one box
    if (cleaned.length >= 4) {
      const codeDigits = cleaned.slice(0, 4).split('');
      setDigits(codeDigits);
      if (inputRefs.current[3]) inputRefs.current[3].focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned[cleaned.length - 1];
    setDigits(nextDigits);

    // Auto-focus next input
    if (index < 3 && cleaned.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  const handleVerify = () => {
    const fullOtp = digits.join('');
    
    if (!fullOtp) {
      setErrorMessage('Please enter the delivery OTP.');
      inputRefs.current[0]?.focus();
      return;
    }

    if (fullOtp.length < 4) {
      setErrorMessage('Please enter the complete 4-digit OTP.');
      const firstEmpty = digits.findIndex(d => !d);
      if (firstEmpty !== -1) {
        inputRefs.current[firstEmpty]?.focus();
      }
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    const result = verifyDeliveryOtp(fullOtp);

    if (result.success) {
      setSuccessMessage(result.message);
      // Short delay for customer visual celebration before popup opens
      setTimeout(() => {
        setIsOtpModalOpen(false);
      }, 700);
    } else {
      setIsVerifying(false);
      setErrorMessage(result.message);
      // Keep focus and select digits for easy correction
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
  };

  const handleFillDemoOtp = () => {
    const otpChars = expectedOtp.slice(0, 4).split('');
    setDigits(otpChars);
    setErrorMessage(null);
    if (inputRefs.current[3]) inputRefs.current[3].focus();
  };

  return (
    <div
      id="customer-otp-verification-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="customer-otp-verification-box"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Close / Cancel Button */}
        <button
          id="btn-close-otp-modal"
          onClick={() => setIsOtpModalOpen(false)}
          className="absolute top-5 right-5 rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Cancel"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 shadow-2xs">
            <KeyRound className="h-7 w-7" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 text-cyan-950 px-3 py-0.5 text-xs font-bold border border-cyan-300">
            <Bike className="h-3.5 w-3.5 text-cyan-700" />
            <span>Rider Has Arrived at Your Location</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Confirm Your Delivery
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
            Your delivery partner <strong>Rahul Sharma</strong> has requested the OTP. Enter your 4-digit code to complete the order.
          </p>
        </div>

        {/* Order Details Chip & Auto-Fill Hint */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-200 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Order Reference</span>
            <span className="font-mono font-black text-slate-800">{orderId}</span>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-cyan-700 block">Your Order OTP</span>
            <button
              type="button"
              id="btn-demo-autofill-otp"
              onClick={handleFillDemoOtp}
              className="inline-flex items-center gap-1 font-mono font-black text-xs text-cyan-900 bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              title="Click to fill your order OTP"
            >
              <span>{expectedOtp}</span>
              <span className="text-[9px] text-cyan-700 font-sans font-medium">(Click to fill)</span>
            </button>
          </div>
        </div>

        {/* 4-Digit Input Boxes */}
        <div className="space-y-3">
          <label className="block text-center text-xs font-bold uppercase tracking-wider text-slate-600">
            Enter 4-Digit Delivery OTP
          </label>
          
          <div className="flex justify-center gap-2.5 sm:gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                id={`otp-input-digit-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isVerifying || Boolean(successMessage)}
                className={`h-14 w-12 sm:h-16 sm:w-14 text-center font-mono text-2xl font-black rounded-2xl border-2 transition-all shadow-2xs focus:outline-hidden ${
                  errorMessage
                    ? 'border-rose-400 bg-rose-50 text-rose-900 focus:border-rose-600 focus:ring-3 focus:ring-rose-500/20'
                    : digit
                    ? 'border-cyan-500 bg-cyan-50/50 text-cyan-950 ring-2 ring-cyan-500/20'
                    : 'border-slate-200 bg-slate-50/70 text-slate-900 focus:border-cyan-500 focus:bg-white focus:ring-3 focus:ring-cyan-500/20'
                }`}
                placeholder="•"
              />
            ))}
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div
            id="otp-error-alert"
            className="rounded-2xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-950 space-y-1 animate-in fade-in"
          >
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>❌ Incorrect OTP</span>
            </div>
            <p className="pl-6 text-[11px] leading-relaxed text-rose-800">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Success Notification Alert */}
        {successMessage && (
          <div
            id="otp-success-alert"
            className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-950 space-y-1 animate-in fade-in"
          >
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>✓ OTP Verified</span>
            </div>
            <p className="pl-6 text-[11px] leading-relaxed text-emerald-800 font-semibold">
              Delivery successfully confirmed!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            id="btn-submit-verify-otp"
            onClick={handleVerify}
            disabled={isVerifying || Boolean(successMessage)}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3.5 text-sm font-black text-white transition-all shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>{isVerifying ? 'Verifying OTP...' : 'VERIFY OTP'}</span>
          </button>

          <button
            type="button"
            id="btn-cancel-otp-modal"
            onClick={() => setIsOtpModalOpen(false)}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Help footer note */}
        <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Info className="h-3 w-3 text-slate-400" />
          <span>Keep this code private until the rider reaches your doorstep.</span>
        </p>

      </div>
    </div>
  );
};
