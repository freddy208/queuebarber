'use client';

import Link from 'next/link';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
        <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl transform group-hover:scale-110 transition-transform">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
      </div>
      <span className={`font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent ${sizes[size]}`}>
        QueueBarber
      </span>
    </Link>
  );
}