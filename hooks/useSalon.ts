/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Salon, Service } from '@/types';

export function useSalons(ownerId?: string) {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'salons'), where('ownerId', '==', ownerId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salonsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Salon[];

      setSalons(salonsData);
      setLoading(false);
    }, (error) => {
      console.error('Erreur useSalons:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [ownerId]);

  return { salons, loading };
}

export function useSalon(slug: string) {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchSalon = async () => {
      try {
        const q = query(collection(db, 'salons'), where('slug', '==', slug));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setSalon({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          } as Salon);
        } else {
          setSalon(null);
        }
      } catch (error) {
        console.error('Erreur useSalon:', error);
        setSalon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [slug]);

  return { salon, loading };
}

export async function createSalon(data: {
  name: string;
  slug: string;
  ownerId: string;
  phone: string;
  city: string;
  address?: string;
  services: Service[];
  whatsappSupport?: string;
}) {
  try {
    // Validation des données requises
    if (!data.name?.trim()) throw new Error('Le nom du salon est requis');
    if (!data.slug?.trim()) throw new Error('Le slug est requis');
    if (!data.ownerId?.trim()) throw new Error('L\'ID du propriétaire est requis');
    if (!data.phone?.trim()) throw new Error('Le téléphone est requis');
    if (!data.city?.trim()) throw new Error('La ville est requise');
    if (!data.services || data.services.length === 0) throw new Error('Au moins un service est requis');

    // Vérifier si le slug existe déjà
    const q = query(collection(db, 'salons'), where('slug', '==', data.slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      throw new Error('Ce nom de salon est déjà utilisé');
    }

    // Préparer les données
    const salonData = {
      name: data.name.trim(),
      slug: data.slug.trim(),
      ownerId: data.ownerId.trim(),
      phone: data.phone.trim(),
      city: data.city.trim(),
      address: data.address?.trim() || null,
      services: data.services.map(s => ({
        id: s.id || Date.now().toString(),
        name: s.name.trim(),
        duration: Number(s.duration),
        price: s.price ? Number(s.price) : null
      })),
      whatsappSupport: data.whatsappSupport?.trim() || null,
      isOpen: true,
      createdAt: new Date(),
    };

    console.log('Données salon à créer:', salonData);

    const docRef = await addDoc(collection(db, 'salons'), salonData);
    return docRef.id;
  } catch (error: any) {
    console.error('Erreur createSalon:', error);
    throw new Error(error.message || 'Erreur lors de la création du salon');
  }
}

export async function updateSalon(salonId: string, data: Partial<Salon>) {
  const salonRef = doc(db, 'salons', salonId);
  await updateDoc(salonRef, data);
}

export async function deleteSalon(salonId: string) {
  const salonRef = doc(db, 'salons', salonId);
  await deleteDoc(salonRef);
}

export async function toggleSalonStatus(salonId: string, isOpen: boolean) {
  const salonRef = doc(db, 'salons', salonId);
  await updateDoc(salonRef, { isOpen });
}