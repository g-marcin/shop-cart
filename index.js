let fetchedProductsMap = new Map();
let cartProducts = [];
let brandSet = new Set();
let productSet = new Set();
let brandTotalMap = new Map();
let isBrandCheckedSet = new Set();

// if (window.localStorage.getItem("fetchedProductMapJSON")) {
//   fetchedProductsMap = JSONtoMap(window.localStorage.getItem("fetchedProductMapJSON"));
// }
// if (window.localStorage.getItem("cartProductsJSON")) {
//   cartProducts = JSON.parse(window.localStorage.getItem("cartProductsJSON"));
// }
// if (window.localStorage.getItem("brandSetJSON")) {
//   brandSet = JSONtoSet(window.localStorage.getItem("brandSetJSON"));
// }
// if (window.localStorage.getItem("productSetJSON")) {
//   productSet = JSONtoSet(window.localStorage.getItem("productSetJSON"));
// }
// if (window.localStorage.getItem("brandTotalMapJSON")) {
//   brandTotalMap = JSONtoMap(window.localStorage.getItem("brandTotalMapJSON"));
// }
// if (window.localStorage.getItem("brandTotalMapJSON")) {
//   isBrandCheckedSet = JSONtoSet(window.localStorage.getItem("isBrandCheckedSetJSON"));
// }

window.addEventListener("load", async (e) => {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();

  const { products } = jsonData;
  products.map((fetchedProduct) => {
    appendFetchedProduct(fetchedProduct, fetchedProduct.id);
    fetchedProductsMap.set(fetchedProduct.id, fetchedProduct);
  });
});

