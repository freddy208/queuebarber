/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSalon } from '@/hooks/useSalon';
import { useQueue } from '@/hooks/useQueue';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Logo from '@/components/Logo';
import { 
  Clock, 
  Users, 
  MapPin, 
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Store,
  MessageCircle
} from 'lucide-react';
import { formatWaitTime } from '@/lib/utils';
import Link from 'next/link';

export default function PublicSalonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { salon, loading: salonLoading } = useSalon(slug);
  const { clients, stats, loading: queueLoading } = useQueue(salon?.id || '');

  if (salonLoading || queueLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-secondary-600 text-sm sm:text-base">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-3 sm:p-4">
        <Card className="max-w-md w-full text-center p-6 sm:p-8">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-error mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
            Salon introuvable
          </h2>
          <p className="text-secondary-600 text-sm sm:text-base">
            Ce salon n&apos;existe pas ou a été supprimé
          </p>
        </Card>
      </div>
    );
  }

  const waitingClients = clients.filter(c => c.status === 'waiting');

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Header - Mobile optimized */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Salon header - Mobile optimized */}
        <div className="text-center mb-4 sm:mb-8 animate-fadeIn">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-medium">
            <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-1 sm:mb-2">
            {salon.name}
          </h1>
          <p className="text-secondary-600 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-lg">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            {salon.city}
          </p>
        </div>

        {/* Status banner - Mobile optimized */}
        <div className={`
          mb-4 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-soft animate-slideUp
          ${salon.isOpen 
            ? 'bg-gradient-to-r from-success/10 to-green-100 border-2 border-success/30' 
            : 'bg-gradient-to-r from-error/10 to-red-100 border-2 border-error/30'
          }
        `}>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${salon.isOpen ? 'bg-success animate-pulse' : 'bg-error'}`}></div>
            <p className={`text-lg sm:text-2xl font-bold ${salon.isOpen ? 'text-success' : 'text-error'}`}>
              {salon.isOpen ? 'Salon ouvert' : 'Salon fermé'}
            </p>
          </div>
          {!salon.isOpen && (
            <p className="text-secondary-600 text-xs sm:text-base">
              Revenez plus tard ou contactez le salon
            </p>
          )}
        </div>

        {/* Stats cards - Mobile: 2 cols, always side by side */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {/* Waiting count */}
          <Card gradient className="text-center p-3 sm:p-4">
            <Users className="w-8 h-8 sm:w-12 sm:h-12 text-primary-500 mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1">En attente</p>
            <p className="text-3xl sm:text-5xl font-bold text-secondary-900 mb-1 sm:mb-2">
              {stats.totalWaiting}
            </p>
            {stats.totalWaiting === 0 && (
              <p className="text-xs sm:text-sm text-success font-semibold">
                ✨ Aucune attente !
              </p>
            )}
          </Card>

          {/* Wait time */}
          <Card gradient className="text-center p-3 sm:p-4">
            <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-primary-500 mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1">Temps estimé</p>
            <p className="text-3xl sm:text-5xl font-bold text-secondary-900 mb-1 sm:mb-2">
              {stats.totalWaiting === 0 ? '0' : formatWaitTime(stats.estimatedWaitTime)}
            </p>
            {stats.totalWaiting > 0 && (
              <p className="text-xs sm:text-sm text-secondary-600">
                {stats.totalWaiting} pers. avant vous
              </p>
            )}
          </Card>
        </div>

        {/* CTA - Mobile optimized */}
        {salon.isOpen && (
          <div className="mb-4 sm:mb-8 animate-fadeIn">
            <Button
              onClick={() => router.push(`/${slug}/join`)}
              size="lg"
              className="w-full text-base sm:text-xl py-4 sm:py-6"
              icon={<ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />}
            >
              Rejoindre la file
            </Button>
          </div>
        )}

        {/* Services - Mobile optimized */}
        <Card className="mb-4 sm:mb-8 p-3 sm:p-4">
          <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
            Nos services
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {salon.services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 sm:p-4 bg-secondary-50 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">✂️</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-secondary-900 text-sm sm:text-base truncate">
                      {service.name}
                    </p>
                    <p className="text-xs sm:text-sm text-secondary-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration} min
                    </p>
                  </div>
                </div>
                {service.price && (
                  <p className="text-sm sm:text-lg font-bold text-primary-500 flex-shrink-0 ml-2">
                    {service.price.toLocaleString()} FCFA
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Contact info - Mobile optimized */}
        <Card className="p-3 sm:p-4">
          <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4">
            Contact
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <a
              href={`tel:${salon.phone}`}
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 bg-secondary-50 rounded-lg hover:bg-primary-50 transition-colors group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors flex-shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-secondary-600">Téléphone</p>
                <p className="font-semibold text-secondary-900 text-sm sm:text-base">{salon.phone}</p>
              </div>
            </a>

            {salon.whatsappSupport && (
              <a
                href={`https://wa.me/237${salon.whatsappSupport.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success/20 rounded-lg flex items-center justify-center group-hover:bg-success transition-colors flex-shrink-0">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-secondary-600">WhatsApp Support</p>
                  <p className="font-semibold text-secondary-900 text-sm sm:text-base">{salon.whatsappSupport}</p>
                </div>
              </a>
            )}

            {salon.address && (
              <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-4 bg-secondary-50 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-secondary-600">Adresse</p>
                  <p className="font-semibold text-secondary-900 text-sm sm:text-base">{salon.address}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Queue preview - Mobile optimized */}
        {waitingClients.length > 0 && (
          <Card className="mt-4 sm:mt-8 p-3 sm:p-4">
            <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4">
              File actuelle
            </h2>
            <div className="space-y-1.5 sm:space-y-2">
              {waitingClients.slice(0, 5).map((client, index) => (
                <div
                  key={client.id}
                  className={`
                    flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg
                    ${index === 0 ? 'bg-primary-50 border-2 border-primary-200' : 'bg-secondary-50'}
                  `}
                >
                  <div className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0
                    ${index === 0 ? 'bg-primary-500 text-white' : 'bg-secondary-300 text-secondary-700'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-secondary-900 text-sm sm:text-base truncate">
                      {client.name.split(' ')[0]}
                    </p>
                    <p className="text-xs text-secondary-600 truncate">
                      {client.service} • {client.serviceDuration} min
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="text-xs font-bold text-primary-500 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                      EN COURS
                    </span>
                  )}
                </div>
              ))}
              {waitingClients.length > 5 && (
                <p className="text-center text-xs sm:text-sm text-secondary-500 pt-2">
                  +{waitingClients.length - 5} autres
                </p>
              )}
            </div>
          </Card>
        )}
      </main>

      {/* Footer - Mobile optimized */}
      <footer className="bg-white border-t border-secondary-200 mt-8 sm:mt-16 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
          <Logo size="sm" />
          <p className="text-xs sm:text-sm text-secondary-500 mt-3 sm:mt-4">
            Propulsé par QueueBarber • Gestion de file d&apos;attente intelligente
          </p>
        </div>
      </footer>
    </div>
  );
}