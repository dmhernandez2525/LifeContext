import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrowserHistoryItem {
  url: string;
  title: string;
  visitTime: number; // Unix timestamp
  visitCount: number;
  typedCount: number;
}

export interface GDPRRequest {
  id: string;
  platform: string;
  email: string;
  sentDate: Date;
  status: 'pending' | 'received' | 'parsed' | 'failed';
  receivedDate?: Date;
  dataLocation?: string; // Local file path or blob URL
}

export interface DataBrokerProfile {
  broker: string;
  cost: number;
  purchaseDate: Date;
  data: {
    addresses?: string[];
    phones?: string[];
    emails?: string[];
    relatives?: string[];
    propertyRecords?: Array<{ address: string; owner?: string; value?: number }>;
  };
}

interface DataReclamationState {
  // Browser Data
  browserHistory: BrowserHistoryItem[];
  cookieDomains: string[];
  bookmarks: Array<{ url: string; title: string; folder?: string }>;
  
  // GDPR Requests
  gdprRequests: GDPRRequest[];
  
  // Data Broker
  brokerProfiles: DataBrokerProfile[];
  
  // Actions
  addBrowserHistory: (items: BrowserHistoryItem[]) => void;
  addGDPRRequest: (request: GDPRRequest) => void;
  updateGDPRStatus: (id: string, status: GDPRRequest['status']) => void;
  addBrokerProfile: (profile: DataBrokerProfile) => void;
  clearAllData: () => void;
}

export const useDataReclamationStore = create<DataReclamationState>()(
  persist(
    (set) => ({
      browserHistory: [],
      cookieDomains: [],
      bookmarks: [],
      gdprRequests: [],
      brokerProfiles: [],

      addBrowserHistory: (items) =>
        set((state) => ({
          browserHistory: [...state.browserHistory, ...items],
        })),

      addGDPRRequest: (request) =>
        set((state) => ({
          gdprRequests: [...state.gdprRequests, request],
        })),

      updateGDPRStatus: (id, status) =>
        set((state) => ({
          gdprRequests: state.gdprRequests.map((req) =>
            req.id === id ? { ...req, status } : req
          ),
        })),

      addBrokerProfile: (profile) =>
        set((state) => ({
          brokerProfiles: [...state.brokerProfiles, profile],
        })),

      clearAllData: () =>
        set({
          browserHistory: [],
          cookieDomains: [],
          bookmarks: [],
          gdprRequests: [],
          brokerProfiles: [],
        }),
    }),
    {
      name: 'lcc-data-reclamation',
    }
  )
);
