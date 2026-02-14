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
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              {user ? (
                <Button onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Connexion</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Créer un compte</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8 animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Solution digitale pour salons modernes
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                Fini les files d&apos;attente{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  interminables
                </span>
              </h1>
              
              <p className="text-xl text-secondary-600 leading-relaxed">
                Gérez votre salon intelligemment. Vos clients rejoignent la file à distance, 
                vous gagnez du temps et de l&apos;argent.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Démarrer gratuitement
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Voir la démo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-secondary-200">
                <div>
                  <div className="text-3xl font-bold text-primary-500">2min</div>
                  <div className="text-sm text-secondary-600">Installation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-500">+40%</div>
                  <div className="text-sm text-secondary-600">Clients satisfaits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-500">24/7</div>
                  <div className="text-sm text-secondary-600">Support WhatsApp</div>
                </div>
              </div>
            </div>

            {/* Right - Mock app preview */}
            <div className="relative animate-slideUp">
              <div className="relative z-10">
                <Card className="max-w-md mx-auto" gradient>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-secondary-900">Salon Freddy</h3>
                      <span className="inline-flex items-center gap-1 bg-success/10 text-success px-3 py-1 rounded-full text-sm font-semibold">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        Ouvert
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 backdrop-blur p-4 rounded-xl">
                        <Users className="w-8 h-8 text-primary-500 mb-2" />
                        <div className="text-2xl font-bold text-secondary-900">3</div>
                        <div className="text-sm text-secondary-600">En attente</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur p-4 rounded-xl">
                        <Clock className="w-8 h-8 text-primary-500 mb-2" />
                        <div className="text-2xl font-bold text-secondary-900">35min</div>
                        <div className="text-sm text-secondary-600">Temps estimé</div>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Rejoindre la file
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Decorative blur */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-400 blur-3xl opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Pourquoi choisir QueueBarber ?
            </h2>
            <p className="text-xl text-secondary-600">
              Une solution complète pour moderniser votre salon
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="group">
                <div className="mb-4 inline-flex p-3 bg-primary-100 rounded-xl group-hover:bg-primary-500 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-secondary-600">
              Simple, rapide, efficace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary-600">
                    {step.description}
                  </p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre salon ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez les salons de coiffure qui ont choisi l&lsquo;innovation
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" />
            <p className="text-secondary-400 mt-4 md:mt-0">
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
    description: 'File d\'attente mise à jour instantanément. Vos clients voient leur position en direct.',
  },
  {
    icon: Smartphone,
    title: 'Sans application',
    description: 'Simple scan QR code. Pas besoin de télécharger une app. Ça marche directement sur le navigateur.',
  },
  {
    icon: Users,
    title: 'Plus de clients',
    description: 'Ne perdez plus de clients qui partent en voyant la file. Ils peuvent attendre ailleurs.',
  },
  {
    icon: TrendingUp,
    title: 'Statistiques',
    description: 'Suivez vos performances : clients par jour, heures de pointe, temps moyen.',
  },
  {
    icon: CheckCircle2,
    title: 'Installation rapide',
    description: 'Prêt en 2 minutes. On configure tout pour vous. Support WhatsApp disponible.',
  },
  {
    icon: Zap,
    title: 'Prix abordable',
    description: '5 000 FCFA/mois. Ou paiement unique 60 000 FCFA. Sans engagement.',
  },
];

const steps = [
  {
    title: 'Créez votre salon',
    description: 'Inscription en 1 minute. Ajoutez vos services et tarifs.',
  },
  {
    title: 'Affichez le QR code',
    description: 'On génère automatiquement votre QR code. Collez-le devant votre salon.',
  },
  {
    title: 'Gérez la file',
    description: 'Gérez votre file d\'attente depuis votre téléphone. Simple et rapide.',
  },
];