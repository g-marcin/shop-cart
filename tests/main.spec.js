import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1234')
})

test.describe('page-loads', () => {
    test('should load the page', async ({ page }) => {
        const title = await page.title()
        expect(title).toBe('shop-cart')
    })
})

test.describe('page-elements-load', () => {
    test('shop-container is rendered', async ({ page }) => {
        const contentShop = page.locator('.content__Shop')
        await expect(contentShop).toBeVisible({ timeout: 5000 })
    })

    test('shop-products are rendered', async ({ page }) => {
        const product = page.locator('.wrapper__Product').nth(0)
        await expect(product).toBeVisible({ timeout: 5000 })
    })
})

test.describe('shop-product-counter-controls', () => {
    test('check plus button', async ({ page }) => {
        const counterButtons = page.locator('.controller__CountButtons').nth(0)
        const counterButtonPlus = counterButtons
            .locator('.counter__Product')
            .nth(0)
        await counterButtonPlus.click()
        const counterDisplay = page.locator('.controller__Display').nth(0)

        const value = await counterDisplay.inputValue()
        expect(value).toBe('1')
    })

    test('check minus button', async ({ page }) => {
        const counterButtons = page.locator('.controller__CountButtons').nth(0)
        const counterButtonPlus = counterButtons
            .locator('.counter__Product')
            .nth(0)
        await counterButtonPlus.click()

        const counterButtonMinus = counterButtons
            .locator('.counter__Product')
            .nth(1)
        await counterButtonMinus.click()

        const counterDisplay = page.locator('.controller__Display').nth(0)
        const value = await counterDisplay.inputValue()
        expect(value).toBe('0')
    })
})

test.describe('add-to-cart', () => {
    test('possible to add product to cart', async ({ page }) => {
        const counterButtons = page.locator('.controller__CountButtons').nth(0)
        const counterButtonPlus = counterButtons
            .locator('.counter__Product')
            .nth(0)
        await counterButtonPlus.click()

        const addToCartButton = page.locator('.button__AddToCart').nth(0)
        await addToCartButton.click()

        const cartProduct = page.locator('.product__Cart__Data').nth(0)
        await expect(cartProduct).toBeVisible()
    })
})
