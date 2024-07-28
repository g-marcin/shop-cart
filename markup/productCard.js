export function getProductCardHTMLMarkup(fetchedProduct) {
    if (!fetchedProduct) {
      return "<div>no-product</div>";
    }
    // console.log('getProductCardHTMLMarkup!', fetchedProduct);
    const product = document.createElement("div");
    product.className = `wrapper__Product`;
    product.innerHTML = `
            <div class="flex product__info">
      <img class="product__Thumbnail" src="${fetchedProduct.images[0]}" alt = "product_Thumbnail"/>
      <div class="flex column ">
      <h4 class="product__Title__${fetchedProduct.id} ">${fetchedProduct.title}</h4>
      <h3 class="product__Brand__${fetchedProduct.id}">${fetchedProduct.brand !== undefined ? fetchedProduct.brand : "common products"}</h3>
              </div>
              </div>
      <div class="product__Description">${fetchedProduct.description}</div>
              <div class="product__Controller">
      <div class="flex product__Price "><div class=" product__Price__${fetchedProduct.id} ">${fetchedProduct.price}</div>$</div>
              <div class="flex">
              <div class="product__Counter">
                <input
                  type="number"
                  disabled
          class=" controller__Display  controller__Display__${fetchedProduct.id}"
                  value="0"
                />
                <div class="controller__CountButtons">
                  <button class="counter__Product" onclick="increaseProductCount(event)">+</button>
                  <button class="counter__Product"  onclick="decreaseProductCount(event)">-</button>
                </div>
                </div>  
                <button class="button__AddToCart" onClick='addToCartHandler(event,${fetchedProduct.id})'><i class="fa-solid fa-cart-plus fa-xl"></i></button>
                </div>
              </div>
              `;
    return product;
}