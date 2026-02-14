/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import Button from './Button';
import { LogOut, User, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getGreeting } from '@/lib/utils';
import { useState } from 'react';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      router.push('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="sm" />

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-secondary-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 p-2 hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-secondary-900">
                    {getGreeting()}
                  </p>
                  <p className="text-xs text-secondary-600">{user?.email}</p>
                </div>
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-secondary-200 py-2 animate-fadeIn">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      router.push('/profile');
                    }}
                    className="w-full px-4 py-2 text-left text-secondary-700 hover:bg-secondary-50 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Mon profil
                  </button>
                  <div className="border-t border-secondary-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-error hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}