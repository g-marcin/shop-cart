export const helpers = {
    checkTruthyValues,
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
    deleteProductHandler,
    increaseCartCount,
    decreaseCartCount,
    getProductById,
    resetCart,
}

function getBrandSet() {
    const brandSet = new Set()
    globalStateObject.cart.forEach((brandGroup) => {
        brandSet.add(brandGroup.brand)
    })
    return brandSet
}
function getBrandTotal(brand) {
    let brandTotalArray = []
    let brandTotal = 0
    globalStateObject.cart.forEach((brandGroup) => {
        if (brandGroup.brand === brand) {
            let newBrandProducts = [...brandGroup.brandProducts]
            newBrandProducts
                .filter((brandProduct) => brandProduct.isChecked === true)
                .map((brandProduct) => {
                    const totalProduct =
                        brandProduct.product.price * brandProduct.count
                    brandTotalArray.push(totalProduct)
                })
        }
    })
    if (brandTotalArray.length !== 0) {
        brandTotal = brandTotalArray.reduce(
            (brandTotal, productTotal) => brandTotal + productTotal,
            0
        )
    }
    return brandTotal
}
function getGrandTotal() {
    const brandTotalArray = []

    globalStateObject._cart.forEach((brandGroup) => {
        brandTotalArray.push(getBrandTotal(brandGroup.brand))
    })
    if (brandTotalArray.length === 0) {
        return 0
    }
    const grandTotal = brandTotalArray.reduce(
        (grandTotal, brandTotal) => grandTotal + brandTotal
    )
    return grandTotal
}
function getIsBrandCheckedSet() {
    const isBrandCheckedSet = new Set()
    globalStateObject.cart.forEach((brandGroup) => {
        if (brandGroup.isChecked === true) {
            isBrandCheckedSet.add(brandGroup.brand)
        }
    })
    return isBrandCheckedSet
}
function readProductCount(id) {
    const count = Number(
        document.querySelector(`.controller__Display__${id}`).value
    )
    return { count: count }
}
function trimWhiteSpace(string) {
    return string.replace(/\s/g, '')
}
function trimSpecialCharacters(string) {
    return string.replace(/^a-zA-Z0-9 ]/g, '').replace(/[&-']/g, '')
}
export function checkTruthyValues(arr) {
    return arr.every((element) => Boolean(element) === true)
}

export function increaseProductCount(e) {
    const counterDisplay = e.target.parentElement.parentElement.querySelector(
        '.controller__Display'
    )
    counterDisplay.value++
}
export function decreaseProductCount(e) {
    const counterDisplay = e.target.parentElement.parentElement.querySelector(
        '.controller__Display'
    )
    Number(counterDisplay.value) >= 1 && counterDisplay.value--
}

function renderGrandTotal(grandTotalValue) {
    console.log('renderGrandTotal', grandTotalValue)
    const wrapperCart = document.querySelector('.wrapper__Cart')

    const wrapperGrandTotal = document.querySelector('.wrapper__Grand__Total')
    wrapperGrandTotal.remove()

    const newWrapperGrandTotal = document.createElement('div')
    newWrapperGrandTotal.className = 'wrapper__Grand__Total'
    newWrapperGrandTotal.innerHTML = `<span><label>
        Grand Total:
        <input class="grand__Total" disabled type="number" value=${grandTotalValue}  />
        </label>$</span>`
    wrapperCart.appendChild(newWrapperGrandTotal)
}
function decreaseCartCount(e, id) {
    const counterDisplay = e.target.parentElement.parentElement.querySelector(
        '.controller__Display'
    )
    if (Number(counterDisplay.value) < 1) {
        return
    }
    globalStateObject._cart.forEach((outerProduct) => {
        let newBrandProducts = [...outerProduct.brandProducts]
        newBrandProducts = newBrandProducts.map((brandProduct) => {
            if (brandProduct.product.id === id) {
                brandProduct.count--
            }
            return brandProduct
        })
        return outerProduct
    })
    renderCart()
}
function increaseCartCount(e, id) {
    globalStateObject._cart.forEach((brandGroup) => {
        brandGroup.brandProducts.map((brandProduct) => {
            if (brandProduct.product.id === id) {
                brandProduct.count++
            }
            return brandProduct
        })
        return brandGroup
    })
    renderCart()
}
function deleteProductHandler(id) {
    globalStateObject._cart = globalStateObject._cart
        .map((brandGroup) => {
            brandGroup.brandProducts = brandGroup.brandProducts.filter(
                (brandProduct) => brandProduct.product.id !== id
            )
            return brandGroup
        })
        .filter((brandGroup) => brandGroup.brandProducts.length !== 0)
    renderCart()
}
function getProductById(id) {
    let allProducts = []
    globalStateObject.cart.forEach((extendedProduct) => {
        allProducts = allProducts.concat(extendedProduct.brandProducts)
    })
    const productId = allProducts.filter(
        (brandProduct) => brandProduct.product.id === id
    )[0]
    return productId
}

function resetCart() {
    globalStateObject.reset()
    renderCart()
}
