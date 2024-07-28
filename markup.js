



export function getManufacturerProductMarkup(props) {
  const { id, brand, isChecked, title, price, count } = props;

  const manufacturerProduct = document.createElement("div");
  manufacturerProduct.className = `wrapper__Product__Cart wrapper__Product__Cart__${id} `;
  manufacturerProduct.innerHTML = `

    <div class=product__Cart__Data >
    <input type="checkbox" 
        class="product__Checkbox checkbox__Product__${id} checkbox__Product__${brand}"  
        onclick="productCheckboxHandler(${id})" 
        ${isChecked && "checked"}
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
        /> 

        <div class="counter__Buttons">
            <button class="counter__Cart" onclick="increaseCartCount(event,${id})">+</button>
            <button class="counter__Cart" onclick="decreaseCartCount(event,${id})">-</button>
        </div>

    </div>

    <button class="button__Delete cart__Delete" onclick="deleteProductHandler(${id})"><i class="fa-solid fa-trash fa-lg"></i></button>
    </div>

    `;
  return manufacturerProduct;
}
