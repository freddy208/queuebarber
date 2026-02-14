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
  
  // Services
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
    if (services.length === 0) {
      toast.error('Ajoutez au moins un service');
      return false;
    }

    const hasEmptyService = services.some(s => !s.name.trim() || s.duration <= 0);
    if (hasEmptyService) {
      toast.error('Tous les services doivent avoir un nom et une durée');
      return false;
    }

    return true;
  };

  const addService = () => {
    setServices([
      ...services,
      { id: Date.now().toString(), name: '', duration: 15 },
    ]);
  };

  const removeService = (id: string) => {
    if (services.length === 1) {
      toast.error('Gardez au moins un service');
      return;
    }
    setServices(services.filter((s) => s.id !== id));
  };

  const updateService = (id: string, field: 'name' | 'duration' | 'price', value: any) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const slug = generateSlug(name);
      
      await createSalon({
        name,
        slug,
        ownerId: user!.uid,
        phone,
        city,
        address: address || undefined,
        services,
        whatsappSupport: whatsapp || undefined,
      });

      toast.success('Salon créé avec succès ! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      if (error.message.includes('déjà utilisé')) {
        toast.error('Ce nom de salon est déjà pris');
      } else {
        toast.error('Erreur lors de la création');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <DashboardHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour au dashboard</span>
        </Link>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-medium'
                      : 'bg-secondary-200 text-secondary-500'
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      step > s ? 'bg-primary-500' : 'bg-secondary-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={step >= 1 ? 'text-primary-500 font-semibold' : 'text-secondary-500'}>
              Informations
            </span>
            <span className={step >= 2 ? 'text-primary-500 font-semibold' : 'text-secondary-500'}>
              Services
            </span>
            <span className={step >= 3 ? 'text-primary-500 font-semibold' : 'text-secondary-500'}>
              Confirmation
            </span>
          </div>
        </div>

        <Card>
          {/* Step 1: Salon Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  Informations du salon
                </h2>
                <p className="text-secondary-600">
                  Ces informations seront visibles par vos clients
                </p>
              </div>

              <Input
                label="Nom du salon *"
                placeholder="Ex: Salon Freddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<Store className="w-5 h-5" />}
                error={errors.name}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Ville *"
                  placeholder="Ex: Douala"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  icon={<MapPin className="w-5 h-5" />}
                  error={errors.city}
                />

                <Input
                  label="Téléphone *"
                  placeholder="Ex: 677123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-5 h-5" />}
                  error={errors.phone}
                />
              </div>

              <Input
                label="Adresse (optionnel)"
                placeholder="Ex: Akwa, face Total"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                icon={<MapPin className="w-5 h-5" />}
              />

              <Input
                label="WhatsApp support (optionnel)"
                placeholder="Ex: 677123456"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                icon={<Phone className="w-5 h-5" />}
              />

              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-secondary-700">
                  💡 <strong>Conseil :</strong> Ajoutez un numéro WhatsApp pour que vos clients puissent vous contacter facilement en cas de problème.
                </p>
              </div>

              <Button onClick={handleNext} size="lg" className="w-full">
                Continuer
              </Button>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  Services proposés
                </h2>
                <p className="text-secondary-600">
                  Ajoutez les services que vous proposez avec leur durée
                </p>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Nom du service (ex: Coupe homme)"
                          value={service.name}
                          onChange={(e) =>
                            updateService(service.id, 'name', e.target.value)
                          }
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                              Durée (minutes) *
                            </label>
                            <Input
                              type="number"
                              placeholder="20"
                              value={service.duration}
                              onChange={(e) =>
                                updateService(
                                  service.id,
                                  'duration',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              icon={<Clock className="w-5 h-5" />}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-700 mb-2">
                              Prix (FCFA, optionnel)
                            </label>
                            <Input
                              type="number"
                              placeholder="2000"
                              value={service.price || ''}
                              onChange={(e) =>
                                updateService(
                                  service.id,
                                  'price',
                                  parseInt(e.target.value) || undefined
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(service.id)}
                        className="text-error hover:bg-red-50 mt-2"
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
                icon={<Plus className="w-5 h-5" />}
                className="w-full"
              >
                Ajouter un service
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  Récapitulatif
                </h2>
                <p className="text-secondary-600">
                  Vérifiez les informations avant de créer votre salon
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <h3 className="font-bold text-secondary-900 mb-3">
                    Informations du salon
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {name}</p>
                    <p><strong>Ville:</strong> {city}</p>
                    <p><strong>Téléphone:</strong> {phone}</p>
                    {address && <p><strong>Adresse:</strong> {address}</p>}
                    {whatsapp && <p><strong>WhatsApp:</strong> {whatsapp}</p>}
                  </div>
                </div>

                <div className="p-4 bg-secondary-50 rounded-lg">
                  <h3 className="font-bold text-secondary-900 mb-3">
                    Services ({services.length})
                  </h3>
                  <div className="space-y-2">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{service.name}</span>
                        <span className="text-secondary-600">
                          {service.duration} min
                          {service.price && ` • ${service.price} FCFA`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                  <p className="text-sm text-secondary-700">
                    🎉 <strong>Prochaine étape :</strong> Après création, nous générerons automatiquement votre QR code à afficher devant votre salon !
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  className="flex-1"
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