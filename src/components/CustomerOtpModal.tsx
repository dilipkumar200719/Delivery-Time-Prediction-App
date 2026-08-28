import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Bike,
  Store,
  FileText,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight
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
  const [hasShaken, setHasShaken] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const orderId = activeOrder?.id || 'ORD-8553';
  const expectedOtp = activeOrder?.deliveryOtp || '8553';
  const restaurantName = activeOrder?.restaurantName || 'Spice Route Kitchen';
  const riderName = 'Rahul Sharma';

  // Handle modal lifecycle, keyboard Escape listener, and body scroll lock
  useEffect(() => {
    if (isOtpModalOpen && !isDeliveryCompleted) {
      setDigits(['', '', '', '']);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsVerifying(false);
      setHasShaken(false);

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Auto-focus first input with slight delay
      const focusTimer = setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
          inputRefs.current[0].select();
        }
      }, 100);

      // Escape key listener to close modal
      const handleKeyDownGlobal = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOtpModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDownGlobal);

      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDownGlobal);
      };
    }
  }, [isOtpModalOpen, isDeliveryCompleted, setIsOtpModalOpen]);

  if (!isOtpModalOpen || isDeliveryCompleted) return null;

  // Single source of truth input change handler
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/\D/g, '');

    setErrorMessage(null);
    setHasShaken(false);

    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // Handle multiple digits entered or pasted into a field
    if (cleaned.length > 1) {
      const next = [...digits];
      for (let i = 0; i < cleaned.length && index + i < 4; i++) {
        next[index + i] = cleaned[i];
      }
      setDigits(next);
      const nextIndex = Math.min(3, index + cleaned.length);
      inputRefs.current[nextIndex]?.focus();
      inputRefs.current[nextIndex]?.select();
      return;
    }

    // Single digit typed
    const next = [...digits];
    next[index] = cleaned[cleaned.length - 1];
    setDigits(next);

    // Auto-advance to next box
    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  // Keyboard navigation: Backspace, Arrow keys, Enter
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move back and clear previous box
        e.preventDefault();
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      } else if (digits[index]) {
        // Clear current box
        const next = [...digits];
        next[index] = '';
        setDigits(next);
        setErrorMessage(null);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        inputRefs.current[index - 1]?.select();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
        inputRefs.current[index + 1]?.select();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  // Paste handler: paste 4-digit code directly into any box
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasteData) return;

    const next = [...digits];
    for (let i = 0; i < 4 && i < pasteData.length; i++) {
      next[i] = pasteData[i];
    }
    setDigits(next);
    setErrorMessage(null);
    setHasShaken(false);

    // Focus last filled box
    const focusIdx = Math.min(3, Math.max(0, pasteData.length - 1));
    inputRefs.current[focusIdx]?.focus();
    inputRefs.current[focusIdx]?.select();
  };

  // Click to fill demo OTP handler: ONLY fills the boxes, does NOT auto-submit
  const handleFillDemoOtp = () => {
    const otpChars = expectedOtp.slice(0, 4).split('');
    // Pad to 4 if needed
    while (otpChars.length < 4) otpChars.push('0');
    setDigits(otpChars);
    setErrorMessage(null);
    setHasShaken(false);

    // Move focus to 4th box so user can review and explicitly click VERIFY OTP
    if (inputRefs.current[3]) {
      inputRefs.current[3].focus();
      inputRefs.current[3].select();
    }
  };

  // Verify OTP submission
  const handleVerify = async () => {
    const fullOtp = digits.join('');

    // C. Empty OTP check
    if (!fullOtp || fullOtp.trim().length === 0) {
      setErrorMessage('Please enter your 4-digit delivery OTP.');
      setHasShaken(true);
      inputRefs.current[0]?.focus();
      return;
    }

    // D. Partial OTP check
    if (fullOtp.length < 4 || digits.some(d => !d)) {
      setErrorMessage('Please enter all 4 digits.');
      setHasShaken(true);
      const firstEmptyIndex = digits.findIndex(d => !d);
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setHasShaken(false);

    try {
      const result = await verifyDeliveryOtp(fullOtp);

      if (result.success) {
        // A. Correct OTP
        setSuccessMessage('Delivery confirmed successfully!');
        // Short celebratory delay before closing modal
        setTimeout(() => {
          setIsOtpModalOpen(false);
        }, 800);
      } else {
        // B. Incorrect OTP
        setIsVerifying(false);
        setErrorMessage(result.message || 'Incorrect OTP. Please check the 4-digit code and try again.');
        setHasShaken(true);
        // Highlight and focus the first box for easy correction
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
          inputRefs.current[0].select();
        }
      }
    } catch (err) {
      setIsVerifying(false);
      setErrorMessage('Unable to verify the delivery right now. Please try again.');
      setHasShaken(true);
    }
  };

  return (
    <div
      id="customer-otp-verification-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isVerifying) {
          setIsOtpModalOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="customer-otp-verification-box"
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xl space-y-5 my-auto transition-transform ${
          hasShaken ? 'animate-shake' : ''
        }`}
      >
        {/* Close Button */}
        <button
          id="btn-close-otp-modal"
          type="button"
          onClick={() => setIsOtpModalOpen(false)}
          disabled={isVerifying}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 cursor-pointer"
          aria-label="Close delivery verification modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 1. Header Section */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 text-cyan-950 px-3.5 py-1 text-xs font-black border border-cyan-300 shadow-2xs">
            <Bike className="h-4 w-4 text-cyan-700 animate-pulse" />
            <span>Delivery Partner Arrived</span>
          </div>

          <h2 id="otp-modal-title" className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Confirm Your Delivery
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your delivery partner has arrived at your location. Please verify your order using the 4-digit OTP.
          </p>

          <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 rounded-xl py-1 px-3 border border-amber-200/70 max-w-sm mx-auto">
            For your security, share the 4-digit OTP only when you receive your order.
          </p>
        </div>

        {/* 2. ORDER DETAILS Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3.5 space-y-2 text-xs">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span>Order Details</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-800">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Order ID</span>
              <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">{orderId}</span>
            </div>

            <div className="space-y-0.5 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Order Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded-md border border-cyan-200 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 animate-ping" />
                Rider Arrived
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Restaurant</span>
              <span className="font-bold text-slate-900 truncate block text-[11px] sm:text-xs flex items-center gap-1">
                <Store className="h-3 w-3 text-slate-500 shrink-0" />
                <span className="truncate">{restaurantName}</span>
              </span>
            </div>

            <div className="space-y-0.5 text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery Partner</span>
              <span className="font-bold text-slate-900 text-[11px] sm:text-xs">{riderName}</span>
            </div>
          </div>
        </div>

        {/* 3. YOUR DELIVERY OTP Card & 4 Input Boxes */}
        <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50/40 p-4 sm:p-5 space-y-4">
          
          {/* OTP Code Display & Fill for Demo */}
          <div className="flex items-center justify-between border-b border-cyan-200/70 pb-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-900 block">
                Your Delivery OTP
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Enter this 4-digit code below
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base sm:text-lg text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-cyan-300 shadow-2xs">
                {expectedOtp}
              </span>
              <button
                type="button"
                id="btn-demo-autofill-otp"
                onClick={handleFillDemoOtp}
                disabled={isVerifying || Boolean(successMessage)}
                className="inline-flex items-center gap-1 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-2.5 py-1.5 text-[11px] font-black transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
                title="Populates the 4 OTP boxes for testing"
              >
                <Sparkles className="h-3 w-3 text-cyan-200" />
                <span>Click to Fill</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Input Boxes */}
          <div className="space-y-2">
            <div className="flex justify-center items-center gap-2.5 sm:gap-4 py-1">
              {digits.map((digit, idx) => {
                const isCurrentActive = digits.findIndex(d => !d) === idx || (idx === 3 && digits.every(Boolean));
                return (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    id={`otp-input-digit-${idx}`}
                    name={`otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    value={digit}
                    onChange={(e) => handleInputChange(idx, e)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    disabled={isVerifying || Boolean(successMessage)}
                    aria-label={`OTP digit ${idx + 1} of 4`}
                    aria-invalid={Boolean(errorMessage)}
                    className={`h-14 w-12 sm:h-16 sm:w-14 text-center font-mono text-2xl sm:text-3xl font-black rounded-2xl border-2 transition-all shadow-xs cursor-text focus:outline-hidden ${
                      errorMessage
                        ? 'border-rose-400 bg-rose-50 text-rose-950 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/20'
                        : successMessage
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30'
                        : digit
                        ? 'border-cyan-600 bg-white text-cyan-950 ring-2 ring-cyan-500/20 shadow-sm'
                        : 'border-slate-300 bg-white text-slate-900 hover:border-cyan-400 focus:border-cyan-600 focus:bg-white focus:ring-4 focus:ring-cyan-500/20'
                    }`}
                    placeholder="•"
                  />
                );
              })}
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              id="otp-error-alert"
              role="alert"
              className="rounded-2xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-950 space-y-0.5 animate-in fade-in"
            >
              <div className="flex items-center gap-1.5 font-black text-rose-900">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Verification Failed</span>
              </div>
              <p className="pl-5 text-[11px] leading-relaxed text-rose-800 font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div
              id="otp-success-alert"
              role="status"
              className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950 space-y-0.5 animate-in fade-in"
            >
              <div className="flex items-center gap-1.5 font-black text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Delivery Confirmed!</span>
              </div>
              <p className="pl-5 text-[11px] leading-relaxed text-emerald-800 font-bold">
                {successMessage}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              id="btn-submit-verify-otp"
              onClick={handleVerify}
              disabled={isVerifying || Boolean(successMessage)}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3.5 text-sm font-black text-white transition-all shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>VERIFYING...</span>
                </>
              ) : successMessage ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  <span>DELIVERED ✓</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>VERIFY OTP</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="btn-cancel-otp-modal"
              onClick={() => setIsOtpModalOpen(false)}
              disabled={isVerifying}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer disabled:opacity-30"
            >
              Cancel
            </button>
          </div>

        </div>

        {/* 4. Security Note Footer */}
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-600 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-bold text-slate-800 block">🔒 Security Tip</span>
            <p>
              Share the OTP only after your order has arrived. Never share your OTP before the delivery partner reaches your location.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
