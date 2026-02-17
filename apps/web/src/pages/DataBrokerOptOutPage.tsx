/**
 * DataBrokerOptOutPage - Guided data broker opt-out tool with progress tracking.
 */
import { useState, useMemo } from 'react';
import { ShieldOff, Filter } from 'lucide-react';
import { DATA_BROKERS, getAllBrokerCategories, CATEGORY_LABELS, type BrokerCategory } from '@/data/data-brokers';
import { useDataReclamationStore } from '@/store/data-reclamation-store';
import { BrokerCard, OptOutProgress } from '@/components/data-brokers';
import { cn } from '@/lib/utils';

type FilterMode = 'all' | BrokerCategory;
type SortMode = 'difficulty' | 'name' | 'category';

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 };

export default function DataBrokerOptOutPage() {
  const [filter, setFilter] = useState<FilterMode>('all');
  const [sort, setSort] = useState<SortMode>('difficulty');

  const { brokerOptOuts, markBrokerOptOut } = useDataReclamationStore();

  const categories = getAllBrokerCategories();

  const filteredBrokers = useMemo(() => {
    let brokers = filter === 'all' ? DATA_BROKERS : DATA_BROKERS.filter(b => b.category === filter);

    const sortFns: Record<SortMode, (a: typeof brokers[0], b: typeof brokers[0]) => number> = {
      difficulty: (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
      name: (a, b) => a.name.localeCompare(b.name),
      category: (a, b) => a.category.localeCompare(b.category),
    };

    return [...brokers].sort(sortFns[sort]);
  }, [filter, sort]);

  const easyCount = DATA_BROKERS.filter(b => b.difficulty === 'easy').length;
  const mediumCount = DATA_BROKERS.filter(b => b.difficulty === 'medium').length;
  const hardCount = DATA_BROKERS.filter(b => b.difficulty === 'hard').length;

  return (
    <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ShieldOff className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Broker Opt-Out</h1>
            <p className="text-gray-600 dark:text-gray-400">Remove your personal information from data broker databases.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left sidebar: progress + filters */}
        <div className="lg:col-span-1 space-y-6">
          <OptOutProgress
            totalBrokers={DATA_BROKERS.length}
            optedOutCount={brokerOptOuts.length}
            easyCount={easyCount}
            mediumCount={mediumCount}
            hardCount={hardCount}
          />

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  filter === 'all' ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                All Brokers ({DATA_BROKERS.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    filter === cat ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {CATEGORY_LABELS[cat]} ({DATA_BROKERS.filter(b => b.category === cat).length})
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Sort by</h4>
              <div className="flex gap-1.5">
                {([['difficulty', 'Difficulty'], ['name', 'Name'], ['category', 'Category']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setSort(val)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                      sort === val ? "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: broker list */}
        <div className="lg:col-span-2 space-y-4">
          {filteredBrokers.map(broker => (
            <BrokerCard
              key={broker.name}
              broker={broker}
              isOptedOut={brokerOptOuts.includes(broker.name)}
              onMarkOptedOut={markBrokerOptOut}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