function initializeDisplay() {
  array.forEach((element) => {});
  appendManufacturerToCart(cartProducts);
  appendProductToManufacturer();
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

const getCurrentProduct = (id) => {
  return cartProducts.filter((product) => product.id === Number(id))[0];
};

function addOne(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (counterDisplay.value < 12) {
    counterDisplay.value++;
  } else return;

  const count = counterDisplay.value || 0;

  if (e.target.className === "counter__Cart") {
    const currentProduct = getCurrentProduct(id);
    const brand = trimWhiteSpace(trimSpecialCharacters(currentProduct.brand));
    const brandCountDisplay = document.querySelector(`.total__Manufacturer__${brand}`);

    function newTotalDisplay(newBrandTotal) {
      brandCountDisplay.remove();
      const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
      const newTotalDisplay = document.createElement("input");
      newTotalDisplay.disabled = true;
      newTotalDisplay.className = `total__Manufacturer__${brand}`;
      newTotalDisplay.value = newBrandTotal;
      newTotalDisplay.style = "width:50px;";
      wrapperManufacturerTotal.appendChild(newTotalDisplay);
    }
    const price = currentProduct.price;
    const currentValue = brandTotalMap.get(brand);
    const newBrandTotal = currentValue + price;
    if (currentProduct.isChecked === true) {
      newTotalDisplay(newBrandTotal);
    }
    brandTotalMap.set(brand, newBrandTotal);

    const newCartProducts = cartProducts.map((product) => {
      if (Number(id) === product.id) {
        product.count = Number(counterDisplay.value);
      }
      return product;
    });
    cartProducts = [...newCartProducts];
    console.log(cartProducts);
    updateGrandTotal();
  }
}
function subtractOne(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (counterDisplay.value > 1) {
    counterDisplay.value--;
  } else {
    return;
  }

  const count = counterDisplay.value || 0;

  if (e.target.className === "counter__Cart") {
    const currentProduct = fetchedProductsMap.get(id);
    const brand = trimWhiteSpace(trimSpecialCharacters(currentProduct.brand));
    const brandCountDisplay = document.querySelector(`.total__Manufacturer__${brand}`);

    function newTotalDisplay(newBrandTotal) {
      brandCountDisplay.remove();
      const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
      const newTotalDisplay = document.createElement("input");
      newTotalDisplay.disabled = true;
      newTotalDisplay.className = `total__Manufacturer__${brand}`;
      newTotalDisplay.value = newBrandTotal;
      newTotalDisplay.style = "width:50px;";
      wrapperManufacturerTotal.appendChild(newTotalDisplay);
    }
    const price = currentProduct.price;
    const currentValue = brandTotalMap.get(brand);
    const newBrandTotal = currentValue - price;
    if (getCurrentProduct(id).isChecked === true) {
      newTotalDisplay(newBrandTotal);
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

function trimWhiteSpace(string) {
  return string.replace(/\s/g, "");
}

function trimSpecialCharacters(string) {
  return string.replace(/^a-zA-Z0-9 ]/g, "").replace(/[&-']/g, "");
}

function getBrandTotal(brand) {
  const requestedBrandProducts = cartProducts
    .filter((product) => product.brand === brand)
    .filter((product) => product.isChecked);
  const brandTotal = requestedBrandProducts.reduce(
    (accumulator, product) => accumulator + product.price * product.count,
    0
  );
  brandTotalMap.delete(brand);
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
    if (brandCountDisplay) {
      brandCountDisplay.remove();
      function newTotalDisplay(newBrandTotal) {
        const wrapperManufacturerTotal = document.querySelector(`.manufacturer__Total__${brand}`);
        const newTotalDisplay = document.createElement("input");
        newTotalDisplay.disabled = true;
        newTotalDisplay.className = `total__Manufacturer__${brand}`;
        newTotalDisplay.value = newBrandTotal;
        newTotalDisplay.style = "width:50px;";
        wrapperManufacturerTotal.appendChild(newTotalDisplay);
      }
      newTotalDisplay(newBrandTotal);
    }
  }
}

function updateGrandTotal() {
  const wrapperCart = document.querySelector(".wrapper__Cart");
  const arr = Array.from(brandTotalMap, ([key, value]) => ({
    value,
  }));
  const grandTotalValue = arr.reduce((acc, val) => acc + val.value, 0);
  console.log(grandTotalValue);

  const wrapperGrandTotal = document.querySelector(".wrapper__Grand__Total");
  const grandTotal = document.querySelector(".grand__Total");
  const newWrapperGrandTotal = document.createElement("div");
  newWrapperGrandTotal.className = "wrapper__Grand__Total";
  newWrapperGrandTotal.innerHTML = `<label for="">
           Grand Total:
            <input class="grand__Total" disabled type="number" value=${grandTotalValue}  style="width: 100px" />
           </label>`;
  wrapperGrandTotal.remove();
  wrapperCart.appendChild(newWrapperGrandTotal);
}

function deleteProduct(e, id) {
  const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
  const price = fetchedProductsMap.get(id).price;
  const wrapperManufacturer = document.querySelector(`.wrapper__Manufacturer__${brand}`);
  const manufacturerProducts = wrapperManufacturer.querySelector(`.${brand}`);
  const product = document.querySelector(`.wrapper__Product__Cart__${id}`);
  const counterDisplay = product.querySelector(`.counter__Display`);
  const manufacturerTotal = document.querySelector(`.total__Manufacturer__${brand}`);

  let currentBrandTotal = brandTotalMap.get(brand);
  const currentProduct = getCurrentProduct(id);

  let newBrandTotal = currentBrandTotal - counterDisplay.value * price;

  if (productSet.has(id)) {
    product.remove();
    productSet.delete(id);
    const newCartProducts = cartProducts.filter((product) => {
      product.id !== Number(id);
    });
    brandTotalMap.set(brand, newBrandTotal);

    cartProducts = [...newCartProducts];
    if (manufacturerProducts.childNodes.length === 1) {
      wrapperManufacturer.remove();
      brandSet.delete(brand);
      const newBrandTotal = 0;
      brandTotalMap.set(brand, newBrandTotal);
    }
  }

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
  newTotalDisplay(newBrandTotal);
  updateGrandTotal();
  console.log(brandTotalMap);
  console.log(cartProducts);
}

function appendFetchedProduct(fetchedProduct, id) {
  const shopContent = document.querySelector(".content__Shop");
  const product = document.createElement("div");
  product.className = `wrapper__Product`;
  shopContent.appendChild(product);

  function displayId() {
    const id = document.createElement("div");
    id.className = "product__Id";
    id.innerText = fetchedProduct.id;
    id.style = "display:none;";
    product.appendChild(id);
  }

  function displayThumbnail() {
    const thumbnail = document.createElement("img");
    thumbnail.className = "product__Thumbnail";
    thumbnail.src = fetchedProduct.images[0];
    thumbnail.alt = "product_Thumbnail";
    product.appendChild(thumbnail);
  }

  function displayTitle() {
    const title = document.createElement("div");
    title.className = "product__Title";
    title.innerHTML = fetchedProduct.title;
    product.appendChild(title);
  }

  function displayManufacturer() {
    const manufacturer = document.createElement("div");
    manufacturer.className = "product__Brand";
    manufacturer.innerText = fetchedProduct.brand;
    product.appendChild(manufacturer);
  }

  function displayDescription() {
    const description = document.createElement("div");
    description.className = "product__Description";
    description.innerText = fetchedProduct.description;
    product.appendChild(description);
  }

  function displayPrice() {
    const price = document.createElement("div");
    price.className = "product__Price";
    price.innerText = `${fetchedProduct.price}`;
    product.appendChild(price);
  }

  function counterShop() {
    return ` <div class="product__Counter" style="display: flex; align-items: center">
    <input
      type="number"
      disabled
      class="counter__Display"
      value="0"
      style="width: 35px; margin:5px"
    />
    <div style="display: flex; flex-direction: column">
      <button onclick="addOne(event)">+</button>
      <button onclick="subtractOne(event)">-</button>
    </div>`;
  }

  function displayCounter() {
    const count = document.createElement("div");
    count.className = "product__Count";
    count.innerHTML = `${counterShop()}`;
    product.appendChild(count);
  }

  displayId();
  displayThumbnail();
  displayTitle();
  displayManufacturer();
  displayDescription();
  displayPrice();
  displayCounter();

  function addToCart() {
    const addButton = document.createElement("button");
    addButton.className = "product__addToCart";
    addButton.innerHTML = '<i class="fa-solid fa-cart-plus fa-xl"></i>';
    addButton.style = "border:3px solid black; align-self:start; padding:5px";

    addButton.onclick = () => {
      const id = Number(addButton.parentElement.querySelector(".product__Id").innerHTML);
      const count = Number(addButton.parentElement.querySelector(".counter__Display").value);
      const title = fetchedProductsMap.get(id).title;
      const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
      const price = Number(fetchedProductsMap.get(id).price);
      const newCartProducts = [...cartProducts];
      const findId = newCartProducts.filter((product) => product.id === Number(id));

      if (count === 0) {
        return;
      }

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

      updateBrandTotal(id, brand, price, count);
      appendManufacturerToCart(cartProducts);
      appendProductToManufacturer(cartProducts);
      addButton.parentElement.querySelector(".counter__Display").value = "0";

      updateGrandTotal();
      console.log(cartProducts);
    };
    product.appendChild(addButton);
  }

  addToCart();
}

function appendManufacturerToCart(cartProducts) {
  if (!cartProducts) {
    return;
  }
  const cartContent = document.querySelector(".content__Cart");
  displayedCartProducts = cartProducts.map(({ id, brand }) => {
    const manufacturerBox = document.createElement("div");
    manufacturerBox.className = `wrapper__Manufacturer__${brand}`;

    getBrandTotal(brand);
    const brandTotal = brandTotalMap.get(brand);

    manufacturerBox.innerHTML = ` 
      <div class="manufacturer__Header">
        <input type="checkbox" class="checkbox__Manufacturer__${brand}" onclick="BrandCheckboxHandler(${id})"  />
        <div class="manufacturer__Name">${brand}</div>
      </div>
      <div class="manufacturer__Products__${brand} ${brand}">
     
      </div>
      <div class="manufacturer__Total__${brand} manufacturer__Total" style="display:flex">
        Total:<input disabled class="total__Manufacturer__${brand}" value=${brandTotal} style="width:50px"/>
      </div>
    `;

    if (!brandSet.has(brand)) {
      cartContent.appendChild(manufacturerBox);
      brandSet.add(brand);
    }
  });
}

function appendProductToManufacturer(cartProducts) {
  const renderedManufacturerProducts = cartProducts.map(
    ({ id, title, price, count, brand, isChecked }) => {
      let checkboxState;
      switch (isChecked) {
        case true:
          checkboxState = true;
          break;
        case false:
          checkboxState = false;
          break;
        default:
          checkboxState = false;
          break;
      }

      const manufacturerBox = document.querySelector(`.${brand}`);
      const manufacturerProduct = document.createElement("div");
      manufacturerProduct.className = `wrapper__Product__Cart__${id}`;
      manufacturerProduct.innerHTML = `
    <div class=product__Cart__Data >
      <label for=""> <input type="checkbox" class="checkbox__Product__${id} checkbox__Product__${brand}"  onclick="ProductCheckboxHandler(${id})"  />${title}</label>
      <div>${price}</div>
      <div class="product__Counter" style="display: flex; align-items: center">
      <input
        type="number"
        disabled
        class="counter__Display"

        value=${count}
        style="width: 35px"
        
      />
      <div style="display: flex; flex-direction: column">
        <button class="counter__Cart" onclick="addOne(event, ${id})">+</button>
        <button class="counter__Cart" onclick="subtractOne(event, ${id})">-</button>
      </div>
    </div>
    <button class="button__Delete" onclick="deleteProduct(event, ${id},  )"><i class="fa-solid fa-trash fa-lg"></i></button>
    </div>
  `;

      if (!productSet.has(id)) {
        manufacturerBox.appendChild(manufacturerProduct);
        productSet.add(Number(id));
      } else {
        let oldProduct = document.querySelector(`.wrapper__Product__Cart__${id}`);
        if (oldProduct) {
          oldProduct.remove();
        }
        if (manufacturerBox) {
          manufacturerBox.appendChild(manufacturerProduct);
        }
      }
      const currentCheckbox = document.querySelector(`.checkbox__Product__${id}`);
      currentCheckbox.checked = isChecked;
    }
  );
}

function ProductCheckboxHandler(id) {
  let currentProduct = getCurrentProduct(id);
  const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
  const manufacturerCheckbox = document.querySelector(`.checkbox__Manufacturer__${brand}`);
  if (isBrandCheckedSet.has(brand)) {
    isBrandCheckedSet.delete(brand);
    let newCartProducts = [...cartProducts];
    newCartProducts = newCartProducts.map((product) => {
      if (product.brand === brand) {
        product.isChecked = false;
      }
      return product;
    });
    cartProducts = [...newCartProducts];
    console.log(cartProducts);
  }

  manufacturerCheckbox.checked = false;
  isBrandCheckedSet.delete(brand);
  const clickedCheckbox = document.querySelector(`checkbox__Product__${id}`);

  const { price, count } = currentProduct;

  const newCartProducts = cartProducts.map((product) => {
    if (product.id === Number(id)) {
      product.isChecked ? (product.isChecked = !product.isChecked) : (product.isChecked = true);
    }
    return product;
  });

  cartProducts = [...newCartProducts];

  getBrandTotal();
  currentProduct = getCurrentProduct(id);
  updateBrandTotal(id, brand, price, count, currentProduct.isChecked);
  updateGrandTotal();
}

function BrandCheckboxHandler(id) {
  const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
  const brandCheckboxArray = document.getElementsByClassName(`checkbox__Product__${brand}`);
  const manufacturerTotal = document.querySelector(`.total__Manufacturer__${brand}`);

  for (let productCheckbox of brandCheckboxArray) {
    productCheckbox.checked = false;
  }

  if (isBrandCheckedSet.has(brand)) {
    const newCartProducts = [...cartProducts];
    newCartProducts.map((product) => {
      if (product.brand === brand) {
        product.isChecked = false;
      }
      return product;
    });

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
    let newBrandTotal = getBrandTotal(brand);
    newTotalDisplay(newBrandTotal);
    updateGrandTotal();
    isBrandCheckedSet.delete(brand);
  } else {
    isBrandCheckedSet.add(brand);
    let newCartProducts = [...cartProducts];
    newCartProducts.map((product) => {
      if (product.brand === brand) {
        product.isChecked = true;
      }
      return product;
    });
    const currentBrandTotal = brandTotalMap.get(brand);
    let newBrandTotal = getBrandTotal(brand);

    //TODO brand checkbox logic

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
    newTotalDisplay(newBrandTotal);
  }

  const currentProduct = getCurrentProduct(id);

  console.log(cartProducts);
  console.log(brandTotalMap.get(brand));
}

window.addEventListener("unload", async (e) => {
  const fetchedProductsMapJSON = mapToJSON(fetchedProductsMap);
  const brandSetJSON = setToJSON(brandSet);
  const productSetJSON = setToJSON(productSet);
  const cartProductsJSON = JSON.stringify(cartProducts);
  const brandTotalMapJSON = mapToJSON(brandTotalMap);
  const isBrandCheckedSetJSON = setToJSON(isBrandCheckedSet);

  await window.localStorage.setItem("fetchedProductsMapJSON", fetchedProductsMapJSON);
  await window.localStorage.setItem("brandSetJSON", brandSetJSON);
  await window.localStorage.setItem("productSetJSON", productSetJSON);
  await window.localStorage.setItem("cartProductsJSON", cartProductsJSON);
  await window.localStorage.setItem("brandTotalMapJSON", brandTotalMapJSON);
  await window.localStorage.setItem("isBrandCheckedSetJSON", isBrandCheckedSetJSON);
});
