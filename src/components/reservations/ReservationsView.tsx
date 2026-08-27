import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Reservation, ReservationStatus } from '../../types.ts';
import { AddReservationModal } from './AddReservationModal.tsx';

export const ReservationsView: React.FC = () => {
  const { reservations, updateReservationStatus, activeBranch } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.includes(q) ||
        (r.tableName && r.tableName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
      case 'seated':
        return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
      case 'completed':
        return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
      case 'cancelled':
        return 'bg-rose-500/15 text-rose-500 border-rose-500/30';
      case 'no-show':
        return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-400';
    }
  };

  return (
    <div id="reservations-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Table Bookings & Reservations
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {activeBranch.name} • {reservations.length} total scheduled guests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Book Table</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['all', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {st.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest name, phone..."
              className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="flex-1 p-5 overflow-y-auto">
        {filteredReservations.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 space-y-2">
            <Calendar className="w-10 h-10 stroke-1 opacity-40 text-amber-500" />
            <div className="text-xs font-semibold">No reservations found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredReservations.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{res.customerName}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="w-3.5 h-3.5 text-amber-500" /> {res.guestsCount} Guests
                        </span>
                        <span>•</span>
                        <span>{res.tableName ? `Table ${res.tableName}` : 'Table Unassigned'}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold border ${getStatusBadge(
                        res.status
                      )}`}
                    >
                      {res.status}
                    </span>
                  </div>

                  {/* Date & Time Badge */}
                  <div className="mt-3 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">Scheduled Time:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {res.reservationDate} at {res.reservationTime}
                    </span>
                  </div>

                  {/* Contact details */}
                  <div className="mt-2.5 space-y-1 text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{res.customerPhone}</span>
                    </div>
                    {res.specialRequests && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 italic pt-1">
                        Note: "{res.specialRequests}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-1.5">
                  {res.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => updateReservationStatus(res.id, 'seated')}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Seat Guests</span>
                      </button>
                      <button
                        onClick={() => updateReservationStatus(res.id, 'no-show')}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-400 text-xs font-semibold"
                      >
                        No-Show
                      </button>
                    </>
                  )}

                  {res.status === 'seated' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'completed')}
                      className="w-full py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-colors"
                    >
                      Mark Finished & Departed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && <AddReservationModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};
