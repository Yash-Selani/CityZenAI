import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CityZenAI — Report Civic Issues with AI',
  description:
    'Snap a photo of any civic issue. Our AI analyzes it, identifies the responsible authority, and drafts a formal complaint — all in seconds.',
  keywords: ['civic', 'complaint', 'AI', 'municipal', 'pothole', 'city', 'report', 'India'],
  authors: [{ name: 'CityZenAI Team' }],
  openGraph: {
    title: 'CityZenAI — Report Civic Issues with AI',
    description: 'Snap. Analyze. Report. Fix your city with AI-powered civic reporting.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#07070E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ paddingTop: '64px', paddingBottom: '72px' }}>
        <div className="gradient-mesh" aria-hidden="true" />
        <Header />
        <main style={{ minHeight: 'calc(100vh - 136px)' }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
