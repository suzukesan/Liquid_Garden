import { useCallback, useRef, useEffect, useState } from 'react'

// Web Audio APIを使用した高品質音響システム
class LiquidSoundEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private effectGain: GainNode | null = null
  private isInitialized = false
  private ambientSources: AudioBufferSourceNode[] = []
  private activeNodes: Set<AudioNode> = new Set()
  private bufferCache: Map<string, AudioBuffer> = new Map()

  async initialize() {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // マスターボリューム制御
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      this.masterGain.connect(this.audioContext.destination)

      // 環境音用チャンネル
      this.ambientGain = this.audioContext.createGain()
      this.ambientGain.gain.setValueAtTime(0.15, this.audioContext.currentTime)
      this.ambientGain.connect(this.masterGain)

      // エフェクト音用チャンネル
      this.effectGain = this.audioContext.createGain()
      this.effectGain.gain.setValueAtTime(0.8, this.audioContext.currentTime)
      this.effectGain.connect(this.masterGain)

      this.isInitialized = true
    } catch (error) {
      console.warn('音響システムの初期化に失敗しました:', error)
    }
  }

  // コンテキストのクリーンアップ
  async cleanup() {
    // すべてのアクティブなノードを停止
    this.activeNodes.forEach(node => {
      if ('stop' in node && typeof (node as any).stop === 'function') {
        try {
          (node as any).stop()
        } catch (e) {
          // 既に停止している場合のエラーを無視
        }
      }
      if ('disconnect' in node) {
        try {
          node.disconnect()
        } catch (e) {
          // 既に切断されている場合のエラーを無視
        }
      }
    })
    this.activeNodes.clear()

    // 環境音を停止
    this.stopAmbientSound()

    // バッファキャッシュをクリア
    this.bufferCache.clear()

    // オーディオコンテキストをクローズ
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close()
    }

    this.audioContext = null
    this.masterGain = null
    this.ambientGain = null
    this.effectGain = null
    this.isInitialized = false
  }

  // 水の音を生成（プロシージャル生成）- キャッシュ機能付き
  private generateWaterSound(duration: number = 0.8): AudioBuffer | null {
    if (!this.audioContext) return null

    const cacheKey = `water_${duration}`
    if (this.bufferCache.has(cacheKey)) {
      return this.bufferCache.get(cacheKey)!
    }

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        
        // 複数の正弦波を重ねて水の音を作成
        let sample = 0
        sample += Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 3) * 0.3
        sample += Math.sin(2 * Math.PI * 400 * t) * Math.exp(-t * 5) * 0.2
        sample += Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 8) * 0.1
        
        // ノイズを加えて自然な音に
        sample += (Math.random() - 0.5) * 0.1 * Math.exp(-t * 2)
        
        channelData[i] = sample * 0.5
      }
    }

    this.bufferCache.set(cacheKey, buffer)
    return buffer
  }

  // キラキラ音を生成 - キャッシュ機能付き
  private generateSparkleSound(duration: number = 1.2): AudioBuffer | null {
    if (!this.audioContext) return null

    const cacheKey = `sparkle_${duration}`
    if (this.bufferCache.has(cacheKey)) {
      return this.bufferCache.get(cacheKey)!
    }

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        
        // 高周波の美しい音色
        let sample = 0
        sample += Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 1.5) * 0.4
        sample += Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 2) * 0.3
        sample += Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 3) * 0.2
        sample += Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t * 4) * 0.1
        
        // 微細な振動でキラキラ感を演出
        sample *= (1 + Math.sin(2 * Math.PI * 8 * t) * 0.1)
        
        channelData[i] = sample * 0.6
      }
    }

    this.bufferCache.set(cacheKey, buffer)
    return buffer
  }

  // 心地よいチャイム音を生成 - キャッシュ機能付き
  private generateChimeSound(duration: number = 1.5): AudioBuffer | null {
    if (!this.audioContext) return null

    const cacheKey = `chime_${duration}`
    if (this.bufferCache.has(cacheKey)) {
      return this.bufferCache.get(cacheKey)!
    }

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        
        // 和音のチャイム
        let sample = 0
        sample += Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-t * 1) * 0.3 // C5
        sample += Math.sin(2 * Math.PI * 659.25 * t) * Math.exp(-t * 1.2) * 0.25 // E5
        sample += Math.sin(2 * Math.PI * 783.99 * t) * Math.exp(-t * 1.5) * 0.2 // G5
        
        // 倍音を加えて豊かな音色に
        sample += Math.sin(2 * Math.PI * 523.25 * 2 * t) * Math.exp(-t * 2) * 0.1
        sample += Math.sin(2 * Math.PI * 659.25 * 2 * t) * Math.exp(-t * 2.5) * 0.08
        
        channelData[i] = sample * 0.7
      }
    }

    this.bufferCache.set(cacheKey, buffer)
    return buffer
  }

  // 環境音（水のせせらぎ）を生成 - キャッシュ機能付き
  private generateAmbientStream(): AudioBuffer | null {
    if (!this.audioContext) return null

    const cacheKey = 'ambient_stream'
    if (this.bufferCache.has(cacheKey)) {
      return this.bufferCache.get(cacheKey)!
    }

    const duration = 10 // 10秒のループ
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        
        // 複数の周波数で水の流れを表現
        let sample = 0
        
        // 低周波の水の流れ
        sample += Math.sin(2 * Math.PI * 50 * t + Math.sin(t * 0.5) * 2) * 0.1
        sample += Math.sin(2 * Math.PI * 80 * t + Math.sin(t * 0.3) * 1.5) * 0.08
        
        // 中周波の泡音
        sample += Math.sin(2 * Math.PI * 200 * t + Math.sin(t * 2) * 0.5) * 0.05
        sample += Math.sin(2 * Math.PI * 300 * t + Math.sin(t * 1.5) * 0.3) * 0.04
        
        // 高周波のキラキラ感
        sample += Math.sin(2 * Math.PI * 800 * t + Math.sin(t * 3) * 0.2) * 0.02
        sample += Math.sin(2 * Math.PI * 1200 * t + Math.sin(t * 4) * 0.1) * 0.01
        
        // ホワイトノイズで自然感を追加
        sample += (Math.random() - 0.5) * 0.03
        
        // ステレオ効果
        if (channel === 1) {
          sample *= 0.8 // 右チャンネルを少し小さく
        }
        
        channelData[i] = sample * 0.4
      }
    }

    this.bufferCache.set(cacheKey, buffer)
    return buffer
  }

  // 音を再生 - リソース管理改善
  async playSound(type: 'water' | 'sparkle' | 'chime', volume: number = 1) {
    if (!this.audioContext || !this.effectGain) return

    await this.initialize()

    let buffer: AudioBuffer | null = null
    
    switch (type) {
      case 'water':
        buffer = this.generateWaterSound()
        break
      case 'sparkle':
        buffer = this.generateSparkleSound()
        break
      case 'chime':
        buffer = this.generateChimeSound()
        break
    }

    if (!buffer) return

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    
    source.buffer = buffer
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    
    source.connect(gainNode)
    gainNode.connect(this.effectGain)
    
    // ノードをトラッキング
    this.activeNodes.add(source)
    this.activeNodes.add(gainNode)
    
    // 再生終了時にノードをクリーンアップ
    source.onended = () => {
      source.disconnect()
      gainNode.disconnect()
      this.activeNodes.delete(source)
      this.activeNodes.delete(gainNode)
    }
    
    source.start()
  }

  // 環境音を開始 - リソース管理改善
  async startAmbientSound() {
    if (!this.audioContext || !this.ambientGain) return

    await this.initialize()

    const buffer = this.generateAmbientStream()
    if (!buffer) return

    const playAmbient = () => {
      const source = this.audioContext!.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(this.ambientGain!)
      
      // ノードをトラッキング
      this.activeNodes.add(source)
      
      source.start()
      
      this.ambientSources.push(source)
      return source
    }

    playAmbient()
  }

  // 環境音を停止 - リソース管理改善
  stopAmbientSound() {
    this.ambientSources.forEach(source => {
      try {
        source.stop()
        source.disconnect()
        this.activeNodes.delete(source)
      } catch (e) {
        // 既に停止している場合のエラーを無視
      }
    })
    this.ambientSources = []
  }

  // 植物の鼓動音を生成・再生 - リソース管理改善
  async playHeartbeat(bpm: number = 60, duration: number = 2) {
    if (!this.audioContext || !this.effectGain) return

    await this.initialize()

    const beatInterval = 60 / bpm
    const beats = Math.floor(duration / beatInterval)

    for (let i = 0; i < beats; i++) {
      setTimeout(() => {
        if (!this.audioContext || !this.effectGain) return

        // 低周波の鼓動音
        const buffer = this.audioContext.createBuffer(2, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate)
        
        for (let channel = 0; channel < 2; channel++) {
          const channelData = buffer.getChannelData(channel)
          
          for (let j = 0; j < channelData.length; j++) {
            const t = j / this.audioContext.sampleRate
            let sample = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 20) * 0.5
            sample += Math.sin(2 * Math.PI * 120 * t) * Math.exp(-t * 25) * 0.3
            channelData[j] = sample
          }
        }

        const source = this.audioContext.createBufferSource()
        const gainNode = this.audioContext.createGain()
        
        source.buffer = buffer
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        
        source.connect(gainNode)
        gainNode.connect(this.effectGain)
        
        // ノードをトラッキング
        this.activeNodes.add(source)
        this.activeNodes.add(gainNode)
        
        // 再生終了時にノードをクリーンアップ
        source.onended = () => {
          source.disconnect()
          gainNode.disconnect()
          this.activeNodes.delete(source)
          this.activeNodes.delete(gainNode)
        }
        
        source.start()
      }, i * beatInterval * 1000)
    }
  }

  // ボリューム調整
  setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioContext!.currentTime)
    }
  }

  setAmbientVolume(volume: number) {
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioContext!.currentTime)
    }
  }
}

