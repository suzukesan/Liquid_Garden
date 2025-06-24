import React, { useState, useRef } from 'react'
import { usePlantStore } from '@/stores/plantStore'
import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'

/**
 * Draggable watering-can. Drag onto a plant (element with data-plant-id) to trigger waterPlant().
 */
const WateringCan: React.FC = () => {
  const { waterPlant } = usePlantStore()
  const [dragging, setDragging] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const startPos = useRef<{x:number,y:number}>({x:0,y:0})

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    startPos.current = { x: e.clientX, y: e.clientY }
    setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
  }

  const handlePointerUp = (e: PointerEvent) => {
    setDragging(false)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)

    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y
    const moved = Math.hypot(dx, dy) > 30

    if (moved) {
      const target = document.elementFromPoint(e.clientX, e.clientY)
      if (target) {
        const plantId = (target as HTMLElement).closest('[data-plant-id]')?.getAttribute('data-plant-id')
        if (plantId) {
          waterPlant(plantId)
        }
      }
    }
  }

  return (
    <motion.div
      className="relative cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none', pointerEvents: dragging ? 'none' : 'auto' }}
      onPointerDown={handlePointerDown}
      animate={dragging ? { x: pos.x - 24, y: pos.y - 24 } : { x: 0, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
        <Droplets size={28} />
      </div>
    </motion.div>
  )
}

export default WateringCan 