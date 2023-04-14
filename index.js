let cartProducts = [];

window.addEventListener("load", async (e) => {
  const response = await fetch("https://dummyjson.com/products");
  const jsonData = await response.json();
  console.log(jsonData);
  const { products } = jsonData;
});
