import { useCallback } from 'react'

export const useConfetti = () => {
  const fire = useCallback(async (emoji: string = '🎉') => {
    // dynamic import to reduce bundle
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      shapes: ['circle'],
      scalar: 1.2,
      ticks: 200,
      colors: ['#facc15', '#f97316', '#f472b6', '#60a5fa'],
      emojis: [emoji],
      emojiSize: 40,
    } as any)
  }, [])

  return { fire }
} 