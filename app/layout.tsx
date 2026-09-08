import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { HealthFitAIChat } from '@/components/ai/HealthFitAIChat';

export const metadata: Metadata = {
  title: 'HealthFit — Personal Health, Diet, Workout & AI Coach Platform',
  description:
    'Your unified personal health assistant. Personalized nutrition, workouts, hydration, sleep tracking, and real-time AI coaching with Supabase persistence.',
  keywords: [
    'HealthFit',
    'AI Health Coach',
    'personalized nutrition',
    'fitness planner',
    'hydration tracker',
    'sleep cycle',
    'daily adherence',
    'wellness streak',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between pb-24 lg:pb-0">
        <div className="flex min-h-screen w-full">
          {/* Desktop Navigation Sidebar */}
          <Sidebar />

          {/* Main Application Area */}
          <div className="flex-1 flex flex-col min-w-0 w-full">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
              {children}
            </main>
            <Footer />
          </div>
        </div>

        {/* Floating AI Assistant Widget */}
        <HealthFitAIChat />

        {/* Mobile Bottom Navigation Bar & Drawer */}
        <MobileNav />
      </body>
    </html>
  );
}
