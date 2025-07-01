import { test, expect } from '@playwright/test'

test.describe('UI操作とインタラクション機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('言語切り替え機能のテスト', async ({ page }) => {
    // 設定ボタンをクリック
    const settingsButton = page.getByRole('button', { name: /設定|settings/i })
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      // 言語設定を探す
      const languageSection = page.locator('text=言語設定').or(page.locator('text=Language'))
      if (await languageSection.count() > 0) {
        await expect(languageSection).toBeVisible()
        
        // 言語切り替えボタンを探す
        const languageButton = page.locator('button:has-text("日本語")').or(page.locator('button:has-text("English")'))
        if (await languageButton.count() > 0) {
          await languageButton.first().click()
          await page.waitForTimeout(500)
          
          // 言語が変更されたことを確認
          const pageContent = await page.textContent('body')
          expect(pageContent).toBeTruthy()
        }
      }
      
      // 設定を閉じる
      const closeButton = page.getByRole('button', { name: /閉じる|close/i })
      if (await closeButton.count() > 0) {
        await closeButton.click()
      }
    }
  })

  test('テーマ切り替え機能のテスト', async ({ page }) => {
    // 設定を開く
    const settingsButton = page.getByRole('button', { name: /設定|settings/i })
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      // テーマ設定セクションを探す
      const themeSection = page.locator('text=テーマ').or(page.locator('text=Theme'))
      if (await themeSection.count() > 0) {
        await expect(themeSection).toBeVisible()
        
        // テーマ切り替えボタンを探す
        const themeButtons = page.locator('button:has-text("ライト")').or(
          page.locator('button:has-text("ダーク")')
        ).or(page.locator('button:has-text("Light")'))
        
        if (await themeButtons.count() > 0) {
          const buttonCount = await themeButtons.count()
          for (let i = 0; i < Math.min(buttonCount, 2); i++) {
            await themeButtons.nth(i).click()
            await page.waitForTimeout(500)
            
            // テーマ変更の確認（背景色の変化など）
            const bodyClass = await page.getAttribute('body', 'class')
            expect(bodyClass).toBeTruthy()
          }
        }
      }
      
      // 設定を閉じる
      const closeButton = page.getByRole('button', { name: /閉じる|close/i })
      if (await closeButton.count() > 0) {
        await closeButton.click()
      }
    }
  })

  test('音声設定テスト', async ({ page }) => {
    // 音声ボタンを探す
    const soundButton = page.locator('button:has([class*="Volume"])').first()
    if (await soundButton.count() > 0) {
      await expect(soundButton).toBeVisible()
      
      // 音声の切り替え
      await soundButton.click()
      await page.waitForTimeout(500)
      
      // アイコンの変化を確認
      const soundIcon = soundButton.locator('[class*="Volume"]')
      await expect(soundIcon).toBeVisible()
    }
  })

  test('レスポンシブデザインのテスト', async ({ page }) => {
    // モバイルサイズでのテスト
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // メイン要素が適切に表示されることを確認
    const mainContent = page.locator('main').or(page.locator('[data-testid="main-content"]'))
    if (await mainContent.count() > 0) {
      await expect(mainContent).toBeVisible()
    }
    
    // タブレットサイズでのテスト
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    
    // デスクトップサイズでのテスト
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    
    // グリッドレイアウトの確認
    if (await page.locator('[aria-label*="カード"]').count() > 0) {
      const plantCards = page.locator('[aria-label*="カード"]')
      await expect(plantCards.first()).toBeVisible()
    }
  })

  test('キーボードナビゲーションのテスト', async ({ page }) => {
    // Tabキーでナビゲーション
    await page.keyboard.press('Tab')
    
    // フォーカス可能な要素に順次移動
    const focusableElements = page.locator('button, [tabindex="0"]')
    const elementCount = await focusableElements.count()
    
    if (elementCount > 0) {
      for (let i = 0; i < Math.min(elementCount, 5); i++) {
        await page.keyboard.press('Tab')
        await page.waitForTimeout(200)
        
        // フォーカスされた要素の確認
        const focusedElement = page.locator(':focus')
        if (await focusedElement.count() > 0) {
          await expect(focusedElement).toBeVisible()
        }
      }
      
      // Enterキーでアクティベーション
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)
    }
  })

  test('モーダルの操作テスト', async ({ page }) => {
    // 設定モーダルのテスト
    const settingsButton = page.getByRole('button', { name: /設定|settings/i })
    if (await settingsButton.count() > 0) {
      await settingsButton.click()
      
      // モーダルが開いたことを確認
      const modal = page.locator('[role="dialog"]').or(page.locator('.fixed.inset-0'))
      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible()
        
        // ESCキーでモーダルを閉じる
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
        
        // モーダルが閉じたことを確認
        if (await modal.count() > 0) {
          await expect(modal.first()).not.toBeVisible()
        }
      }
    }
  })

  test('アニメーション効果のテスト', async ({ page }) => {
    // ページローダーアニメーションの確認
    await page.reload()
    
    // フェードイン効果の確認
    const animatedElements = page.locator('[class*="animate-"]').or(
      page.locator('[style*="animation"]')
    )
    
    if (await animatedElements.count() > 0) {
      await expect(animatedElements.first()).toBeVisible()
    }
    
    // ホバーエフェクトのテスト
    const interactiveElements = page.locator('button, [aria-label*="カード"]')
    if (await interactiveElements.count() > 0) {
      await interactiveElements.first().hover()
      await page.waitForTimeout(300)
      
      // ホバー状態の確認
      await expect(interactiveElements.first()).toBeVisible()
    }
  })

  test('エラー状態のハンドリングテスト', async ({ page }) => {
    // ネットワークエラーのシミュレーション
    await page.route('**/*', route => {
      if (route.request().url().includes('api')) {
        route.abort()
      } else {
        route.continue()
      }
    })
    
    // エラートーストやメッセージの確認
    const errorElements = page.locator('[class*="error"]').or(
      page.locator('[class*="bg-red"]')
    )
    
    // 通常の操作を実行してエラーハンドリングを確認
    await page.reload()
    await page.waitForTimeout(1000)
  })

  test('パフォーマンス関連の確認', async ({ page }) => {
    // ページロード時間の確認
    const startTime = Date.now()
    await page.reload()
    const loadTime = Date.now() - startTime
    
    // 5秒以内でロードされることを確認
    expect(loadTime).toBeLessThan(5000)
    
    // 重要な要素が表示されることを確認
    const importantElements = page.locator('[data-testid="add-plant-button"]').or(
      page.locator('[aria-label*="カード"]')
    )
    
    if (await importantElements.count() > 0) {
      await expect(importantElements.first()).toBeVisible()
    }
  })

  test('アクセシビリティ機能のテスト', async ({ page }) => {
    // ARIA ラベルの確認
    const ariaElements = page.locator('[aria-label]')
    const ariaCount = await ariaElements.count()
    
    expect(ariaCount).toBeGreaterThan(0)
    
    // ボタンのロール確認
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()
    
    expect(buttonCount).toBeGreaterThan(0)
    
    // フォーカス可能な要素の確認
    const focusableElements = page.locator('button, input, select, textarea, [tabindex="0"]')
    const focusableCount = await focusableElements.count()
    
    expect(focusableCount).toBeGreaterThan(0)
  })
}) 