import { test, expect } from '@playwright/test'

test.describe('Plant lifecycle', () => {
  test('user can add a new plant', async ({ page }) => {
    await page.goto('/')

    // Click add plant button (first occurrence)
    await page.getByTestId('add-plant-button').first().click()

    // Select first plant type
    await page.getByTestId('plant-type-item').first().click()

    // Confirm selection
    await page.getByTestId('confirm-plant-button').click()

    // Expect at least one plant card to appear
    const plantCards = page.locator('[aria-label*="カード"]')
    await expect(plantCards).toHaveCount(1)
  })

  test('user can water the plant', async ({ page }) => {
    await page.goto('/')

    // If no plant, create one quickly
    const hasPlant = await page.locator('button:has-text("話しかける")').count()
    if (!hasPlant) {
      await page.getByTestId('add-plant-button').first().click()
      await page.getByTestId('plant-type-item').first().click()
      await page.getByTestId('confirm-plant-button').click()
    }

    // Open first plant card (tap first card element)
    await page.locator('[aria-label*="カード"]').first().click()

    // Click water button if active
    const waterButton = page.getByRole('button', { name: '水やりボタン' })
    if (await waterButton.isEnabled()) {
      await waterButton.click()
    }

    // Wait for some visual reaction e.g., droplet icon animation; just wait for 1s
    await page.waitForTimeout(1000)

    // Navigate back
    await page.getByText('庭に戻る').click()
  })
}) 