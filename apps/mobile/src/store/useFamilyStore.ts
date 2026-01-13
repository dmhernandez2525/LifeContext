import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FamilyMember, SharedItemWrapper, PrivacyLevel, FamilyInvitation } from '@lcc/types';
import { storage } from '../lib/storage';

interface FamilyState {
  members: FamilyMember[];
  sharedFeed: SharedItemWrapper[];
  invitations: FamilyInvitation[];
  
  // Actions
  addMember: (member: FamilyMember) => void;
  removeMember: (id: string) => void;
  updateMemberStatus: (id: string, status: FamilyMember['status']) => void;
  addToFeed: (item: SharedItemWrapper) => void;
  
  // Demo / Dev
  seedDemoFamily: () => void;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      members: [],
      sharedFeed: [],
      invitations: [],

      addMember: (member) => 
        set((state) => ({ members: [...state.members, member] })),

      removeMember: (id) => 
        set((state) => ({ members: state.members.filter((m) => m.id !== id) })),

      updateMemberStatus: (id, status) =>
        set((state) => ({
          members: state.members.map((m) => 
            m.id === id ? { ...m, status } : m
          ),
        })),

      addToFeed: (item) =>
        set((state) => ({
          sharedFeed: [item, ...state.sharedFeed].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ),
        })),

      seedDemoFamily: () => {
        const demoMembers: FamilyMember[] = [
          {
            id: 'demo-1',
            name: 'Sarah (Partner)',
            relationship: 'Partner',
            status: 'active',
            joinedAt: new Date(),
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          },
          {
            id: 'demo-2',
            name: 'Mom',
            relationship: 'Parent',
            status: 'active',
            joinedAt: new Date(),
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mom',
          }
        ];

        const demoFeed: SharedItemWrapper[] = [
          {
            id: 'share-1',
            type: 'question_answer',
            authorId: 'demo-1',
            authorName: 'Sarah',
            content: 'I remember when we first met at that coffee shop...',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            privacyLevel: PrivacyLevel.FAMILY,
            reactions: [],
          },
          {
            id: 'share-2',
            type: 'life_chapter',
            authorId: 'demo-2',
            authorName: 'Mom',
            content: 'My college years were focused on discovery...',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            privacyLevel: PrivacyLevel.FAMILY,
            reactions: [],
          }
        ];

        set({ members: demoMembers, sharedFeed: demoFeed });
      },
    }),
    {
      name: 'family-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.getString(name) || null,
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.delete(name),
      })),
    }
  )
);
