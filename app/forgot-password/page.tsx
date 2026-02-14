/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { validateEmail } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('L\'email est requis');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email invalide');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Email envoyé ! 📧');
    } catch (err: any) {
      console.error(err);
      
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email');
      } else {
        setError('Erreur lors de l\'envoi. Réessayez.');
      }
      
      toast.error('Erreur d\'envoi');
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
        <Link href="/login" className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-8 transition-colors group text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour à la connexion</span>
          <span className="sm:hidden">Retour</span>
        </Link>

        <Card className="animate-fadeIn">
          {/* Header - Mobile optimized */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Logo size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
              Mot de passe oublié ? 🔐
            </h1>
            <p className="text-sm sm:text-base text-secondary-600">
              Pas de souci, on va vous aider à le récupérer
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <Input
                type="email"
                label="Adresse email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={error}
                disabled={loading}
              />

              <div className="p-3 sm:p-4 bg-primary-50 rounded-lg">
                <p className="text-xs sm:text-sm text-secondary-700">
                  Nous vous enverrons un lien de réinitialisation par email.
                  Vérifiez aussi vos spams ! 📬
                </p>
              </div>

              <Button
                type="submit"
                className="w-full text-sm sm:text-base"
                size="lg"
                loading={loading}
              >
                Envoyer le lien
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
              </div>
              
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-secondary-900 mb-1 sm:mb-2">
                  Email envoyé ! 📧
                </h2>
                <p className="text-sm sm:text-base text-secondary-600 px-2">
                  Vérifiez votre boîte mail <span className="font-semibold text-primary-500">{email}</span>
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-primary-50 rounded-lg text-left space-y-1.5 sm:space-y-2">
                <p className="text-xs sm:text-sm text-secondary-700 font-semibold">
                  Vous n&apos;avez pas reçu l&apos;email ?
                </p>
                <ul className="text-xs sm:text-sm text-secondary-600 space-y-1">
                  <li>• Vérifiez vos spams</li>
                  <li>• Attendez quelques minutes</li>
                  <li>• Vérifiez l&apos;orthographe de votre email</li>
                </ul>
              </div>

              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full text-sm sm:text-base"
              >
                Renvoyer l&apos;email
              </Button>
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-center">
            <Link
              href="/login"
              className="text-xs sm:text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}