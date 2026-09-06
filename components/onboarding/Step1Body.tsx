'use client';

import React from 'react';
import { User, Scale, Ruler, Calendar, Heart } from 'lucide-react';
import { calculateBMI } from '@/lib/nutrition/calculations';
import { Sex } from '@/types/health';

interface Step1Props {
  formData: {
    weight_kg: number;
    height_cm: number;
    age: number;
    sex: Sex;
  };
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function Step1Body({ formData, updateField, errors }: Step1Props) {
  const bmiInfo =
    formData.weight_kg > 0 && formData.height_cm > 0
      ? calculateBMI(formData.weight_kg, formData.height_cm)
      : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <User className="h-6 w-6 text-emerald-400" />
          Step 1: Body Information
        </h2>
        <p className="text-sm text-slate-400">
          We use your physical measurements to compute precise Basal Metabolic Rate (BMR) and screening metrics.
        </p>
      </div>

      {/* Sex Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300">
          Biological Sex <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'male', label: 'Male' },
            { id: 'female', label: 'Female' },
            { id: 'other', label: 'Other' },
          ].map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => updateField('sex', option.id)}
              className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                formData.sex === option.id
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-800/60'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.sex && <p className="text-xs text-rose-400">{errors.sex}</p>}
      </div>

      {/* Numerical Inputs: Weight, Height, Age */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weight */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-emerald-400" />
            Weight (kg) <span className="text-rose-400">*</span>
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
              className={`w-full px-4 py-3 rounded-xl bg-slate-900/70 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                errors.weight_kg ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-white/10'
              }`}
            />
            <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-medium pointer-events-none">
              kg
            </span>
          </div>
          {errors.weight_kg ? (
            <p className="text-xs text-rose-400">{errors.weight_kg}</p>
          ) : (
            <span className="text-[11px] text-slate-500">Allowed: 20 – 300 kg</span>
          )}
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-cyan-400" />
            Height (cm) <span className="text-rose-400">*</span>
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
              className={`w-full px-4 py-3 rounded-xl bg-slate-900/70 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                errors.height_cm ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-white/10'
              }`}
            />
            <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-medium pointer-events-none">
              cm
            </span>
          </div>
          {errors.height_cm ? (
            <p className="text-xs text-rose-400">{errors.height_cm}</p>
          ) : (
            <span className="text-[11px] text-slate-500">Allowed: 100 – 250 cm</span>
          )}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-indigo-400" />
            Age (years) <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="13"
              max="100"
              value={formData.age || ''}
              onChange={(e) => updateField('age', parseInt(e.target.value, 10) || 0)}
              placeholder="e.g. 25"
              className={`w-full px-4 py-3 rounded-xl bg-slate-900/70 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                errors.age ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-white/10'
              }`}
            />
            <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-medium pointer-events-none">
              yrs
            </span>
          </div>
          {errors.age ? (
            <p className="text-xs text-rose-400">{errors.age}</p>
          ) : (
            <span className="text-[11px] text-slate-500">Allowed: 13 – 100 yrs</span>
          )}
        </div>
      </div>

      {/* Live BMI Preview Badge */}
      {bmiInfo && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-900/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400">Calculated Body Mass Index (BMI)</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>{bmiInfo.bmi}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${bmiInfo.color} border-current bg-current/10`}>
                  {bmiInfo.category}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            Estimated healthy weight range: <span className="font-semibold text-emerald-300">{bmiInfo.healthyWeightRange.min} – {bmiInfo.healthyWeightRange.max} kg</span>
          </div>
        </div>
      )}
    </div>
  );
}
