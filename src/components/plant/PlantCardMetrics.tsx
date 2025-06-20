import React from 'react'
import { Plant } from '@/types/plant'

interface PlantCardMetricsProps {
  plant: Plant
}

export const PlantCardMetrics: React.FC<PlantCardMetricsProps> = React.memo(({ plant }) => {
  const healthColor = React.useMemo(() => {
    if (plant.health >= 80) return '#10b981'
    if (plant.health >= 60) return '#f59e0b'
    if (plant.health >= 40) return '#f97316'
    return '#ef4444'
  }, [plant.health])

  const healthTextColor = React.useMemo(() => {
    if (plant.health >= 80) return 'text-green-600'
    if (plant.health >= 60) return 'text-yellow-600'
    if (plant.health >= 40) return 'text-orange-600'
    return 'text-red-600'
  }, [plant.health])

  return (
    <div className="space-y-6">
      {/* 元気ゲージ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-800">元気</span>
          <span className={`text-sm font-bold ${healthTextColor}`}>
            {plant.health}%
          </span>
        </div>
        
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${plant.health}%`,
              background: healthColor
            }}
          />
        </div>
      </div>

      {/* 愛情度 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-800">愛情度</span>
          <span className="text-sm font-bold text-pink-600">
            {Math.round(plant.loveLevel)}%
          </span>
        </div>
        
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-pink-500"
            style={{
              width: `${plant.loveLevel}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}) 