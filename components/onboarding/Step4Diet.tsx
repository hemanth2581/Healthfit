"use client";

import React from "react";
import {
  UtensilsCrossed,
  Globe,
  AlertOctagon,
  Check,
  Leaf,
  Egg,
  Fish,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  AllergyRestriction,
  CuisinePreference,
  DietPreference,
} from "@/types/health";
import { FullOnboardingInput } from '@/lib/validation';

interface Step4Props {
  formData: {
    diet_preference: DietPreference;
    cuisine_preference: CuisinePreference;
    dietary_restrictions: AllergyRestriction[];
  };
  updateField: <K extends keyof FullOnboardingInput>(
    field: K,
    value: FullOnboardingInput[K],
  ) => void;
  errors?: Record<string, string>;
}

export function Step4Diet({ formData, updateField, errors = {} }: Step4Props) {
  const dietTypes: {
    id: DietPreference;
    label: string;
    icon: LucideIcon;
    desc: string;
  }[] = [
    {
      id: "vegetarian",
      label: "Vegetarian",
      icon: Leaf,
      desc: "Plant-based foods, pulses, dairy & paneer (No meat, fish or eggs).",
    },
    {
      id: "non_vegetarian",
      label: "Non-Vegetarian",
      icon: Fish,
      desc: "Includes poultry, fish, eggs, dairy, and all whole plant foods.",
    },
    {
      id: "vegan",
      label: "Vegan",
      icon: Sparkles,
      desc: "100% plant-based: pulses, grains, tofu, soy/almond milk (Zero animal/dairy).",
    },
    {
      id: "eggetarian",
      label: "Eggetarian",
      icon: Egg,
      desc: "Vegetarian diet plus whole eggs and egg whites (No meat or seafood).",
    },
  ];

  const cuisines: { id: CuisinePreference; label: string; flag: string }[] = [
    { id: "south_indian", label: "South Indian", flag: "🥥" },
    { id: "north_indian", label: "North Indian", flag: "🫓" },
    { id: "indian", label: "All Indian Regional", flag: "🥘" },
    { id: "international", label: "Continental / Global", flag: "🥗" },
    { id: "mixed", label: "Mixed / Fusion", flag: "✨" },
  ];

  const allergens: { id: AllergyRestriction; label: string }[] = [
    { id: "dairy", label: "Dairy / Lactose" },
    { id: "eggs", label: "Eggs" },
    { id: "nuts", label: "Tree Nuts & Peanuts" },
    { id: "gluten", label: "Gluten / Wheat" },
    { id: "seafood", label: "Fish & Shellfish" },
    { id: "soy", label: "Soy / Tofu" },
  ];

  const toggleAllergen = (allergenId: AllergyRestriction) => {
    const current = formData.dietary_restrictions || [];
    if (current.includes(allergenId)) {
      updateField(
        "dietary_restrictions",
        current.filter((a) => a !== allergenId),
      );
    } else {
      updateField("dietary_restrictions", [...current, allergenId]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-emerald-600 shrink-0" />
          <span>Step 4: Nutrition & Dietary Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Tailor recipes and meal plans according to your lifestyle and food sensitivities.
        </p>
      </div>

      {/* Diet Type */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Diet Pattern <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dietTypes.map((d) => {
            const Icon = d.icon;
            const isSelected = formData.diet_preference === d.id;
            return (
              <button
                type="button"
                key={d.id}
                onClick={() => updateField("diet_preference", d.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer touch-manipulation min-h-[56px] active:scale-[0.99] ${
                  isSelected
                    ? "bg-emerald-50/90 border-emerald-500 text-slate-900 shadow-md shadow-emerald-500/10"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                }`}
              >
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    isSelected
                      ? "bg-emerald-600 text-white font-bold shadow-xs"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900">{d.label}</div>
                  <p className="text-xs text-slate-500 leading-snug font-normal">
                    {d.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.diet_preference && (
          <p className="text-xs font-bold text-rose-600">{errors.diet_preference}</p>
        )}
      </div>

      {/* Cuisine Preference */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-teal-600" />
          <span>Preferred Cuisine Flavor Profile</span>
          <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {cuisines.map((c) => {
            const isSelected = formData.cuisine_preference === c.id;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => updateField("cuisine_preference", c.id)}
                className={`py-3 px-3 min-h-[48px] rounded-2xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/70"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
        {errors.cuisine_preference && (
          <p className="text-xs font-bold text-rose-600">{errors.cuisine_preference}</p>
        )}
      </div>

      {/* Allergies / Restrictions (Multi-select) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <AlertOctagon className="h-4 w-4 text-amber-600" />
            <span>Allergies & Exclusions</span>
            <span className="text-[11px] text-slate-400 font-normal lowercase">
              (select all that apply)
            </span>
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {allergens.map((a) => {
            const isChecked = (formData.dietary_restrictions || []).includes(
              a.id,
            );
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => toggleAllergen(a.id)}
                className={`p-3 min-h-[44px] rounded-2xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer touch-manipulation ${
                  isChecked
                    ? "bg-rose-50 border-rose-300 text-rose-800 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/70"
                }`}
              >
                <span>{a.label}</span>
                <div
                  className={`h-4 w-4 rounded-md flex items-center justify-center border ${
                    isChecked
                      ? "bg-rose-600 border-rose-600 text-white"
                      : "border-slate-300 bg-white"
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

