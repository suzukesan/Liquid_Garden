import { useEffect } from 'react'
import { usePlantStore } from '@/stores/plantStore'

export const useTheme = () => {
  const { theme } = usePlantStore()

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (mode: 'auto' | 'light' | 'dark') => {
      if (mode === 'light') {
        root.classList.remove('dark')
      } else if (mode === 'dark') {
        root.classList.add('dark')
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', prefersDark)
      }
    }

    applyTheme(theme)

    if (theme === 'auto') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches)
      }
      mql.addEventListener('change', listener)
      return () => mql.removeEventListener('change', listener)
    }
  }, [theme])
} 