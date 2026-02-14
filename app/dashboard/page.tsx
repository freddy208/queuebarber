/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSalons } from '@/hooks/useSalon';
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
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { salons, loading } = useSalons(user?.uid);
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary-600">Chargement de vos salons...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-secondary-600">
            Gérez vos salons et suivez vos performances en temps réel
          </p>
        </div>

        {/* Stats cards */}
        {salons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Store}
              label="Salons actifs"
              value={salons.length}
              color="primary"
            />
            <StatsCard
              icon={Users}
              label="Clients aujourd'hui"
              value="24"
              trend="+12%"
              color="success"
            />
            <StatsCard
              icon={Clock}
              label="Temps d'attente moyen"
              value="25min"
              trend="-5min"
              color="warning"
            />
            <StatsCard
              icon={TrendingUp}
              label="Satisfaction"
              value="94%"
              trend="+3%"
              color="info"
            />
          </div>
        )}

        {/* Salons list */}
        {salons.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                Mes salons ({salons.length})
              </h2>
              <Button
                onClick={() => router.push('/dashboard/create-salon')}
                icon={<Plus className="w-5 h-5" />}
              >
                Nouveau salon
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

// Stats Card Component
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
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-secondary-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-secondary-900 mb-2">{value}</p>
          {trend && (
            <p className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-success' : 'text-error'}`}>
              {trend} vs hier
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}

// Salon Card Component
function SalonCard({ salon }: { salon: any }) {
  const router = useRouter();

  return (
    <Card hover className="group cursor-pointer" onClick={() => router.push(`/dashboard/${salon.slug}`)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-500 transition-colors">
              {salon.name}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              salon.isOpen 
                ? 'bg-success/10 text-success' 
                : 'bg-error/10 text-error'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${salon.isOpen ? 'bg-success' : 'bg-error'} ${salon.isOpen ? 'animate-pulse' : ''}`}></div>
              {salon.isOpen ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
          <p className="text-sm text-secondary-600 mb-1">
            📍 {salon.city}
          </p>
          <p className="text-sm text-secondary-600">
            📞 {salon.phone}
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-secondary-500 mb-2">SERVICES</p>
        <div className="flex flex-wrap gap-2">
          {salon.services?.slice(0, 3).map((service: any, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
            >
              {service.name} • {service.duration}min
            </span>
          ))}
          {salon.services?.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 bg-secondary-100 text-secondary-600 rounded-md text-xs font-medium">
              +{salon.services.length - 3} autres
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-secondary-200">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/${salon.slug}`);
          }}
        >
          <Users className="w-4 h-4" />
          Gérer la file
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/${salon.slug}`, '_blank');
          }}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/${salon.slug}/qr`);
          }}
        >
          <QrCode className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/${salon.slug}/settings`);
          }}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

// Empty State Component
function EmptyState() {
  const router = useRouter();

  return (
    <Card className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Store className="w-10 h-10 text-primary-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-secondary-900 mb-3">
          Créez votre premier salon
        </h2>
        
        <p className="text-secondary-600 mb-8 leading-relaxed">
          Commencez à gérer votre file d&apos;attente en quelques clics.
          Installation en 2 minutes, QR code généré automatiquement.
        </p>

        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => router.push('/dashboard/create-salon')}
            icon={<Plus className="w-5 h-5" />}
          >
            Créer mon premier salon
          </Button>
          
          <div className="flex items-center justify-center gap-6 text-sm text-secondary-500 pt-4">
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