import React, { useState } from 'react';
import { Lock, KeyRound, X, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const PinLoginModal: React.FC = () => {
  const { isPinModalOpen, setIsPinModalOpen, loginWithPin, staffList, setCurrentUser, setActiveView } = useApp();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isPinModalOpen) return null;

  const handleDigitClick = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      setError('');
      if (next.length === 4) {
        verifyPin(next);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const verifyPin = async (codeToTest: string) => {
    setIsVerifying(true);
    const success = await loginWithPin(codeToTest);
    setIsVerifying(false);
    if (!success) {
      setError('Invalid PIN. Please try again or use quick switch below.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="pin-login-modal"
        className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 relative overflow-hidden"
      >
        <button
          onClick={() => setIsPinModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Staff Fast PIN Access</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Enter your 4-digit staff terminal code</p>
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  isFilled
                    ? 'bg-amber-500 border-amber-500 scale-110 shadow-sm shadow-amber-500/50'
                    : 'border-zinc-300 dark:border-zinc-700 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs text-center flex items-center justify-center gap-1.5 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              id={`pin-key-${digit}`}
              onClick={() => handleDigitClick(digit)}
              disabled={isVerifying}
              className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xl font-bold active:scale-95 transition-all shadow-sm"
            >
              {digit}
            </button>
          ))}
          <button
            id="pin-key-clear"
            onClick={handleClear}
            className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800/40 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase transition-all"
          >
            Clear
          </button>
          <button
            id="pin-key-0"
            onClick={() => handleDigitClick('0')}
            disabled={isVerifying}
            className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xl font-bold active:scale-95 transition-all shadow-sm"
          >
            0
          </button>
          <button
            id="pin-key-del"
            onClick={handleDelete}
            className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800/40 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase transition-all flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

        {/* Demo Fast Shift Switcher Shortcuts */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Instant Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {staffList.slice(0, 4).map((stf) => (
              <button
                key={stf.id}
                onClick={() => {
                  setCurrentUser(stf);
                  setIsPinModalOpen(false);
                  if (stf.role === 'chef') setActiveView('kds');
                  else if (stf.role === 'server') setActiveView('pos');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-amber-500/10 hover:border-amber-500/30 border border-zinc-200 dark:border-zinc-800 text-left transition-colors"
              >
                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-200 truncate">{stf.name}</div>
                <div className="text-[10px] text-zinc-400 flex justify-between">
                  <span className="capitalize">{stf.role}</span>
                  <span className="font-mono text-amber-500">PIN: {stf.pin}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
