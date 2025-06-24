import { create } from 'zustand'

interface DebugStore {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useDebugStore = create<DebugStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open })
})) 