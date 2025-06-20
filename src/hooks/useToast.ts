import { useToastStore } from '@/stores/toastStore'

export const useToast = () => {
  const { show } = useToastStore()
  return { show }
}
