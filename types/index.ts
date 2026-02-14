// Types de l'application

export interface User {
  uid: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Salon {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  phone: string;
  city: string;
  address?: string;
  isOpen: boolean;
  createdAt: Date;
  services: Service[];
  whatsappSupport?: string; // Numéro WhatsApp pour support
}

export interface Service {
  id: string;
  name: string;
  duration: number; // en minutes
  price?: number; // optionnel pour MVP
}

export interface Client {
  id: string;
  name: string;
  service: string;
  serviceDuration: number; // durée du service choisi
  status: 'waiting' | 'done';
  createdAt: Date;
  position?: number; // position dans la file
}

export interface QueueStats {
  totalWaiting: number;
  estimatedWaitTime: number; // en minutes
  isOpen: boolean;
}

export interface Subscription {
  salonId: string;
  plan: 'free' | 'monthly' | 'annual';
  active: boolean;
  startDate: Date;
  endDate?: Date;
}