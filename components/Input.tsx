'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 
              ${icon ? 'pl-10' : ''}
              border-2 border-secondary-300 rounded-lg
              focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100
              transition-all duration-200
              disabled:bg-secondary-100 disabled:cursor-not-allowed
              ${error ? 'border-error focus:border-error focus:ring-red-100' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-error animate-fadeIn">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;