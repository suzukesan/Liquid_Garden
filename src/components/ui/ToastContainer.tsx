import React from 'react'
import { useToastStore } from '@/stores/toastStore'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore()
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-3 rounded-xl shadow-lg backdrop-blur-md bg-white/80 flex items-center space-x-2"
          >
            <span className="text-xl select-none">{toast.emoji || '🎉'}</span>
            <p className="text-sm font-medium text-gray-800">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
