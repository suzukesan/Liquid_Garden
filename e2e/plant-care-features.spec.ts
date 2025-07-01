import { test, expect } from '@playwright/test'

test.describe('植物ケア機能の詳細テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // 植物が存在しない場合は作成
    const plantCards = page.locator('[aria-label*="カード"]')
    const existingPlantsCount = await plantCards.count()
    
    if (existingPlantsCount === 0) {
      await page.getByTestId('add-plant-button').first().click()
      await page.getByTestId('plant-type-item').first().click()
      await page.getByTestId('confirm-plant-button').click()
      await page.waitForSelector('[aria-label*="カード"]')
    }
  })

  test('水やり機能のテスト', async ({ page }) => {
    // 最初の植物カードをクリック
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 詳細ビューに移行したことを確認
    await expect(page.getByText('庭に戻る')).toBeVisible()
    
    // 水やりボタンを探す
    const waterButton = page.getByRole('button', { name: '水やりボタン' })
    await expect(waterButton).toBeVisible()
    
    // ボタンが有効な場合のみクリック
    if (await waterButton.isEnabled()) {
      await waterButton.click()
      
      // 水やり結果の確認（進捗バーやアニメーションの変化）
      await page.waitForTimeout(1000)
      
      // 水やり後の状態確認
      const progressBar = page.locator('[role="progressbar"]').first()
      if (await progressBar.count() > 0) {
        const progressValue = await progressBar.getAttribute('aria-valuenow')
        expect(Number(progressValue)).toBeGreaterThan(0)
      }
    }
    
    // 庭に戻る
    await page.getByText('庭に戻る').click()
    await expect(page.locator('[aria-label*="カード"]')).toBeVisible()
  })

  test('日光浴機能のテスト', async ({ page }) => {
    // 植物詳細ビューを開く
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 日光浴ボタンを探す
    const sunButton = page.getByRole('button', { name: /日光浴|太陽|sun/i })
    await expect(sunButton).toBeVisible()
    
    if (await sunButton.isEnabled()) {
      await sunButton.click()
      
      // 日光浴エフェクトの確認
      await page.waitForTimeout(1500)
      
      // 成長進捗の確認
      const growthProgress = page.locator('[data-testid="growth-progress"]')
      if (await growthProgress.count() > 0) {
        await expect(growthProgress).toBeVisible()
      }
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('愛情表現機能のテスト', async ({ page }) => {
    // 植物詳細ビューを開く
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 話しかけるボタンを探す
    const talkButton = page.getByRole('button', { name: /話しかける|愛情|talk/i })
    await expect(talkButton).toBeVisible()
    
    if (await talkButton.isEnabled()) {
      await talkButton.click()
      
      // 愛情アニメーションの確認
      await page.waitForTimeout(1000)
      
      // ハートエフェクトや愛情レベルの変化を確認
      const loveIndicator = page.locator('[data-testid="love-level"]')
      if (await loveIndicator.count() > 0) {
        await expect(loveIndicator).toBeVisible()
      }
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('植物の健康状態表示テスト', async ({ page }) => {
    // 植物詳細ビューを開く
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 健康度インジケーターの確認
    const healthIndicator = page.locator('[data-testid="health-indicator"]')
    if (await healthIndicator.count() > 0) {
      await expect(healthIndicator).toBeVisible()
      const healthValue = await healthIndicator.getAttribute('aria-valuenow')
      expect(Number(healthValue)).toBeGreaterThanOrEqual(0)
      expect(Number(healthValue)).toBeLessThanOrEqual(100)
    }
    
    // 愛情レベル表示の確認
    const loveLevel = page.locator('[data-testid="love-level"]')
    if (await loveLevel.count() > 0) {
      await expect(loveLevel).toBeVisible()
    }
    
    // 成長段階表示の確認
    const growthStage = page.locator('[data-testid="growth-stage"]')
    if (await growthStage.count() > 0) {
      await expect(growthStage).toBeVisible()
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('緊急度インジケーターのテスト', async ({ page }) => {
    // 緊急度の高い植物を探す（赤い点で表示される）
    const urgentIndicator = page.locator('.bg-red-500')
    
    if (await urgentIndicator.count() > 0) {
      // 緊急度インジケーターが点滅していることを確認
      await expect(urgentIndicator.first()).toBeVisible()
      
      // 緊急度の高い植物をクリック
      const parentCard = urgentIndicator.first().locator('xpath=ancestor::*[@aria-label]')
      await parentCard.click()
      
      // 緊急メッセージの確認
      const urgentMessage = page.locator('[class*="border-red-400"]')
      if (await urgentMessage.count() > 0) {
        await expect(urgentMessage.first()).toBeVisible()
      }
      
      await page.getByText('庭に戻る').click()
    }
  })

  test('植物の感情状態表示テスト', async ({ page }) => {
    // 各植物カードの感情状態を確認
    const plantCards = page.locator('[aria-label*="カード"]')
    const cardCount = await plantCards.count()
    
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      await plantCards.nth(i).click()
      
      // 感情メッセージの確認
      const emotionMessage = page.locator('[class*="bg-white/60"]')
      if (await emotionMessage.count() > 0) {
        await expect(emotionMessage.first()).toBeVisible()
        const messageText = await emotionMessage.first().textContent()
        expect(messageText).toBeTruthy()
      }
      
      // ASCII アートの確認
      const plantArt = page.locator('[data-plant-id]')
      if (await plantArt.count() > 0) {
        await expect(plantArt.first()).toBeVisible()
      }
      
      // 戻る
      await page.getByText('庭に戻る').click()
      await page.waitForTimeout(500)
    }
  })
}) 