import React, { useState } from 'react';
import {
  LayoutGrid,
  Plus,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  UtensilsCrossed,
  RotateCcw,
  CreditCard,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { TableZone, TableStatus, RestaurantTable } from '../../types.ts';
import { AddTableModal } from './AddTableModal.tsx';

export const TablesView: React.FC = () => {
  const {
    tables,
    activeBranch,
    updateTableStatus,
    setSelectedTableForPOS,
    setActiveView,
    orders,
    profile,
  } = useApp();

  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeTableAction, setActiveTableAction] = useState<RestaurantTable | null>(null);

  const zones = ['All', 'Main Dining', 'Patio & Garden', 'Bar Area', 'Rooftop Lounge', 'VIP Private Room'];
  const statuses: { id: string; label: string; color: string }[] = [
    { id: 'All', label: 'All Statuses', color: 'bg-zinc-500' },
    { id: 'available', label: 'Available', color: 'bg-emerald-500' },
    { id: 'occupied', label: 'Occupied', color: 'bg-amber-500' },
    { id: 'billing', label: 'Billing / Pay', color: 'bg-cyan-500' },
    { id: 'cleaning', label: 'Needs Cleaning', color: 'bg-purple-500' },
    { id: 'reserved', label: 'Reserved', color: 'bg-blue-500' },
  ];

  const filteredTables = tables.filter((t) => {
    if (selectedZone !== 'All' && t.zone !== selectedZone) return false;
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;
    return true;
  });

  const currencySymbol = profile?.currencySymbol || '$';

  const statusStyles: Record<TableStatus, { border: string; badge: string; text: string; bg: string }> = {
    available: {
      border: 'border-emerald-500/40 hover:border-emerald-500',
      badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/5',
    },
    occupied: {
      border: 'border-amber-500/40 hover:border-amber-500',
      badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      text: 'text-amber-500',
      bg: 'bg-amber-500/5',
    },
    billing: {
      border: 'border-cyan-500/40 hover:border-cyan-500',
      badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      text: 'text-cyan-500',
      bg: 'bg-cyan-500/5',
    },
    cleaning: {
      border: 'border-purple-500/40 hover:border-purple-500',
      badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      text: 'text-purple-500',
      bg: 'bg-purple-500/5',
    },
    reserved: {
      border: 'border-blue-500/40 hover:border-blue-500',
      badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      text: 'text-blue-500',
      bg: 'bg-blue-500/5',
    },
  };

  const getElapsedMinutes = (occupiedSince?: string) => {
    if (!occupiedSince) return 0;
    return Math.floor((Date.now() - new Date(occupiedSince).getTime()) / 60000);
  };

  return (
    <div id="tables-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Top Header & Filter Controls */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Floor Plan & Table Management
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {activeBranch.name} • {tables.length} configured dining spaces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          </div>
        </div>

        {/* Zone Tabs & Status Quick Counts */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedZone === z
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
            {statuses.map((st) => {
              const count =
                st.id === 'All'
                  ? tables.length
                  : tables.filter((t) => t.status === st.id).length;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    selectedStatus === st.id
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${st.color}`} />
                  <span>{st.label}</span>
                  <span className="font-bold font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables Grid Layout */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredTables.map((tbl) => {
            const styles = statusStyles[tbl.status] || statusStyles.available;
            const elapsed = getElapsedMinutes(tbl.occupiedSince);
            const activeOrder = tbl.currentOrderId ? orders.find((o) => o.id === tbl.currentOrderId) : null;

            return (
              <div
                key={tbl.id}
                id={`table-card-${tbl.number}`}
                onClick={() => setActiveTableAction(tbl)}
                className={`p-4 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${styles.border} ${styles.bg}`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>{tbl.number}</span>
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                          {tbl.zone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>Up to {tbl.capacity} guests</span>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold border ${styles.badge}`}>
                      {tbl.status}
                    </span>
                  </div>

                  {/* Active Order Details */}
                  {tbl.status === 'occupied' && (
                    <div className="mt-3 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-zinc-800 dark:text-zinc-200">
                        <span>Order: {activeOrder?.orderNumber || '#1084'}</span>
                        <span className="text-amber-500 font-extrabold">
                          {currencySymbol}{activeOrder ? activeOrder.total.toFixed(2) : '121.80'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>Server: {tbl.assignedWaiterName || 'Elena R.'}</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {elapsed}m
                        </span>
                      </div>
                    </div>
                  )}

                  {tbl.notes && (
                    <div className="mt-2 text-[11px] text-zinc-500 italic line-clamp-1">
                      Note: {tbl.notes}
                    </div>
                  )}
                </div>

                {/* Card Quick Action Bar */}
                <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTableForPOS(tbl);
                      setActiveView('pos');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-500 dark:hover:text-zinc-950 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>POS Order</span>
                  </button>

                  {tbl.status === 'cleaning' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTableStatus(tbl.id, 'available');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-500 text-xs font-bold transition-colors"
                      title="Mark Cleaned"
                    >
                      Cleaned ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Status Quick Action Sheet Modal */}
      {activeTableAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Table {activeTableAction.number} Controls
                </h3>
                <p className="text-xs text-zinc-500">{activeTableAction.zone} • Capacity: {activeTableAction.capacity}</p>
              </div>
              <button
                onClick={() => setActiveTableAction(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Set Table Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['available', 'occupied', 'billing', 'cleaning', 'reserved'] as TableStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateTableStatus(activeTableAction.id, st);
                      setActiveTableAction(null);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-colors ${
                      activeTableAction.status === st
                        ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <button
                onClick={() => {
                  setSelectedTableForPOS(activeTableAction);
                  setActiveTableAction(null);
                  setActiveView('pos');
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Open POS Terminal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && <AddTableModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};
