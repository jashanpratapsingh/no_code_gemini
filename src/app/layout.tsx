// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
// Removed LocalFont import as Geist fonts are being removed
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans', // Inter will use --font-sans
});

// Removed geistSans and geistMono definitions as the font files are missing

export const metadata: Metadata = {
  title: 'PromptCoder',
  description: 'Generate code from prompts with AI',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
