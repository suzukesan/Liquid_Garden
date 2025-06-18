import React from 'react'
import { useTheme } from '@/hooks/useTheme'
import BentoGarden from '@/components/layout/BentoGarden'
import './index.css'

function App() {
  useTheme()
  return <BentoGarden />
}

export default App
