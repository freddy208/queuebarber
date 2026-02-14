/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Button from './Button';
import { Download, X } from 'lucide-react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slideUp">
      <div className="bg-white rounded-xl shadow-strong border-2 border-primary-200 p-4">
        <button
          onClick={() => setShowInstallPrompt(false)}
          className="absolute top-2 right-2 p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-bold text-secondary-900 mb-1">
              Installer QueueBarber
            </h3>
            <p className="text-sm text-secondary-600 mb-3">
              Installez l&apos;app pour un accès rapide depuis votre écran d&apos;accueil
            </p>
            <Button size="sm" onClick={handleInstallClick} className="w-full">
              Installer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}