import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { HealthFitAIChat } from '@/components/ai/HealthFitAIChat';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

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
    <html lang="en" className={`light scroll-smooth ${inter.variable}`}>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white flex flex-col justify-between pb-24 lg:pb-0 relative`}>
        {/* Modern Ambient Health & Fitness Background Image & Lighting */}
        <div 
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        >
          {/* Subtle high-resolution wellness wave texture */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06] mix-blend-multiply"
            style={{ backgroundImage: "url('/images/health-bg.jpg')" }}
          />
          {/* Ambient soft glow orbs */}
          <div className="absolute top-[-10%] left-[15%] w-[45vw] max-w-[650px] h-[45vw] max-h-[650px] rounded-full bg-emerald-400/10 blur-[130px]" />
          <div className="absolute top-[40%] right-[5%] w-[40vw] max-w-[600px] h-[40vw] max-h-[600px] rounded-full bg-teal-300/15 blur-[140px]" />
          <div className="absolute bottom-[5%] left-[25%] w-[35vw] max-w-[500px] h-[35vw] max-h-[500px] rounded-full bg-cyan-300/10 blur-[140px]" />
        </div>

        <div className="flex min-h-screen w-full relative z-0">
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
