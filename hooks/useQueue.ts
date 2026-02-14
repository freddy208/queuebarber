/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client, QueueStats } from '@/types';

export function useQueue(salonId: string) {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalWaiting: 0,
    estimatedWaitTime: 0,
    isOpen: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!salonId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'queues', salonId, 'clients'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        position: index + 1,
      })) as Client[];

      setClients(clientsData);

      // Calculer les stats
      const waiting = clientsData.filter((c) => c.status === 'waiting');
      const totalWaitTime = waiting.reduce((sum, client) => sum + client.serviceDuration, 0);

      setStats({
        totalWaiting: waiting.length,
        estimatedWaitTime: totalWaitTime,
        isOpen: true, // À récupérer depuis le salon
      });

      setLoading(false);
    });

    return unsubscribe;
  }, [salonId]);

  return { clients, stats, loading };
}

export async function addClientToQueue(
  salonId: string,
  data: {
    name: string;
    service: string;
    serviceDuration: number;
  }
) {
  await addDoc(collection(db, 'queues', salonId, 'clients'), {
    ...data,
    status: 'waiting',
    createdAt: new Date(),
  });
}

export async function markClientAsDone(salonId: string, clientId: string) {
  const clientRef = doc(db, 'queues', salonId, 'clients', clientId);
  await updateDoc(clientRef, { status: 'done' });
}

export async function removeClient(salonId: string, clientId: string) {
  const clientRef = doc(db, 'queues', salonId, 'clients', clientId);
  await deleteDoc(clientRef);
}

export async function clearCompletedClients(salonId: string) {
  const q = query(
    collection(db, 'queues', salonId, 'clients'),
    where('status', '==', 'done')
  );

  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

  await Promise.all(deletePromises);
}