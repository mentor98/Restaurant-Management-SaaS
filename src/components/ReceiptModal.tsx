import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const ReceiptModal: React.FC = () => {
  const { activeReceiptOrder, setActiveReceiptOrder, profile, activeBranch } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!activeReceiptOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const currencySymbol = profile?.currencySymbol || '$';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-100 border-b border-zinc-200">
          <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Order Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setActiveReceiptOrder(null)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Paper Layout */}
        <div ref={receiptRef} className="p-6 overflow-y-auto bg-white text-zinc-800 font-mono text-xs space-y-3 print:m-0 print:p-0">
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-300">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div className="font-bold text-sm tracking-wider uppercase">{profile?.name || 'Savory Prime Grill'}</div>
            <div className="text-[10px] text-zinc-600 leading-tight">
              {activeBranch.address}
              <br />
              Tel: {activeBranch.phone}
            </div>
            <div className="text-[10px] text-zinc-500 pt-1">
              Branch: {activeBranch.name} ({activeBranch.code})
            </div>
          </div>

          {/* Metadata */}
          <div className="text-[11px] space-y-0.5 pb-2 border-b border-dashed border-zinc-300">
            <div className="flex justify-between font-bold">
              <span>Order: {activeReceiptOrder.orderNumber}</span>
              <span className="uppercase">{activeReceiptOrder.orderType}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Table: {activeReceiptOrder.tableName || 'N/A'}</span>
              <span>Server: {activeReceiptOrder.waiterName || 'Staff'}</span>
            </div>
            <div className="flex justify-between text-zinc-500 text-[10px]">
              <span>Date: {new Date(activeReceiptOrder.createdAt).toLocaleDateString()}</span>
              <span>Time: {new Date(activeReceiptOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {activeReceiptOrder.customerName && (
              <div className="text-[10px] text-zinc-600">Guest: {activeReceiptOrder.customerName}</div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-2 py-1 border-b border-dashed border-zinc-300">
            {activeReceiptOrder.items.map((item, idx) => {
              const modSum = (item.selectedModifiers || []).reduce((sum, m) => sum + m.priceDelta, 0);
              const lineTotal = (item.price + modSum) * item.quantity;
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-semibold">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="shrink-0">{currencySymbol}{lineTotal.toFixed(2)}</span>
                  </div>
                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <div className="pl-4 text-[10px] text-zinc-500 space-y-0.5">
                      {item.selectedModifiers.map((mod, mIdx) => (
                        <div key={mIdx} className="flex justify-between">
                          <span>+ {mod.optionName}</span>
                          {mod.priceDelta > 0 && <span>+{currencySymbol}{mod.priceDelta.toFixed(2)}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1 text-[11px] pt-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currencySymbol}{activeReceiptOrder.subtotal.toFixed(2)}</span>
            </div>
            {activeReceiptOrder.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount {activeReceiptOrder.discountCode ? `(${activeReceiptOrder.discountCode})` : ''}</span>
                <span>-{currencySymbol}{activeReceiptOrder.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Sales Tax ({((profile?.taxRate || 0.0825) * 100).toFixed(2)}%)</span>
              <span>{currencySymbol}{activeReceiptOrder.taxAmount.toFixed(2)}</span>
            </div>
            {activeReceiptOrder.serviceChargeAmount > 0 && (
              <div className="flex justify-between">
                <span>Service Charge (10%)</span>
                <span>{currencySymbol}{activeReceiptOrder.serviceChargeAmount.toFixed(2)}</span>
              </div>
            )}
            {activeReceiptOrder.tipAmount > 0 && (
              <div className="flex justify-between font-medium text-amber-800">
                <span>Gratuity / Tip</span>
                <span>{currencySymbol}{activeReceiptOrder.tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-sm pt-1.5 border-t border-zinc-800 text-zinc-950">
              <span>TOTAL</span>
              <span>{currencySymbol}{activeReceiptOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="pt-2 pb-1 border-t border-dashed border-zinc-300 text-[10px] text-zinc-600">
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="uppercase font-bold text-emerald-700">{activeReceiptOrder.paymentStatus}</span>
            </div>
            {activeReceiptOrder.payments && activeReceiptOrder.payments.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {activeReceiptOrder.payments.map((p, pIdx) => (
                  <div key={pIdx} className="flex justify-between">
                    <span className="capitalize">Method: {p.method.replace('_', ' ')} (**** {p.cardLast4 || '4242'})</span>
                    <span>{currencySymbol}{p.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Barcode & Footer */}
          <div className="text-center pt-3 border-t border-dashed border-zinc-300 space-y-1.5">
            <div className="h-9 bg-zinc-900 rounded flex items-center justify-center text-white text-[9px] tracking-widest font-mono">
              ||| | |||| || ||||| | ||| |||| | ||
            </div>
            <div className="text-[9px] text-zinc-500 font-mono">{activeReceiptOrder.id}</div>
            <div className="text-[10px] text-zinc-500 whitespace-pre-line leading-tight">
              {profile?.receiptFooter || 'Thank you for dining with us!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
