/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Save, 
  CheckCircle2,
  AlertCircle,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, userData } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les données utilisateur
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
    }
  }, [userData]);

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Minimum 6 caractères';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfile()) return;
    if (!user?.uid) {
      toast.error('Utilisateur non connecté');
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: name.trim(),
        updatedAt: new Date(),
      });

      toast.success('Profil mis à jour ! 🎉');
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) return;

    setPasswordLoading(true);

    try {
      // Note: La mise à jour du mot de passe nécessite une re-authentification
      // Pour simplifier, on affiche un message indiquant de contacter le support
      // ou d'utiliser la fonction "Mot de passe oublié"
      toast.success('Fonctionnalité en cours de développement. Utilisez "Mot de passe oublié" pour changer votre mot de passe.');
    } catch (error) {
      console.error('Erreur mise à jour mot de passe:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!userData) {
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

  return (
    <div className="min-h-screen bg-secondary-50">
      <DashboardHeader />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Back button - Mobile optimized */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-8 transition-colors group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour au dashboard</span>
          <span className="sm:hidden">Retour</span>
        </Link>

        {/* Header - Mobile optimized */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
            Mon profil
          </h1>
          <p className="text-sm sm:text-base text-secondary-600">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Avatar section */}
          <Card className="p-4 sm:p-6 text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold mx-auto mb-3 sm:mb-4">
                {name.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-medium flex items-center justify-center text-secondary-600 hover:text-primary-500 hover:bg-primary-50 transition-colors border border-secondary-200">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-secondary-900 mb-1">
              {name || 'Utilisateur'}
            </h2>
            <p className="text-sm text-secondary-600">{email}</p>
          </Card>

          {/* Informations personnelles */}
          <Card className="p-3 sm:p-4">
            <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              Informations personnelles
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <Input
                label="Nom complet *"
                placeholder="Ex: Freddy Kouam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={errors.name}
              />

              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                disabled
                icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <p className="text-xs text-secondary-500 -mt-2">
                L&apos;email ne peut pas être modifié. Contactez le support si nécessaire.
              </p>

              <Button
                onClick={handleUpdateProfile}
                loading={loading}
                disabled={loading}
                icon={<Save className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="w-full text-sm sm:text-base"
                size="lg"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </Card>

          {/* Sécurité */}
          <Card className="p-3 sm:p-4">
            <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              Sécurité
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-primary-50 rounded-lg border-2 border-primary-100">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-secondary-900 mb-1">
                      Changement de mot de passe
                    </p>
                    <p className="text-xs sm:text-sm text-secondary-600">
                      Pour des raisons de sécurité, utilisez la fonction &quot;Mot de passe oublié&quot; 
                      sur la page de connexion pour changer votre mot de passe.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/forgot-password">
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                >
                  Réinitialiser mon mot de passe
                </Button>
              </Link>
            </div>
          </Card>

          {/* Informations du compte */}
          <Card className="p-3 sm:p-4">
            <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4">
              Informations du compte
            </h2>
            
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <div className="flex justify-between py-2 border-b border-secondary-100">
                <span className="text-secondary-600">ID utilisateur</span>
                <span className="font-mono text-xs sm:text-sm text-secondary-900 truncate max-w-[150px] sm:max-w-[200px]">
                  {user?.uid}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-secondary-100">
                <span className="text-secondary-600">Membre depuis</span>
                <span className="text-secondary-900">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : '-'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-secondary-600">Statut du compte</span>
                <span className="inline-flex items-center gap-1 text-success">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Actif
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}