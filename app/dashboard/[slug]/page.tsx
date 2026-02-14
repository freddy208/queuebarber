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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-16">
          <Card className="text-center p-6 sm:p-8">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-error mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
              Salon introuvable
            </h2>
            <p className="text-secondary-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Ce salon n&apos;existe pas ou a été supprimé
            </p>
            <Link href="/dashboard">
              <Button size="sm" className="sm:text-base">Retour au dashboard</Button>
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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Back button - Mobile optimized */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-500 mb-4 sm:mb-6 transition-colors group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour au dashboard</span>
          <span className="sm:hidden">Retour</span>
        </Link>

        {/* Header - Mobile optimized */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
              {salon.name}
            </h1>
            <p className="text-xs sm:text-base text-secondary-600">
              📍 {salon.city} {salon.address && `• ${salon.address}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/${salon.slug}`, '_blank')}
              icon={<ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              className="text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">Voir page publique</span>
              <span className="sm:hidden">Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/${salon.slug}/qr`)}
              icon={<QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              className="text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              QR
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/${salon.slug}/settings`)}
              icon={<Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              className="text-xs sm:text-sm flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">Paramètres</span>
              <span className="sm:hidden">Params</span>
            </Button>
          </div>
        </div>

        {/* Stats cards - Mobile: 2 cols, Tablet: 2 cols, Desktop: 4 cols */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
          {/* Status toggle */}
          <Card hover className="cursor-pointer p-3 sm:p-4" onClick={handleToggleStatus}>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1">Statut</p>
                <p className={`text-base sm:text-xl font-bold ${salon.isOpen ? 'text-success' : 'text-error'}`}>
                  {salon.isOpen ? 'Ouvert' : 'Fermé'}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${salon.isOpen ? 'bg-success/10' : 'bg-error/10'}`}>
                {salon.isOpen ? (
                  <ToggleRight className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
                ) : (
                  <ToggleLeft className="w-6 h-6 sm:w-8 sm:h-8 text-error" />
                )}
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1">En attente</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900">
                  {stats.totalWaiting}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-primary-100 rounded-lg sm:rounded-xl">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1 truncate">Temps estimé</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900">
                  {formatWaitTime(stats.estimatedWaitTime)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-warning/10 rounded-lg sm:rounded-xl">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-warning" />
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1">Aujourd&apos;hui</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900">
                  {clients.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-info/10 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-info" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actions - Mobile optimized */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-8">
          <Button
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="flex-1 sm:flex-initial text-sm sm:text-base"
          >
            Ajouter un client
          </Button>
          
          {doneClients.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearCompleted}
              icon={<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              className="flex-1 sm:flex-initial text-sm sm:text-base"
            >
              Nettoyer ({doneClients.length})
            </Button>
          )}
        </div>

        {/* Queue - Mobile: 1 col, Desktop: 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Waiting clients */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-secondary-900">
                File d&apos;attente ({waitingClients.length})
              </h2>
            </div>

            {waitingClients.length === 0 ? (
              <Card className="text-center py-8 sm:py-12 px-4">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-secondary-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-secondary-600 mb-3 sm:mb-4 text-sm sm:text-base">
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
              <div className="space-y-2 sm:space-y-4">
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
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-base sm:text-xl font-bold text-secondary-900">
                Terminés ({doneClients.length})
              </h2>
            </div>

            {doneClients.length === 0 ? (
              <Card className="text-center py-8 sm:py-12 px-4">
                <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-secondary-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-secondary-600 text-sm sm:text-base">
                  Aucun client terminé pour le moment
                </p>
              </Card>
            ) : (
              <div className="space-y-2 sm:space-y-4">
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