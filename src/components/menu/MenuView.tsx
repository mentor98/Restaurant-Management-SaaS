import React, { useState } from 'react';
import {
  MenuSquare,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { MenuItem, MenuCategory, DietaryTag } from '../../types.ts';
import { MenuItemModal } from './MenuItemModal.tsx';

export const MenuView: React.FC = () => {
  const {
    categories,
    menuItems,
    toggleMenuItemAvailability,
    deleteMenuItem,
    profile,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const currencySymbol = profile?.currencySymbol || '$';

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.kitchenStation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="menu-management-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Header & Controls */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <MenuSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Menu & Recipe Engineering
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {menuItems.length} items across {categories.length} culinary categories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="add-menu-item-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>
        </div>

        {/* Categories Bar & Search */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              All Categories ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm shadow-amber-500/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients..."
              className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Menu Dishes List */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const margin = item.price > 0 ? (((item.price - item.costPrice) / item.price) * 100).toFixed(0) : 0;

            return (
              <div
                key={item.id}
                id={`menu-item-manage-${item.id}`}
                className={`p-4 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200 flex flex-col justify-between ${
                  item.isAvailable
                    ? 'border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40'
                    : 'border-rose-500/30 bg-rose-500/5 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.name}</h4>
                        <span className="font-extrabold text-sm text-amber-500 shrink-0">
                          {currencySymbol}{item.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {item.categoryName} • Station: {item.kitchenStation}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <span className="text-zinc-400">Cost: {currencySymbol}{item.costPrice.toFixed(2)}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                          {margin}% Margin
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Dietary Badges */}
                  {item.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {item.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleMenuItemAvailability(item.id, !item.isAvailable)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      item.isAvailable
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                    }`}
                  >
                    {item.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{item.isAvailable ? 'In Stock (Active)' : "86'd (Unavailable)"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Edit Dish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isCreateModalOpen && <MenuItemModal itemToEdit={null} onClose={() => setIsCreateModalOpen(false)} />}
      {editingItem && <MenuItemModal itemToEdit={editingItem} onClose={() => setEditingItem(null)} />}
    </div>
  );
};
