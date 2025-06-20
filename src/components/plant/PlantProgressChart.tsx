import React from 'react'
import { usePlantStore } from '@/stores/plantStore'
import { Plant, PlantCareAction, CareActionType } from '@/types/plant'

interface PlantProgressChartProps {
  plant: Plant
}

interface DayStats {
  date: string
  water: number
  sun: number
  talk: number
}

const getLast7Days = (): string[] => {
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

const PlantProgressChart: React.FC<PlantProgressChartProps> = ({ plant }) => {
  const { careHistory } = usePlantStore()
  const last7Dates = getLast7Days()

  const stats: DayStats[] = last7Dates.map((date) => ({ date, water: 0, sun: 0, talk: 0 }))

  careHistory
    .filter((a) => a.plantId === plant.id)
    .forEach((action) => {
      const d = new Date(action.timestamp).toISOString().split('T')[0]
      const idx = stats.findIndex((s) => s.date === d)
      if (idx !== -1) {
        switch (action.action) {
          case CareActionType.WATER:
            stats[idx].water += 1
            break
          case CareActionType.SUN_EXPOSURE:
            stats[idx].sun += 1
            break
          case CareActionType.TALK:
            stats[idx].talk += 1
            break
        }
      }
    })

  // 最大値取得でバー比率計算
  const maxVal = Math.max(...stats.map((s) => s.water + s.sun + s.talk), 1)

  return (
    <div className="space-y-2">
      {stats.map((s) => (
        <div key={s.date} className="flex items-center space-x-2">
          <span className="text-xs w-14 text-gray-500">{s.date.slice(5)}</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400"
              style={{ width: `${(s.water / maxVal) * 100}%` }}
            />
            <div
              className="h-full bg-yellow-400"
              style={{ width: `${(s.sun / maxVal) * 100}%` }}
            />
            <div
              className="h-full bg-pink-400"
              style={{ width: `${(s.talk / maxVal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlantProgressChart 