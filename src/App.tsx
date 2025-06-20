import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAutoBackup } from '@/hooks/useAutoBackup'
import BentoGarden from '@/components/layout/BentoGarden'
import ToastContainer from '@/components/ui/ToastContainer'
import { useAchievementToast } from '@/hooks/useAchievementToast'
import './index.css'

function App() {
  useTheme()
  useAutoBackup()
  useAchievementToast()
  return (
    <>
      <BentoGarden />
      <ToastContainer />
    </>
  )
}

export default App
