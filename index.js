let fetchedProductsMap = new Map();
let cartProducts = [];
let brandSet = new Set();
let productSet = new Set();
let brandTotalMap = new Map();
let isBrandCheckedSet = new Set();

window.addEventListener("load", async (e) => {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();
  const { products } = jsonData;
  products.map((fetchedProduct) => {
    appendFetchedProduct(fetchedProduct, fetchedProduct.id);
    fetchedProductsMap.set(fetchedProduct.id, fetchedProduct);
  });

  function initializeCartDisplay() {
    const cartContent = document.querySelector(".content__Cart");

    function getDataFromLocalStorage() {
      if (window.localStorage.getItem("fetchedProductMapJSON")) {
        fetchedProductsMap = JSONtoMap(window.localStorage.getItem("fetchedProductMapJSON"));
      }
      if (window.localStorage.getItem("cartProductsJSON")) {
        cartProducts = JSON.parse(window.localStorage.getItem("cartProductsJSON"));
      }
      if (window.localStorage.getItem("brandTotalMapJSON")) {
        brandTotalMap = JSONtoMap(window.localStorage.getItem("brandTotalMapJSON"));
      }
      if (window.localStorage.getItem("brandSetJSON")) {
        brandSet = JSONtoSet(window.localStorage.getItem("brandSetJSON"));
      }
      if (window.localStorage.getItem("productSetJSON")) {
        productSet = JSONtoSet(window.localStorage.getItem("productSetJSON"));
      }
      if (window.localStorage.getItem("isBrandCheckedSetJSON")) {
        isBrandCheckedSet = JSONtoSet(window.localStorage.getItem("isBrandCheckedSetJSON"));
      }
    }
    getDataFromLocalStorage();
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

      const productCheckbox = document.querySelector(`.checkbox__Product__${id}`);
      if (isBrandCheckedSet.has(brand)) {
        productCheckbox.checked = false;
      } else {
        const currentProduct = getCurrentProduct(id);
        productCheckbox.checked = currentProduct.isChecked;
      }
    });
    updateGrandTotal();
  }
  initializeCartDisplay();
});
function appendFetchedProduct(fetchedProduct) {
  const shopContent = document.querySelector(".content__Shop");
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
      style="width: 35px; margin:5px"
    />
    <div style="display: flex; flex-direction: column">
      <button onclick="incrementCount(event)">+</button>
      <button onclick="decrementCount(event)">-</button>
    </div>
  </div>  
  `;
  shopContent.appendChild(product);

  function addToCart() {
    const addButton = document.createElement("button");
    addButton.className = "button__AddToCart";
    addButton.innerHTML = '<i class="fa-solid fa-cart-plus fa-xl"></i>';
    addButton.style = "border:3px solid black; align-self:start; padding:5px";
    addButton.onclick = () => {
      const id = Number(addButton.parentElement.querySelector(".product__Id").innerHTML);
      const count = Number(addButton.parentElement.querySelector(".counter__Display").value);
      const title = fetchedProductsMap.get(id).title;
      const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
      const price = Number(fetchedProductsMap.get(id).price);
      const newCartProducts = [...cartProducts];
      if (count === 0) {
        return;
      }
      const findId = newCartProducts.filter((product) => product.id === Number(id));
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
      appendManufacturerToCart(cartProducts);
      appendProductToManufacturer(cartProducts);
      addButton.parentElement.querySelector(".counter__Display").value = "0";
      updateGrandTotal();
    };
    product.appendChild(addButton);
  }
  addToCart();
}
function appendManufacturerToCart() {
  const cartContent = document.querySelector(".content__Cart");
  cartProducts.forEach(({ brand }) => {
    const manufacturerBox = getManufacturerBox(brand);

    if (!brandSet.has(brand)) {
      cartContent.appendChild(manufacturerBox);
      brandSet.add(brand);
    }
  });
}
function appendProductToManufacturer() {
  cartProducts.forEach(({ id, title, price, count, brand }) => {
    const manufacturerBox = document.querySelector(`.${brand}`);
    const manufacturerProduct = getManufacturerProduct(id, brand, title, price, count);

    if (!productSet.has(id)) {
      manufacturerBox.appendChild(manufacturerProduct);
      productSet.add(Number(id));
    } else {
      let oldProduct = document.querySelector(`.wrapper__Product__Cart__${id}`);
      oldProduct.remove();
      manufacturerBox.appendChild(manufacturerProduct);
    }

    function updateCheckboxState() {
      const currentProduct = getCurrentProduct(id);
      const currentCheckbox = document.querySelector(`.checkbox__Product__${id}`);
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
  let currentProduct = getCurrentProduct(id);
  const { brand, price, count } = currentProduct;
  const manufacturerCheckbox = document.querySelector(`.checkbox__Manufacturer__${brand}`);

  if (isBrandCheckedSet.has(brand)) {
    cartProducts.forEach((product) => {
      if (product.brand === brand) {
        product.isChecked = false;
      }
      return product;
    });
    brandTotalMap.set(brand, 0);
    isBrandCheckedSet.delete(brand);
  }
  manufacturerCheckbox.checked = false;

  cartProducts.forEach((product) => {
    if (product.id === Number(id)) {
      product.isChecked ? (product.isChecked = !product.isChecked) : (product.isChecked = true);
    }
    return product;
  });

  updateBrandTotalMap();
  updateBrandTotal(id, brand, price, count, currentProduct.isChecked);
  updateGrandTotal();
  isBrandCheckedSet.delete(brand);
}
function BrandCheckboxHandler(brand) {
  if (!isBrandCheckedSet.has(brand)) {
    const clearProductsState = () => {
      const clearProductsCheckboxes = () => {
        const brandCheckboxArray = document.getElementsByClassName(`checkbox__Product__${brand}`);
        for (let productCheckbox of brandCheckboxArray) {
          productCheckbox.checked = false;
        }
      };
      clearProductsCheckboxes();

      const clearCartState = () => {
        let newCartProducts = [...cartProducts];
        newCartProducts = newCartProducts.map((product) => {
          if (product.brand === brand) {
            product.isChecked = true;
          }
        });
      };
      clearCartState();
    };
    clearProductsState();

    function updateBrandTotalDisplay() {
      const manufacturerTotal = document.querySelector(`.total__Manufacturer__${brand}`);
      let newBrandTotal = updateBrandTotalMap(brand);
      function newTotalDisplay(newBrandTotal) {
        const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
        const newTotalDisplay = document.createElement("input");
        newTotalDisplay.disabled = true;
        newTotalDisplay.className = `total__Manufacturer__${brand}`;
        newTotalDisplay.value = newBrandTotal;
        newTotalDisplay.style = "width:50px;";
        if (wrapperManufacturerTotal) {
          wrapperManufacturerTotal.appendChild(newTotalDisplay);
        }
      }
      manufacturerTotal.remove();
      console.log(newBrandTotal, "newBrandTotal");
      newTotalDisplay(newBrandTotal);
    }
    updateBrandTotalDisplay();
    isBrandCheckedSet.add(brand);
    console.log("brand added!");
  } else {
    const clearCartState = () => {
      let newCartProducts = [...cartProducts];
      newCartProducts = newCartProducts.map((product) => {
        if (product.brand === brand) {
          product.isChecked = false;
        }
      });
    };
    clearCartState();

    function updateBrandTotalDisplay() {
      const manufacturerTotal = document.querySelector(`.total__Manufacturer__${brand}`);
      let newBrandTotal = updateBrandTotalMap(brand);

      function newTotalDisplay(newBrandTotal) {
        const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
        const newTotalDisplay = document.createElement("input");
        newTotalDisplay.disabled = true;
        newTotalDisplay.className = `total__Manufacturer__${brand}`;
        newTotalDisplay.value = newBrandTotal;
        newTotalDisplay.style = "width:50px;";
        if (wrapperManufacturerTotal) {
          wrapperManufacturerTotal.appendChild(newTotalDisplay);
        }
      }
      manufacturerTotal.remove();
      console.log(newBrandTotal, "newBrandTotal");
      newTotalDisplay(newBrandTotal);
    }
    updateBrandTotalDisplay();
    brandTotalMap.set(brand, 0);
    isBrandCheckedSet.delete(brand);
  }
  updateGrandTotal();
}
function incrementCount(e, id) {
  const currentProduct = getCurrentProduct(id);
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  counterDisplay.value++;
  if (e.target.className === "counter__Cart") {
    const { brand, price } = currentProduct;
    const currentValue = brandTotalMap.get(brand);
    const newBrandTotal = currentValue + price;
    if (currentProduct.isChecked === true) {
      newTotalDisplay(newBrandTotal, brand);
    }
    brandTotalMap.set(brand, newBrandTotal);
    cartProducts.forEach((product) => {
      if (Number(id) === product.id) {
        product.count++;
      }
    });
    updateGrandTotal();
  }
}
function decrementCount(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (Number(counterDisplay.value > 1)) {
    counterDisplay.value--;
  }

  if (e.target.className === "counter__Cart") {
    const currentProduct = fetchedProductsMap.get(id);
    const brand = trimWhiteSpace(trimSpecialCharacters(currentProduct.brand));
    const price = currentProduct.price;
    const currentValue = brandTotalMap.get(brand);
    const newBrandTotal = currentValue - price;
    if (getCurrentProduct(id).isChecked && getCurrentProduct(id).isChecked === true) {
      newTotalDisplay(newBrandTotal, brand);
      brandTotalMap.set(brand, newBrandTotal);
    }
    let newCartProducts = [...cartProducts];
    newCartProducts = cartProducts.map((product) => {
      if (Number(id) === product.id) {
        product.count = counterDisplay.value;
      }
      return product;
    });
    cartProducts = [...newCartProducts];
    console.log(cartProducts);
    updateGrandTotal();
  }
}
function deleteProduct(e, id) {
  const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
  const wrapperManufacturer = document.querySelector(`.wrapper__Manufacturer__${brand}`);
  const product = document.querySelector(`.wrapper__Product__Cart__${id}`);
  if (productSet.has(id)) {
    product.remove();
    productSet.delete(id);
    const newBrandTotal = updateBrandTotalMap(brand);
    brandTotalMap.set(brand, newBrandTotal);
    const newCartProducts = cartProducts.filter((product) => product.id !== Number(id));
    cartProducts = [...newCartProducts];

    const manufacturerProducts = wrapperManufacturer.querySelector(`.${brand}`);
    if (manufacturerProducts.childNodes.length === 1) {
      removeManufacturerBox(brand, id);
    }
  }

  const newBrandTotal = updateBrandTotalMap(brand);
  newTotalDisplay(newBrandTotal, brand);
  updateGrandTotal();
}
function updateBrandTotalMap(brand) {
  const requestedBrandProducts = cartProducts
    .filter((product) => product.brand === brand)
    .filter((product) => product.isChecked);
  const brandTotal = requestedBrandProducts.reduce(
    (accumulator, product) => accumulator + product.price * product.count,
    0
  );
  brandTotalMap.set(brand, brandTotal);
  return brandTotal;
}
function updateBrandTotal(id, brand, price, count, isChecked = true) {
  const brandCountDisplay = document.querySelector(`.total__Manufacturer__${brand}`);
  const oldBrandTotal = brandTotalMap.get(brand);
  let newBrandTotal = oldBrandTotal;

  if (isChecked === true) {
    newBrandTotal = oldBrandTotal + price * getCurrentProduct(id).count;
    brandTotalMap.set(brand, newBrandTotal);
  }

  if (isChecked === false) {
    newBrandTotal = oldBrandTotal - price * getCurrentProduct(id).count;
    brandTotalMap.set(brand, newBrandTotal);
  }

  if (brandSet.has(brand)) {
    brandCountDisplay.remove();
    newTotalDisplay(newBrandTotal, brand);
  }
}
function updateGrandTotal() {
  const arr = Array.from(brandTotalMap, ([_, value]) => ({
    value,
  }));
  const grandTotalValue = arr.reduce((acc, val) => acc + val.value, 0);
  getGrandTotalBox(grandTotalValue);
}
function newTotalDisplay(newBrandTotal, brand) {
  const brandCountDisplay = document.querySelector(`.total__Manufacturer__${brand}`);

  brandCountDisplay.remove();

  const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
  const newTotalDisplay = document.createElement("input");
  newTotalDisplay.disabled = true;
  newTotalDisplay.className = `total__Manufacturer__${brand}`;
  newTotalDisplay.value = newBrandTotal;
  newTotalDisplay.style = "width:50px;";
  wrapperManufacturerTotal.appendChild(newTotalDisplay);
}
function saveDataToLocalStorage() {
  const fetchedProductsMapJSON = mapToJSON(fetchedProductsMap);
  const brandSetJSON = setToJSON(brandSet);
  const productSetJSON = setToJSON(productSet);
  const cartProductsJSON = JSON.stringify(cartProducts);
  const brandTotalMapJSON = mapToJSON(brandTotalMap);
  const isBrandCheckedSetJSON = setToJSON(isBrandCheckedSet);

  window.localStorage.clear();
  window.localStorage.setItem("fetchedProductsMapJSON", fetchedProductsMapJSON);
  window.localStorage.setItem("brandSetJSON", brandSetJSON);
  window.localStorage.setItem("productSetJSON", productSetJSON);
  window.localStorage.setItem("cartProductsJSON", cartProductsJSON);
  window.localStorage.setItem("brandTotalMapJSON", brandTotalMapJSON);
  window.localStorage.setItem("isBrandCheckedSetJSON", isBrandCheckedSetJSON);
  window.localStorage.setItem("data", "true");
}
function getManufacturerBox(brand) {
  updateBrandTotalMap(brand);
  const brandTotal = brandTotalMap.get(brand);
  const manufacturerBox = document.createElement("div");
  manufacturerBox.className = `wrapper__Manufacturer__${brand}`;
  manufacturerBox.innerHTML = ` 
      <div class="manufacturer__Header">
        <input type="checkbox" class="checkbox__Manufacturer__${brand}" onclick="BrandCheckboxHandler('${brand}')"  />
        <div class="manufacturer__Name">${brand}</div>
      </div>
      <div class="manufacturer__Products__${brand} ${brand}">
     
      </div>
      <div class="manufacturer__Total__${brand} manufacturer__Total" style="display:flex">
        Total:<input disabled class="total__Manufacturer__${brand}" value=${brandTotal} style="width:50px"/>
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
      <div class="product__Counter" style="display: flex; align-items: center">
      <input
        type="number"
        disabled
        class="counter__Display"
        value=${count}
      />
      <div style="display: flex; flex-direction: column">
        <button class="counter__Cart" onclick="incrementCount(event, ${id})">+</button>
        <button class="counter__Cart" onclick="decrementCount(event, ${id})">-</button>
      </div>
    </div>
    <button class="button__Delete" onclick="deleteProduct(event, ${id},  )"><i class="fa-solid fa-trash fa-lg"></i></button>
    </div>
  `;
  return manufacturerProduct;
}
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
  productSet.delete(id);
  const newBrandTotal = updateBrandTotalMap(brand);
  brandTotalMap.set(brand, newBrandTotal);
  isBrandCheckedSet.delete(brand);
  brandSet.delete(brand);
}
