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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              Salon introuvable
            </h2>
            <p className="text-secondary-600 mb-6">
              Ce salon n&apos;existe pas ou a été supprimé
            </p>
            <Link href="/dashboard">
              <Button>Retour au dashboard</Button>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href={`/dashboard/${salon.slug}`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-6 transition-colors group print:hidden"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour au salon</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <QrCodeIcon className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            QR Code - {salon.name}
          </h1>
          <p className="text-secondary-600">
            Partagez ce QR code pour permettre à vos clients de rejoindre la file d&apos;attente
          </p>
        </div>

        {/* QR Code Card */}
        <Card className="text-center mb-8">
          <div className="bg-white p-8 rounded-xl inline-block">
            <canvas ref={canvasRef} className="mx-auto" />
          </div>

          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-2">Lien public</p>
            <p className="text-lg font-mono text-primary-500 break-all">
              {publicUrl}
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          <Button
            variant="outline"
            onClick={handleDownload}
            icon={<Download className="w-5 h-5" />}
            disabled={!qrCodeUrl}
          >
            Télécharger
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            icon={<Printer className="w-5 h-5" />}
          >
            Imprimer
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            icon={<Share2 className="w-5 h-5" />}
          >
            Partager
          </Button>
        </div>

        {/* Instructions */}
        <Card className="mt-8 print:hidden">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">
            Comment utiliser ce QR code ?
          </h2>
          <div className="space-y-4 text-secondary-600">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-500 font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-secondary-900 mb-1">
                  Imprimez ou affichez le QR code
                </p>
                <p className="text-sm">
                  Placez-le à l&apos;entrée de votre salon ou sur votre comptoir
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-500 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-secondary-900 mb-1">
                  Les clients scannent le code
                </p>
                <p className="text-sm">
                  Ils accèdent directement à la page publique de votre salon
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-500 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-secondary-900 mb-1">
                  Ils rejoignent la file d&apos;attente
                </p>
                <p className="text-sm">
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
