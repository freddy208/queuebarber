/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSalon } from '@/hooks/useSalon';
import { addClientToQueue } from '@/hooks/useQueue';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Logo from '@/components/Logo';
import { 
  User, 
  ArrowLeft, 
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function JoinQueuePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { salon, loading: salonLoading } = useSalon(slug);

  const [name, setName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (salonLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-3 sm:p-4">
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
        </Card>
      </div>
    );
  }

  if (!salon.isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-3 sm:p-4">
        <Card className="max-w-md w-full text-center p-6 sm:p-8">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-warning mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
            Salon fermé
          </h2>
          <p className="text-secondary-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Le salon est actuellement fermé. Revenez plus tard !
          </p>
          <Link href={`/${slug}`}>
            <Button variant="outline" size="sm" className="sm:text-base">Retour</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }

    if (!selectedServiceId) {
      toast.error('Veuillez choisir un service');
      return;
    }

    const service = salon.services.find(s => s.id === selectedServiceId);
    if (!service) return;

    setLoading(true);

    try {
      await addClientToQueue(salon.id, {
        name: name.trim(),
        service: service.name,
        serviceDuration: service.duration,
      });

      setSuccess(true);
      toast.success('Vous êtes dans la file ! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-3 sm:p-4">
        <Card className="max-w-md w-full text-center animate-fadeIn p-4 sm:p-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-strong">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2 sm:mb-3">
            C&apos;est bon ! 🎉
          </h2>

          <p className="text-base sm:text-lg text-secondary-700 mb-4 sm:mb-6">
            Vous êtes maintenant dans la file d&apos;attente de <strong>{salon.name}</strong>
          </p>

          <div className="p-4 sm:p-6 bg-primary-50 rounded-xl mb-4 sm:mb-6 text-left">
            <p className="text-sm sm:text-base text-secondary-700 mb-3 sm:mb-4 font-semibold">
              📱 Que faire maintenant ?
            </p>
            <ul className="text-xs sm:text-sm text-secondary-700 space-y-1.5 sm:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 flex-shrink-0">✓</span>
                <span>Vous pouvez quitter et revenir plus tard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 flex-shrink-0">✓</span>
                <span>Surveillez la page pour voir votre position</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 flex-shrink-0">✓</span>
                <span>Arrivez quelques minutes avant votre tour</span>
              </li>
            </ul>
          </div>

          <Link href={`/${slug}`}>
            <Button size="lg" className="w-full text-sm sm:text-base">
              Voir la file d&apos;attente
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-secondary-200">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Link
          href={`/${slug}`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-8 transition-colors group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour</span>
        </Link>

        <Card className="animate-fadeIn p-3 sm:p-4">
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
              Rejoindre la file
            </h1>
            <p className="text-sm sm:text-base text-secondary-600">
              {salon.name} • {salon.city}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="Votre nom *"
              placeholder="Ex: Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4 sm:w-5 sm:h-5" />}
              disabled={loading}
              autoFocus
            />

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-2 sm:mb-3">
                Choisissez votre service *
              </label>
              <div className="space-y-2 sm:space-y-3">
                {salon.services.map((service) => (
                  <label
                    key={service.id}
                    className={`
                      block p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${selectedServiceId === service.id
                        ? 'border-primary-500 bg-primary-50 shadow-medium'
                        : 'border-secondary-200 hover:border-primary-300 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={selectedServiceId === service.id}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 focus:ring-primary-500 flex-shrink-0"
                        disabled={loading}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-secondary-900 text-sm sm:text-lg">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
                          <p className="text-xs sm:text-sm text-secondary-600 flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            {service.duration} min
                          </p>
                          {service.price && (
                            <>
                              <span className="text-secondary-400 hidden sm:inline">•</span>
                              <p className="text-xs sm:text-sm font-semibold text-primary-500">
                                {service.price.toLocaleString()} FCFA
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-primary-50 rounded-lg border-2 border-primary-100">
              <p className="text-xs sm:text-sm text-secondary-700">
                💡 <strong>Astuce :</strong> Une fois dans la file, vous pouvez quitter et revenir. 
                Surveillez simplement votre position sur cette page.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-sm sm:text-base"
              loading={loading}
            >
              Rejoindre la file d&apos;attente
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}