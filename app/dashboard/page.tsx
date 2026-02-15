/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSalons } from '@/hooks/useSalon';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { 
  Plus, 
  Store, 
  Users, 
  Clock, 
  TrendingUp,
  ExternalLink,
  Settings,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatWaitTime } from '@/lib/utils';

// Hook personnalisé pour les statistiques globales
function useDashboardStats(ownerId?: string) {
  const [stats, setStats] = useState({
    totalClientsToday: 0,
    avgWaitTime: 0,
    satisfactionRate: 0,
    loading: true
  });

  useEffect(() => {
    if (!ownerId) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    // Récupérer tous les salons de l'utilisateur
    const salonsQuery = query(collection(db, 'salons'), where('ownerId', '==', ownerId));
    
    const unsubscribe = onSnapshot(salonsQuery, async (salonsSnapshot) => {
      const salonIds = salonsSnapshot.docs.map(doc => doc.id);
      
      if (salonIds.length === 0) {
        setStats({ totalClientsToday: 0, avgWaitTime: 0, satisfactionRate: 0, loading: false });
        return;
      }

      // Calculer les stats pour aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let totalClients = 0;
      let totalWaitTime = 0;
      let totalServed = 0;
      let satisfiedClients = 0;

      // Pour chaque salon, récupérer les clients d'aujourd'hui
      for (const salonId of salonIds) {
        const queueQuery = query(
          collection(db, 'salons', salonId, 'queue'),
          where('joinedAt', '>=', today)
        );
        
        try {
          const queueSnapshot = await getDocs(queueQuery);
          
          queueSnapshot.docs.forEach(doc => {
            const client = doc.data();
            totalClients++;
            
            if (client.status === 'done') {
              totalServed++;
              // Considérer comme satisfait si pas de plainte et temps raisonnable
              if (client.serviceDuration && client.serviceDuration < 60) {
                satisfiedClients++;
              }
            }
            
            if (client.estimatedWaitTime) {
              totalWaitTime += client.estimatedWaitTime;
            }
          });
        } catch (error) {
          console.error(`Erreur récupération queue pour salon ${salonId}:`, error);
        }
      }

      const avgWait = totalClients > 0 ? Math.round(totalWaitTime / totalClients) : 0;
      const satisfaction = totalServed > 0 ? Math.round((satisfiedClients / totalServed) * 100) : 0;

      setStats({
        totalClientsToday: totalClients,
        avgWaitTime: avgWait,
        satisfactionRate: satisfaction,
        loading: false
      });
    });

    return () => unsubscribe();
  }, [ownerId]);

  return stats;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { salons, loading: salonsLoading } = useSalons(user?.uid);
  const stats = useDashboardStats(user?.uid);
  const router = useRouter();

  if (salonsLoading || stats.loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <p className="text-secondary-600 text-sm sm:text-base">Chargement de vos salons...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome section - Mobile optimized */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 mb-1 sm:mb-2">
            Tableau de bord
          </h1>
          <p className="text-xs sm:text-base text-secondary-600">
            Gérez vos salons et suivez vos performances en temps réel
          </p>
        </div>

        {/* Stats cards - DONNÉES DYNAMIQUES RÉELLES */}
        {salons.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
            <StatsCard
              icon={Store}
              label="Salons actifs"
              value={salons.length}
              color="primary"
            />
            <StatsCard
              icon={Users}
              label="Clients aujourd'hui"
              value={stats.totalClientsToday}
              trend={stats.totalClientsToday > 0 ? `+${stats.totalClientsToday}` : '0'}
              color="success"
            />
            <StatsCard
              icon={Clock}
              label="Temps d'attente moyen"
              value={formatWaitTime(stats.avgWaitTime)}
              trend={stats.avgWaitTime > 0 ? `${stats.avgWaitTime}min` : '-'}
              color="warning"
            />
            <StatsCard
              icon={TrendingUp}
              label="Satisfaction"
              value={`${stats.satisfactionRate}%`}
              trend={stats.satisfactionRate > 80 ? 'Excellent' : stats.satisfactionRate > 50 ? 'Bon' : 'À améliorer'}
              color="info"
            />
          </div>
        )}

        {/* Salons list */}
        {salons.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-secondary-900">
                Mes salons ({salons.length})
              </h2>
              <Button
                onClick={() => router.push('/dashboard/create-salon')}
                icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                size="sm"
                className="w-full sm:w-auto text-sm"
              >
                Nouveau salon
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {salons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Stats Card Component - Mobile optimized
function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color = 'primary' 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  trend?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
}) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-500',
    success: 'bg-green-100 text-success',
    warning: 'bg-yellow-100 text-warning',
    info: 'bg-blue-100 text-info',
  };

  return (
    <Card hover className="group p-3 sm:p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1 truncate">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 mb-0.5 sm:mb-2">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm font-semibold ${color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-info'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
      </div>
    </Card>
  );
}

