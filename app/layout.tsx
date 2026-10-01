import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import EnvNoticeBanner from '@/components/ui/EnvNoticeBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Activate My Life — 30-Day Personal Activation Challenge',
  description:
    'Transform intention into disciplined action with the 30-Day Personal Activation Challenge. Action over Intention. Discipline over Mood. Movement over Procrastination.',
  keywords: [
    'personal activation',
    '30 day challenge',
    'discipline',
    'mindset',
    'action',
    'growth',
    'personal development',
  ],
  authors: [{ name: 'Activate My Life Team' }],
  openGraph: {
    title: 'Activate My Life — 30-Day Personal Activation Challenge',
    description:
      'Action over Intention. Discipline over Mood. Movement over Procrastination.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark h-full antialiased`}>
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans flex flex-col selection:bg-orange-500 selection:text-white">
        <EnvNoticeBanner />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
