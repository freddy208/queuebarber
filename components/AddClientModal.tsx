'use client';

import { useState } from 'react';
import { Service } from '@/types';
import Button from './Button';
import Input from './Input';
import { X, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, service: string, duration: number) => void;
  services: Service[];
}

export default function AddClientModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  services 
}: AddClientModalProps) {
  const [name, setName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    if (!selectedServiceId) {
      toast.error('Sélectionnez un service');
      return;
    }

    const service = services.find(s => s.id === selectedServiceId);
    if (!service) return;

    onAdd(name.trim(), service.name, service.duration);
    
    // Reset
    setName('');
    setSelectedServiceId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-strong max-w-md w-full p-6 animate-slideUp">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              Ajouter un client
            </h2>
            <p className="text-secondary-600">
              Ajoutez un client présent physiquement dans le salon
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nom du client *"
              placeholder="Ex: Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              autoFocus
            />

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Service demandé *
              </label>
              <div className="space-y-2">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`
                      flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedServiceId === service.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-primary-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={selectedServiceId === service.id}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-semibold text-secondary-900">
                          {service.name}
                        </p>
                        <p className="text-sm text-secondary-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                          {service.price && ` • ${service.price} FCFA`}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                Ajouter
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}