'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white text-secondary-700 border-2 border-secondary-200 hover:border-primary-500 hover:text-primary-500 hover:shadow-soft',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'bg-transparent text-secondary-700 hover:bg-secondary-100',
    danger: 'bg-gradient-to-r from-error to-red-600 text-white shadow-soft hover:shadow-medium hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}