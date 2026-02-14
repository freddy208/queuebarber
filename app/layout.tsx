import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import PWAInstaller from '@/components/PWAInstaller';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QueueBarber - Gestion de file d'attente pour salons de coiffure",
  description: "Gérez votre file d'attente en temps réel. Plus d'attente inutile, plus de clients satisfaits.",
  keywords: "coiffeur, salon, file d'attente, Cameroun, Douala, réservation",
  authors: [{ name: "QueueBarber" }],
  openGraph: {
    title: "QueueBarber - Gestion de file d'attente",
    description: "Rejoignez la file d'attente à distance",
    type: "website",
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification=6xHpRUXBApT7AVBpEjeZwBQvBfx7t-Z8eG-7JQ_q1Cg', // TON CODE ICI
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#FF6B35" />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
          <PWAInstaller />
        </AuthProvider>
      </body>
    </html>
  );
}