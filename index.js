let fetchedProductsMap = new Map();
let cartProducts = [];

let isBrandCheckedSet = new Set();

window.addEventListener("load", async () => {
  initializeShopDisplay();
  initializeCartDisplay();
});

function appendFetchedProduct(fetchedProduct) {
  const shopContent = document.querySelector(".content__Shop");
  const product = getFetchedProduct(fetchedProduct);
  shopContent.appendChild(product);

  function DisplayAddToCartButton() {
    const addButton = document.createElement("button");
    addButton.className = "button__DisplayAddToCartButton";
    addButton.innerHTML = '<i class="fa-solid fa-cart-plus fa-xl"></i>';
    addButton.onclick = () => {
      const id = Number(addButton.parentElement.querySelector(".product__Id").innerText);
      const count = Number(addButton.parentElement.querySelector(".counter__Display").value);
      const title = fetchedProductsMap.get(id).title;
      const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
      const price = Number(fetchedProductsMap.get(id).price);

      const newCartProducts = [...cartProducts];
      if (count === 0) {
        return;
      }
      const findId = newCartProducts.filter((product) => product.id === Number(id)); //x
      if (findId.length === 0) {
        cartProducts.push({
          id: id,
          price: price,
          title: title,
          brand: brand,
          count: count,
          isChecked: true,
        });
      } else {
        cartProducts[cartProducts.indexOf(findId[0])].count += count;
      }
      addButton.parentElement.querySelector(".counter__Display").value = "0"; //x
      renderCart();
      isBrandCheckedSet.delete(brand);
      setGrandTotal();
      console.log(cartProducts);
    };
    product.appendChild(addButton);
  }
  DisplayAddToCartButton();
}
function renderManufacturerBoxes() {
  const cartContent = document.querySelector(".content__Cart");
  cartContent.innerHTML = "";
  const brandSet = new Set();

  let newCartProducts = [...cartProducts];
  newCartProducts = newCartProducts.map((product) => {
    const manufacturerBox = getManufacturerBox(product.brand);
    if (!brandSet.has(product.brand)) {
      cartContent.appendChild(manufacturerBox);
      brandSet.add(product.brand);
    }
    return product;
  });
  cartProducts = [...newCartProducts];
}
function renderProducts() {
  let newCartProducts = [...cartProducts];
  const productSet = new Set();
  newCartProducts = newCartProducts.map(({ id, title, price, count, brand }) => {
    const manufacturerBox = document.querySelector(`.${brand}`);
    const manufacturerProduct = getManufacturerProduct(id, brand, title, price, count);
    if (!productSet.has(id)) {
      manufacturerBox.appendChild(manufacturerProduct);
      productSet.add(id);
    } else {
      let oldProduct = document.querySelector(`.wrapper__Product__Cart__${id}`);
      if (oldProduct) {
        oldProduct.remove();
      }
      if (manufacturerBox) {
        manufacturerBox.appendChild(manufacturerProduct);
        productSet.add(id);
      }
    }
    cartProducts = [...newCartProducts];

    function updateCheckboxState() {
      const currentProduct = getCurrentProduct(id);
      const currentCheckbox = document.querySelector(`.checkbox__Product__${id}`);
      if (!currentCheckbox) {
        return;
      }
      if (!isBrandCheckedSet.has(brand)) {
        currentCheckbox.checked = currentProduct.isChecked;
      } else {
        currentCheckbox.checked = false;
      }
    }
    updateCheckboxState();
  });
}
window.addEventListener("unload", (e) => {
  saveDataToLocalStorage();
});
function ProductCheckboxHandler(id) {
  const currentProduct = getCurrentProduct(id);
  const { brand, price, count, isChecked } = currentProduct;

  if (isBrandCheckedSet.has(brand)) {
    setBrandProductsState(brand, false);
    const manufacturerCheckbox = document.querySelector(`.checkbox__Manufacturer__${brand}`);
    manufacturerCheckbox.checked = false;
  }

  findProductAndApply(id, (product) => {
    product.isChecked = !product.isChecked;
  });
  updateBrandTotal(id, brand, price, count, isChecked);
  const newBrandTotal = getBrandTotal(brand);
  newTotalDisplay(newBrandTotal, brand);
  setGrandTotal();
}
function ManufacturerCheckboxHandler(brand) {
  if (!isBrandCheckedSet.has(brand)) {
    setBrandProductsState(brand, true);
  } else {
    setBrandProductsState(brand, false);
  }
  console.log(getBrandTotal(brand));
}
function incrementCount(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  counterDisplay.value++;
  if (e.target.className === "counter__Cart") {
    incrementCartCount(id);
  }
}
function decrementCount(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (Number(counterDisplay.value) < 1) {
    return;
  }
  if (e.target.className === "counter__Cart") {
    decrementCartCount(id);
  }
  counterDisplay.value--;
}
function incrementCartCount(id) {
  const currentProduct = getCurrentProduct(Number(id));
  const { brand, price, count } = currentProduct;
  const currentValue = getBrandTotal(brand);
  const newBrandTotal = currentValue + price;
  if (currentProduct.isChecked === true) {
    updateBrandTotal(brand);

    newTotalDisplay(newBrandTotal, brand);
  }
  let newCartProducts = [...cartProducts];
  newCartProducts.map((product) => {
    if (Number(id) === product.id) {
      product.count++;
    }
  });
  cartProducts = [...newCartProducts];
  setGrandTotal();
  console.log("+1");
}
function decrementCartCount(id) {
  const counterDisplay = document.querySelector(`.counter__Display__${id}`);
  const currentProduct = fetchedProductsMap.get(id);
  const brand = trimWhiteSpace(trimSpecialCharacters(currentProduct.brand));
  const price = currentProduct.price;
  const currentValue = getBrandTotal(brand);
  const newBrandTotal = currentValue - price;
  if (getCurrentProduct(id).isChecked === true) {
    newTotalDisplay(newBrandTotal, brand);
  }
  let newCartProducts = [...cartProducts];
  newCartProducts = cartProducts.map((product) => {
    if (Number(id) === product.id) {
      product.count = counterDisplay.value;
    }
    return product;
  });
  cartProducts = [...newCartProducts];
  setGrandTotal();
}
function deleteProduct(id) {
  const currentProduct = getCurrentProduct(parseInt(id));
  const { price, count, isChecked } = currentProduct;
  const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
  const wrapperManufacturer = document.querySelector(`.wrapper__Manufacturer__${brand}`);
  const product = document.querySelector(`.wrapper__Product__Cart__${id}`);
  const productSet = getProductSet();
  if (productSet.has(id)) {
    const newCartProducts = cartProducts.filter((product) => product.id !== Number(id));
    cartProducts = [...newCartProducts];
    product.remove();
    updateBrandTotal(id, brand, price, count, isChecked);

    const manufacturerProducts = wrapperManufacturer.querySelector(`.${brand}`);
    if (cartProducts.filter((product) => product.brand === brand).length === 0) {
      removeManufacturerBox(brand, id);
    }
  }

  updateBrandTotal(brand);
  const newBrandTotal = getBrandTotal(brand);
  newTotalDisplay(newBrandTotal, brand);
  isBrandCheckedSet.delete(brand);
  setGrandTotal();
}

