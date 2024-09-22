import {
    getBrandSet,
    getBrandTotal,
    getGrandTotal,
    getIsBrandCheckedSet,
    readProductCount,
    trimSpecialCharacters,
    trimWhiteSpace,
    increaseProductCount,
    decreaseProductCount,
    renderGrandTotal,
    increaseCartCount,
    decreaseCartCount,
    deleteProductHandler,
    getProductById,
    resetCart,
} from './helpers.js'

import { checkTruthyValues } from './helpers.js'

import { constants } from './constants.js'
const {
    PAGE_LOAD,
    PAGE_UNLOAD,
    UNHANDLED_REJECTION,
    BASE_URL,
    FETCH_PRODUCTS_LIMIT,
} = constants

import {
    getDataFromLocalStorage,
    saveDataToLocalStorage,
} from './localStorage.js'
import { fetchedProductsMap, globalStateObject } from './state.js'
import {
    getProductCardHTMLMarkup,
    getBrandBoxHTMLMarkup,
    getManufacturerProductHTMLMarkup,
} from './markup/index.js'

window.addEventListener(PAGE_LOAD, () => {
    window.globalStateObject = globalStateObject
    window.addToCartHandler = addToCartHandler
    window.deleteProductHandler = deleteProductHandler
    window.getGrandTotal = getGrandTotal
    window.getBrandTotal = getBrandTotal
    window.increaseProductCount = increaseProductCount
    window.decreaseProductCount = decreaseProductCount
    window.increaseCartCount = increaseCartCount
    window.decreaseCartCount = decreaseCartCount
    window.brandCheckboxHandler = brandCheckboxHandler
    window.productCheckboxHandler = productCheckboxHandler
    window.getDataFromLocalStorage = getDataFromLocalStorage
    window.getProductById = getProductById
    window.renderCart = renderCart
    window.resetCart = resetCart

    getDataFromLocalStorage()
    renderShop()
    renderCart()
    // renderMain()

    const rangeInput = document.querySelector('.windows-size-controller')
    rangeInput.addEventListener('input', observeInputValue)

    function observeInputValue(event) {
        const currentInputVale = event.target.value
        const rangeInputDisplay = document.querySelector(
            '.windows-size-controller-display'
        )
        rangeInputDisplay.innerHTML = currentInputVale
        manageShopWindowWidth(currentInputVale)
    }

    function manageShopWindowWidth(currentInputVale) {
        const mainElement = document.querySelector('.wrapper__Main')
        const shopWrapper = document.querySelector('.wrapper__Shop')
        const cartWrapper = document.querySelector('.wrapper__Cart')
        const CART_WIDTH = 400

        const MIN_SHOP_WIDTH = 440
        const MAIN_WIDTH = mainElement.offsetWidth
        const INPUT_PERCENTAGE = currentInputVale / 100
        if ((MAIN_WIDTH - CART_WIDTH) * INPUT_PERCENTAGE <= MIN_SHOP_WIDTH) {
            return
        }

        shopWrapper.style.width = `${(MAIN_WIDTH - CART_WIDTH) * INPUT_PERCENTAGE}px`
        cartWrapper.style.width = `${MAIN_WIDTH - (MAIN_WIDTH - CART_WIDTH) * INPUT_PERCENTAGE}px`
    }

    async function fetchProducts() {
        try {
            const response = await fetch(
                `${BASE_URL}?limit=${FETCH_PRODUCTS_LIMIT}`
            )
            const jsonData = await response.json()
            const { products } = jsonData
            return products
        } catch (e) {
            console.error('fetchProducts() method error')
            console.error(e)
            return []
        }
    }

    async function renderShop() {
        try {
            const products = await fetchProducts()
            products.map((fetchedProduct) => {
                if (!fetchedProduct.brand) {
                    fetchedProduct.brand = 'common products'
                }
                fetchedProductsMap.set(fetchedProduct.id, fetchedProduct)
                renderFetchedProduct(fetchedProduct, fetchedProduct.id)
            })
            function renderFetchedProduct(fetchedProduct) {
                const shopContent = document.querySelector('.content__Shop')
                const productHTMLMarkup =
                    getProductCardHTMLMarkup(fetchedProduct)
                shopContent.appendChild(productHTMLMarkup)
            }
        } catch (e) {
            console.error(e)
        }
    }
})

window.addEventListener(PAGE_UNLOAD, () => {
    saveDataToLocalStorage()
})
window.addEventListener(UNHANDLED_REJECTION, (e) => {
    console.error(e)
})

