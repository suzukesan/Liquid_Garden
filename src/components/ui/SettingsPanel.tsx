import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Palette, Download, Globe, Volume2, X } from 'lucide-react'
import { usePlantStore } from '../../stores/plantStore'
import { useSoundEffects } from '../../hooks/useSoundEffects'

interface SettingsPanelProps {
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { plants } = usePlantStore()
  const { volume, setMasterVolume, playUISound } = useSoundEffects()
  
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto')
  const [language, setLanguage] = useState<'ja' | 'en'>('ja')

  const handleNotificationToggle = () => {
    setNotifications(!notifications)
    playUISound('click')
  }

  const handleThemeChange = (newTheme: 'auto' | 'light' | 'dark') => {
    setTheme(newTheme)
    playUISound('click')
  }

  const handleLanguageChange = (newLanguage: 'ja' | 'en') => {
    setLanguage(newLanguage)
    playUISound('click')
  }

  const handleVolumeChange = (newVolume: number) => {
    setMasterVolume(newVolume)
  }

  const handleExportData = () => {
    const data = {
      plants: plants,
      settings: {
        notifications,
        theme,
        language,
        volume
      },
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `liquid-garden-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    playUISound('success')
  }

  const getText = (ja: string, en: string) => language === 'ja' ? ja : en

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white/30 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              {getText('設定', 'Settings')}
            </h2>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 text-gray-700" />
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* 通知設定 */}
          <div className="p-6 rounded-2xl bg-white/10 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {getText('通知設定', 'Notifications')}
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">
                {getText('植物のケア時間をお知らせ', 'Plant care reminders')}
              </span>
              <motion.button
                onClick={handleNotificationToggle}
                className={`w-14 h-8 rounded-full p-1 ${
                  notifications ? 'bg-green-500' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full"
                  animate={{ x: notifications ? 24 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </div>
          </div>

          {/* テーマ設定 */}
          <div className="p-6 rounded-2xl bg-white/10 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {getText('テーマ設定', 'Theme')}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'auto', label: getText('自動', 'Auto'), icon: '🌅' },
                { value: 'light', label: getText('ライト', 'Light'), icon: '☀️' },
                { value: 'dark', label: getText('ダーク', 'Dark'), icon: '🌙' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value as any)}
                  className={`p-3 rounded-xl border-2 text-center ${
                    theme === option.value
                      ? 'border-blue-500 bg-blue-50/80'
                      : 'border-white/30 bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium text-gray-700">
                    {option.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 言語設定 */}
          <div className="p-6 rounded-2xl bg-white/10 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {getText('言語設定', 'Language')}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'ja', label: '日本語', flag: '🇯🇵' },
                { value: 'en', label: 'English', flag: '🇺🇸' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleLanguageChange(option.value as any)}
                  className={`p-3 rounded-xl border-2 text-center ${
                    language === option.value
                      ? 'border-green-500 bg-green-50/80'
                      : 'border-white/30 bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-1">{option.flag}</div>
                  <div className="text-sm font-medium text-gray-700">
                    {option.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 音量設定 */}
          <div className="p-6 rounded-2xl bg-white/10 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Volume2 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {getText('音量設定', 'Volume')}
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 w-12">0%</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)`
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12">100%</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-gray-700">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* データエクスポート */}
          <div className="p-6 rounded-2xl bg-white/10 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {getText('データエクスポート', 'Data Export')}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {getText(
                '植物のデータと設定をバックアップファイルとしてダウンロードできます',
                'Download your plant data and settings as a backup file'
              )}
            </p>
            <motion.button
              onClick={handleExportData}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-medium"
              whileHover={{ scale: 1.02, backgroundColor: '#f97316' }}
              whileTap={{ scale: 0.98 }}
            >
              {getText('データをエクスポート', 'Export Data')} ({plants.length} {getText('匹の植物', 'plants')})
            </motion.button>
          </div>

          {/* アプリ情報 */}
          <div className="p-6 rounded-2xl bg-white/10 border border-white/20 text-center">
            <div className="text-4xl mb-3">🌿</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Liquid Garden
            </h3>
            <p className="text-sm text-gray-600">
              {getText(
                'Version 1.0.0 - 植物との特別な時間をお楽しみください',
                'Version 1.0.0 - Enjoy your special time with plants'
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPanel 