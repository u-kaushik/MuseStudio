
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Client {
  id: string;
  name: string;
  defaultBrandPalette: string;
  commercialObjective: string;
  defaultMorphology?: string;
}

interface ClientState {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'> & { id: string }) => void;
  removeClient: (clientId: string) => void;
}

export const useClients = create<ClientState>()(
  persist(
    (set) => ({
      clients: [],
      addClient: (client) =>
        set((state) => {
          const existingClientIndex = state.clients.findIndex((c) => c.id === client.id);
          if (existingClientIndex !== -1) {
            const updatedClients = [...state.clients];
            updatedClients[existingClientIndex] = client;
            return { clients: updatedClients };
          }
          return { clients: [...state.clients, client] };
        }),
      removeClient: (clientId) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== clientId),
        })),
    }),
    {
      name: 'client-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);
