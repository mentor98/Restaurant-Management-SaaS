import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Boxes,
  Truck,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { InventoryItem } from '../../types.ts';
import { AddInventoryModal } from './AddInventoryModal.tsx';

export const InventoryView: React.FC = () => {
  const { inventory, updateInventoryStock, profile } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [restockAmount, setRestockAmount] = useState<Record<string, string>>({});

  const currencySymbol = profile?.currencySymbol || '$';

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minThreshold);
  const totalValuation = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0);

  const categories = ['all', 'Meat & Seafood', 'Dairy & Eggs', 'Produce & Veg', 'Pantry & Dry', 'Alcohol & Wine', 'Beverages'];

  const filteredInventory = inventory.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.supplier && item.supplier.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRestock = (itemId: string) => {
    const delta = Number(restockAmount[itemId]) || 10;
    updateInventoryStock(itemId, delta);
    setRestockAmount((prev) => ({ ...prev, [itemId]: '' }));
  };

  return (
    <div id="inventory-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Header & Metrics Strip */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Inventory & Raw Materials Stock
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Auto-depletes dynamically upon POS order cooking completion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock Item</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-500">Tracked SKU Items</span>
              <div className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{inventory.length} items</div>
            </div>
            <Boxes className="w-5 h-5 text-zinc-400" />
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400">Low Stock Reorders</span>
              <div className="font-extrabold text-sm text-amber-600 dark:text-amber-400 font-mono">
                {lowStockItems.length} alerts
              </div>
            </div>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-500">Holding Valuation</span>
              <div className="font-extrabold text-sm text-emerald-500">
                {currencySymbol}{totalValuation.toFixed(2)}
              </div>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === c
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredients, supplier..."
              className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table / Card Grid */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredInventory.map((item) => {
            const isLow = item.currentStock <= item.minThreshold;
            const stockPct = Math.min(100, Math.round((item.currentStock / (item.minThreshold * 2)) * 100));

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm space-y-3 flex flex-col justify-between ${
                  isLow ? 'border-amber-500/60 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.name}</h4>
                      <div className="text-[11px] text-zinc-500">{item.category}</div>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        isLow
                          ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                      }`}
                    >
                      {isLow ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>

                  {/* Stock Level Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-600 dark:text-zinc-300">
                        Current: {item.currentStock} {item.unit}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px]">
                        Par Alert: {item.minThreshold} {item.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isLow ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${stockPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Pricing and Supplier */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="text-[10px] block text-zinc-400">Unit Cost</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {currencySymbol}{item.costPerUnit.toFixed(2)} / {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] block text-zinc-400">Vendor</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate block">
                        {item.supplier || 'Direct'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Restock action bar */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                  <input
                    type="number"
                    value={restockAmount[item.id] || ''}
                    onChange={(e) => setRestockAmount({ ...restockAmount, [item.id]: e.target.value })}
                    placeholder={`+ Qty (${item.unit})`}
                    className="w-24 px-2 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-center"
                  />
                  <button
                    onClick={() => handleRestock(item.id)}
                    className="flex-1 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 dark:hover:bg-amber-500 dark:hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Restock</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isAddModalOpen && <AddInventoryModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};
