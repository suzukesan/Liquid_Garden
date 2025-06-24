import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useDebugStore } from '@/stores/debugStore'

// @ts-ignore
import { registerSW } from 'virtual:pwa-register'

// register service worker with prompt strategy
registerSW({ immediate: true })

// console command to open debug menu
// This must run after module evaluation, so we attach immediately
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.openDebugMenu = () => {
  // dynamic import not needed; directly use store
  useDebugStore.getState().setOpen(true)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
