'use client';

import React from 'react';
import { UtensilsCrossed, Globe, AlertOctagon, Check, Leaf, Egg, Fish, Sparkles } from 'lucide-react';
import { AllergyRestriction, CuisinePreference, DietPreference } from '@/types/health';

interface Step4Props {
  formData: {
    diet_preference: DietPreference;
    cuisine_preference: CuisinePreference;
    dietary_restrictions: AllergyRestriction[];
  };
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function Step4Diet({ formData, updateField, errors }: Step4Props) {
  const dietTypes: { id: DietPreference; label: string; icon: any; desc: string }[] = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      icon: Leaf,
      desc: 'Plant-based foods, pulses, dairy & paneer (No meat, fish or eggs).',
    },
    {
      id: 'non_vegetarian',
      label: 'Non-Vegetarian',
      icon: Fish,
      desc: 'Includes poultry, fish, eggs, dairy, and all whole plant foods.',
    },
    {
      id: 'vegan',
      label: 'Vegan',
      icon: Sparkles,
      desc: '100% plant-based: pulses, grains, tofu, soy/almond milk (Zero animal/dairy).',
    },
    {
      id: 'eggetarian',
      label: 'Eggetarian',
      icon: Egg,
      desc: 'Vegetarian diet plus whole eggs and egg whites (No meat or seafood).',
    },
  ];

  const cuisines: { id: CuisinePreference; label: string; flag: string }[] = [
    { id: 'south_indian', label: 'South Indian', flag: '🥥' },
    { id: 'north_indian', label: 'North Indian', flag: '🫓' },
    { id: 'indian', label: 'All Indian Regional', flag: '🥘' },
    { id: 'international', label: 'Continental / Global', flag: '🥗' },
    { id: 'mixed', label: 'Mixed / Fusion', flag: '✨' },
  ];

  const allergens: { id: AllergyRestriction; label: string }[] = [
    { id: 'dairy', label: 'Dairy / Lactose' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'nuts', label: 'Tree Nuts & Peanuts' },
    { id: 'gluten', label: 'Gluten / Wheat' },
    { id: 'seafood', label: 'Fish & Shellfish' },
    { id: 'soy', label: 'Soy / Tofu' },
  ];

  const toggleAllergen = (allergenId: AllergyRestriction) => {
    const current = formData.dietary_restrictions || [];
    if (current.includes(allergenId)) {
      updateField(
        'dietary_restrictions',
        current.filter((a) => a !== allergenId)
      );
    } else {
      updateField('dietary_restrictions', [...current, allergenId]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-emerald-400" />
          Step 4: Nutrition & Dietary Preferences
        </h2>
        <p className="text-sm text-slate-400">
          Tailor recipes and meal plans according to your lifestyle and food sensitivities.
        </p>
      </div>

      {/* Diet Type */}
      <div className="space-y-2.5">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
          Diet Pattern <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dietTypes.map((d) => {
            const Icon = d.icon;
            const isSelected = formData.diet_preference === d.id;
            return (
              <button
                type="button"
                key={d.id}
                onClick={() => updateField('diet_preference', d.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`p-2 rounded-xl mt-0.5 ${
                    isSelected ? 'bg-emerald-400 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white">{d.label}</div>
                  <p className="text-xs text-slate-400 leading-snug">{d.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.diet_preference && <p className="text-xs text-rose-400">{errors.diet_preference}</p>}
      </div>

      {/* Cuisine Preference */}
      <div className="space-y-2.5">
        <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-cyan-400" />
          Preferred Cuisine Flavor Profile <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {cuisines.map((c) => {
            const isSelected = formData.cuisine_preference === c.id;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => updateField('cuisine_preference', c.id)}
                className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-sm'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
        {errors.cuisine_preference && (
          <p className="text-xs text-rose-400">{errors.cuisine_preference}</p>
        )}
      </div>

      {/* Allergies / Restrictions (Multi-select) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertOctagon className="h-4 w-4 text-amber-400" />
            Allergies & Exclusions <span className="text-xs text-slate-500 font-normal">(Select all that apply)</span>
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {allergens.map((a) => {
            const isChecked = (formData.dietary_restrictions || []).includes(a.id);
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => toggleAllergen(a.id)}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                  isChecked
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <span>{a.label}</span>
                <div
                  className={`h-4 w-4 rounded flex items-center justify-center border ${
                    isChecked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-600'
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
