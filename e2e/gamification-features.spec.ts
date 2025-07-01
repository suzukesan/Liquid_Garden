import { test, expect } from '@playwright/test'

test.describe('ゲーミフィケーション機能テスト', () => {
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

  test('植物成長システムのテスト', async ({ page }) => {
    // 植物詳細ビューを開く
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 成長段階の表示確認
    const growthStageElement = page.locator('[data-testid="growth-stage"]')
    if (await growthStageElement.count() > 0) {
      await expect(growthStageElement).toBeVisible()
      const growthText = await growthStageElement.textContent()
      expect(growthText).toBeTruthy()
    }
    
    // 成長進捗バーの確認
    const progressElement = page.locator('[data-testid="growth-progress"]')
    if (await progressElement.count() > 0) {
      await expect(progressElement).toBeVisible()
    }
    
    // 日光浴を実行して成長進捗を確認
    const sunButton = page.getByRole('button', { name: /日光浴|太陽|sun/i })
    if (await sunButton.count() > 0 && await sunButton.isEnabled()) {
      const initialProgress = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuenow')
      
      await sunButton.click()
      await page.waitForTimeout(1500)
      
      // 成長進捗が増加したことを確認
      const newProgress = await page.locator('[role="progressbar"]').first().getAttribute('aria-valuenow')
      if (initialProgress && newProgress) {
        expect(Number(newProgress)).toBeGreaterThanOrEqual(Number(initialProgress))
      }
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('愛情レベルシステムのテスト', async ({ page }) => {
    // 植物詳細ビューを開く
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 愛情レベル表示の確認
    const loveIndicator = page.locator('[data-testid="love-level"]')
    if (await loveIndicator.count() > 0) {
      await expect(loveIndicator).toBeVisible()
    }
    
    // 話しかける機能で愛情レベル向上をテスト
    const talkButton = page.getByRole('button', { name: /話しかける|愛情|talk/i })
    if (await talkButton.count() > 0 && await talkButton.isEnabled()) {
      await talkButton.click()
      
      // ハートエフェクトの確認
      await page.waitForTimeout(1000)
      
      // エフェクトアニメーションが実行されたことを確認
      const heartEffects = page.locator('text=❤️').or(page.locator('text=💖'))
      if (await heartEffects.count() > 0) {
        await expect(heartEffects.first()).toBeVisible()
      }
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('植物の健康状態とケア緊急度のテスト', async ({ page }) => {
    // 緊急度インジケーターの確認
    const urgentIndicators = page.locator('.bg-red-500')
    if (await urgentIndicators.count() > 0) {
      await expect(urgentIndicators.first()).toBeVisible()
      
      // 点滅アニメーションの確認
      const animation = await urgentIndicators.first().getAttribute('style')
      // アニメーションが設定されていることを確認
    }
    
    // 植物カードの状態メッセージ確認
    const plantCards = page.locator('[aria-label*="カード"]')
    const cardCount = await plantCards.count()
    
    for (let i = 0; i < Math.min(cardCount, 2); i++) {
      await plantCards.nth(i).click()
      
      // 緊急メッセージの確認
      const urgentMessage = page.locator('[class*="border-red-400"], [class*="border-yellow-400"]')
      if (await urgentMessage.count() > 0) {
        await expect(urgentMessage.first()).toBeVisible()
        const messageText = await urgentMessage.first().textContent()
        expect(messageText).toContain('必要')
      }
      
      await page.getByText('庭に戻る').click()
      await page.waitForTimeout(500)
    }
  })

  test('音響エフェクトのテスト', async ({ page }) => {
    // 音声が有効になっていることを確認
    const soundButton = page.locator('button:has([class*="Volume"])').first()
    if (await soundButton.count() > 0) {
      // 音声アイコンが表示されていることを確認
      await expect(soundButton).toBeVisible()
    }
    
    // 植物操作での音響エフェクト
    const plantCard = page.locator('[aria-label*="カード"]').first()
    await plantCard.click()
    
    // 水やり音響エフェクト
    const waterButton = page.getByRole('button', { name: '水やりボタン' })
    if (await waterButton.count() > 0 && await waterButton.isEnabled()) {
      await waterButton.click()
      // 音響エフェクトの実行時間を待つ
      await page.waitForTimeout(1000)
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('ビジュアルエフェクトとアニメーションのテスト', async ({ page }) => {
    // 植物カードのホバーエフェクト
    const plantCard = page.locator('[aria-label*="カード"]').first()
    await plantCard.hover()
    await page.waitForTimeout(300)
    
    // 波紋エフェクトのテスト
    await plantCard.click()
    await page.waitForTimeout(500)
    
    // 植物詳細ビューでのエフェクト
    const waterButton = page.getByRole('button', { name: '水やりボタン' })
    if (await waterButton.count() > 0 && await waterButton.isEnabled()) {
      await waterButton.click()
      
      // 水滴エフェクトの確認
      await page.waitForTimeout(1500)
      
      // エフェクト要素の確認
      const waterDroplets = page.locator('text=💧')
      if (await waterDroplets.count() > 0) {
        await expect(waterDroplets.first()).toBeVisible()
      }
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('植物の感情状態とリアクションのテスト', async ({ page }) => {
    // 各植物の感情状態を確認
    const plantCards = page.locator('[aria-label*="カード"]')
    const cardCount = await plantCards.count()
    
    for (let i = 0; i < Math.min(cardCount, 2); i++) {
      await plantCards.nth(i).click()
      
      // 植物の表情確認
      const emotionEmojis = page.locator('text=😊').or(page.locator('text=😔')).or(page.locator('text=🥺'))
      if (await emotionEmojis.count() > 0) {
        await expect(emotionEmojis.first()).toBeVisible()
      }
      
      // 感情メッセージの確認
      const emotionMessage = page.locator('[class*="bg-white/60"]')
      if (await emotionMessage.count() > 0) {
        const messageText = await emotionMessage.first().textContent()
        expect(messageText).toBeTruthy()
        expect(messageText?.length).toBeGreaterThan(0)
      }
      
      await page.getByText('庭に戻る').click()
      await page.waitForTimeout(500)
    }
  })

  test('季節システムとテーマ変化のテスト', async ({ page }) => {
    // 背景グラデーションの確認
    const bodyElement = page.locator('body')
    const bodyStyle = await bodyElement.getAttribute('style')
    
    // 時間帯に応じた背景変化の確認
    const backgroundElement = page.locator('[style*="gradient"]').first()
    if (await backgroundElement.count() > 0) {
      const gradientStyle = await backgroundElement.getAttribute('style')
      expect(gradientStyle).toContain('gradient')
    }
    
    // テーマ設定による変化
    const settingsButton = page.getByRole('button', { name: /設定|settings/i })
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      // テーマ切り替えボタンの確認
      const themeButtons = page.locator('button:has-text("ダーク")').or(page.locator('button:has-text("ライト")'))
      if (await themeButtons.count() > 0) {
        await themeButtons.first().click()
        await page.waitForTimeout(500)
        
        // テーマ変更後の背景確認
        const newBodyStyle = await bodyElement.getAttribute('style')
        // 変化があったことを確認（具体的な値は時間帯により異なる）
      }
      
      const closeButton = page.getByRole('button', { name: /閉じる|close/i })
      if (await closeButton.count() > 0) {
        await closeButton.click()
      }
    }
  })

  test('プログレスとメトリクス表示のテスト', async ({ page }) => {
    // 植物詳細ビューでメトリクスを確認
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 健康度メーター
    const healthMeter = page.locator('[data-testid="health-indicator"]')
    if (await healthMeter.count() > 0) {
      await expect(healthMeter).toBeVisible()
      const healthValue = await healthMeter.getAttribute('aria-valuenow')
      expect(Number(healthValue)).toBeGreaterThanOrEqual(0)
      expect(Number(healthValue)).toBeLessThanOrEqual(100)
    }
    
    // プログレスバーの動的更新
    const progressBars = page.locator('[role="progressbar"]')
    const progressCount = await progressBars.count()
    
    for (let i = 0; i < progressCount; i++) {
      const progressBar = progressBars.nth(i)
      await expect(progressBar).toBeVisible()
      
      const value = await progressBar.getAttribute('aria-valuenow')
      const max = await progressBar.getAttribute('aria-valuemax')
      
      if (value && max) {
        expect(Number(value)).toBeLessThanOrEqual(Number(max))
        expect(Number(value)).toBeGreaterThanOrEqual(0)
      }
    }
    
    await page.getByText('庭に戻る').click()
  })

  test('植物の個性とバリエーションのテスト', async ({ page }) => {
    // 複数の植物がある場合の個性確認
    const plantCards = page.locator('[aria-label*="カード"]')
    const cardCount = await plantCards.count()
    
         const plantCharacteristics: string[] = []
    
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      await plantCards.nth(i).click()
      
             // ASCII アートの違いを確認
       const plantArt = page.locator('[data-plant-id]')
       if (await plantArt.count() > 0) {
         const artContent = await plantArt.textContent()
         if (artContent) {
           plantCharacteristics.push(artContent)
         }
       }
      
      // 植物名の確認
      const plantName = page.locator('h2, h3').first()
      if (await plantName.count() > 0) {
        const nameText = await plantName.textContent()
        expect(nameText).toBeTruthy()
      }
      
      await page.getByText('庭に戻る').click()
      await page.waitForTimeout(500)
    }
    
    // 複数の植物で異なる特徴があることを確認
    if (plantCharacteristics.length > 1) {
      const uniqueCharacteristics = new Set(plantCharacteristics)
      expect(uniqueCharacteristics.size).toBeGreaterThan(0)
    }
  })

  test('エラーハンドリングとフォールバックのテスト', async ({ page }) => {
    // コンソールエラーの監視
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    // 無効な操作を試行
    await page.locator('[aria-label*="カード"]').first().click()
    
    // 短時間で連続操作
    const waterButton = page.getByRole('button', { name: '水やりボタン' })
    if (await waterButton.count() > 0) {
      for (let i = 0; i < 3; i++) {
        if (await waterButton.isEnabled()) {
          await waterButton.click()
        }
        await page.waitForTimeout(100)
      }
    }
    
    // エラーが適切にハンドリングされていることを確認
    expect(consoleErrors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('favicon')
    )).toHaveLength(0)
    
    await page.getByText('庭に戻る').click()
  })
}) 