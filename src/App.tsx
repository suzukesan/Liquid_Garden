import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useAutoBackup } from '@/hooks/useAutoBackup'
import BentoGarden from '@/components/layout/BentoGarden'
import './index.css'

function App() {
  useTheme()
  useAutoBackup()
  return <BentoGarden />
}

export default App
