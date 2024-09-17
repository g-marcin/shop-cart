export const globalStateObject = {
  _cart: [],
  _renderedBrands: [],
  _renderedProducts: [],
  _checkedBrands: [],
  _grandTotal: 0,
  _shopScrollCount:0,
  // TODO: _fetchedProductsMap : new Map()
  // TODO: brandTotal
  // TODO: grandTotal
  // TODO: isProductChecked
  // TODO: isBrandChecked
  // TODO: isAllProductsChecked
  reset() {
    this._cart = [];
    this._renderedBrands = [];
    this._renderedProducts = [];
    this._checkedBrands = [];
    this._grandTotal = 0;
    console.log('cart-reset!'); 
  }
};

//TODO add reducer

export const fetchedProductsMap = new Map();

Object.defineProperty(globalStateObject, "cart", {
  get() {
    return this._cart;
  },
  set(newCart) {
    this._cart = newCart;
    let grandTotal = 0;
    const renderedBrands = [];
    const renderedProducts = [];
    const checkedBrands = [];
    newCart.forEach((brandGroup, index) => {
      brandGroup.id = index + 1;

      const brandTotal = brandGroup.brandProducts.reduce(
        (acc, current) => acc + current,
      );
      brandGroup.brandTotal = brandTotal;

      renderedBrands.push(brandGroup.brand);
      brandGroup.isChecked && checkedBrands.push(brandGroup.id);
      brandGroup.brandProducts.forEach((brandProduct) => {
        renderedProducts.push(brandProduct.product.id);
      });

      globalStateObject._renderedBrands = renderedBrands;
      globalStateObject._renderedProducts = renderedProducts;
      globalStateObject._checkedBrands = checkedBrands;
      globalStateObject._grandTotal = grandTotal;
    });
    console.log(globalStateObject);
  },
});
Object.defineProperty(globalStateObject, "renderdedBrands", {
  get() {
    return this.renderedBrands;
  },
  set(newCartProducts) {
    this._renderedBrands = newCartProducts;
  },
});
Object.defineProperty(globalStateObject, "renderedProducts", {
  get() {
    return this._renderedProducts;
  },
  set(newCartProducts) {
    this._renderedProducts = newCartProducts;
  },
});