// サウンドエンジンのシングルトンインスタンス
const soundEngine = new LiquidSoundEngine()

export const useSoundEffects = () => {
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const initializeRef = useRef(false)

  // 初期化
  useEffect(() => {
    const initializeAudio = async () => {
      if (!initializeRef.current) {
        await soundEngine.initialize()
        initializeRef.current = true
      }
    }

    // ユーザーインタラクションで音響システムを初期化
    const handleFirstInteraction = () => {
      initializeAudio()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [])

  // クリーンアップ
  useEffect(() => {
    return () => {
      soundEngine.cleanup()
    }
  }, [])

  // 水やりの音
  const playWaterSound = useCallback(async () => {
    await soundEngine.playSound('water', 0.8)
  }, [])

  // 日光浴の音（キラキラ）
  const playSunlightSound = useCallback(async () => {
    await soundEngine.playSound('sparkle', 0.6)
  }, [])

  // 愛情を伝える音（チャイム）
  const playLoveSound = useCallback(async () => {
    await soundEngine.playSound('chime', 0.7)
  }, [])

  // 植物の鼓動音
  const playPlantHeartbeat = useCallback(async (health: number, loveLevel: number) => {
    // 健康度と愛情レベルで鼓動の速さを調整
    const baseBpm = 60
    const healthModifier = (health / 100) * 20 // 0-20 BPM
    const loveModifier = (loveLevel / 100) * 20 // 0-20 BPM
    const bpm = baseBpm + healthModifier + loveModifier
    
    await soundEngine.playHeartbeat(bpm, 3)
  }, [])

  // 環境音の開始
  const startAmbientSound = useCallback(async () => {
    if (!isAmbientPlaying) {
      await soundEngine.startAmbientSound()
      setIsAmbientPlaying(true)
    }
  }, [isAmbientPlaying])

  // 環境音の停止
  const stopAmbientSound = useCallback(() => {
    if (isAmbientPlaying) {
      soundEngine.stopAmbientSound()
      setIsAmbientPlaying(false)
    }
  }, [isAmbientPlaying])

  // ボリューム調整
  const setMasterVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    soundEngine.setMasterVolume(newVolume)
  }, [])

  const setAmbientVolume = useCallback((newVolume: number) => {
    soundEngine.setAmbientVolume(newVolume)
  }, [])

  // 波紋効果音
  const playRippleSound = useCallback(async () => {
    // 軽やかな水の波紋音
    await soundEngine.playSound('water', 0.3)
  }, [])

  // UI操作音
  const playUISound = useCallback(async (type: 'hover' | 'click' | 'success' | 'gentle') => {
    switch (type) {
      case 'hover':
        await soundEngine.playSound('sparkle', 0.1)
        break
      case 'click':
        await soundEngine.playSound('water', 0.2)
        break
      case 'success':
        await soundEngine.playSound('chime', 0.4)
        break
      case 'gentle':
        await soundEngine.playSound('sparkle', 0.2)
        break
    }
  }, [])

  return {
    // 基本的なサウンドエフェクト
    playWaterSound,
    playSunlightSound,
    playLoveSound,
    playPlantHeartbeat,
    playRippleSound,
    playUISound,

    // 環境音制御
    startAmbientSound,
    stopAmbientSound,
    isAmbientPlaying,

    // ボリューム制御
    setMasterVolume,
    setAmbientVolume,
    volume,

    // 状態
    isInitialized: initializeRef.current
  }
} 