'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ActiveVenueState = {
  activeVenueId: string | null;
  setActiveVenueId: (id: string | null) => void;
  clear: () => void;
};

export const useActiveVenueStore = create<ActiveVenueState>()(
  persist(
    set => ({
      activeVenueId: null,
      setActiveVenueId: id => set({ activeVenueId: id }),
      clear: () => set({ activeVenueId: null }),
    }),
    {
      name: 'owner-active-venue-id',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
