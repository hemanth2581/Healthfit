import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'HealthFit — Personalized Health & Fitness Planner',
  description:
    'Generate personalized daily & weekly nutrition, hydration, sleep, and fitness plans based on scientific metabolic calculations without requiring an account.',
  keywords: [
    'HealthFit',
    'fitness planner',
    'nutrition plan',
    'macro calculator',
    'meal planner',
    'hydration tracker',
    'sleep schedule',
    'TDEE calculator',
    'BMR calculator',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0c121e] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
