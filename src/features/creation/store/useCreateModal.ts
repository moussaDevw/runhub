import { create } from 'zustand';

interface CreateModalStore {
  isVisible: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateModal = create<CreateModalStore>((set) => ({
  isVisible: false,
  open: () => set({ isVisible: true }),
  close: () => set({ isVisible: false }),
}));
