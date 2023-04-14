let cartProducts = [];

window.addEventListener("load", async (e) => {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();
  console.log(jsonData);
  const { products } = jsonData;
  products.map((fetchedProduct) => {
    appendProduct(fetchedProduct);
  });
});

function appendProduct(fetchedProduct) {
  const shopContent = document.querySelector(".content__Shop");

  const product = document.createElement("div");
  product.className = "wrapper__Product";
  shopContent.appendChild(product);

  const id = document.createElement("div");
  id.className = "product__Id";
  id.innerHTML = fetchedProduct.id;
  id.style = "display:none;";
  product.appendChild(id);

  const thumbnail = document.createElement("img");
  thumbnail.className = "product__Thumbnail";
  thumbnail.src = fetchedProduct.images[0];
  thumbnail.alt = "product_Thumbnail";
  product.appendChild(thumbnail);

  const title = document.createElement("div");
  title.className = "product__Title";
  title.innerHTML = fetchedProduct.title;
  product.appendChild(title);

  const manufacturer = document.createElement("div");
  manufacturer.className = "product__Brand";
  manufacturer.innerText = fetchedProduct.brand;
  product.appendChild(manufacturer);

  const description = document.createElement("div");
  description.className = "product__Description";
  description.innerText = fetchedProduct.description;
  product.appendChild(description);

  const price = document.createElement("div");
  price.className = "product__Price";
  price.innerText = `${fetchedProduct.price}`;
  product.appendChild(price);

  //TODO counter

  //TODO addToCart button
}
