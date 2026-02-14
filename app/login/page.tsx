/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success('Connexion réussie ! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      
      // Messages d'erreur personnalisés
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Erreur de connexion. Réessayez.');
      }
      
      toast.error('Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background decorations - Mobile optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary-300 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button - Mobile optimized */}
        <Link href="/" className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-8 transition-colors group text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour à l&apos;accueil</span>
          <span className="sm:hidden">Retour</span>
        </Link>

        <Card className="animate-fadeIn">
          {/* Logo - Mobile optimized */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Logo size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
              Bon retour ! 👋
            </h1>
            <p className="text-sm sm:text-base text-secondary-600">
              Connectez-vous pour gérer votre salon
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-error/10 border-2 border-error/20 rounded-lg flex items-start gap-2 sm:gap-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 sm:w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <Input
              type="email"
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 sm:w-5 h-5" />}
              disabled={loading}
            />

            <Input
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 sm:w-5 h-5" />}
              disabled={loading}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 sm:w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-secondary-600 group-hover:text-secondary-900 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              size="lg"
              loading={loading}
            >
              Se connecter
            </Button>
          </form>

          {/* Divider - Mobile optimized */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white text-secondary-500">
                Nouveau sur QueueBarber ?
              </span>
            </div>
          </div>

          {/* Register link */}
          <Link href="/register">
            <Button variant="outline" className="w-full text-sm sm:text-base">
              Créer un compte gratuitement
            </Button>
          </Link>
        </Card>

        {/* Trust badges - Mobile optimized */}
        <div className="mt-6 sm:mt-8 text-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-secondary-500">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full"></div>
              Connexion sécurisée
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"></div>
              Données protégées
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}