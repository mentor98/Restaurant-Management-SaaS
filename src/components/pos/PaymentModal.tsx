import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone, Split, Check, Sparkles, Receipt, Calculator } from 'lucide-react';
import { Order, PaymentMethod } from '../../types.ts';
import { useApp } from '../../context/AppContext.tsx';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onPaymentSuccess: (paidOrder: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ order, onClose, onPaymentSuccess }) => {
  const { profile, payOrder, setActiveReceiptOrder } = useApp();
  const [method, setMethod] = useState<PaymentMethod>('credit_card');
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [customTip, setCustomTip] = useState<string>('');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [splitCount, setSplitCount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const currencySymbol = profile?.currencySymbol || '$';

  // Calculate tip
  const tipOptions = profile?.defaultTipPercentages || [15, 18, 20, 25];
  const calculatedTip = customTip !== '' ? Number(customTip) || 0 : Number((order.subtotal * (tipPercent / 100)).toFixed(2));
  const finalTotal = Number((order.subtotal + order.taxAmount + (order.serviceChargeAmount || 0) - (order.discountAmount || 0) + calculatedTip).toFixed(2));

  // Split calculation
  const perPersonAmount = Number((finalTotal / splitCount).toFixed(2));

  // Cash change
  const cashNum = Number(cashTendered) || 0;
  const changeDue = Math.max(0, Number((cashNum - finalTotal).toFixed(2)));

  const handleSettleBill = async () => {
    setIsProcessing(true);
    const paid = await payOrder(order.id, method, finalTotal, calculatedTip);
    setIsProcessing(false);
    if (paid) {
      setActiveReceiptOrder(paid);
      onPaymentSuccess(paid);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="payment-modal"
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span>Settle Order {order.orderNumber}</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {order.tableName || 'Takeout'} • {order.items.length} items • Server: {order.waiterName || 'Staff'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Bill Summary Strip */}
          <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Subtotal</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{currencySymbol}{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>Discount Applied</span>
                <span>-{currencySymbol}{order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Tax ({( (profile?.taxRate || 0.0825) * 100 ).toFixed(2)}%)</span>
              <span>{currencySymbol}{order.taxAmount.toFixed(2)}</span>
            </div>
            {order.serviceChargeAmount > 0 && (
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Service Charge (10%)</span>
                <span>{currencySymbol}{order.serviceChargeAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-amber-500 font-medium">
              <span>Gratuity / Tip</span>
              <span>+{currencySymbol}{calculatedTip.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Grand Total</span>
              <span className="text-xl font-extrabold text-amber-500">{currencySymbol}{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Tip Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Select Gratuity</span>
              <span className="text-[11px] text-zinc-400 font-normal">Shared with kitchen & waitstaff</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {tipOptions.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip('');
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    tipPercent === pct && customTip === ''
                      ? 'bg-amber-500 text-zinc-950 shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {pct}%
                  <div className="text-[9px] font-normal opacity-80">
                    {currencySymbol}{(order.subtotal * (pct / 100)).toFixed(0)}
                  </div>
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Custom $"
                  value={customTip}
                  onChange={(e) => {
                    setCustomTip(e.target.value);
                    setTipPercent(0);
                  }}
                  className="w-full h-full py-2 px-1 text-center text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('credit_card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'credit_card'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:text-amber-400 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'cash'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:text-amber-400 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span className="text-xs">Cash</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('apple_pay')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'apple_pay'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:text-amber-400 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">Apple / Contactless</span>
              </button>
            </div>
          </div>

          {/* Cash Tendered & Change Helper */}
          {method === 'cash' && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Cash Received</span>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  placeholder={`e.g. ${Math.ceil(finalTotal / 10) * 10}`}
                  className="w-28 px-2 py-1 text-right text-xs font-bold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-amber-500/20">
                <span className="text-zinc-600 dark:text-zinc-400">Change Due Back:</span>
                <span className="font-extrabold text-sm text-emerald-500">
                  {currencySymbol}{changeDue.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Split Bill Calculator */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <Split className="w-4 h-4 text-amber-500" />
                <span>Equal Split Bill</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 6].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSplitCount(count)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      splitCount === count
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300'
                    }`}
                  >
                    {count}x
                  </button>
                ))}
              </div>
            </div>
            {splitCount > 1 && (
              <div className="text-xs text-zinc-500 flex justify-between items-center pt-1">
                <span>Each Guest Pays ({splitCount} guests):</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {currencySymbol}{perPersonAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            id="confirm-payment-btn"
            disabled={isProcessing}
            onClick={handleSettleBill}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Processing...' : `Confirm & Charge ${currencySymbol}${finalTotal.toFixed(2)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
