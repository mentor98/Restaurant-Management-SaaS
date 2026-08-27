import React, { useState } from 'react';
import { X, Plus, Check, Utensils } from 'lucide-react';
import { MenuItem, MenuItemModifier, SelectedModifier } from '../../types.ts';
import { useApp } from '../../context/AppContext.tsx';

interface ModifierModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (modifiers: SelectedModifier[], instructions: string) => void;
}

export const ModifierModal: React.FC<ModifierModalProps> = ({ item, onClose, onConfirm }) => {
  const { profile } = useApp();
  const [selectedMods, setSelectedMods] = useState<SelectedModifier[]>([]);
  const [instructions, setInstructions] = useState<string>('');

  if (!item) return null;

  const currencySymbol = profile?.currencySymbol || '$';

  const handleOptionToggle = (modifier: MenuItemModifier, optionId: string, optionName: string, priceDelta: number) => {
    const isSingleChoice = modifier.maxSelection === 1;
    const existingIndex = selectedMods.findIndex((m) => m.modifierId === modifier.id && m.optionId === optionId);

    if (existingIndex !== -1) {
      // Deselect
      setSelectedMods((prev) => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      if (isSingleChoice) {
        // Replace existing option from same modifier
        setSelectedMods((prev) => [
          ...prev.filter((m) => m.modifierId !== modifier.id),
          { modifierId: modifier.id, modifierName: modifier.name, optionId, optionName, priceDelta },
        ]);
      } else {
        // Multi-choice: Check max selection
        const currentCount = selectedMods.filter((m) => m.modifierId === modifier.id).length;
        if (currentCount < modifier.maxSelection) {
          setSelectedMods((prev) => [
            ...prev,
            { modifierId: modifier.id, modifierName: modifier.name, optionId, optionName, priceDelta },
          ]);
        }
      }
    }
  };

  const isOptionSelected = (modifierId: string, optionId: string) => {
    return selectedMods.some((m) => m.modifierId === modifierId && m.optionId === optionId);
  };

  // Check required modifiers
  const missingRequired = (item.modifiers || []).filter((mod) => {
    if (!mod.required) return false;
    return !selectedMods.some((m) => m.modifierId === mod.id);
  });

  const canSubmit = missingRequired.length === 0;

  const currentTotal = item.price + selectedMods.reduce((sum, m) => sum + m.priceDelta, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        id="modifier-modal"
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{item.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Base Price: {currencySymbol}{item.price.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modifiers List */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {item.modifiers && item.modifiers.length > 0 ? (
            item.modifiers.map((modifier) => (
              <div key={modifier.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>{modifier.name}</span>
                    {modifier.required && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 font-medium uppercase">
                        Required
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {modifier.maxSelection === 1 ? 'Choose 1' : `Max ${modifier.maxSelection}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modifier.options.map((opt) => {
                    const selected = isOptionSelected(modifier.id, opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionToggle(modifier, opt.id, opt.name, opt.priceDelta)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selected
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:text-amber-400 shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selected ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-400'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-xs font-medium">{opt.name}</span>
                        </div>
                        {opt.priceDelta > 0 && (
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            +{currencySymbol}{opt.priceDelta.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs text-zinc-400">No preset modifiers for this dish.</div>
          )}

          {/* Kitchen Special Instructions */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Kitchen Special Notes / Allergies
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Extra crispy, dressing on side, allergy to shellfish..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Item Total</div>
            <div className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
              {currencySymbol}{currentTotal.toFixed(2)}
            </div>
          </div>
          <button
            disabled={!canSubmit}
            onClick={() => onConfirm(selectedMods, instructions)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
              canSubmit
                ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-amber-500/20 active:scale-95'
                : 'bg-zinc-300 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Customized Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
