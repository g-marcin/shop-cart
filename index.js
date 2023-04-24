let fetchedProductsMap = new Map();
let cartProducts = [];
let improvedCartProducts = [];

window.addEventListener("load", async () => {
  renderShop();
  initializeCartDisplay();
});
window.addEventListener("unload", (e) => {
  saveDataToLocalStorage();
});
//load/save:
function initializeCartDisplay() {
  getDataFromLocalStorage();
  renderCart();
}
async function renderShop() {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();
  const { products } = jsonData;
  products.map((fetchedProduct) => {
    renderFetchedProduct(fetchedProduct, fetchedProduct.id);
    fetchedProductsMap.set(fetchedProduct.id, fetchedProduct);
  });
}
function getDataFromLocalStorage() {
  if (window.localStorage.getItem("cartProductsJSON")) {
    cartProducts = JSON.parse(window.localStorage.getItem("cartProductsJSON"));
  }
}
function saveDataToLocalStorage() {
  const fetchedProductsMapJSON = mapToJSON(fetchedProductsMap);
  const cartProductsJSON = JSON.stringify(cartProducts);
  window.localStorage.clear();
  window.localStorage.setItem("fetchedProductsMapJSON", fetchedProductsMapJSON);
  window.localStorage.setItem("cartProductsJSON", cartProductsJSON);
}
//Handlers:
function addToCartHandler(e, id) {
  const count = Number(e.target.parentElement.parentElement.querySelector(".counter__Display").value);
  const title = fetchedProductsMap.get(id).title;
  const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
  const price = Number(fetchedProductsMap.get(id).price);
  const brandSet = getBrandSet();
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
    if (!brandSet.has(brand)) {
      improvedCartProducts.push({
        brand: brand,
        isChecked: true,
        brandProducts: [
          {
            product: { id: id, price: price, title: title, brand: brand },
            isChecked: true,
            count: count,
          },
        ],
      });
    } else {
      let newImprovedCartProducts = [...improvedCartProducts];
      newImprovedCartProducts = newImprovedCartProducts.map((group) => {
        if (group.brand === brand) {
          newBrandProducts = [...group.brandProducts];
          group.brandProducts.push({
            product: { id: id, price: price, title: title, brand: brand },
            isChecked: true,
            count: count,
          });
        }
      });
    }
  } else {
    cartProducts[cartProducts.indexOf(findId[0])].count += count;
    let newImprovedCartProducts = [...improvedCartProducts];
    newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
      let newBrandProducts = [...brandGroup.brandProducts];
      newBrandProducts = newBrandProducts.map((brandProduct) => {
        if (brandProduct.product.id === id) {
          brandProduct.count += count;
        }
        return brandProduct;
      });

      return brandGroup;
    });
    improvedCartProducts = [...newImprovedCartProducts];
  }
  e.target.parentElement.parentElement.querySelector(".counter__Display").value = "0"; //x
  console.log(getImprovedProduct(id));
  renderCart();
  // console.log(improvedCartProducts);
}
function ProductCheckboxHandler(id) {
  const currentProduct = getCurrentProduct(id);
  const { brand } = currentProduct;
  const isBrandCheckedSet = getIsBrandCheckedSet();
  if (isBrandCheckedSet.has(brand)) {
    setBrandProductsState(brand, false);
    const manufacturerCheckbox = document.querySelector(`.checkbox__Manufacturer__${brand}`);
    manufacturerCheckbox.checked = false;
  }
  findProductAndApply(id, (product) => {
    product.isChecked = !product.isChecked;
  });

  renderCart();
}
function BrandCheckboxHandler(brand) {
  const isBrandCheckedSet = getIsBrandCheckedSet();
  if (!isBrandCheckedSet.has(brand)) {
    setBrandProductsState(brand, true);
    setProductCheckboxes(brand, true);
  } else {
    setBrandProductsState(brand, false);
    setProductCheckboxes(brand, false);
  }
  renderCart();
  function setProductCheckboxes(brand, areChecked) {
    const brandCheckboxArray = document.getElementsByClassName(`checkbox__Product__${brand}`);
    for (let productCheckbox of brandCheckboxArray) {
      productCheckbox.checked = areChecked;
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

    renderCart();
  }
}
function incrementCountHandler(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  counterDisplay.value++;
  if (e.target.className === "counter__Cart") {
    incrementCartCount(id);
  }
  function incrementCartCount(id) {
    const currentProduct = getCurrentProduct(Number(id));
    const { brand } = currentProduct;

    let newCartProducts = [...cartProducts];
    newCartProducts.map((product) => {
      if (Number(id) === product.id) {
        product.count++;
      }
    });
    cartProducts = [...newCartProducts];
    renderCart();
  }
}
function decrementCountHandler(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (Number(counterDisplay.value) >= 2) {
    counterDisplay.value--;
  }
  if (e.target.className === "counter__Cart") {
    decrementCartCount(id);
  }
  function decrementCartCount(id) {
    const counterDisplay = document.querySelector(`.counter__Display__${id}`);
    const currentProduct = getCurrentProduct(id);
    const brand = currentProduct.brand;
    let newCartProducts = [...cartProducts];
    newCartProducts = cartProducts.map((product) => {
      if (Number(id) === product.id) {
        if (product.count >= 2) {
          product.count--;
        }
      }
      return product;
    });
    cartProducts = [...newCartProducts];
    renderCart();
  }
}
function deleteProduct(id) {
  const currentProduct = getCurrentProduct(parseInt(id));
  const { brand } = currentProduct;
  const product = document.querySelector(`.wrapper__Product__Cart__${id}`);
  const productSet = getProductSet();
  if (productSet.has(id)) {
    const newCartProducts = cartProducts.filter((product) => product.id !== Number(id));
    cartProducts = [...newCartProducts];
    product.remove();
    if (cartProducts.filter((product) => product.brand === brand).length === 0) {
      removeManufacturerBox(brand, id);
    }
  }
  renderCart();

  function removeManufacturerBox(brand) {
    const wrapperManufacturer = document.querySelector(`.wrapper__Manufacturer__${brand}`);
    wrapperManufacturer.remove();
  }
}
//Renderers:
function renderFetchedProduct(fetchedProduct) {
  const shopContent = document.querySelector(".content__Shop");
  const product = getFetchedProductMarkup(fetchedProduct);
  shopContent.appendChild(product);
}
function renderCart() {
  // renderBrandBoxes();
  // renderCartProducts();
  renderImprovedBrandBoxes();
  // renderCartProducts();
  renderImprovedCartProducts();
  renderGrandTotal();
}
function renderBrandBoxes() {
  const cartContent = document.querySelector(".content__Cart");
  cartContent.innerHTML = "";
  const brandSet = new Set();
  let newCartProducts = [...cartProducts];
  newCartProducts = newCartProducts.map((product) => {
    const manufacturerBox = getManufacturerBoxMarkup(product.brand);
    if (!brandSet.has(product.brand)) {
      cartContent.appendChild(manufacturerBox);
      brandSet.add(product.brand);
    }
    return product;
  });
  cartProducts = [...newCartProducts];
}

function renderImprovedBrandBoxes() {
  const cartContent = document.querySelector(".content__Cart");
  cartContent.innerHTML = "";
  const brandSet = new Set();

  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((improvedProduct) => {
    const manufacturerBox = getManufacturerBoxMarkup(improvedProduct.brand);
    if (!brandSet.has(improvedProduct.brand)) {
      brandSet.add(improvedProduct.brand);

      cartContent.appendChild(manufacturerBox);
    }
    return improvedProduct;
  });
  improvedCartProducts = [...newImprovedCartProducts];
}

function renderCartProducts() {
  const productSet = new Set();
  let newCartProducts = [...cartProducts];
  newCartProducts = newCartProducts.map(({ id, brand }) => {
    const manufacturerBox = document.querySelector(`.${brand}`);
    const manufacturerProduct = getManufacturerProductMarkup(id);
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
      const isBrandCheckedSet = getIsBrandCheckedSet();
      if (!isBrandCheckedSet.has(brand)) {
        currentCheckbox.checked = currentProduct.isChecked;
      } else {
        currentCheckbox.checked = false;
      }
    }
    updateCheckboxState();
  });
}
function renderImprovedCartProducts() {
  const productSet = new Set();
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map(({ brand, brandProducts, isChecked }) => {
    let newBrandProducts = [...brandProducts];
    newBrandProducts = newBrandProducts.map((product) => {
      const manufacturerBox = document.querySelector(`.${brand}`);
      const manufacturerProduct = getManufacturerProductMarkup(product.id);
      if (!productSet.has(product.id)) {
        manufacturerBox.appendChild(manufacturerProduct);
        productSet.add(product.id);
      } else {
        let oldProduct = document.querySelector(`.wrapper__Product__Cart__${product.id}`);
        if (oldProduct) {
          oldProduct.remove();
        }
        if (manufacturerBox) {
          manufacturerBox.appendChild(manufacturerProduct);
          productSet.add(product.id);
        }
      }
      return product;
    });
  });
}
function renderGrandTotal() {
  const grandTotalValue = getGrandTotal();
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
function getFetchedProductMarkup(fetchedProduct) {
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
      <button class="counter__Product" onclick="incrementCountHandler(event)">+</button>
      <button class="counter__Product"  onclick="decrementCountHandler(event)">-</button>
    </div>
    </div>  
    <button class="button__DisplayAddToCartHandlerButton" onClick='addToCartHandler(event,${fetchedProduct.id})'><i class="fa-solid fa-cart-plus fa-xl"></i></button>
  `;
  return product;
}
function getManufacturerBoxMarkup(brand) {
  const isBrandCheckedSet = getIsBrandCheckedSet();
  const isChecked = isBrandCheckedSet.has(brand) ? "checked" : "";
  const brandTotal = getBrandTotal(brand);
  const manufacturerBox = document.createElement("div");
  manufacturerBox.className = `wrapper__Manufacturer__${brand}`;
  manufacturerBox.innerHTML = ` 
      <div class="manufacturer__Header">
        <input type="checkbox" class="checkbox__Manufacturer__${brand}" onclick="BrandCheckboxHandler('${brand}')" ${isChecked}/>
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
function getManufacturerProductMarkup(id) {
  const currentProduct = getCurrentProduct(id);
  const currentImprovedProduct = getImprovedProduct(id);
  console.log(currentImprovedProduct);
  // const { title, brand, price, count, isChecked } = currentProduct;
  const { title, brand, price } = currentImprovedProduct.product;
  const count = currentImprovedProduct.count;
  const isChecked = currentImprovedProduct.isChecked;

  const manufacturerProduct = document.createElement("div");
  manufacturerProduct.className = `wrapper__Product__Cart__${id}`;
  manufacturerProduct.innerHTML = `
    <div class=product__Cart__Data >
      <label for=""> <input type="checkbox" class="checkbox__Product__${id} checkbox__Product__${brand}"  onclick="ProductCheckboxHandler(${id})" ${
    isChecked ? "checked" : ""
  }  />${title}</label>
      <div>${price}</div>
      <div class="product__Counter" >
      <input
        type="number"
        disabled
        class="counter__Display counter__Display__${id}"
        value=${count}
      />
      <div class="wrapper__Counter">
        <button class="counter__Cart" onclick="incrementCountHandler(event,${id})">+</button>
        <button class="counter__Cart" onclick="decrementCountHandler(event,${id})">-</button>
      </div>
    </div>
    <button class="button__Delete" onclick="deleteProduct(${id})"><i class="fa-solid fa-trash fa-lg"></i></button>
    </div>
  `;
  return manufacturerProduct;
}
//Helpers:
function getCurrentProduct(id) {
  return cartProducts.filter((product) => product.id === Number(id))[0];
}
function getImprovedProduct(id) {
  let cartProducts = [];
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((improvedProduct) => {
    cartProducts = cartProducts.concat(improvedProduct.brandProducts);
  });
  return cartProducts;
}
function findProductAndApply(id, cb) {
  cartProducts.forEach((product) => {
    if (product.id === Number(id)) {
      cb(product);
    }
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
  const grandTotal = newCartProducts.filter((product) => product.isChecked === true).reduce((acc, val) => acc + val.count * val.price, 0);
  return grandTotal;
}
function getIsBrandCheckedSet() {
  const brandSet = getBrandSet();
  const isBrandCheckedSet = new Set();
  const brandArray = Array.from(brandSet);
  for (let brand of brandArray) {
    isBrandChecked(brand) && isBrandCheckedSet.add(brand);
  }
  function isBrandChecked(brand) {
    let newCartProducts = [...cartProducts];
    newCartProducts = newCartProducts.filter((product) => product.brand === brand).filter((product) => product.isChecked === true);
    return newCartProducts.length === cartProducts.filter((product) => product.brand === brand).length;
  }

  return isBrandCheckedSet;
}
function trimWhiteSpace(string) {
  return string.replace(/\s/g, "");
}
function trimSpecialCharacters(string) {
  return string.replace(/^a-zA-Z0-9 ]/g, "").replace(/[&-']/g, "");
}
