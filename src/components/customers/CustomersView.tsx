import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Award,
  DollarSign,
  Calendar,
  AlertTriangle,
  Heart,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Customer } from '../../types.ts';
import { AddCustomerModal } from './AddCustomerModal.tsx';

export const CustomersView: React.FC = () => {
  const { customers, profile } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currencySymbol = profile?.currencySymbol || '$';

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div id="customers-crm-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Customer CRM & Loyalty Directory
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {customers.length} registered guests • VIP loyalty, dietary profiles & order history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, tags..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Guests Grid */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{cust.name}</span>
                      {cust.tags.includes('VIP') && (
                        <Award className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                      )}
                    </h4>
                    <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                      <span>{cust.phone}</span>
                      {cust.email && <span>• {cust.email}</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-zinc-400 uppercase font-medium">Lifetime Spend</div>
                    <div className="font-extrabold text-sm text-emerald-500">
                      {currencySymbol}{cust.totalSpend.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Loyalty & Visits Strip */}
                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px]">Total Visits</span>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{cust.visitsCount} visits</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px]">Loyalty Points</span>
                    <div className="font-bold text-amber-500 font-mono">{cust.loyaltyPoints} pts</div>
                  </div>
                </div>

                {/* Allergies / Health Badges */}
                {cust.allergies && cust.allergies.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Allergies:
                    </span>
                    {cust.allergies.map((alg, aIdx) => (
                      <span
                        key={aIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-medium"
                      >
                        {alg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Favorite Dishes */}
                {cust.favoriteDishes && cust.favoriteDishes.length > 0 && (
                  <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-amber-500" />
                    <span>Favorites: {cust.favoriteDishes.join(', ')}</span>
                  </div>
                )}

                {/* Notes */}
                {cust.notes && (
                  <div className="mt-2 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-400 italic">
                    "{cust.notes}"
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {cust.tags.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-400">
                  Last seen: {new Date(cust.lastVisitAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAddModalOpen && <AddCustomerModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};
