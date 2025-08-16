
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  season: string;
  year: string;
}

interface CampaignState {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'> & { id: string }) => void;
  removeCampaign: (campaignId: string) => void;
}

export const useCampaigns = create<CampaignState>()(
  persist(
    (set) => ({
      campaigns: [],
      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
        })),
      removeCampaign: (campaignId) =>
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== campaignId),
        })),
    }),
    {
      name: 'campaign-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
