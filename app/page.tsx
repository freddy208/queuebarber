'use client';

import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Clock, Users, Smartphone, TrendingUp, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Header - Ultra mobile optimized */}
      <header className="border-b border-secondary-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <div className="flex items-center gap-2">
              {user ? (
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  size="sm" 
                  className="px-3 py-2 text-xs sm:text-sm"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-3 py-2 text-xs sm:text-sm"
                    >
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      size="sm" 
                      className="px-3 py-2 text-xs sm:text-sm whitespace-nowrap"
                    >
                      Inscription
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile first */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className="space-y-6 animate-fadeIn">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                <Zap className="w-3 h-3" />
                <span>Solution digitale</span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-900 leading-tight">
                Fini les files d&apos;attente{' '}
                <span className="block sm:inline bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  interminables
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-base sm:text-lg text-secondary-600 leading-relaxed">
                Gérez votre salon intelligemment. Vos clients rejoignent la file à distance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/register" className="w-full">
                  <Button 
                    size="lg" 
                    icon={<ArrowRight className="w-4 h-4" />} 
                    className="w-full justify-center"
                  >
                    Démarrer gratuitement
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full"
                >
                  Voir la démo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-secondary-200">
                <div>
                  <div className="text-2xl font-bold text-primary-500">2min</div>
                  <div className="text-xs text-secondary-600">Installation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-500">+40%</div>
                  <div className="text-xs text-secondary-600">Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-500">24/7</div>
                  <div className="text-xs text-secondary-600">Support</div>
                </div>
              </div>
            </div>

            {/* Right - Mock app preview */}
            <div className="relative animate-slideUp">
              <Card className="max-w-sm mx-auto" gradient>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-secondary-900">Salon Freddy</h3>
                    <span className="inline-flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full text-xs font-semibold">
                      <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                      Ouvert
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/80 backdrop-blur p-3 rounded-xl">
                      <Users className="w-6 h-6 text-primary-500 mb-1" />
                      <div className="text-xl font-bold text-secondary-900">3</div>
                      <div className="text-xs text-secondary-600">En attente</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur p-3 rounded-xl">
                      <Clock className="w-6 h-6 text-primary-500 mb-1" />
                      <div className="text-xl font-bold text-secondary-900">35min</div>
                      <div className="text-xs text-secondary-600">Estimation</div>
                    </div>
                  </div>

                  {/* Button */}
                  <Button className="w-full" size="lg">
                    Rejoindre la file
                  </Button>
                </div>
              </Card>

              {/* Decorative blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-400 blur-3xl opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">
              Pourquoi QueueBarber ?
            </h2>
            <p className="text-sm sm:text-base text-secondary-600">
              Solution complète pour votre salon
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} hover className="group">
                <div className="mb-3 inline-flex p-2 bg-primary-100 rounded-xl group-hover:bg-primary-500 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">
              Comment ça marche ?
            </h2>
            <p className="text-sm sm:text-base text-secondary-600">
              Simple, rapide, efficace
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {index + 1}
                </div>
                <h3 className="text-base font-bold text-secondary-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-secondary-600">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Prêt à moderniser votre salon ?
          </h2>
          <p className="text-sm sm:text-base text-primary-100 mb-6">
            Rejoignez les salons qui ont choisi l&apos;innovation
          </p>
          <Link href="/register" className="inline-block w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary-600 hover:bg-primary-50 w-full sm:w-auto"
            >
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Logo size="sm" />
            <p className="text-secondary-400 text-xs sm:text-sm text-center">
              © 2026 QueueBarber. Fait avec ❤️ au Cameroun
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Clock,
    title: 'Temps réel',
    description: 'File mise à jour instantanément. Position en direct.',
  },
  {
    icon: Smartphone,
    title: 'Sans app',
    description: 'Simple scan QR code. Marche sur le navigateur.',
  },
  {
    icon: Users,
    title: 'Plus de clients',
    description: 'Ils peuvent attendre ailleurs sans partir.',
  },
  {
    icon: TrendingUp,
    title: 'Statistiques',
    description: 'Clients/jour, heures de pointe, temps moyen.',
  },
  {
    icon: CheckCircle2,
    title: 'Rapide',
    description: 'Prêt en 2min. Support WhatsApp disponible.',
  },
  {
    icon: Zap,
    title: 'Abordable',
    description: '5 000 FCFA/mois. Sans engagement.',
  },
];

const steps = [
  {
    title: 'Créez votre salon',
    description: 'Inscription en 1 minute',
  },
  {
    title: 'Affichez le QR',
    description: 'On génère automatiquement',
  },
  {
    title: 'Gérez la file',
    description: 'Depuis votre téléphone',
  },
];