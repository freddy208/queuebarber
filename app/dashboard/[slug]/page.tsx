/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSalon } from '@/hooks/useSalon';
import { useQueue, addClientToQueue, markClientAsDone, removeClient, clearCompletedClients } from '@/hooks/useQueue';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';
import Button from '@/components/Button';
import Card from '@/components/Card';
import QueueClient from '@/components/QueueClient';
import AddClientModal from '@/components/AddClientModal';
import { 
  Plus, 
  Users, 
  Clock, 
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  QrCode,
  Settings,
  Trash2,
  ArrowLeft,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { toggleSalonStatus } from '@/hooks/useSalon';
import { formatWaitTime } from '@/lib/utils';

export default function QueueManagementPage() {
  return (
    <ProtectedRoute>
      <QueueManagementContent />
    </ProtectedRoute>
  );
}

function QueueManagementContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const { salon, loading: salonLoading } = useSalon(slug);
  const { clients, stats, loading: queueLoading } = useQueue(salon?.id || '');

  const [showAddModal, setShowAddModal] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Vérifier que le coiffeur est bien le propriétaire
  useEffect(() => {
    if (!salonLoading && salon && salon.ownerId !== user?.uid) {
      toast.error('Accès non autorisé');
      router.push('/dashboard');
    }
  }, [salon, salonLoading, user, router]);

  if (salonLoading || queueLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <DashboardHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              Salon introuvable
            </h2>
            <p className="text-secondary-600 mb-6">
              Ce salon n&apos;existe pas ou a été supprimé
            </p>
            <Link href="/dashboard">
              <Button>Retour au dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const waitingClients = clients.filter(c => c.status === 'waiting');
  const doneClients = clients.filter(c => c.status === 'done');

  const handleToggleStatus = async () => {
    setToggling(true);
    try {
      await toggleSalonStatus(salon.id, !salon.isOpen);
      toast.success(salon.isOpen ? 'Salon fermé' : 'Salon ouvert');
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    } finally {
      setToggling(false);
    }
  };

  const handleAddClient = async (name: string, service: string, duration: number) => {
    try {
      await addClientToQueue(salon.id, { name, service, serviceDuration: duration });
      toast.success(`${name} ajouté à la file`);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleMarkDone = async (clientId: string, clientName: string) => {
    try {
      await markClientAsDone(salon.id, clientId);
      toast.success(`${clientName} terminé !`);
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleRemove = async (clientId: string, clientName: string) => {
    if (!confirm(`Supprimer ${clientName} de la file ?`)) return;
    
    try {
      await removeClient(salon.id, clientId);
      toast.success('Client retiré');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleClearCompleted = async () => {
    if (!confirm('Supprimer tous les clients terminés ?')) return;
    
    try {
      await clearCompletedClients(salon.id);
      toast.success('Clients terminés supprimés');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const getEstimatedWaitTime = (position: number) => {
    if (position <= 1) return 0;
    let totalTime = 0;
    for (let i = 0; i < position - 1; i++) {
      if (waitingClients[i]) {
        totalTime += waitingClients[i].serviceDuration;
      }
    }
    return totalTime;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour au dashboard</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              {salon.name}
            </h1>
            <p className="text-secondary-600">
              📍 {salon.city} {salon.address && `• ${salon.address}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/${salon.slug}`, '_blank')}
              icon={<ExternalLink className="w-4 h-4" />}
            >
              Voir page publique
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/${salon.slug}/qr`)}
              icon={<QrCode className="w-4 h-4" />}
            >
              QR Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/${salon.slug}/settings`)}
              icon={<Settings className="w-4 h-4" />}
            >
              Paramètres
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Status toggle */}
          <Card hover className="cursor-pointer" onClick={handleToggleStatus}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Statut</p>
                <p className={`text-xl font-bold ${salon.isOpen ? 'text-success' : 'text-error'}`}>
                  {salon.isOpen ? 'Ouvert' : 'Fermé'}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${salon.isOpen ? 'bg-success/10' : 'bg-error/10'}`}>
                {salon.isOpen ? (
                  <ToggleRight className="w-8 h-8 text-success" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-error" />
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">En attente</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {stats.totalWaiting}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-xl">
                <Users className="w-8 h-8 text-primary-500" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Temps estimé</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {formatWaitTime(stats.estimatedWaitTime)}
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl">
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Aujourd&apos;hui</p>
                <p className="text-3xl font-bold text-secondary-900">
                  {clients.length}
                </p>
              </div>
              <div className="p-3 bg-info/10 rounded-xl">
                <TrendingUp className="w-8 h-8 text-info" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-5 h-5" />}
            className="flex-1 sm:flex-initial"
          >
            Ajouter un client
          </Button>
          
          {doneClients.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCompleted}
              icon={<Trash2 className="w-5 h-5" />}
              className="flex-1 sm:flex-initial"
            >
              Nettoyer ({doneClients.length} terminés)
            </Button>
          )}
        </div>

        {/* Queue */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Waiting clients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-secondary-900">
                File d&apos;attente ({waitingClients.length})
              </h2>
            </div>

            {waitingClients.length === 0 ? (
              <Card className="text-center py-12">
                <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600 mb-4">
                  Aucun client en attente
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Ajouter le premier client
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {waitingClients.map((client) => (
                  <QueueClient
                    key={client.id}
                    client={client}
                    onMarkDone={() => handleMarkDone(client.id, client.name)}
                    onRemove={() => handleRemove(client.id, client.name)}
                    estimatedWaitTime={getEstimatedWaitTime(client.position || 0)}
                    isFirst={client.position === 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed clients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-secondary-900">
                Terminés ({doneClients.length})
              </h2>
            </div>

            {doneClients.length === 0 ? (
              <Card className="text-center py-12">
                <Clock className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">
                  Aucun client terminé pour le moment
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {doneClients.map((client) => (
                  <QueueClient
                    key={client.id}
                    client={client}
                    onMarkDone={() => {}}
                    onRemove={() => handleRemove(client.id, client.name)}
                    estimatedWaitTime={0}
                    isFirst={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add client modal */}
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddClient}
        services={salon.services}
      />
    </div>
  );
}