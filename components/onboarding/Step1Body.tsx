'use client';

import React from 'react';
import { User, Scale, Ruler, Calendar, Heart } from 'lucide-react';
import { calculateBMI } from '@/lib/nutrition/calculations';
import { Sex } from '@/types/health';
import { FullOnboardingInput } from '@/lib/validation';

interface Step1Props {
  formData: {
    weight_kg: number;
    height_cm: number;
    age: number;
    sex: Sex;
  };
  updateField: <K extends keyof FullOnboardingInput>(field: K, value: FullOnboardingInput[K]) => void;
  errors?: Record<string, string>;
}

export function Step1Body({ formData, updateField, errors = {} }: Step1Props) {
  const bmiInfo =
    formData.weight_kg > 0 && formData.height_cm > 0
      ? calculateBMI(formData.weight_kg, formData.height_cm)
      : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <User className="h-6 w-6 text-emerald-600 shrink-0" />
          <span>Step 1: Body Information</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          We use your physical measurements to compute precise Basal Metabolic Rate (BMR) and caloric requirements.
        </p>
      </div>

      {/* Sex Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Biological Sex <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {([
            { id: 'male', label: '👨 Male' },
            { id: 'female', label: '👩 Female' },
            { id: 'other', label: '✨ Other' },
          ] as const).map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => updateField('sex', option.id)}
              className={`py-3 px-4 min-h-[48px] rounded-2xl border font-bold text-sm transition-all cursor-pointer touch-manipulation flex items-center justify-center ${
                formData.sex === option.id
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.sex && <p className="text-xs font-bold text-rose-600">{errors.sex}</p>}
      </div>

      {/* Numerical Inputs: Weight, Height, Age */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weight */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-emerald-600" />
            <span>Weight (kg)</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              value={formData.weight_kg || ''}
              onChange={(e) => updateField('weight_kg', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 70"
              className={`w-full px-4 py-3 min-h-[48px] rounded-2xl bg-white border text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm ${
                errors.weight_kg ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-300'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">
              kg
            </span>
          </div>
          {errors.weight_kg ? (
            <p className="text-xs font-bold text-rose-600">{errors.weight_kg}</p>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Allowed: 20 – 300 kg</span>
          )}
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-teal-600" />
            <span>Height (cm)</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.5"
              min="100"
              max="250"
              value={formData.height_cm || ''}
              onChange={(e) => updateField('height_cm', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 175"
              className={`w-full px-4 py-3 min-h-[48px] rounded-2xl bg-white border text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm ${
                errors.height_cm ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-300'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">
              cm
            </span>
          </div>
          {errors.height_cm ? (
            <p className="text-xs font-bold text-rose-600">{errors.height_cm}</p>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Allowed: 100 – 250 cm</span>
          )}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span>Age (years)</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="13"
              max="100"
              value={formData.age || ''}
              onChange={(e) => updateField('age', parseInt(e.target.value, 10) || 0)}
              placeholder="e.g. 25"
              className={`w-full px-4 py-3 min-h-[48px] rounded-2xl bg-white border text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm ${
                errors.age ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-300'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">
              yrs
            </span>
          </div>
          {errors.age ? (
            <p className="text-xs font-bold text-rose-600">{errors.age}</p>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Allowed: 13 – 100 yrs</span>
          )}
        </div>
      </div>

      {/* Live BMI Preview Badge */}
      {bmiInfo && (
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Calculated Body Mass Index (BMI)</div>
              <div className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{bmiInfo.bmi}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${bmiInfo.color} border-current bg-white shadow-2xs`}>
                  {bmiInfo.category}
                </span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
            Healthy weight range: <span className="font-bold text-emerald-700">{bmiInfo.healthyWeightRange.min} – {bmiInfo.healthyWeightRange.max} kg</span>
          </div>
        </div>
      )}
    </div>
  );
}

