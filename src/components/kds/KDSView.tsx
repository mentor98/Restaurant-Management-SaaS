import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2,
  VolumeX,
  Filter,
  Check,
  Sparkles,
  Layers,
  Utensils,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { KitchenStation } from '../../types.ts';

export const KDSView: React.FC = () => {
  const { kitchenTickets, bumpKitchenTicket, orders } = useApp();
  const [selectedStation, setSelectedStation] = useState<string>('All');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showAllDaySummary, setShowAllDaySummary] = useState<boolean>(false);

  const stations: (KitchenStation | 'All')[] = ['All', 'Grill', 'Saute', 'Pizza', 'Fryer', 'Pantry', 'Bar', 'Dessert'];

  // Filter tickets by station
  const filteredTickets = kitchenTickets.filter((ticket) => {
    if (selectedStation === 'All') return true;
    return ticket.items.some((item) => item.station.toLowerCase() === selectedStation.toLowerCase());
  });

  // Calculate All-Day Item Counts
  const allDayCounts: Record<string, { count: number; station: string }> = {};
  kitchenTickets.forEach((ticket) => {
    ticket.items.forEach((item) => {
      if (item.status !== 'served' && item.status !== 'ready') {
        if (!allDayCounts[item.name]) {
          allDayCounts[item.name] = { count: 0, station: item.station };
        }
        allDayCounts[item.name].count += item.quantity;
      }
    });
  });

  const toggleItemCheck = (orderItemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [orderItemId]: !prev[orderItemId],
    }));
  };

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  return (
    <div id="kds-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Top KDS Control Header */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                <span>Kitchen Display System (KDS)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold">
                  {filteredTickets.length} Active Tickets
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Station Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {stations.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStation(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedStation === st
                  ? 'bg-orange-500 text-zinc-950 shadow-md shadow-orange-500/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllDaySummary(!showAllDaySummary)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              showAllDaySummary ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All-Day Summary</span>
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playChime();
            }}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Audio feedback"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>
      </div>

      {/* Main KDS Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tickets Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500/40 stroke-1" />
              <div className="text-base font-bold text-zinc-300">All Kitchen Stations Clear!</div>
              <div className="text-xs max-w-sm">No pending orders for {selectedStation} station right now.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredTickets.map((ticket) => {
                const isUrgent = ticket.urgency === 'urgent';
                const isWarning = ticket.urgency === 'warning';

                return (
                  <div
                    key={ticket.id}
                    id={`kds-ticket-${ticket.orderNumber}`}
                    className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-200 ${
                      isUrgent
                        ? 'bg-zinc-900 border-rose-500/80 shadow-rose-950/40'
                        : isWarning
                        ? 'bg-zinc-900 border-amber-500/80 shadow-amber-950/40'
                        : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Ticket Header */}
                    <div
                      className={`p-3.5 border-b flex items-center justify-between ${
                        isUrgent
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : isWarning
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-zinc-800/80 border-zinc-700 text-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-base tracking-wide flex items-center gap-2">
                          <span>{ticket.orderNumber}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-black/40 font-mono">
                            {ticket.tableNumber || ticket.orderType.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[11px] opacity-80 mt-0.5">
                          Waiter: {ticket.waiterName || 'Staff'} • {ticket.items.length} items
                        </div>
                      </div>

                      {/* Timer */}
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                          isUrgent
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isWarning
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-700 text-zinc-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ticket.elapsedMinutes}m</span>
                      </div>
                    </div>

                    {/* Ticket Items List */}
                    <div className="p-3.5 space-y-3 flex-1 overflow-y-auto max-h-80">
                      {ticket.items.map((item, idx) => {
                        const isChecked = checkedItems[item.orderItemId];
                        const isItemReady = item.status === 'ready';

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleItemCheck(item.orderItemId)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                              isChecked || isItemReady
                                ? 'bg-zinc-800/40 border-zinc-800 opacity-50 line-through text-zinc-500'
                                : 'bg-zinc-800/90 border-zinc-700/80 hover:border-orange-500/50 text-zinc-100'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                    isChecked || isItemReady
                                      ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                                      : 'border-zinc-600 bg-zinc-900'
                                  }`}
                                >
                                  {(isChecked || isItemReady) && <Check className="w-3.5 h-3.5 font-black" />}
                                </div>
                                <span className="font-bold text-sm">
                                  {item.quantity}x {item.name}
                                </span>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 font-mono uppercase">
                                {item.station}
                              </span>
                            </div>

                            {/* Modifiers */}
                            {item.modifiers && item.modifiers.length > 0 && (
                              <div className="pl-7 pt-1 space-y-0.5">
                                {item.modifiers.map((m, mIdx) => (
                                  <div key={mIdx} className="text-[11px] text-amber-400 font-medium">
                                    • {m}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Special instructions */}
                            {item.specialInstructions && (
                              <div className="pl-7 pt-1 text-[11px] text-rose-400 font-semibold italic">
                                Note: "{item.specialInstructions}"
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bump Bar Action Footer */}
                    <div className="p-3 border-t border-zinc-800 bg-zinc-900/95 flex gap-2">
                      <button
                        onClick={() => {
                          if (soundEnabled) playChime();
                          bumpKitchenTicket(ticket.orderId, 'ready');
                        }}
                        className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Bump to Pass (Ready)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All-Day Items Summary Side Drawer */}
        {showAllDaySummary && (
          <div className="w-80 border-l border-zinc-800 bg-zinc-900 p-4 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>All-Day Prep Totals</span>
              </h3>
              <span className="text-xs text-zinc-400">Total queued items</span>
            </div>

            <div className="space-y-2 mt-3 flex-1">
              {Object.keys(allDayCounts).length === 0 ? (
                <div className="text-xs text-zinc-500 text-center py-6">No items currently queued.</div>
              ) : (
                Object.entries(allDayCounts).map(([name, info]) => (
                  <div
                    key={name}
                    className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-zinc-200">{name}</div>
                      <div className="text-[10px] text-zinc-400 uppercase font-mono">{info.station}</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 font-extrabold text-sm flex items-center justify-center border border-orange-500/30">
                      {info.count}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
