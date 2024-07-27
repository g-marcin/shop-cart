const mockProductHtml = `
    <div class="wrapper__Product">
    <div class="flex product__info">
    <img class="product__Thumbnail" src="https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png" alt="product_Thumbnail">
    <div class="flex column ">
    <h4 class="product__Title__1 ">Essence Mascara Lash Princess</h4>
    <h3 class="product__Brand__1">Essence</h3>
    </div>
    </div>
    <div class="product__Description">The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.</div>
    <div class="product__Controller">
    <div class="flex product__Price "><div class=" product__Price__1 ">9.99</div>$</div>
    <div class="flex">
    <div class="product__Counter">
      <input type="number" disabled="" data-testid='display' class=" controller__Display  controller__Display__1" value="0">
      <div class="controller__CountButtons">
        <button class="counter__Product" data-testid='plus_button' onclick="increaseProductCount(event)">+</button>
        <button class="counter__Product" onclick="decreaseProductCount(event)">-</button>
      </div>
      </div>  
      <button class="button__AddToCart" data-testid='add_to_cart_button' onclick="addToCartHandler(event,1)"><i class="fa-solid fa-cart-plus fa-xl" aria-hidden="true"></i></button>
      </div>
      </div>
      </div>
`;