function updateBrandTotal(brand) {
  const brandSet = getBrandSet();
  const newBrandTotal = getBrandTotal(brand);

  if (brandSet.has(brand)) {
    const newDisplay = newTotalDisplay(newBrandTotal, brand);
    const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
    if (wrapperManufacturerTotal) {
      wrapperManufacturerTotal.appendChild(newDisplay);
    }
  }
}
function setGrandTotal() {
  const grandTotalValue = getGrandTotal();
  getGrandTotalBox(grandTotalValue);
}
function newTotalDisplay(newBrandTotal, brand) {
  const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
  const brandCountDisplay = document.querySelector(`.total__Manufacturer__${brand}`);
  const newTotalDisplay = document.createElement("input");
  newTotalDisplay.disabled = true;
  newTotalDisplay.className = `total__Manufacturer total__Manufacturer__${brand}`;
  newTotalDisplay.value = newBrandTotal;

  if (brandCountDisplay) {
    brandCountDisplay.remove();
  }
  if (wrapperManufacturerTotal) {
    wrapperManufacturerTotal.appendChild(newTotalDisplay);
  }
  return newTotalDisplay;
}
function saveDataToLocalStorage() {
  const fetchedProductsMapJSON = mapToJSON(fetchedProductsMap);
  const cartProductsJSON = JSON.stringify(cartProducts);
  const isBrandCheckedSetJSON = setToJSON(isBrandCheckedSet);

  window.localStorage.clear();
  window.localStorage.setItem("fetchedProductsMapJSON", fetchedProductsMapJSON);
  window.localStorage.setItem("cartProductsJSON", cartProductsJSON);
  window.localStorage.setItem("isBrandCheckedSetJSON", isBrandCheckedSetJSON);
  window.localStorage.setItem("data", "true");
}
function getFetchedProduct(fetchedProduct) {
  const product = document.createElement("div");
  product.className = `wrapper__Product`;
  product.innerHTML = `
  <div class="product__Id">${fetchedProduct.id}</div>
  <img class="product__Thumbnail" src="${fetchedProduct.images[0]}" alt = "product_Thumbnail"/>
  <div class="product__Title">${fetchedProduct.title}</div>
  <div class="product__Brand">${fetchedProduct.brand}</div>
  <div class="product__Description">${fetchedProduct.description}</div>
  <div class="product__Price">${fetchedProduct.price}</div>
  <div class="product__Count">
  <div class="product__Counter">
    <input
      type="number"
      disabled
      class="counter__Display"
      value="0"
    />
    <div>
      <button class="counter__Product" onclick="incrementCount(event)"> + </button>
      <button class="counter__Product"  onclick="decrementCount(event)"> - </button>
    </div>
  </div>  
  `;
  return product;
}
function getManufacturerBox(brand) {
  const brandTotal = getBrandTotal(brand);
  const manufacturerBox = document.createElement("div");
  manufacturerBox.className = `wrapper__Manufacturer__${brand}`;
  manufacturerBox.innerHTML = ` 
      <div class="manufacturer__Header">
        <input type="checkbox" class="checkbox__Manufacturer__${brand}" onclick="ManufacturerCheckboxHandler('${brand}')"  />
        <div class="manufacturer__Name">${brand}</div>
      </div>
      <div class="manufacturer__Products__${brand} ${brand}">
     
      </div>
      <div class="manufacturer__Total__${brand} manufacturer__Total" >
        Total:<input disabled class="total__Manufacturer total__Manufacturer__${brand}" value=${brandTotal} />
      </div>
    `;

  return manufacturerBox;
}
function getManufacturerProduct(id, brand, title, price, count) {
  const manufacturerProduct = document.createElement("div");
  manufacturerProduct.className = `wrapper__Product__Cart__${id}`;
  manufacturerProduct.innerHTML = `
    <div class=product__Cart__Data >
      <label for=""> <input type="checkbox" class="checkbox__Product__${id} checkbox__Product__${brand}"  onclick="ProductCheckboxHandler(${id})" checked  />${title}</label>
      <div>${price}</div>
      <div class="product__Counter" >
      <input
        type="number"
        disabled
        class="counter__Display counter__Display__${id}"
        value=${count}
      />
      <div class="wrapper__Counter">
        <button class="counter__Cart" onclick="incrementCount(event,${id})">+</button>
        <button class="counter__Cart" onclick="decrementCount(event,${id})">-</button>
      </div>
    </div>
    <button class="button__Delete" onclick="deleteProduct(${id})"><i class="fa-solid fa-trash fa-lg"></i></button>
    </div>
  `;
  return manufacturerProduct;
}
function getGrandTotalBox(grandTotalValue) {
  const wrapperCart = document.querySelector(".wrapper__Cart");
  const wrapperGrandTotal = document.querySelector(".wrapper__Grand__Total");
  const newWrapperGrandTotal = document.createElement("div");
  newWrapperGrandTotal.className = "wrapper__Grand__Total";
  newWrapperGrandTotal.innerHTML = `<label for="">
         Grand Total:
          <input class="grand__Total" disabled type="number" value=${grandTotalValue}  />
         </label>`;
  wrapperGrandTotal.remove();
  wrapperCart.appendChild(newWrapperGrandTotal);
}
function removeManufacturerBox(brand, id) {
  const wrapperManufacturer = document.querySelector(`.wrapper__Manufacturer__${brand}`);
  wrapperManufacturer.remove();
  isBrandCheckedSet.delete(brand);
}
//Helpers
function mapToJSON(map) {
  return JSON.stringify(Object.fromEntries(map));
}
function JSONtoMap(json) {
  const obj = JSON.parse(json);
  return new Map(Object.entries(obj));
}
function setToJSON(set) {
  return JSON.stringify(Array.from(set));
}
function JSONtoSet(json) {
  return new Set(JSON.parse(json));
}
function trimWhiteSpace(string) {
  return string.replace(/\s/g, "");
}
function trimSpecialCharacters(string) {
  return string.replace(/^a-zA-Z0-9 ]/g, "").replace(/[&-']/g, "");
}
function getCurrentProduct(id) {
  return cartProducts.filter((product) => product.id === Number(id))[0];
}
function clearProductsCheckboxes(brand) {
  const brandCheckboxArray = document.getElementsByClassName(`checkbox__Product__${brand}`);
  for (let productCheckbox of brandCheckboxArray) {
    productCheckbox.checked = false;
  }
}
function setBrandProductsState(brand, areChecked) {
  let newCartProducts = [...cartProducts];
  newCartProducts = newCartProducts.map((product) => {
    if (product.brand === brand) {
      product.isChecked = areChecked;
    }
    return product;
  });
  cartProducts = [...newCartProducts];

  if (areChecked) {
    isBrandCheckedSet.add(brand);
    clearProductsCheckboxes(brand);
  } else {
    isBrandCheckedSet.delete(brand);
  }
  const newBrandTotal = getBrandTotal(brand);
  newTotalDisplay(newBrandTotal, brand);
  setGrandTotal();
}
function findProductAndApply(id, cb) {
  cartProducts.forEach((product) => {
    if (product.id === Number(id)) {
      cb(product);
    }
  });
}
function getProductCheckboxState(id) {
  const { brand } = getCurrentProduct(id);
  const productCheckbox = document.querySelector(`.checkbox__Product__${id}`);
  if (isBrandCheckedSet.has(brand)) {
    productCheckbox.checked = false;
  } else {
    const currentProduct = getCurrentProduct(id);
    productCheckbox.checked = currentProduct.isChecked;
  }
}
function initializeCartDisplay() {
  // getDataFromLocalStorage();
  const brandSet = getBrandSet();
  if (brandSet.size === 0) {
    return;
  }
  const cartContent = document.querySelector(".content__Cart");
  const initialBrands = Array.from(brandSet);

  initialBrands.forEach((brand) => {
    const manufacturerBox = getManufacturerBox(brand);
    cartContent.appendChild(manufacturerBox);
    const manufacturerCheckbox = document.querySelector(`.checkbox__Manufacturer__${brand}`);
    if (isBrandCheckedSet.has(brand)) {
      manufacturerCheckbox.checked = true;
    }
  });

  cartProducts.forEach(({ id, title, price, count, brand }) => {
    const manufacturerBox = document.querySelector(`.${brand}`);
    const manufacturerProduct = getManufacturerProduct(id, brand, title, price, count);
    manufacturerBox.appendChild(manufacturerProduct);
    getProductCheckboxState(id);
  });
  setGrandTotal();
}
async function initializeShopDisplay() {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();
  const { products } = jsonData;
  products.map((fetchedProduct) => {
    appendFetchedProduct(fetchedProduct, fetchedProduct.id);
    fetchedProductsMap.set(fetchedProduct.id, fetchedProduct);
  });
}
function getBrandSet() {
  const brandSet = new Set();

  if (cartProducts.length !== 0) {
    cartProducts.forEach((product) => brandSet.add(product.brand));
  }

  return brandSet;
}
function getProductSet() {
  const productSet = new Set();
  if (cartProducts.length === 0) {
    return productSet;
  }
  let newCartProducts = [...cartProducts];
  newCartProducts = newCartProducts.map((product) => {
    productSet.add(product.id);
  });
  return productSet;
}
function getBrandTotal(brand) {
  const newCartProducts = [...cartProducts];
  const brandTotal = newCartProducts
    .filter((product) => product.brand === brand)
    .filter((product) => product.isChecked === true)
    .reduce((acc, val) => acc + val.price * val.count, 0);
  return brandTotal;
}
function getGrandTotal() {
  let newCartProducts = [...cartProducts];
  const grandTotal = newCartProducts.reduce((acc, val) => acc + val.count * val.price, 0);
  return grandTotal;
}
function getDataFromLocalStorage() {
  if (window.localStorage.getItem("fetchedProductMapJSON")) {
    fetchedProductsMap = JSONtoMap(window.localStorage.getItem("fetchedProductMapJSON"));
  }
  if (window.localStorage.getItem("cartProductsJSON")) {
    cartProducts = JSON.parse(window.localStorage.getItem("cartProductsJSON"));
  }
  // if (window.localStorage.getItem("brandTotalMapJSON")) {
  //   brandTotalMap = JSONtoMap(window.localStorage.getItem("brandTotalMapJSON"));
  // }
  // if (window.localStorage.getItem("brandSetJSON")) {
  //   brandSet = JSONtoSet(window.localStorage.getItem("brandSetJSON"));
  // }
  // if (window.localStorage.getItem("productSetJSON")) {
  //   productSet = JSONtoSet(window.localStorage.getItem("productSetJSON"));
  // }
  if (window.localStorage.getItem("isBrandCheckedSetJSON")) {
    isBrandCheckedSet = JSONtoSet(window.localStorage.getItem("isBrandCheckedSetJSON"));
  }
}
function renderCart() {
  renderManufacturerBoxes();
  renderProducts();
}
function renderBrandTotal(brand) {
  const newCartProducts = [...cartProducts];
  const brandTotal = newCartProducts.filter((product) => product.brand === brand).reduce((acc, val) => acc + val.price * val.count, 0);
  return brandTotal;
}
