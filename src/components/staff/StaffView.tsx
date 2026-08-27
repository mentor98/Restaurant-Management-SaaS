import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  Key,
  DollarSign,
  UserCheck,
  Award,
  CheckCircle2,
  Clock,
  LogIn,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { StaffUser, StaffRole } from '../../types.ts';
import { AddStaffModal } from './AddStaffModal.tsx';

export const StaffView: React.FC = () => {
  const { staffList, currentUser, loginWithPin, profile, activeBranch } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const currencySymbol = profile?.currencySymbol || '$';

  const roleBadges: Record<StaffRole, { bg: string; text: string; label: string }> = {
    admin: { bg: 'bg-rose-500/15 text-rose-500 border-rose-500/30', text: 'text-rose-500', label: 'Admin / Owner' },
    manager: { bg: 'bg-amber-500/15 text-amber-500 border-amber-500/30', text: 'text-amber-500', label: 'Manager' },
    chef: { bg: 'bg-orange-500/15 text-orange-500 border-orange-500/30', text: 'text-orange-500', label: 'Head Chef' },
    kitchen_staff: { bg: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', text: 'text-yellow-500', label: 'Line Cook' },
    waiter: { bg: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30', text: 'text-emerald-500', label: 'Server / Waiter' },
    server: { bg: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30', text: 'text-emerald-500', label: 'Server / Waiter' },
    bartender: { bg: 'bg-purple-500/15 text-purple-500 border-purple-500/30', text: 'text-purple-500', label: 'Mixologist / Bar' },
    host: { bg: 'bg-blue-500/15 text-blue-500 border-blue-500/30', text: 'text-blue-500', label: 'Hostess' },
    cashier: { bg: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30', text: 'text-cyan-500', label: 'Cashier' },
  };

  const filteredStaff = staffList.filter((s) => {
    if (selectedRole !== 'all' && s.role !== selectedRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div id="staff-management-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Header & Controls */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Staff Directory & Role-Based Permissions
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {activeBranch.name} • {staffList.length} total team members across front and back of house
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        {/* Roles Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['all', 'admin', 'manager', 'chef', 'kitchen_staff', 'waiter', 'bartender'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  selectedRole === r
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name, email..."
              className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => {
            const roleInfo = roleBadges[staff.role] || roleBadges.waiter;
            const isSelf = currentUser?.id === staff.id;

            return (
              <div
                key={staff.id}
                className={`p-4 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm space-y-3 flex flex-col justify-between ${
                  isSelf ? 'border-amber-500/80 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        staff.avatarUrl ||
                        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
                      }
                      alt={staff.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                          <span>{staff.name}</span>
                          {isSelf && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-zinc-950 font-black">
                              YOU
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="text-xs text-zinc-500 truncate">{staff.email}</div>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${roleInfo.bg}`}
                        >
                          {roleInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Staff Info Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">POS PIN Code</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 tracking-widest">
                        {staff.pin}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Base Hourly</span>
                      <span className="font-bold text-emerald-500">
                        {currencySymbol}{staff.hourlyWage?.toFixed(2) || '18.00'} / hr
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch User Simulation Button */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => loginWithPin(staff.pin)}
                    className="w-full py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-500 dark:hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Switch & Act as {staff.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isAddModalOpen && <AddStaffModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};
