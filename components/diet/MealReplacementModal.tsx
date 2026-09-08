'use client';

import React from 'react';
import { X, RefreshCw, Check, Utensils } from 'lucide-react';
import { MealAlternative, getMealAlternatives } from '@/lib/nutrition/dietGenerator';
import { DietType } from '@/types/user';

interface MealReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'dinner';
  currentMealTitle: string;
  dietType?: DietType;
  allergies?: string[];
  onSelectAlternative: (alternative: MealAlternative) => void;
}

export function MealReplacementModal({
  isOpen,
  onClose,
  mealType,
  currentMealTitle,
  dietType = 'vegetarian',
  allergies = [],
  onSelectAlternative,
}: MealReplacementModalProps) {
  if (!isOpen) return null;

  const alternatives = getMealAlternatives(mealType, currentMealTitle, dietType, allergies);

  const formatMealTypeName = (type: string) => {
    return type
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Replace {formatMealTypeName(mealType)}
              </h3>
              <p className="text-xs text-slate-500">
                Compatible alternatives based on your diet &amp; targets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current meal reference */}
        <div className="px-6 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <span className="font-semibold">Current:</span>
          <span className="truncate">{currentMealTitle}</span>
        </div>

        {/* Alternatives List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {alternatives.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Utensils className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No direct alternatives found for this filter combination.</p>
              <p className="text-xs">Try adjusting dietary restrictions in Settings.</p>
            </div>
          ) : (
            alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all bg-white group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {alt.title}
                    </h4>
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                      {alt.calories} kcal
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                    {alt.description}
                  </p>

                  {/* Macros breakdown */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl mb-3">
                    <span>
                      <strong className="text-slate-900">Protein:</strong> {alt.protein}g
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900">Carbs:</strong> {alt.carbs}g
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900">Fat:</strong> {alt.fat}g
                    </span>
                  </div>

                  {/* Food items preview */}
                  <div className="text-[11px] text-slate-500 space-y-0.5 mb-3">
                    {alt.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>• {item.name}</span>
                        <span className="font-medium text-slate-600">
                          {item.qty} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectAlternative(alt);
                    onClose();
                  }}
                  className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Select This Meal</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
