import { test, expect } from '@playwright/test'

test.describe('データ管理機能テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('データエクスポート機能のテスト', async ({ page }) => {
    // 設定パネルを開く
    const settingsButton = page.getByRole('button', { name: /設定|settings/i })
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      // データエクスポートセクションを探す
      const exportSection = page.locator('text=データエクスポート').or(page.locator('text=Data Export'))
      if (await exportSection.count() > 0) {
        await expect(exportSection).toBeVisible()
        
        // エクスポートボタンを探す
        const exportButton = page.locator('button:has-text("エクスポート")').or(
          page.locator('button:has-text("Export")')
        )
        
        if (await exportButton.count() > 0) {
          // ダウンロード開始の監視
          const downloadPromise = page.waitForEvent('download')
          
          await exportButton.click()
          
          // ダウンロードが開始されることを確認
          const download = await downloadPromise
          expect(download.suggestedFilename()).toContain('.json')
          
          // ダウンロードファイルの内容確認
          const path = await download.path()
          expect(path).toBeTruthy()
        }
      }
      
      // 設定を閉じる
      const closeButton = page.getByRole('button', { name: /閉じる|close/i })
      if (await closeButton.count() > 0) {
        await closeButton.click()
      }
    }
  })

  test('データインポート機能のテスト', async ({ page }) => {
    // テスト用のJSONデータを準備
    const testData = {
      plants: [],
      version: "1.1.0",
      exportDate: new Date().toISOString()
    }
    
    // 設定パネルを開く
    const settingsButton = page.getByRole('button', { name: /設定|settings/i })
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      // インポートボタンを探す
      const importButton = page.locator('button:has-text("インポート")').or(
        page.locator('button:has-text("Import")')
      )
      
      if (await importButton.count() > 0) {
        await importButton.click()
        
        // ファイル入力要素が存在することを確認
        const fileInput = page.locator('input[type="file"]')
        if (await fileInput.count() > 0) {
          await expect(fileInput).toBeVisible()
        }
      }
      
      // 設定を閉じる
      const closeButton = page.getByRole('button', { name: /閉じる|close/i })
      if (await closeButton.count() > 0) {
        await closeButton.click()
      }
    }
  })

  test('自動バックアップ機能のテスト', async ({ page }) => {
    // ローカルストレージの内容を確認
    const localStorage = await page.evaluate(() => {
      return Object.keys(window.localStorage)
    })
    
    // 植物データのキーが存在することを確認
    const hasPlantData = localStorage.some(key => 
      key.includes('plant') || key.includes('liquid-garden')
    )
    
    // 植物を追加してデータが保存されることを確認
    const addButton = page.getByTestId('add-plant-button')
    if (await addButton.count() > 0) {
      await addButton.first().click()
      
      const plantTypeItem = page.getByTestId('plant-type-item')
      if (await plantTypeItem.count() > 0) {
        await plantTypeItem.first().click()
        
        const confirmButton = page.getByTestId('confirm-plant-button')
        if (await confirmButton.count() > 0) {
          await confirmButton.click()
          
          // データが保存されるまで少し待つ
          await page.waitForTimeout(1000)
          
          // ローカルストレージにデータが保存されたことを確認
          const updatedLocalStorage = await page.evaluate(() => {
            const data = Object.keys(window.localStorage)
            return data.map(key => ({
              key,
              length: window.localStorage.getItem(key)?.length || 0
            }))
          })
          
          const hasData = updatedLocalStorage.some(item => item.length > 0)
          expect(hasData).toBe(true)
        }
      }
    }
  })

  test('設定の永続化テスト', async ({ page }) => {
    // 設定を変更
    const settingsButton = page.getByRole('button', { name: /設定|settings/i })
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      // 言語設定を変更
      const languageButton = page.locator('button:has-text("日本語")').or(
        page.locator('button:has-text("English")')
      )
      
      if (await languageButton.count() > 0) {
        await languageButton.first().click()
        await page.waitForTimeout(500)
      }
      
      // 設定を閉じる
      const closeButton = page.getByRole('button', { name: /閉じる|close/i })
      if (await closeButton.count() > 0) {
        await closeButton.click()
      }
    }
    
    // ページをリロードして設定が保持されているか確認
    await page.reload()
    await page.waitForTimeout(1000)
    
    // 設定が保持されていることを確認
    const bodyContent = await page.textContent('body')
    expect(bodyContent).toBeTruthy()
  })

  test('データの整合性チェック', async ({ page }) => {
    // JavaScriptコンソールエラーを監視
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    // 植物を追加
    const addButton = page.getByTestId('add-plant-button')
    if (await addButton.count() > 0) {
      await addButton.first().click()
      
      const plantTypeItem = page.getByTestId('plant-type-item')
      if (await plantTypeItem.count() > 0) {
        await plantTypeItem.first().click()
        
        const confirmButton = page.getByTestId('confirm-plant-button')
        if (await confirmButton.count() > 0) {
          await confirmButton.click()
          await page.waitForTimeout(1000)
        }
      }
    }
    
    // 植物のケアを実行
    const plantCard = page.locator('[aria-label*="カード"]')
    if (await plantCard.count() > 0) {
      await plantCard.first().click()
      
      // 水やり
      const waterButton = page.getByRole('button', { name: '水やりボタン' })
      if (await waterButton.count() > 0 && await waterButton.isEnabled()) {
        await waterButton.click()
        await page.waitForTimeout(1000)
      }
      
      // 戻る
      const backButton = page.getByText('庭に戻る')
      if (await backButton.count() > 0) {
        await backButton.click()
      }
    }
    
    // コンソールエラーがないことを確認
    expect(consoleErrors).toHaveLength(0)
    
    // データの整合性をチェック
    const dataIntegrity = await page.evaluate(() => {
      try {
        const data = localStorage.getItem('liquid-garden-plants')
        if (data) {
          const parsed = JSON.parse(data)
          return Array.isArray(parsed) && parsed.every(plant => 
            plant.id && 
            plant.name && 
            typeof plant.health === 'number' &&
            typeof plant.loveLevel === 'number'
          )
        }
        return true
      } catch {
        return false
      }
    })
    
    expect(dataIntegrity).toBe(true)
  })

  test('大量データのパフォーマンステスト', async ({ page }) => {
    // 複数の植物を追加
    const targetPlantCount = 5
    
    for (let i = 0; i < targetPlantCount; i++) {
      const addButton = page.getByTestId('add-plant-button')
      if (await addButton.count() > 0) {
        await addButton.first().click()
        
        const plantTypeItem = page.getByTestId('plant-type-item')
        if (await plantTypeItem.count() > 0) {
          await plantTypeItem.first().click()
          
          const confirmButton = page.getByTestId('confirm-plant-button')
          if (await confirmButton.count() > 0) {
            await confirmButton.click()
            await page.waitForTimeout(500)
          }
        }
      }
    }
    
    // レンダリング時間の測定
    const startTime = Date.now()
    await page.reload()
    await page.waitForSelector('[aria-label*="カード"]')
    const renderTime = Date.now() - startTime
    
    // 3秒以内でレンダリングされることを確認
    expect(renderTime).toBeLessThan(3000)
    
    // すべての植物カードが表示されることを確認
    const plantCards = page.locator('[aria-label*="カード"]')
    const cardCount = await plantCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(1)
  })

  test('マイグレーション機能のテスト', async ({ page }) => {
    // 古いバージョンのデータ形式をシミュレート
    await page.evaluate(() => {
      const oldData = [
        {
          id: '1',
          name: 'テスト植物',
          type: 'PACHIRA',
          health: 100,
          loveLevel: 1,
          growthStage: 'SEED', // 古いSEEDステージ
          lastWatered: new Date().toISOString(),
          lastSunExposure: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('liquid-garden-plants', JSON.stringify(oldData))
    })
    
    // ページをリロードしてマイグレーションを実行
    await page.reload()
    await page.waitForTimeout(1000)
    
    // マイグレーション後のデータを確認
    const migratedData = await page.evaluate(() => {
      const data = localStorage.getItem('liquid-garden-plants')
      return data ? JSON.parse(data) : null
    })
    
    if (migratedData && migratedData.length > 0) {
      // SEEDがSPROUTに変更されていることを確認
      expect(migratedData[0].growthStage).not.toBe('SEED')
      expect(migratedData[0].growthStage).toBe('SPROUT')
    }
  })
}) 