function addToCartHandler(e, id) {
    console.log(globalStateObject.cart)
    const { count } = readProductCount(id)
    const { title, brand: brandName, price } = fetchedProductsMap.get(id)
    const brand = trimSpecialCharacters(trimWhiteSpace(brandName))

    if (count === 0) {
        return
    }
    const findProduct = getProductById(id)
    if (!findProduct) {
        const brandSet = getBrandSet()
        const BRANDBOX_NOT_RENDERED = !brandSet.has(brand)
        if (BRANDBOX_NOT_RENDERED) {
            pushNewBrandGroup()
        }
        const BRANDBOX_IS_RENDERED = brandSet.has(brand)
        if (BRANDBOX_IS_RENDERED) {
            updateExistingBrandGroup()
        }
    }
    if (findProduct) {
        updateProductCount()
    }
    function pushNewBrandGroup() {
        globalStateObject.cart.push({
            brand: brand,
            isChecked: true,
            brandProducts: [
                {
                    product: {
                        id: id,
                        price: price,
                        title: title,
                        brand: brandName,
                    },
                    isChecked: true,
                    count: count,
                },
            ],
        })
    }
    function updateExistingBrandGroup() {
        let newCartProducts = [...globalStateObject.cart]
        newCartProducts.map((brandGroup) => {
            if (brandGroup.brand === brand) {
                brandGroup.brandProducts.push({
                    product: {
                        id: id,
                        price: price,
                        title: title,
                        brand: brandName,
                    },
                    isChecked: true,
                    count: count,
                })
            }
        })
    }
    function updateProductCount() {
        let newCartProducts = [...globalStateObject.cart]
        newCartProducts = newCartProducts.map((brandGroup) => {
            let newBrandProducts = [...brandGroup.brandProducts]
            newBrandProducts.map((brandProduct) => {
                if (brandProduct.product.id === id) {
                    brandProduct.count += count
                }
                return brandProduct
            })

            return brandGroup
        })
        globalStateObject.cart = [...newCartProducts]
    }
    function resetCounterDisplay() {
        e.target.parentElement.parentElement.querySelector(
            '.controller__Display'
        ).value = '0'
    }
    resetCounterDisplay()
    renderCart()
}
function productCheckboxHandler(id) {
    const isCheckedArray = []
    const currentProduct = getProductById(id)
    const {
        product: { brand },
    } = currentProduct
    globalStateObject._cart.forEach((brandGroup) => {
        brandGroup.brandProducts.forEach((brandProduct) => {
            if (brandProduct.product.id === id) {
                brandProduct.isChecked = !brandProduct.isChecked
                brandGroup.isChecked = false
            }
            if (brandGroup.brand === brand) {
                brandGroup.isChecked = false
            }
            isCheckedArray.push(brandProduct.isChecked)
            return brandProduct
        })
        if (checkTruthyValues(isCheckedArray)) {
            brandGroup.isChecked = true
        }
        return brandGroup
    })
    renderCart()
}
function brandCheckboxHandler(brand) {
    globalStateObject._cart.forEach((brandGroup) => {
        if (brandGroup.brand === brand) {
            brandGroup.isChecked = !brandGroup.isChecked
            brandGroup.brandProducts.forEach((brandProduct) => {
                brandProduct.isChecked = brandGroup.isChecked
            })
        }
        return brandGroup
    })
    renderCart()
}

//Renderers:
export function renderCart() {
    renderBrandBoxes()
    renderCartProducts()
    const grandTotal = getGrandTotal()
    renderGrandTotal(grandTotal)

    function renderBrandBoxes() {
        const brandSet = new Set()

        const cartContent = document.querySelector('.content__Cart')
        cartContent.innerHTML = ''

        globalStateObject._cart = globalStateObject._cart.map(
            (extendedProduct) => {
                const { brand, brandProducts } = extendedProduct
                const BRAND_LABEL = Array.isArray(brandProducts)
                    ? brandProducts[0].product.brand
                    : 'no-label'
                const isBrandCheckedSet = getIsBrandCheckedSet()
                const isChecked = isBrandCheckedSet.has(brand) ? 'checked' : ''
                const brandTotal = getBrandTotal(brand)
                const brandBox = getBrandBoxHTMLMarkup({
                    brand,
                    brandName: BRAND_LABEL,
                    brandTotal,
                    isChecked,
                })

                const BRANDBOX_NOT_RENDERED = !brandSet.has(brand)
                if (BRANDBOX_NOT_RENDERED) {
                    brandSet.add(brand)
                    cartContent.appendChild(brandBox)
                }
                return extendedProduct
            }
        )
    }
    function renderCartProducts() {
        const productSet = new Set()

        globalStateObject._cart.forEach((brandGroup) => {
            const { brand } = brandGroup
            brandGroup.brandProducts.forEach((brandProduct) => {
                const {
                    isChecked,
                    count,
                    product: { title, price, id },
                } = brandProduct

                const manufacturerProduct = getManufacturerProductHTMLMarkup({
                    id,
                    brand,
                    title,
                    price,
                    count,
                    isChecked,
                })

                const brandBox = document.querySelector(`.${brand}`)
                const PRODUCT_NOT_RENDERED = !productSet.has(id)
                if (PRODUCT_NOT_RENDERED) {
                    brandBox.appendChild(manufacturerProduct)
                    productSet.add(id)
                } else {
                    let previousProductElement = document.querySelector(
                        `.wrapper__Product__Cart__${id}`
                    )
                    if (previousProductElement) {
                        previousProductElement.remove()
                    }
                    if (brandBox) {
                        brandBox.appendChild(manufacturerProduct)
                        productSet.add(id)
                    }
                }
            })
            return brandGroup
        })
    }
}
