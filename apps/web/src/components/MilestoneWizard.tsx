/**
 * MilestoneWizard - Guided recording for life milestones
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby, 
  GraduationCap, 
  Heart, 
  Briefcase, 
  Home,
  Plane,
  HeartCrack,
  Star,
  ChevronRight,
  ChevronLeft,
  Check,
  Mic,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// TYPES
// ============================================================

export interface MilestoneType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  prompts: string[];
  suggestedDuration: number; // minutes
}

export interface MilestoneData {
  type: MilestoneType;
  date: Date;
  datePrecision: 'exact' | 'month' | 'year' | 'approximate';
  location?: string;
  people?: string[];
  notes?: string;
}

// ============================================================
// MILESTONE DEFINITIONS
// ============================================================

export const MILESTONE_TYPES: MilestoneType[] = [
  {
    id: 'birth',
    name: 'Birth',
    icon: <Baby className="w-6 h-6" />,
    color: '#f472b6',
    description: 'The arrival of a new life',
    suggestedDuration: 10,
    prompts: [
      "Describe the day this person was born",
      "What were your first thoughts and feelings?",
      "Who was there to welcome them?",
      "What were the circumstances around the birth?",
      "What name did you choose and why?",
    ],
  },
  {
    id: 'graduation',
    name: 'Graduation',
    icon: <GraduationCap className="w-6 h-6" />,
    color: '#3b82f6',
    description: 'Completing an educational milestone',
    suggestedDuration: 8,
    prompts: [
      "What did you graduate from?",
      "How did it feel to reach this achievement?",
      "What challenges did you overcome to get here?",
      "Who supported you through this journey?",
      "What doors did this open for you?",
    ],
  },
  {
    id: 'marriage',
    name: 'Marriage / Commitment',
    icon: <Heart className="w-6 h-6" />,
    color: '#ef4444',
    description: 'Joining your life with another',
    suggestedDuration: 15,
    prompts: [
      "How did you meet your partner?",
      "Describe the day of your wedding/commitment",
      "What made you choose each other?",
      "What do you love most about your partner?",
      "What hopes do you have for your life together?",
    ],
  },
  {
    id: 'career',
    name: 'Career Milestone',
    icon: <Briefcase className="w-6 h-6" />,
    color: '#8b5cf6',
    description: 'Job change, promotion, or career shift',
    suggestedDuration: 10,
    prompts: [
      "What was this career change or milestone?",
      "How did this opportunity come about?",
      "What skills or experiences led to this?",
      "How did this change your daily life?",
      "What did this mean for your sense of purpose?",
    ],
  },
  {
    id: 'move',
    name: 'Moving / Relocation',
    icon: <Home className="w-6 h-6" />,
    color: '#10b981',
    description: 'Changing where you call home',
    suggestedDuration: 10,
    prompts: [
      "Where did you move from and to?",
      "What prompted this move?",
      "How did you feel leaving your previous home?",
      "What was the transition like?",
      "How did this move change your life?",
    ],
  },
  {
    id: 'travel',
    name: 'Significant Travel',
    icon: <Plane className="w-6 h-6" />,
    color: '#f59e0b',
    description: 'A journey that changed you',
    suggestedDuration: 12,
    prompts: [
      "Where did you travel to?",
      "What motivated this journey?",
      "What surprised or amazed you?",
      "How did this trip change your perspective?",
      "What memories stand out most?",
    ],
  },
  {
    id: 'loss',
    name: 'Loss',
    icon: <HeartCrack className="w-6 h-6" />,
    color: '#64748b',
    description: 'Processing grief and honoring memory',
    suggestedDuration: 15,
    prompts: [
      "Who or what did you lose?",
      "What did they mean to you?",
      "How did you learn of this loss?",
      "What do you want to remember about them?",
      "How has this loss shaped who you are?",
    ],
  },
  {
    id: 'achievement',
    name: 'Personal Achievement',
    icon: <Star className="w-6 h-6" />,
    color: '#fbbf24',
    description: 'A goal reached or dream realized',
    suggestedDuration: 8,
    prompts: [
      "What did you achieve?",
      "How long had you been working toward this?",
      "What obstacles did you overcome?",
      "How did it feel when you succeeded?",
      "What does this achievement mean to you?",
    ],
  },
];

// ============================================================
// COMPONENT
// ============================================================

interface MilestoneWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (milestone: MilestoneData) => void;
}

export default function MilestoneWizard({ 
  isOpen, 
  onClose, 
  onComplete 
}: MilestoneWizardProps) {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<MilestoneType | null>(null);
  const [date, setDate] = useState('');
  const [datePrecision, setDatePrecision] = useState<MilestoneData['datePrecision']>('exact');
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState('');

  const handleSelectType = (type: MilestoneType) => {
    setSelectedType(type);
    setStep(1);
  };

  const handleComplete = () => {
    if (!selectedType) return;
    
    onComplete({
      type: selectedType,
      date: new Date(date || Date.now()),
      datePrecision,
      location: location || undefined,
      people: people ? people.split(',').map(p => p.trim()) : undefined,
    });
    
    // Reset state
    setStep(0);
    setSelectedType(null);
    setDate('');
    setLocation('');
    setPeople('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Record a Life Milestone
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center space-x-2 mt-4">
            {['Type', 'Details', 'Record'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < 2 && (
                  <div className={cn(
                    "w-12 h-0.5 mx-2",
                    i < step ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {MILESTONE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type)}
                    className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-white"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.icon}
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm text-center">
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {type.description}
                    </p>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 1 && selectedType && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedType.color }}
                  >
                    {selectedType.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedType.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedType.description}</p>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>When did this happen?</span>
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                    <select
                      value={datePrecision}
                      onChange={(e) => setDatePrecision(e.target.value as MilestoneData['datePrecision'])}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    >
                      <option value="exact">Exact date</option>
                      <option value="month">Month only</option>
                      <option value="year">Year only</option>
                      <option value="approximate">Approximate</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Where did this happen? (optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                {/* People */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="w-4 h-4" />
                    <span>Who was involved? (optional)</span>
                  </label>
                  <input
                    type="text"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    placeholder="e.g., Mom, Dad, Sarah (comma separated)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && selectedType && (
              <motion.div
                key="record"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Ready to Record
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                    Take your time. There's no rush. Consider these prompts:
                  </p>
                  
                  <div className="text-left max-w-md mx-auto space-y-3">
                    {selectedType.prompts.map((prompt, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-blue-500 font-medium">{i + 1}.</span>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{prompt}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 mt-6">
                    Suggested duration: ~{selectedType.suggestedDuration} minutes
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>
            ) : (
              <div />
            )}
            
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
            
            {step === 2 && (
              <button
                onClick={handleComplete}
                className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
