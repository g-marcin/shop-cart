export function getDataFromLocalStorage() {
  try {
    const cartProductsJSON = window.localStorage.getItem("cartProductsJSON");
    globalStateObject.cart = cartProductsJSON
      ? JSON.parse(cartProductsJSON)
      : [];
  } catch (e) {
    console.error(e);
  }
}

export function saveDataToLocalStorage() {
  window.localStorage.clear();
  window.localStorage.setItem(
    "cartProductsJSON",
    JSON.stringify(globalStateObject.cart),
  );
}
