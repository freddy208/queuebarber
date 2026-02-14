'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, gradient = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-6 shadow-soft
        ${hover ? 'hover:shadow-medium transition-shadow duration-300' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-primary-50' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}