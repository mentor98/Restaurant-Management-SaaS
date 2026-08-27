import React, { useState } from 'react';
import { X, Sparkles, Plus, Image as ImageIcon, ChefHat } from 'lucide-react';
import { MenuItem, MenuCategory, DietaryTag, KitchenStation } from '../../types.ts';
import { useApp } from '../../context/AppContext.tsx';

interface MenuItemModalProps {
  itemToEdit: MenuItem | null;
  onClose: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ itemToEdit, onClose }) => {
  const { categories, createMenuItem, updateMenuItem } = useApp();

  const [name, setName] = useState<string>(itemToEdit?.name || '');
  const [categoryId, setCategoryId] = useState<string>(itemToEdit?.categoryId || categories[0]?.id || 'cat_mains');
  const [price, setPrice] = useState<string>(itemToEdit?.price.toString() || '24.00');
  const [costPrice, setCostPrice] = useState<string>(itemToEdit?.costPrice.toString() || '6.50');
  const [kitchenStation, setKitchenStation] = useState<KitchenStation>(itemToEdit?.kitchenStation || 'Grill');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(itemToEdit?.prepTimeMinutes || 12);
  const [calories, setCalories] = useState<string>(itemToEdit?.calories?.toString() || '550');
  const [imageUrl, setImageUrl] = useState<string>(
    itemToEdit?.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80'
  );
  const [description, setDescription] = useState<string>(itemToEdit?.description || '');
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>(itemToEdit?.dietaryTags || []);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const stations: KitchenStation[] = ['Grill', 'Saute', 'Pizza', 'Fryer', 'Pantry', 'Bar', 'Dessert'];
  const allDietaryTags: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Spicy', 'Chef Special', 'Dairy-Free', 'Contains Nuts'];

  const toggleDietaryTag = (tag: DietaryTag) => {
    setDietaryTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleGenerateAIDescription = async () => {
    if (!name.trim()) return;
    setIsGeneratingAI(true);
    try {
      const cat = categories.find((c) => c.id === categoryId)?.name;
      const res = await fetch('/api/ai/suggest-menu-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: name, category: cat }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.description) setDescription(data.description);
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setIsSaving(true);
    const categoryName = categories.find((c) => c.id === categoryId)?.name || 'Mains';

    const payload: Partial<MenuItem> = {
      name,
      categoryId,
      categoryName,
      price: Number(price),
      costPrice: Number(costPrice),
      kitchenStation,
      prepTimeMinutes: Number(prepTimeMinutes),
      calories: calories ? Number(calories) : undefined,
      imageUrl,
      description,
      dietaryTags,
      isAvailable: itemToEdit ? itemToEdit.isAvailable : true,
    };

    let ok = false;
    if (itemToEdit) {
      ok = await updateMenuItem(itemToEdit.id, payload);
    } else {
      ok = await createMenuItem(payload);
    }

    setIsSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="menu-item-modal"
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              {itemToEdit ? 'Edit Menu Dish' : 'Create New Menu Dish'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pan-Seared Chilean Sea Bass"
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Menu Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Food Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Kitchen Prep Station
              </label>
              <select
                value={kitchenStation}
                onChange={(e) => setKitchenStation(e.target.value as KitchenStation)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              >
                {stations.map((s) => (
                  <option key={s} value={s}>
                    {s} Station
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Prep Time (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
              />
              <img src={imageUrl} alt="preview" className="w-10 h-10 rounded-lg object-cover border border-zinc-300 dark:border-zinc-700 shrink-0" />
            </div>
          </div>

          {/* Description & AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Menu Description
              </label>
              <button
                type="button"
                onClick={handleGenerateAIDescription}
                disabled={isGeneratingAI || !name.trim()}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:text-amber-600 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAI ? 'Writing with AI...' : 'AI Enhance Copy'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the flavors, preparation technique, and presentation..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Dietary & Allergen Badges
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allDietaryTags.map((tag) => {
                const active = dietaryTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                    }`}
                  >
                    {tag} {active ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : itemToEdit ? 'Save Changes' : 'Create Dish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
