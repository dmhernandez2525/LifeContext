import React, { useEffect, useState } from 'react';
import { Users, Plus, Sparkles } from 'lucide-react';
import { useFamilyStore } from '@/store/family-store';
import { InviteModal, SharedFeedItem } from '@/components/family/FamilyComponents';

export default function FamilyPage() {
  const { members, sharedFeed, seedDemoFamily } = useFamilyStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    // Auto-seed for demo if empty (optional)
    if (members.length === 0 && sharedFeed.length === 0) {
      // seedDemoFamily();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Family Circle
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share journals and life chapters with your trusted circle
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Members */}
        <div className="lg:col-span-1 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Members
              </h2>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                {members.length}
              </span>
            </div>

            {members.length === 0 ? (
              <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Start your circle
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Invite your partner or close family securely.
                </p>
                <button
                  onClick={seedDemoFamily}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Seed Demo Data</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 overflow-hidden">
                       {member.avatar ? (
                         <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                       ) : (
                         <Users className="w-5 h-5 text-gray-400" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {member.relationship}
                      </p>
                    </div>
                    {member.status === 'pending' && (
                       <span className="text-[10px] font-medium px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded ml-2">
                         Pending
                       </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Feed */}
        <div className="lg:col-span-2">
           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
             Shared Timeline
           </h2>
           
           {sharedFeed.length === 0 ? (
             <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
               <p className="text-gray-400 dark:text-gray-500">
                 No shared updates yet.
               </p>
             </div>
           ) : (
             <div className="space-y-4">
               {sharedFeed.map((item) => (
                 <SharedFeedItem key={item.id} item={item} />
               ))}
             </div>
           )}
        </div>
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
