let cartProducts = [];

function appendProduct(fetchedProduct) {
  const shopContent = document.querySelector(".content__Shop");
  const product = document.createElement("div");
  product.className = "wrapper__Product";
  shopContent.appendChild(product);

  function displayId() {
    const id = document.createElement("div");
    id.className = "product__Id";
    id.innerHTML = fetchedProduct.id;
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

  function counter() {
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
    count.innerHTML = `${counter()}`;
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
      const id = Number(addButton.parentElement.querySelector(".product__Id").innerText);
      const name = addButton.parentElement.querySelector(".product__Title").innerText;
      const brand = addButton.parentElement.querySelector(".product__Brand").innerText;
      const count = Number(addButton.parentElement.querySelector(".counter__Display").value);
      const price = Number(addButton.parentElement.querySelector(".product__Price").innerText);

      if (count !== 0) {
        const findId = cartProducts.filter((product) => product.id === id);
        if (findId.length === 0) {
          cartProducts.push({ id: id, price: price, name: name, brand: brand, count: count });
        } else {
          cartProducts[cartProducts.indexOf(findId[0])].count += count;
        }
        appendManufacturer(cartProducts);
        appendProductToManufacturer(cartProducts);
      }
      addButton.parentElement.querySelector(".counter__Display").value = "0";
      console.log(cartProducts);
    };

    product.appendChild(addButton);
  }
  addToCart();

  //TODO counter

  //TODO addToCart button
}

window.addEventListener("load", async (e) => {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();
  console.log(jsonData);
  const { products } = jsonData;
  products.map((fetchedProduct) => {
    appendProduct(fetchedProduct);
  });
});

//utils
function addOne(e) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (counterDisplay.value < 12) {
    counterDisplay.value++;
  }
}
function subtractOne(e) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (counterDisplay.value > 0) {
    counterDisplay.value--;
  }
}
