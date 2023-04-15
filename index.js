const fetchedProductsMap = new Map();
let cartProducts = [];
const brandSet = new Set();
const productSet = new Set();
const brandTotalMap = new Map();

function addOne(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (counterDisplay.value < 12) {
    counterDisplay.value++;
  } else return;

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
    const newBrandTotal = currentValue + price;
    newTotalDisplay(newBrandTotal);
    brandTotalMap.set(brand, newBrandTotal);

    const newCartProducts = cartProducts.map((product) => {
      if (Number(id) === product.id) {
        product.count = Number(counterDisplay.value);
      }
      return product;
    });
    cartProducts = [...newCartProducts];
    console.log(cartProducts);
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
    newTotalDisplay(newBrandTotal);
    brandTotalMap.set(brand, newBrandTotal);
    let newCartProducts = [...cartProducts];
    newCartProducts = cartProducts.map((product) => {
      if (id === product.id) {
        product.count = counterDisplay.value;
      }
      return product;
    });
    cartProducts = [...newCartProducts];
    console.log(cartProducts);
  }
}

function trimWhiteSpace(string) {
  return string.replace(/\s/g, "");
}

function trimSpecialCharacters(string) {
  return string.replace(/^a-zA-Z0-9 ]/g, "").replace(/[&-']/g, "");
}

function getBrandTotal(brand) {
  const requestedBrand = cartProducts.filter((product) => product.brand === brand);

  const initialValue = 0;
  const brandTotal = requestedBrand.reduce((accumulator, product) => accumulator + product.price * product.count, initialValue);

  console.log(brandTotal);
  brandTotalMap.set(brand, brandTotal);
  return brandTotal;
}

function updateBrandTotal(brand, price, count) {
  const brandCountDisplay = document.querySelector(`.total__Manufacturer__${brand}`);
  const currentValue = brandTotalMap.get(brand);
  const newBrandTotal = currentValue + price * count;
  brandTotalMap.set(brand, newBrandTotal);
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

function test(e) {}

//TODO update state on delete product

function deleteProduct(e, id) {
  const brand = trimSpecialCharacters(trimWhiteSpace(fetchedProductsMap.get(id).brand));
  const price = fetchedProductsMap.get(id).price;
  const wrapperManufacturer = document.querySelector(`.wrapper__Manufacturer__${brand}`);
  const manufacturerProducts = wrapperManufacturer.querySelector(`.${brand}`);
  const product = document.querySelector(`.wrapper__Product__Cart__${id}`);
  const counterDisplay = product.querySelector(`.counter__Display`);
  const manufacturerTotal = document.querySelector(`.total__Manufacturer__${brand}`);

  if (product !== null) {
    product.remove();
    const newCartProducts = cartProducts.filter((product) => {
      if (!id) return;
      product.id !== Number(id);
    });
    cartProducts = [...newCartProducts];
    if (manufacturerProducts.childNodes.length == 1) {
      wrapperManufacturer.remove();
      brandTotalMap.set(brand, 0);
    }
  }
  console.log(manufacturerProducts.childNodes.length);

  brandSet.delete(`${brand}`);
  productSet.delete(id);
  let currentBrandTotal = brandTotalMap.get(brand);
  currentBrandTotal = currentBrandTotal - counterDisplay.value * price;
  brandTotalMap.set(brand, currentBrandTotal);

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
  newTotalDisplay(currentBrandTotal);

  console.log(cartProducts);
}

window.addEventListener("load", async (e) => {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();

  const { products } = jsonData;
  products.map((fetchedProduct) => {
    appendProduct(fetchedProduct, fetchedProduct.id);
    fetchedProductsMap.set(fetchedProduct.id, fetchedProduct);
  });
});

function appendProduct(fetchedProduct, id) {
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

      if (findId.length === 0) {
        cartProducts.push({ id: id, price: price, title: title, brand: brand, count: count });
      } else {
        cartProducts[cartProducts.indexOf(findId[0])].count += count;
      }

      updateBrandTotal(brand, price, count);
      appendManufacturer(cartProducts);
      appendProductToManufacturer(cartProducts);

      addButton.parentElement.querySelector(".counter__Display").value = "0";
      console.log(id);
      console.log(findId);
      console.log(newCartProducts);
      console.log(cartProducts);
    };
    product.appendChild(addButton);
  }
  addToCart();
}

function appendManufacturer(cartProducts) {
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
        <input type="checkbox" />
        <div class="manufacturer__Name">${fetchedProductsMap.get(id).brand}</div>
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
  const renderedManufacturerProducts = cartProducts.map(({ id, title, price, count, brand }) => {
    const manufacturerBox = document.querySelector(`.${brand}`);
    const manufacturerProduct = document.createElement("div");
    manufacturerProduct.className = `wrapper__Product__Cart__${id}`;
    manufacturerProduct.innerHTML = `
    <div class=product__Cart__Data >
      <label for=""> <input type="checkbox" class="product__Name" />${title}</label>
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

      oldProduct.remove();
      manufacturerBox.appendChild(manufacturerProduct);
    }
  });
}
