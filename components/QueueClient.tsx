'use client';

import { Client } from '@/types';
import Card from './Card';
import Button from './Button';
import { Clock, CheckCircle2, Trash2, User } from 'lucide-react';
import { formatWaitTime } from '@/lib/utils';

interface QueueClientProps {
  client: Client;
  onMarkDone: () => void;
  onRemove: () => void;
  estimatedWaitTime: number;
  isFirst: boolean;
}

export default function QueueClient({ 
  client, 
  onMarkDone, 
  onRemove, 
  estimatedWaitTime,
  isFirst 
}: QueueClientProps) {
  const isDone = client.status === 'done';

  return (
    <div className={`
      transition-all duration-300
      ${isFirst ? 'animate-pulse' : ''}
      ${isDone ? 'opacity-50' : ''}
    `}>
      <Card className={`
        relative overflow-hidden
        ${isFirst ? 'ring-2 ring-primary-500 shadow-strong' : ''}
        ${isDone ? 'bg-secondary-50' : ''}
      `}>
        {/* Badge "Suivant" */}
        {isFirst && !isDone && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-bl-lg text-xs font-bold">
            🔥 SUIVANT
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          {/* Left side - Client info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {/* Avatar */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                ${isDone 
                  ? 'bg-secondary-200 text-secondary-600' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                }
              `}>
                {isDone ? <CheckCircle2 className="w-6 h-6" /> : client.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <h3 className={`text-lg font-bold ${isDone ? 'text-secondary-600 line-through' : 'text-secondary-900'}`}>
                  {client.name}
                </h3>
                <p className="text-sm text-secondary-600 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    ✂️ {client.service}
                  </span>
                  <span className="text-secondary-400">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {client.serviceDuration} min
                  </span>
                </p>
              </div>
            </div>

            {/* Wait time estimation */}
            {!isDone && client.position && client.position > 1 && (
              <div className="mt-3 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-secondary-700">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Temps d&apos;attente estimé: <strong className="text-primary-600">{formatWaitTime(estimatedWaitTime)}</strong>
                </p>
              </div>
            )}

            {/* Position badge */}
            {client.position && !isDone && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-semibold">
                  Position #{client.position}
                </span>
              </div>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col gap-2">
            {!isDone && (
              <Button
                onClick={onMarkDone}
                size="sm"
                className="whitespace-nowrap"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Terminé
              </Button>
            )}
            <Button
              onClick={onRemove}
              size="sm"
              variant="ghost"
              className="text-error hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status badge */}
        {isDone && (
          <div className="mt-3 pt-3 border-t border-secondary-200">
            <span className="inline-flex items-center gap-1 text-sm text-success font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Service terminé
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}