/**
 * BrokerCard - Individual data broker card with opt-out instructions.
 */
import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DIFFICULTY_CONFIG, CATEGORY_LABELS, type DataBroker } from '@/data/data-brokers';

interface BrokerCardProps {
  broker: DataBroker;
  isOptedOut: boolean;
  onMarkOptedOut: (brokerName: string) => void;
}

export function BrokerCard({ broker, isOptedOut, onMarkOptedOut }: BrokerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const diffConfig = DIFFICULTY_CONFIG[broker.difficulty];

  return (
    <div className={cn(
      "border rounded-2xl overflow-hidden transition-all",
      isOptedOut
        ? "bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800"
        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
    )}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 text-left">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 dark:text-white">{broker.name}</h3>
              {isOptedOut && <CheckCircle2 className="w-4 h-4 text-green-600" />}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{CATEGORY_LABELS[broker.category]}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", diffConfig.color)}>
              {diffConfig.label}
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {broker.dataTypes.map(type => (
            <span key={type} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
              {type}
            </span>
          ))}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {broker.estimatedTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> {broker.optOutMethod.replace('-', ' ')}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">How to Opt Out:</h4>
            <ol className="space-y-2">
              {broker.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex-shrink-0 w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex gap-3">
            <a
              href={broker.optOutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Open Opt-Out Page
            </a>
            {!isOptedOut && (
              <button
                onClick={(e) => { e.stopPropagation(); onMarkOptedOut(broker.name); }}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Mark Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
