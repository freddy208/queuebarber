/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSalon, updateSalon, deleteSalon } from '@/hooks/useSalon';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { 
  ArrowLeft, 
  Save, 
  Trash2,
  Store,
  MapPin,
  Phone,
  Clock,
  Plus,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Service } from '@/types';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const { salon, loading } = useSalon(slug);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && salon && salon.ownerId !== user?.uid) {
      toast.error('Accès non autorisé');
      router.push('/dashboard');
    }
  }, [salon, loading, user, router]);

  useEffect(() => {
    if (salon) {
      setName(salon.name || '');
      setCity(salon.city || '');
      setAddress(salon.address || '');
      setPhone(salon.phone || '');
      setWhatsapp(salon.whatsappSupport || '');
      setServices(salon.services || []);
    }
  }, [salon]);

  const addService = () => {
    setServices(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', duration: 15 },
    ]);
  };

  const removeService = (id: string) => {
    if (services.length <= 1) {
      toast.error('Gardez au moins un service');
      return;
    }
    setServices(prev => prev.filter((s) => s.id !== id));
  };

  const updateService = (id: string, field: 'name' | 'duration' | 'price', value: any) => {
    setServices(prev =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSave = async () => {
    if (!salon) {
      toast.error('Salon non trouvé');
      return;
    }

    // Validation stricte
    if (!name.trim()) {
      toast.error('Le nom du salon est requis');
      return;
    }
    if (!city.trim()) {
      toast.error('La ville est requise');
      return;
    }
    if (!phone.trim()) {
      toast.error('Le téléphone est requis');
      return;
    }

    // Validation des services
    const invalidService = services.find(s => !s.name?.trim() || !s.duration || s.duration <= 0);
    if (invalidService) {
      toast.error('Tous les services doivent avoir un nom et une durée valide');
      return;
    }

    setSaving(true);

    try {
      // Préparer les données
      const updateData = {
        name: name.trim(),
        city: city.trim(),
        address: address?.trim() || undefined,
        phone: phone.trim(),
        whatsappSupport: whatsapp?.trim() || undefined,
        services: services.map(s => ({
          id: s.id,
          name: s.name.trim(),
          duration: Number(s.duration),
          price: s.price ? Number(s.price) : undefined
        })),
      };

      console.log('Mise à jour salon:', updateData);

      await updateSalon(salon.id, updateData);
      toast.success('Salon mis à jour ! 🎉');
    } catch (error: any) {
      console.error('Erreur mise à jour:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!salon) return;

    const confirmed = confirm(
      `⚠️ ATTENTION ⚠️\n\nÊtes-vous sûr de vouloir supprimer "${salon.name}" ?\n\nCette action est IRRÉVERSIBLE.\nToutes les données seront perdues.`
    );

    if (!confirmed) return;

    const doubleConfirm = confirm(
      'Dernière confirmation : Tapez OK pour supprimer définitivement'
    );

    if (!doubleConfirm) return;

    setDeleting(true);

    try {
      await deleteSalon(salon.id);
      toast.success('Salon supprimé');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
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
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-16">
          <Card className="text-center py-8 sm:py-12 px-4">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-error mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
              Salon introuvable
            </h2>
            <Link href="/dashboard">
              <Button size="sm" className="mt-4 sm:text-base">Retour au dashboard</Button>
            </Link>
          </Card>
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
          href={`/dashboard/${slug}`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-8 transition-colors group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour au salon</span>
          <span className="sm:hidden">Retour</span>
        </Link>

        {/* Header - Mobile optimized */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
            Paramètres
          </h1>
          <p className="text-sm sm:text-base text-secondary-600">
            Modifiez les informations de votre salon
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Salon Info */}
          <Card className="p-3 sm:p-4">
            <h2 className="text-base sm:text-xl font-bold text-secondary-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              Informations du salon
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <Input
                label="Nom du salon *"
                placeholder="Ex: Salon Freddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<Store className="w-4 h-4 sm:w-5 sm:h-5" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Ville *"
                  placeholder="Ex: Douala"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
                />

                <Input
                  label="Téléphone *"
                  placeholder="Ex: 677123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5" />}
                />
              </div>

              <Input
                label="Adresse (optionnel)"
                placeholder="Ex: Akwa, face Total"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
              />

              <Input
                label="WhatsApp support (optionnel)"
                placeholder="Ex: 677123456"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
            </div>
          </Card>

          {/* Services - Mobile optimized */}
          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-secondary-900 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                Services
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addService}
                icon={<Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-2.5 sm:p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <Input
                        placeholder="Nom du service"
                        value={service.name}
                        onChange={(e) =>
                          updateService(service.id, 'name', e.target.value)
                        }
                        className="text-sm sm:text-base"
                      />
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1 sm:mb-2">
                            Durée (min) *
                          </label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="20"
                            value={service.duration || ''}
                            onChange={(e) =>
                              updateService(
                                service.id,
                                'duration',
                                parseInt(e.target.value) || 0
                              )
                            }
                            icon={<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-secondary-700 mb-1 sm:mb-2">
                            Prix (FCFA)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="2000"
                            value={service.price || ''}
                            onChange={(e) =>
                              updateService(
                                service.id,
                                'price',
                                parseInt(e.target.value) || undefined
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(service.id)}
                      className="text-error hover:bg-red-50 mt-1 sm:mt-2 px-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions - Mobile optimized */}
          <Card className="p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              <Button
                onClick={handleSave}
                loading={saving}
                disabled={saving}
                icon={<Save className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="w-full text-sm sm:text-base"
                size="lg"
              >
                Enregistrer les modifications
              </Button>

              <div className="pt-3 sm:pt-4 border-t border-secondary-200">
                <p className="text-xs sm:text-sm font-semibold text-error mb-2 sm:mb-3">
                  ⚠️ Zone dangereuse
                </p>
                <Button
                  onClick={handleDelete}
                  loading={deleting}
                  disabled={deleting}
                  variant="danger"
                  icon={<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="w-full text-sm sm:text-base"
                >
                  Supprimer ce salon
                </Button>
                <p className="text-xs text-secondary-500 mt-2 text-center">
                  Action irréversible
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}