/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { Mail, Lock, ArrowLeft, AlertCircle, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { validateEmail } from '@/lib/utils';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Veuillez accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      toast.success('Compte créé avec succès ! 🎉');
      router.push('/onboarding');
    } catch (err: any) {
      console.error(err);
      
      if (err.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Cet email est déjà utilisé' });
        toast.error('Email déjà utilisé');
      } else if (err.code === 'auth/weak-password') {
        setErrors({ password: 'Mot de passe trop faible' });
        toast.error('Mot de passe trop faible');
      } else {
        toast.error('Erreur lors de la création du compte');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background decorations - Mobile optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-40 h-40 sm:w-80 sm:h-80 bg-primary-300 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-primary-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button - Mobile optimized */}
        <Link href="/" className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-8 transition-colors group text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
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
              Créez votre compte ✨
            </h1>
            <p className="text-sm sm:text-base text-secondary-600">
              Commencez à gérer votre salon en 2 minutes
            </p>
          </div>

          {/* Benefits - Mobile optimized */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary-50 rounded-lg space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-700">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" />
              <span>Gratuit pendant 14 jours</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-700">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" />
              <span>Installation en 2 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-700">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" />
              <span>Support WhatsApp 24/7</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <Input
              type="text"
              label="Nom complet"
              placeholder="Ex: Freddy Kouam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4 sm:w-5 sm:h-5" />}
              error={errors.name}
              disabled={loading}
            />

            <Input
              type="email"
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
              error={errors.email}
              disabled={loading}
            />

            <div>
              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={errors.password}
                disabled={loading}
              />
              
              {/* Password strength bar - Mobile optimized */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div className={`h-1 flex-1 rounded ${passwordStrength >= 25 ? 'bg-error' : 'bg-secondary-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength >= 50 ? 'bg-warning' : 'bg-secondary-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength >= 75 ? 'bg-primary-500' : 'bg-secondary-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength >= 100 ? 'bg-success' : 'bg-secondary-200'}`}></div>
                  </div>
                  <p className="text-xs text-secondary-500">
                    {passwordStrength < 50 && 'Faible'}
                    {passwordStrength >= 50 && passwordStrength < 75 && 'Moyen'}
                    {passwordStrength >= 75 && passwordStrength < 100 && 'Bon'}
                    {passwordStrength === 100 && 'Excellent'}
                  </p>
                </div>
              )}
            </div>

            <Input
              type="password"
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
              error={errors.confirmPassword}
              disabled={loading}
            />

            {/* Terms checkbox - Mobile optimized */}
            <div>
              <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500 focus:ring-2 mt-0.5 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-secondary-600 group-hover:text-secondary-900 transition-colors leading-relaxed">
                  J&apos;accepte les{' '}
                  <Link href="/terms" className="text-primary-500 hover:text-primary-600 font-semibold">
                    conditions d&apos;utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link href="/privacy" className="text-primary-500 hover:text-primary-600 font-semibold">
                    politique de confidentialité
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs sm:text-sm text-error animate-fadeIn flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {errors.terms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              size="lg"
              loading={loading}
            >
              Créer mon compte
            </Button>
          </form>

          {/* Divider - Mobile optimized */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white text-secondary-500">
                Vous avez déjà un compte ?
              </span>
            </div>
          </div>

          {/* Login link */}
          <Link href="/login">
            <Button variant="outline" className="w-full text-sm sm:text-base">
              Se connecter
            </Button>
          </Link>
        </Card>

        {/* Trust badges - Mobile optimized */}
        <div className="mt-6 sm:mt-8 text-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-secondary-500">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full"></div>
              Connexion sécurisée SSL
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full"></div>
              Données cryptées
            </span>
          </div>
          <p className="text-xs text-secondary-400">
            🇨🇲 Fait avec ❤️ au Cameroun
          </p>
        </div>
      </div>
    </div>
  );
}