import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  emoji?: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  show: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: ({ message, emoji, duration = 4000 }) => {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({ toasts: [...state.toasts, { id, message, emoji, duration }] }))
    // auto-remove
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
})) 