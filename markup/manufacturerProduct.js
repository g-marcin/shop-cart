
export function getManufacturerProductHTMLMarkup(props) {
    const { id, brand, isChecked, title, price, count } = props;
  
    const manufacturerProduct = document.createElement("div");
    manufacturerProduct.className = `wrapper__Product__Cart wrapper__Product__Cart__${id} `;
    manufacturerProduct.innerHTML = `
  
      <div class=product__Cart__Data >
      <input type="checkbox" 
          class="product__Checkbox checkbox__Product__${id} checkbox__Product__${brand}"  
          onclick="productCheckboxHandler(${id})" 
          ${isChecked && "checked"}
          data-testid="product_checkbox"
      />
      <div class="cart__Title">
          ${title}
      </div>
      <div class="cart__Price">
          ${price}$
      </div>
      <div class="product__Counter cart__Counter" >
          
          <input
          type="number"
          min="1"
          class="counter__Display controller__Display counter__Display__${id}"
          value=${count}
          disabled
          data-testid="cart_product_display"
          /> 
  
          <div class="counter__Buttons">
              <button class="counter__Cart" data-testid="cart_product_plus" onclick="increaseCartCount(event,${id})">+</button>
              <button class="counter__Cart" data-testid="cart_product_minus" onclick="decreaseCartCount(event,${id})">-</button>
          </div>
  
      </div>
  
      <button class="button__Delete cart__Delete" data-testid="delete_product" onclick="deleteProductHandler(${id})"><i class="fa-solid fa-trash fa-lg"></i></button>
      </div>
  
    `;
    return manufacturerProduct;
}