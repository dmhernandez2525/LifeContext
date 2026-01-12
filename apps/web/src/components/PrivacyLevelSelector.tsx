/**
 * PrivacyLevelSelector - Component for selecting privacy levels on recordings/answers
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Users, Heart, Briefcase, Globe, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PrivacyLevel, PRIVACY_LEVEL_LABELS, PRIVACY_LEVEL_COLORS } from '@lcc/types';

interface PrivacyLevelSelectorProps {
  value: PrivacyLevel;
  onChange: (level: PrivacyLevel) => void;
  compact?: boolean;
  disabled?: boolean;
}

const PRIVACY_ICONS = {
  [PrivacyLevel.PRIVATE]: Lock,
  [PrivacyLevel.TRUSTED]: Heart,
  [PrivacyLevel.FAMILY]: Users,
  [PrivacyLevel.FRIENDS]: Users,
  [PrivacyLevel.PROFESSIONAL]: Briefcase,
  [PrivacyLevel.PUBLIC]: Globe,
};

const PRIVACY_DESCRIPTIONS = {
  [PrivacyLevel.PRIVATE]: 'Only you can access',
  [PrivacyLevel.TRUSTED]: 'Close spouse/partner',
  [PrivacyLevel.FAMILY]: 'Extended family members',
  [PrivacyLevel.FRIENDS]: 'Close friends',
  [PrivacyLevel.PROFESSIONAL]: 'Therapists, doctors, coaches',
  [PrivacyLevel.PUBLIC]: 'Anyone with access link',
};

export function PrivacyLevelSelector({ 
  value, 
  onChange, 
  compact = false,
  disabled = false 
}: PrivacyLevelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const color = PRIVACY_LEVEL_COLORS[value];

  if (compact) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
          )}
          style={{ backgroundColor: `${color}20`, color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span>{PRIVACY_LEVEL_LABELS[value]}</span>
          {!disabled && <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
              >
                {Object.values(PrivacyLevel)
                  .filter((v): v is PrivacyLevel => typeof v === 'number')
                  .map((level) => {
                    const LevelIcon = PRIVACY_ICONS[level];
                    const levelColor = PRIVACY_LEVEL_COLORS[level];
                    return (
                      <button
                        key={level}
                        onClick={() => {
                          onChange(level);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center space-x-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                          value === level && "bg-gray-50 dark:bg-gray-700"
                        )}
                      >
                        <LevelIcon className="w-4 h-4" style={{ color: levelColor }} />
                        <span className="text-gray-900 dark:text-white">
                          {PRIVACY_LEVEL_LABELS[level]}
                        </span>
                      </button>
                    );
                  })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Shield className="w-4 h-4" />
        <span>Privacy Level</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.values(PrivacyLevel)
          .filter((v): v is PrivacyLevel => typeof v === 'number')
          .map((level) => {
            const LevelIcon = PRIVACY_ICONS[level];
            const levelColor = PRIVACY_LEVEL_COLORS[level];
            const isSelected = value === level;
            
            return (
              <button
                key={level}
                type="button"
                onClick={() => onChange(level)}
                disabled={disabled}
                className={cn(
                  "flex flex-col items-start p-3 rounded-lg border-2 text-left transition-all",
                  isSelected
                    ? "border-current"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                style={isSelected ? { borderColor: levelColor, backgroundColor: `${levelColor}10` } : {}}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <LevelIcon 
                    className="w-4 h-4" 
                    style={{ color: isSelected ? levelColor : undefined }} 
                  />
                  <span 
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "" : "text-gray-900 dark:text-white"
                    )}
                    style={isSelected ? { color: levelColor } : {}}
                  >
                    {PRIVACY_LEVEL_LABELS[level]}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {PRIVACY_DESCRIPTIONS[level]}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

export default PrivacyLevelSelector;
