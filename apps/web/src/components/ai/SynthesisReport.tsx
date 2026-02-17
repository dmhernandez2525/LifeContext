/**
 * SynthesisReport - Renders a life summary report with sections.
 */
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { LifeSummary, SummarySection } from '@/lib/contextSynthesis';
import { PERIOD_LABELS } from '@/lib/contextSynthesis';

interface SynthesisReportProps {
  summary: LifeSummary;
}

export function SynthesisReport({ summary }: SynthesisReportProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          {PERIOD_LABELS[summary.period]} Report
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          {summary.startDate} to {summary.endDate}
        </div>
      </div>

      {summary.sections.map((section, idx) => (
        <SectionCard key={idx} section={section} />
      ))}

      <p className="text-xs text-gray-400 text-center">
        Generated {new Date(summary.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

function SectionCard({ section }: { section: SummarySection }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{section.icon}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{section.title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">{section.content}</p>
          {section.highlights.length > 0 && (
            <ul className="space-y-1">
              {section.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-indigo-500 mt-0.5">&#8226;</span>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
