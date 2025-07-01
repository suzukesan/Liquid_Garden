import { Page, expect } from '@playwright/test'

/**
 * テスト用のヘルパー関数集
 */

/**
 * 植物が存在しない場合に新しい植物を作成する
 */
export async function ensurePlantExists(page: Page): Promise<void> {
  const plantCards = page.locator('[aria-label*="カード"]')
  const existingPlantsCount = await plantCards.count()
  
  if (existingPlantsCount === 0) {
    await page.getByTestId('add-plant-button').first().click()
    await page.getByTestId('plant-type-item').first().click()
    await page.getByTestId('confirm-plant-button').click()
    await page.waitForSelector('[aria-label*="カード"]')
  }
}

/**
 * 植物の詳細ビューを開く
 */
export async function openPlantDetail(page: Page, plantIndex = 0): Promise<void> {
  const plantCards = page.locator('[aria-label*="カード"]')
  await plantCards.nth(plantIndex).click()
  await expect(page.getByText('庭に戻る')).toBeVisible()
}

/**
 * 庭のメインビューに戻る
 */
export async function returnToGarden(page: Page): Promise<void> {
  const backButton = page.getByText('庭に戻る')
  if (await backButton.count() > 0) {
    await backButton.click()
    await expect(page.locator('[aria-label*="カード"]')).toBeVisible()
  }
}

/**
 * 設定パネルを開く
 */
export async function openSettings(page: Page): Promise<void> {
  const settingsButton = page.getByRole('button', { name: /設定|settings/i })
  if (await settingsButton.count() > 0) {
    await settingsButton.click()
  }
}

/**
 * 設定パネルを閉じる
 */
export async function closeSettings(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: /閉じる|close/i })
  if (await closeButton.count() > 0) {
    await closeButton.click()
  }
}

/**
 * 植物のケアアクションを実行する
 */
export async function performPlantCare(
  page: Page, 
  action: 'water' | 'sun' | 'talk'
): Promise<boolean> {
  let button
  let buttonName = ''
  
  switch (action) {
    case 'water':
      button = page.getByRole('button', { name: '水やりボタン' })
      buttonName = '水やり'
      break
    case 'sun':
      button = page.getByRole('button', { name: /日光浴|太陽|sun/i })
      buttonName = '日光浴'
      break
    case 'talk':
      button = page.getByRole('button', { name: /話しかける|愛情|talk/i })
      buttonName = '話しかける'
      break
  }
  
  if (await button.count() > 0 && await button.isEnabled()) {
    await button.click()
    
    // アクションに応じた待機時間
    const waitTime = action === 'sun' ? 1500 : 1000
    await page.waitForTimeout(waitTime)
    
    console.log(`${buttonName}アクションを実行しました`)
    return true
  }
  
  console.log(`${buttonName}ボタンが無効または存在しません`)
  return false
}

/**
 * コンソールエラーを監視する
 */
export function setupConsoleErrorMonitoring(page: Page): string[] {
  const consoleErrors: string[] = []
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      // ファビコンやその他の無害なエラーを除外
      const errorText = msg.text()
      if (!errorText.includes('favicon') && 
          !errorText.includes('manifest') &&
          !errorText.includes('SW registration failed')) {
        consoleErrors.push(errorText)
      }
    }
  })
  
  return consoleErrors
}

/**
 * 植物の健康状態を確認する
 */
export async function checkPlantHealth(page: Page): Promise<{
  health: number | null
  loveLevel: number | null
  growthProgress: number | null
}> {
  const healthIndicator = page.locator('[data-testid="health-indicator"]')
  const loveIndicator = page.locator('[data-testid="love-level"]')
  const progressIndicator = page.locator('[data-testid="growth-progress"]')
  
     let health: number | null = null
   let loveLevel: number | null = null
   let growthProgress: number | null = null
  
  if (await healthIndicator.count() > 0) {
    const healthValue = await healthIndicator.getAttribute('aria-valuenow')
    health = healthValue ? Number(healthValue) : null
  }
  
  if (await loveIndicator.count() > 0) {
    const loveValue = await loveIndicator.getAttribute('aria-valuenow')
    loveLevel = loveValue ? Number(loveValue) : null
  }
  
  if (await progressIndicator.count() > 0) {
    const progressValue = await progressIndicator.getAttribute('aria-valuenow')
    growthProgress = progressValue ? Number(progressValue) : null
  }
  
  return { health, loveLevel, growthProgress }
}

