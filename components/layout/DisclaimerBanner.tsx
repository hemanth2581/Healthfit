import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold text-amber-300">Health & Wellness Disclaimer:</strong>{' '}
          HealthFit provides general wellness and nutrition guidance and is not a medical diagnosis or substitute for professional medical advice. Always consult a qualified physician or dietitian for personalized clinical needs.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full my-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-white/10 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            Health & Scientific Planning Disclaimer
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            HealthFit provides general wellness, energy expenditure calculations, and nutrition planning guidance. It is not a medical diagnosis, medical treatment plan, or substitute for professional clinical medical advice. If you have any underlying medical conditions, are pregnant or breastfeeding, take prescription medications affected by diet, or have specific therapeutic nutritional requirements, please consult a qualified healthcare professional before beginning any new diet or exercise regimen.
          </p>
        </div>
      </div>
    </section>
  );
}
