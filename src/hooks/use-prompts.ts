
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  date: string;
  isSaved: boolean;
  isFavorite: boolean;
}

interface PromptState {
  prompts: Prompt[];
  addPrompt: (prompt: Prompt) => void;
  removePrompt: (promptId: string) => void;
  toggleFavorite: (promptId: string) => void;
}

export const usePrompts = create<PromptState>()(
  persist(
    (set) => ({
      prompts: [],
      addPrompt: (prompt) =>
        set((state) => ({
          prompts: [...state.prompts.filter(p => p.id !== prompt.id), prompt],
        })),
      removePrompt: (promptId) =>
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== promptId),
        })),
      toggleFavorite: (promptId) =>
        set((state) => ({
            prompts: state.prompts.map(p => 
                p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
            )
        }))
    }),
    {
      name: 'prompt-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);
