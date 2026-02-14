'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSalon } from '@/hooks/useSalon';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { ArrowLeft, Download, Printer, Share2, QrCode as QrCodeIcon } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

export default function QRCodePage() {
  return (
    <ProtectedRoute>
      <QRCodeContent />
    </ProtectedRoute>
  );
}

function QRCodeContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const { salon, loading: salonLoading } = useSalon(slug);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Vérifier que le coiffeur est bien le propriétaire
  useEffect(() => {
    if (!salonLoading && salon && salon.ownerId !== user?.uid) {
      toast.error('Accès non autorisé');
      router.push('/dashboard');
    }
  }, [salon, salonLoading, user, router]);

  // Générer le QR code
  useEffect(() => {
    if (salon && canvasRef.current) {
      const publicUrl = `${window.location.origin}/${salon.slug}`;
      
      QRCode.toCanvas(
        canvasRef.current,
        publicUrl,
        {
          width: 400,
          margin: 2,
          color: {
            dark: '#1a1a1a',
            light: '#ffffff',
          },
        },
        (error: Error | null | undefined) => {
          if (error) {
            console.error('Erreur lors de la génération du QR code:', error);
            toast.error('Erreur lors de la génération du QR code');
          }
        }
      );

      // Générer aussi l'URL pour le téléchargement
      QRCode.toDataURL(
        publicUrl,
        {
          width: 800,
          margin: 2,
        },
        (error: Error | null | undefined, url: string) => {
          if (error) {
            console.error('Erreur lors de la génération du QR code:', error);
          } else {
            setQrCodeUrl(url);
          }
        }
      );
    }
  }, [salon]);

  const handleDownload = () => {
    if (!qrCodeUrl || !salon) return;

    const link = document.createElement('a');
    link.download = `qr-code-${salon.slug}.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR code téléchargé');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Impression lancée');
  };

  const handleShare = async () => {
    if (!salon) return;

    const publicUrl = `${window.location.origin}/${salon.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${salon.name} - File d'attente`,
          text: `Rejoignez la file d'attente de ${salon.name}`,
          url: publicUrl,
        });
        toast.success('Partagé avec succès');
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Erreur lors du partage:', error);
          toast.error('Erreur lors du partage');
        }
      }
    } else {
      // Fallback: copier l'URL
      try {
        await navigator.clipboard.writeText(publicUrl);
        toast.success('Lien copié dans le presse-papier');
      } catch (error: unknown) {
        console.error('Erreur lors de la copie:', error);
        toast.error('Erreur lors de la copie');
      }
    }
  };

  if (salonLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <DashboardHeader />
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
            <p className="text-secondary-600 text-sm sm:text-base">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-16">
          <Card className="text-center p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
              Salon introuvable
            </h2>
            <p className="text-secondary-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Ce salon n&apos;existe pas ou a été supprimé
            </p>
            <Link href="/dashboard">
              <Button size="sm" className="sm:text-base">Retour au dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${salon.slug}`;

  return (
    <div className="min-h-screen bg-secondary-50">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Back button - Mobile optimized */}
        <Link
          href={`/dashboard/${salon.slug}`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-6 transition-colors group print:hidden text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour au salon</span>
          <span className="sm:hidden">Retour</span>
        </Link>

        {/* Header - Mobile optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <QrCodeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
            QR Code - {salon.name}
          </h1>
          <p className="text-xs sm:text-base text-secondary-600 px-2">
            Partagez ce QR code pour permettre à vos clients de rejoindre la file d&apos;attente
          </p>
        </div>

        {/* QR Code Card - Mobile optimized */}
        <Card className="text-center mb-6 sm:mb-8 p-3 sm:p-4">
          <div className="bg-white p-4 sm:p-8 rounded-xl inline-block">
            <canvas ref={canvasRef} className="mx-auto max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] w-full h-auto" />
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-secondary-50 rounded-lg">
            <p className="text-xs sm:text-sm text-secondary-600 mb-1 sm:mb-2">Lien public</p>
            <p className="text-sm sm:text-lg font-mono text-primary-500 break-all">
              {publicUrl}
            </p>
          </div>
        </Card>

        {/* Actions - Mobile optimized */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 print:hidden">
          <Button
            variant="outline"
            onClick={handleDownload}
            icon={<Download className="w-4 h-4 sm:w-5 sm:h-5" />}
            disabled={!qrCodeUrl}
            className="text-xs sm:text-sm py-2 sm:py-3"
          >
            <span className="hidden sm:inline">Télécharger</span>
            <span className="sm:hidden">DL</span>
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="text-xs sm:text-sm py-2 sm:py-3"
          >
            <span className="hidden sm:inline">Imprimer</span>
            <span className="sm:hidden">Print</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            icon={<Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="text-xs sm:text-sm py-2 sm:py-3"
          >
            <span className="hidden sm:inline">Partager</span>
            <span className="sm:hidden">Share</span>
          </Button>
        </div>

        {/* Instructions - Mobile optimized */}
        <Card className="mt-6 sm:mt-8 print:hidden p-3 sm:p-4">
          <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4">
            Comment utiliser ce QR code ?
          </h2>
          <div className="space-y-3 sm:space-y-4 text-secondary-600">
            <div className="flex gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-500 font-bold text-xs sm:text-base">
                1
              </div>
              <div>
                <p className="font-semibold text-secondary-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                  Imprimez ou affichez le QR code
                </p>
                <p className="text-xs sm:text-sm">
                  Placez-le à l&apos;entrée de votre salon ou sur votre comptoir
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-500 font-bold text-xs sm:text-base">
                2
              </div>
              <div>
                <p className="font-semibold text-secondary-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                  Les clients scannent le code
                </p>
                <p className="text-xs sm:text-sm">
                  Ils accèdent directement à la page publique de votre salon
                </p>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-500 font-bold text-xs sm:text-base">
                3
              </div>
              <div>
                <p className="font-semibold text-secondary-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                  Ils rejoignent la file d&apos;attente
                </p>
                <p className="text-xs sm:text-sm">
                  En quelques clics, sans installation d&apos;application
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}