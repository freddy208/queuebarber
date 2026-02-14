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
    });

    return unsubscribe;
  }, [ownerId]);

  return { salons, loading };
}

export function useSalon(slug: string) {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      const q = query(collection(db, 'salons'), where('slug', '==', slug));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setSalon({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as Salon);
      }

      setLoading(false);
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
  // Vérifier si le slug existe déjà
  const q = query(collection(db, 'salons'), where('slug', '==', data.slug));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error('Ce nom de salon est déjà utilisé');
  }

  const docRef = await addDoc(collection(db, 'salons'), {
    ...data,
    isOpen: true,
    createdAt: new Date(),
  });

  return docRef.id;
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