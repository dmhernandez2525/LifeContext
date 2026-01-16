import React from 'react';
import QRCode from 'react-qr-code';
import { X, Copy, Check, Users, BookOpen, Quote, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SharedItemWrapper } from '@lcc/types';
import { formatDistanceToNow } from 'date-fns';

// ==========================================
// INVITE MODAL
// ==========================================

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode?: string;
}

export const InviteModal = ({ isOpen, onClose, inviteCode = 'LCC-FAMILY-X7K9-2026' }: InviteModalProps) => {
  const [copied, setCopied] = React.useState(false);
  const inviteLink = `https://lifecontext.app/join/family/${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Family</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add trusted members to your circle</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50">
            <div className="p-4 bg-white rounded-xl shadow-sm mb-6">
              <QRCode value={inviteLink} size={180} />
            </div>
            <div className="text-2xl font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              {inviteCode}
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Scan with mobile camera to join
            </p>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-3">
              <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl text-sm text-gray-600 dark:text-gray-300 font-mono truncate border border-gray-200 dark:border-gray-700">
                {inviteLink}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors min-w-[100px]"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500">
              Members will only see content you explicitly mark as "Family" or "Trusted".
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// SHARED FEED ITEM
// ==========================================

export const SharedFeedItem = ({ item }: { item: SharedItemWrapper }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'journal': return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'life_chapter': return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'question_answer': return <Quote className="w-4 h-4 text-amber-500" />;
      default: return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLabel = () => {
    switch (item.type) {
      case 'journal': return 'Shared a Journal Entry';
      case 'life_chapter': return 'Added a Life Chapter';
      case 'question_answer': return 'Answered a Question';
      default: return 'Shared an item';
    }
  };

  const borderColor = item.type === 'journal' ? 'border-indigo-100 dark:border-indigo-900/30' :
                      item.type === 'life_chapter' ? 'border-emerald-100 dark:border-emerald-900/30' :
                      'border-amber-100 dark:border-amber-900/30';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border mb-4 overflow-hidden ${borderColor}`}
    >
      <div className="flex items-center p-4 pb-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 mr-3 flex items-center justify-center">
            <Users className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {item.authorName}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {getIcon()}
            <span>{getLabel()}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {item.content}
        </p>
      </div>

      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50">
        <span className="text-xs text-gray-400 font-medium">
          Visible to Family
        </span>
      </div>
    </motion.div>
  );
};
