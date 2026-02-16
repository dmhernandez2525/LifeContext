/**
 * SearchBar - Global search component with dropdown results
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Mic, 
  FileText, 
  Brain,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import type { SearchResult } from '@/hooks/useSearch';
import type { FuseResultMatch } from 'fuse.js';
import { formatDuration, formatRelativeTime } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  compact?: boolean;
  onResultClick?: (result: SearchResult) => void;
}

export default function SearchBar({ 
  className, 
  compact = false,
  onResultClick 
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const {
    results,
    isSearching,
    isBuilding,
    totalItems,
    buildIndex,
    search,
    clearResults,
  } = useSearch({ limit: 10 });

  // Build index on first focus
  const handleFocus = useCallback(() => {
    setIsOpen(true);
    if (totalItems === 0 && !isBuilding) {
      buildIndex();
    }
  }, [totalItems, isBuilding, buildIndex]);

  // Handle input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim()) {
        search(inputValue);
      } else {
        clearResults();
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [inputValue, search, clearResults]);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    } else {
      // Default navigation based on type
      switch (result.type) {
        case 'recording':
          navigate('/app/questions');
          break;
        case 'journal':
          navigate('/app/journal');
          break;
        case 'brain-dump':
          navigate('/app/brain-dump');
          break;
      }
    }
    setIsOpen(false);
    setInputValue('');
    clearResults();
  };

  // Get icon for result type
  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'recording':
        return <Mic className="w-4 h-4 text-blue-500" />;
      case 'journal':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'brain-dump':
        return <Brain className="w-4 h-4 text-purple-500" />;
    }
  };

  // Highlight matched text
  const highlightMatch = (text: string, matches?: readonly FuseResultMatch[]) => {
    if (!matches || matches.length === 0 || !text) return text;
    
    const contentMatch = matches.find(m => m.key === 'content');
    if (!contentMatch || !contentMatch.indices.length) {
      // Truncate if too long
      return text.length > 100 ? text.slice(0, 100) + '...' : text;
    }

    // Get the first match
    const [start, end] = contentMatch.indices[0];
    const contextStart = Math.max(0, start - 30);
    const contextEnd = Math.min(text.length, end + 70);
    
    const before = text.slice(contextStart, start);
    const match = text.slice(start, end + 1);
    const after = text.slice(end + 1, contextEnd);
    
    return (
      <>
        {contextStart > 0 && '...'}
        {before}
        <mark className="bg-yellow-200 dark:bg-yellow-800 text-inherit rounded px-0.5">
          {match}
        </mark>
        {after}
        {contextEnd < text.length && '...'}
      </>
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)} data-help-search="global">
      <div className={cn(
        "relative flex items-center",
        compact ? "w-40 md:w-64" : "w-full"
      )}>
        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search..."
          className={cn(
            "w-full pl-9 pr-16 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            compact ? "text-sm" : ""
          )}
        />
        {inputValue ? (
          <button
            onClick={() => {
              setInputValue('');
              clearResults();
            }}
            className="absolute right-10 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
        <kbd className="absolute right-3 px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {isOpen && (inputValue || isBuilding) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {isBuilding ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                <span className="text-gray-500">Building search index...</span>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                <span className="text-gray-500">Searching...</span>
              </div>
            ) : results.length === 0 && inputValue ? (
              <div className="py-8 text-center text-gray-500">
                No results found for "{inputValue}"
              </div>
            ) : (
              <div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="mt-1">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {highlightMatch(result.content, result.matches)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(new Date(result.date))}</span>
                        {result.duration && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(result.duration)}</span>
                          </>
                        )}
                        {result.categoryName && (
                          <>
                            <span>•</span>
                            <span>{result.categoryName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
