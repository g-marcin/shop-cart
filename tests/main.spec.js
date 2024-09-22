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
        const counterButtonPlus = page.getByTestId('shop_product_plus').nth(0)
        await counterButtonPlus.evaluate((button) => button.click())
        const counterDisplay = page.locator('.controller__Display').nth(0)

        const value = await counterDisplay.inputValue()
        expect(value).toBe('1')
    })

    test('check minus button', async ({ page }) => {
        const counterButtonPlus = page.getByTestId('shop_product_plus').nth(0)
        await counterButtonPlus.evaluate((button) => button.click())

        const counterButtonMinus = page.getByTestId('shop_product_minus').nth(0)
        await counterButtonMinus.evaluate((button) => button.click())

        const counterDisplay = page.locator('.controller__Display').nth(0)
        const value = await counterDisplay.inputValue()
        expect(value).toBe('0', { timeout: 5000 })
    })
})

test.describe('add-to-cart', () => {
    test('possible to add product to cart', async ({ page }) => {
        const counterButtonPlus = page.getByTestId('shop_product_plus').nth(0)

        // await counterButtonPlus.click()
        await counterButtonPlus.evaluate((button) => button.click())

        const addToCartButton = page.getByTestId('add_to_cart').nth(0)
        await addToCartButton.evaluate((button) => button.click())

        const cartProduct = page.locator('.product__Cart__Data').nth(0)
        //   expect(cartProduct).toBeDefined()
        expect(cartProduct).toBeDefined()
    })
})