/**
 * 緊急度インジケーターの確認
 */
export async function checkUrgencyIndicators(page: Page): Promise<{
  hasUrgent: boolean
  hasNeeded: boolean
  urgentCount: number
}> {
  const urgentIndicators = page.locator('.bg-red-500')
  const neededIndicators = page.locator('.bg-yellow-400')
  
  const urgentCount = await urgentIndicators.count()
  const neededCount = await neededIndicators.count()
  
  return {
    hasUrgent: urgentCount > 0,
    hasNeeded: neededCount > 0,
    urgentCount
  }
}

/**
 * ローカルストレージのデータを確認する
 */
export async function checkLocalStorageData(page: Page): Promise<{
  hasPlantData: boolean
  plantCount: number
  storageKeys: string[]
}> {
  const storageData = await page.evaluate(() => {
    const keys = Object.keys(localStorage)
    const plantData = localStorage.getItem('liquid-garden-plants')
    
    let plantCount = 0
    if (plantData) {
      try {
        const parsed = JSON.parse(plantData)
        plantCount = Array.isArray(parsed) ? parsed.length : 0
      } catch {
        plantCount = 0
      }
    }
    
    return {
      keys,
      hasPlantData: !!plantData,
      plantCount
    }
  })
  
  return {
    hasPlantData: storageData.hasPlantData,
    plantCount: storageData.plantCount,
    storageKeys: storageData.keys
  }
}

/**
 * アニメーション完了を待つ
 */
export async function waitForAnimation(page: Page, duration = 1000): Promise<void> {
  await page.waitForTimeout(duration)
}

/**
 * テストデータをセットアップする
 */
export async function setupTestData(page: Page, options: {
  plantCount?: number
  withOldData?: boolean
} = {}): Promise<void> {
  const { plantCount = 1, withOldData = false } = options
  
  if (withOldData) {
    // 古いバージョンのデータを設定
    await page.evaluate(() => {
      const oldData = [
        {
          id: '1',
          name: 'テスト植物',
          type: 'PACHIRA',
          health: 50,
          loveLevel: 1,
          growthStage: 'SEED', // 古いフォーマット
          lastWatered: new Date().toISOString(),
          lastSunExposure: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('liquid-garden-plants', JSON.stringify(oldData))
    })
  } else {
    // 新しい植物を作成
    for (let i = 0; i < plantCount; i++) {
      await ensurePlantExists(page)
      await page.waitForTimeout(500)
    }
  }
}

/**
 * パフォーマンス測定
 */
export async function measurePageLoadTime(page: Page): Promise<number> {
  const startTime = Date.now()
  await page.reload()
  await page.waitForSelector('[data-testid="add-plant-button"], [aria-label*="カード"]')
  return Date.now() - startTime
}

/**
 * レスポンシブデザインのテスト
 */
export async function testResponsiveLayout(
  page: Page, 
  viewports: Array<{ width: number; height: number; name: string }>
): Promise<void> {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.reload()
    await page.waitForTimeout(500)
    
    // 重要な要素が表示されることを確認
    const importantElements = page.locator('[data-testid="add-plant-button"], [aria-label*="カード"]')
    if (await importantElements.count() > 0) {
      await expect(importantElements.first()).toBeVisible()
    }
    
    console.log(`${viewport.name} (${viewport.width}x${viewport.height}) レイアウト確認完了`)
  }
}

/**
 * データの整合性をチェック
 */
export async function validateDataIntegrity(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    try {
      const data = localStorage.getItem('liquid-garden-plants')
      if (!data) return true
      
      const parsed = JSON.parse(data)
      if (!Array.isArray(parsed)) return false
      
      return parsed.every(plant => {
        return (
          plant.id &&
          plant.name &&
          typeof plant.health === 'number' &&
          typeof plant.loveLevel === 'number' &&
          plant.type &&
          plant.growthStage &&
          plant.lastWatered &&
          plant.lastSunExposure &&
          plant.createdAt
        )
      })
    } catch {
      return false
    }
  })
} 