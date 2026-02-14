/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createSalon } from '@/hooks/useSalon';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { 
  Store, 
  MapPin, 
  Phone, 
  Plus, 
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { generateSlug, validatePhone } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  duration: number;
  price?: number;
}

export default function CreateSalonPage() {
  return (
    <ProtectedRoute>
      <CreateSalonContent />
    </ProtectedRoute>
  );
}

function CreateSalonContent() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Salon info
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  // Services - initialisé avec des services par défaut valides
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Coupe homme', duration: 20 },
    { id: '2', name: 'Barbe', duration: 15 },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom du salon est requis';
    }

    if (!city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Numéro invalide (ex: 677123456)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    // Vérifier qu'il y a au moins un service
    if (!services || services.length === 0) {
      toast.error('Ajoutez au moins un service');
      return false;
    }

    // Vérifier chaque service
    for (const service of services) {
      if (!service.name || !service.name.trim()) {
        toast.error('Tous les services doivent avoir un nom');
        return false;
      }
      if (!service.duration || service.duration <= 0) {
        toast.error(`La durée du service "${service.name || 'sans nom'}" doit être supérieure à 0`);
        return false;
      }
    }

    return true;
  };

  const addService = () => {
    const newService: Service = { 
      id: Date.now().toString(), 
      name: '', 
      duration: 15 
    };
    setServices(prev => [...prev, newService]);
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

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        setErrors({});
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleSubmit = async () => {
    // Validation finale avant soumission
    if (!validateStep2()) {
      return;
    }

    // Vérifier que l'utilisateur est connecté
    if (!user?.uid) {
      toast.error('Vous devez être connecté pour créer un salon');
      return;
    }

    setLoading(true);

    try {
      const slug = generateSlug(name);
      
      // Préparer les services (s'assurer que les prix sont correctement gérés)
      const preparedServices = services.map(s => ({
        id: s.id,
        name: s.name.trim(),
        duration: Number(s.duration),
        price: s.price ? Number(s.price) : undefined
      }));

      console.log('Création du salon avec:', {
        name: name.trim(),
        slug,
        ownerId: user.uid,
        phone: phone.trim(),
        city: city.trim(),
        address: address?.trim() || undefined,
        services: preparedServices,
        whatsappSupport: whatsapp?.trim() || undefined,
      });

      await createSalon({
        name: name.trim(),
        slug,
        ownerId: user.uid,
        phone: phone.trim(),
        city: city.trim(),
        address: address?.trim() || undefined,
        services: preparedServices,
        whatsappSupport: whatsapp?.trim() || undefined,
      });

      toast.success('Salon créé avec succès ! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erreur création salon:', error);
      if (error.message?.includes('déjà utilisé') || error.message?.includes('slug')) {
        toast.error('Ce nom de salon est déjà pris. Essayez un autre nom.');
      } else {
        toast.error(error.message || 'Erreur lors de la création du salon');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Informations', shortLabel: 'Infos' },
    { id: 2, label: 'Services', shortLabel: 'Services' },
    { id: 3, label: 'Confirmation', shortLabel: 'Confirmer' },
  ];

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

        {/* Progress steps - CORRIGÉ */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                {/* Cercle numéro centré */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base ${
                      step >= s.id
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-medium'
                        : 'bg-secondary-200 text-secondary-500'
                    }`}
                  >
                    {step > s.id ? <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" /> : s.id}
                  </div>
                </div>
                
                {/* Barre de progression (sauf dernier) */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 sm:mx-3 rounded transition-all ${
                      step > s.id ? 'bg-primary-500' : 'bg-secondary-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Labels centrés sous chaque numéro */}
          <div className="flex justify-between">
            {steps.map((s) => (
              <div key={s.id} className="flex-1 text-center">
                <span className={`text-xs sm:text-sm font-semibold ${
                  step >= s.id ? 'text-primary-500' : 'text-secondary-500'
                }`}>
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.shortLabel}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-3 sm:p-4">
          {/* Step 1: Salon Info */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-1 sm:mb-2">
                  Informations du salon
                </h2>
                <p className="text-xs sm:text-base text-secondary-600">
                  Ces informations seront visibles par vos clients
                </p>
              </div>

              <Input
                label="Nom du salon *"
                placeholder="Ex: Salon Freddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<Store className="w-4 h-4 sm:w-5 sm:h-5" />}
                error={errors.name}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Ville *"
                  placeholder="Ex: Douala"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
                  error={errors.city}
                />

                <Input
                  label="Téléphone *"
                  placeholder="Ex: 677123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-4 h-4 sm:w-5 sm:h-5" />}
                  error={errors.phone}
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

              <div className="p-3 sm:p-4 bg-primary-50 rounded-lg">
                <p className="text-xs sm:text-sm text-secondary-700">
                  💡 <strong>Conseil :</strong> Ajoutez un numéro WhatsApp pour que vos clients puissent vous contacter facilement en cas de problème.
                </p>
              </div>

              <Button onClick={handleNext} size="lg" className="w-full text-sm sm:text-base">
                Continuer
              </Button>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-1 sm:mb-2">
                  Services proposés
                </h2>
                <p className="text-xs sm:text-base text-secondary-600">
                  Ajoutez les services que vous proposez avec leur durée
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="p-3 sm:p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        <Input
                          placeholder="Nom du service (ex: Coupe homme)"
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
                              icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
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

              <Button
                variant="outline"
                onClick={addService}
                icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="w-full text-sm sm:text-base"
              >
                Ajouter un service
              </Button>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 text-sm sm:text-base"
                >
                  Retour
                </Button>
                <Button onClick={handleNext} className="flex-1 text-sm sm:text-base">
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-1 sm:mb-2">
                  Récapitulatif
                </h2>
                <p className="text-xs sm:text-base text-secondary-600">
                  Vérifiez les informations avant de créer votre salon
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-secondary-50 rounded-lg">
                  <h3 className="font-bold text-secondary-900 mb-2 sm:mb-3 text-sm sm:text-base">
                    Informations du salon
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <p><strong>Nom:</strong> {name}</p>
                    <p><strong>Ville:</strong> {city}</p>
                    <p><strong>Téléphone:</strong> {phone}</p>
                    {address && <p><strong>Adresse:</strong> {address}</p>}
                    {whatsapp && <p><strong>WhatsApp:</strong> {whatsapp}</p>}
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-secondary-50 rounded-lg">
                  <h3 className="font-bold text-secondary-900 mb-2 sm:mb-3 text-sm sm:text-base">
                    Services ({services.length})
                  </h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs sm:text-sm"
                      >
                        <span>{service.name}</span>
                        <span className="text-secondary-600">
                          {service.duration} min
                          {service.price ? ` • ${service.price} FCFA` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                  <p className="text-xs sm:text-sm text-secondary-700">
                    🎉 <strong>Prochaine étape :</strong> Après création, nous générerons automatiquement votre QR code à afficher devant votre salon !
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 text-sm sm:text-base"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  className="flex-1 text-sm sm:text-base"
                >
                  Créer mon salon
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}