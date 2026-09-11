'use client';

import React, { useEffect, useState } from 'react';

export const BACKGROUND_PRESETS = [
  {
    id: 'studio',
    name: 'Wellness & Fitness Studio',
    description: 'Modern gym & yoga atmosphere with warm ambient emerald lighting',
    url: '/images/site-bg.jpg',
  },
  {
    id: 'wave',
    name: 'Biometric Wellness Wave',
    description: 'Luxury 3D emerald glass curves & flowing vital sparks',
    url: '/images/wellness-wave.jpg',
  },
  {
    id: 'fitness',
    name: 'Dynamic Athletic Energy',
    description: 'High performance active lifestyle backdrop',
    url: '/images/fitness-bg.jpg',
  },
  {
    id: 'ambient',
    name: 'Clean Ambient Gradient',
    description: 'Minimalist organic emerald & teal mesh gradient',
    url: '/images/ambient-mesh.jpg',
  },
];

export function SiteBackground() {
  const [bgImage, setBgImage] = useState<string>('/images/site-bg.jpg');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('healthfit_background_image');
    if (saved) {
      setBgImage(saved);
    }

    // Listen for custom change events from Settings or UI controls
    const handleBgChange = (event: CustomEvent<{ url: string }>) => {
      if (event.detail?.url) {
        setBgImage(event.detail.url);
      }
    };

    window.addEventListener('healthfit:change-bg' as any, handleBgChange as any);
    return () => {
      window.removeEventListener('healthfit:change-bg' as any, handleBgChange as any);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Primary Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out transform scale-100 will-change-transform"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Atmospheric Frosted Glass Overlay with subtle gradient for optimal text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-slate-50/60 to-slate-50/80 backdrop-blur-[1.5px]" />

      {/* Subtle vignette border depth */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-900/10" />

      {/* Dynamic Ambient Glowing Color Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[50vw] max-w-[700px] h-[50vw] max-h-[700px] rounded-full bg-emerald-500/12 blur-[140px] mix-blend-screen" />
      <div className="absolute top-[35%] right-[5%] w-[45vw] max-w-[650px] h-[45vw] max-h-[650px] rounded-full bg-teal-400/14 blur-[150px] mix-blend-screen" />
      <div className="absolute bottom-[0%] left-[20%] w-[40vw] max-w-[550px] h-[40vw] max-h-[550px] rounded-full bg-cyan-400/10 blur-[130px] mix-blend-screen" />
    </div>
  );
}