// Salon Card avec stats en temps réel
function SalonCard({ salon }: { salon: any }) {
  const router = useRouter();
  const [liveStats, setLiveStats] = useState({
    waiting: 0,
    todayTotal: 0
  });

  // Écoute temps réel de la file d'attente
  useEffect(() => {
    if (!salon.id) return;

    const queueQuery = query(collection(db, 'salons', salon.id, 'queue'));
    
    const unsubscribe = onSnapshot(queueQuery, (snapshot) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let waiting = 0;
      let todayTotal = 0;

      snapshot.docs.forEach(doc => {
        const client = doc.data();
        
        // Compter les clients en attente
        if (client.status === 'waiting') {
          waiting++;
        }
        
        // Compter les clients d'aujourd'hui
        if (client.joinedAt?.toDate() >= today) {
          todayTotal++;
        }
      });

      setLiveStats({ waiting, todayTotal });
    });

    return () => unsubscribe();
  }, [salon.id]);

  return (
    <Card hover className="group cursor-pointer p-3 sm:p-4" onClick={() => router.push(`/dashboard/${salon.slug}`)}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <h3 className="text-base sm:text-xl font-bold text-secondary-900 group-hover:text-primary-500 transition-colors truncate">
              {salon.name}
            </h3>
            <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
              salon.isOpen 
                ? 'bg-success/10 text-success' 
                : 'bg-error/10 text-error'
            }`}>
              <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${salon.isOpen ? 'bg-success' : 'bg-error'} ${salon.isOpen ? 'animate-pulse' : ''}`}></div>
              <span className="hidden sm:inline">{salon.isOpen ? 'Ouvert' : 'Fermé'}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-secondary-600 mb-0.5 sm:mb-1 truncate">
            📍 {salon.city}
          </p>
          <p className="text-xs sm:text-sm text-secondary-600 truncate">
            📞 {salon.phone}
          </p>
        </div>
      </div>

      {/* Stats en temps réel du salon */}
      <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
        <div className="bg-primary-50 rounded-lg p-2 text-center">
          <p className="text-xs text-secondary-600">En attente</p>
          <p className="text-lg font-bold text-primary-600">{liveStats.waiting}</p>
        </div>
        <div className="bg-secondary-50 rounded-lg p-2 text-center">
          <p className="text-xs text-secondary-600">Aujourd&apos;hui</p>
          <p className="text-lg font-bold text-secondary-700">{liveStats.todayTotal}</p>
        </div>
      </div>

      {/* Services - Mobile optimized */}
      <div className="mb-3 sm:mb-4">
        <p className="text-xs font-semibold text-secondary-500 mb-1 sm:mb-2">SERVICES</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {salon.services?.slice(0, 2).map((service: any, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
            >
              {service.name} <span className="hidden sm:inline">• {service.duration}min</span>
            </span>
          ))}
          {salon.services?.length > 2 && (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary-100 text-secondary-600 rounded-md text-xs font-medium">
              +{salon.services.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Actions - Mobile optimized */}
      <div className="flex gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-secondary-200">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/${salon.slug}`);
          }}
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Gérer la file</span>
          <span className="sm:hidden">File</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 sm:px-3"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/${salon.slug}`, '_blank');
          }}
        >
          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 sm:px-3"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/${salon.slug}/qr`);
          }}
        >
          <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 sm:px-3"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/${salon.slug}/settings`);
          }}
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </Card>
  );
}

// Empty State Component - Mobile optimized
function EmptyState() {
  const router = useRouter();

  return (
    <Card className="text-center py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-sm sm:max-w-md mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Store className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500" />
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2 sm:mb-3">
          Créez votre premier salon
        </h2>
        
        <p className="text-sm sm:text-base text-secondary-600 mb-6 sm:mb-8 leading-relaxed">
          Commencez à gérer votre file d&apos;attente en quelques clics.
          Installation en 2 minutes, QR code généré automatiquement.
        </p>

        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => router.push('/dashboard/create-salon')}
            icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Créer mon premier salon
          </Button>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-secondary-500 pt-2 sm:pt-4">
            <span className="flex items-center gap-1">
              ✓ Installation rapide
            </span>
            <span className="flex items-center gap-1">
              ✓ QR code auto
            </span>
            <span className="flex items-center gap-1">
              ✓ Support 24/7
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}