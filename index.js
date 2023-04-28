let cartProducts = [];
let fetchedProductsMap = new Map();
window.addEventListener("load", async () => {
  renderShop();
  getDataFromLocalStorage();
  renderCart();
  function getDataFromLocalStorage() {
    if (window.localStorage.getItem("cartProductsJSON")) {
      cartProducts = JSON.parse(window.localStorage.getItem("cartProductsJSON"));
    }
  }
  async function renderShop() {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    const jsonData = await response.json();
    const { products } = jsonData;
    products.map((fetchedProduct) => {
      renderFetchedProduct(fetchedProduct, fetchedProduct.id);
      fetchedProductsMap.set(fetchedProduct.id, fetchedProduct);
    });
    function renderFetchedProduct(fetchedProduct) {
      const shopContent = document.querySelector(".content__Shop");
      const product = getFetchedProductMarkup(fetchedProduct);
      shopContent.appendChild(product);
      function getFetchedProductMarkup(fetchedProduct) {
        const product = document.createElement("div");
        product.className = `wrapper__Product`;
        product.innerHTML = `
        <div class="flex product__info">
        <img class="product__Thumbnail" src="${fetchedProduct.images[0]}" alt = "product_Thumbnail"/>
        <div class="flex column ">
        <h4 class="product__Title__${fetchedProduct.id} ">${fetchedProduct.title}</h4>
        <h3 class="product__Brand__${fetchedProduct.id}">${fetchedProduct.brand}</h3>
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
    }
  }
});
window.addEventListener("unload", (e) => {
  saveDataToLocalStorage();
  function saveDataToLocalStorage() {
    const cartProductsJSON = JSON.stringify(cartProducts);
    window.localStorage.clear();
    window.localStorage.setItem("cartProductsJSON", cartProductsJSON);
  }
});
//load/save:

//Handlers:
function addToCartHandler(e, id) {
  const { count } = readProductCount(id);
  const { title, brand: brandName, price } = fetchedProductsMap.get(id);
  const brand = trimSpecialCharacters(trimWhiteSpace(brandName));
  if (count === 0) {
    return;
  }
  const findProduct = getProduct(id);
  if (!findProduct) {
    const brandSet = getBrandSet();
    if (!brandSet.has(brand)) {
      pushNewBrandGroup();
    }
    if (brandSet.has(brand)) {
      updateExistingBrandGroup();
    }
  }
  if (findProduct) {
    updateProductCount();
  }
  function pushNewBrandGroup() {
    cartProducts.push({
      brand: brand,
      isChecked: true,
      brandProducts: [
        {
          product: { id: id, price: price, title: title, brand: brandName },
          isChecked: true,
          count: count,
        },
      ],
    });
  }
  function updateExistingBrandGroup() {
    let newCartProducts = [...cartProducts];
    newCartProducts = newCartProducts.map((brandGroup) => {
      if (brandGroup.brand === brand) {
        brandGroup.brandProducts.push({
          product: { id: id, price: price, title: title, brand: brandName },
          isChecked: true,
          count: count,
        });
      }
    });
  }
  function updateProductCount() {
    let newCartProducts = [...cartProducts];
    newCartProducts = newCartProducts.map((brandGroup) => {
      let newBrandProducts = [...brandGroup.brandProducts];
      newBrandProducts = newBrandProducts.map((brandProduct) => {
        if (brandProduct.product.id === id) {
          brandProduct.count += count;
        }
        return brandProduct;
      });

      return brandGroup;
    });
    cartProducts = [...newCartProducts];
  }
  function resetCounterDisplay() {
    e.target.parentElement.parentElement.querySelector(".controller__Display").value = "0"; //x
  }
  resetCounterDisplay();
  renderCart();
}
function productCheckboxHandler(id) {
  const isCheckedArray = [];
  const currentProduct = getProduct(id);
  const {
    product: { brand },
  } = currentProduct;
  let newCartProducts = structuredClone(cartProducts);
  cartProducts = newCartProducts.map((brandGroup) => {
    brandGroup.brandProducts.forEach((brandProduct) => {
      if (brandProduct.product.id === id) {
        brandProduct.isChecked = !brandProduct.isChecked;
      }
      if (brandGroup.brand === brand) {
        brandGroup.isChecked = false;
      }
      isCheckedArray.push(brandProduct.isChecked);
      return brandProduct;
    });
    if (checkTruthyValues(isCheckedArray)) {
      brandGroup.isChecked = true;
    }
    return brandGroup;
  });
  renderCart();
}
function brandCheckboxHandler(brand) {
  let newCartProducts = structuredClone(cartProducts);
  cartProducts = newCartProducts.map((brandGroup) => {
    if (brandGroup.brand === brand) {
      brandGroup.isChecked = !brandGroup.isChecked;
      brandGroup.brandProducts.forEach((brandProduct) => {
        brandProduct.isChecked = brandGroup.isChecked;
      });
    }
    return brandGroup;
  });
  renderCart();
}
function increaseProductCount(e) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".controller__Display");
  counterDisplay.value++;
}
function decreaseProductCount(e) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".controller__Display");
  Number(counterDisplay.value) >= 2 && counterDisplay.value--;
}
function decreaseCartCount(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".controller__Display");
  if (Number(counterDisplay.value) < 1) {
    return;
  }
  let newCartProducts = [...cartProducts];
  newCartProducts = newCartProducts.map((outerProduct) => {
    let newBrandProducts = [...outerProduct.brandProducts];
    newBrandProducts = newBrandProducts.map((brandProduct) => {
      if (brandProduct.product.id === id) {
        brandProduct.count--;
      }
      return brandProduct;
    });
    return outerProduct;
  });
  cartProducts = [...newCartProducts];
  renderCart();
}
function increaseCartCount(e, id) {
  let newCartProducts = structuredClone(cartProducts);
  cartProducts = newCartProducts.map((brandGroup) => {
    brandGroup.brandProducts.map((brandProduct) => {
      if (brandProduct.product.id === id) {
        brandProduct.count++;
      }
      return brandProduct;
    });
    return brandGroup;
  });
  renderCart();
}
function deleteProductHandler(id) {
  let newCartProducts = structuredClone(cartProducts);
  cartProducts = newCartProducts
    .map((brandGroup) => {
      brandGroup.brandProducts = brandGroup.brandProducts.filter(
        (brandProduct) => brandProduct.product.id !== id
      );
      return brandGroup;
    })
    .filter((brandGroup) => brandGroup.brandProducts.length !== 0);
  renderCart();
}
//Renderers:
function renderCart() {
  renderBrandBoxes();
  renderCartProducts();
  renderGrandTotal();

  function renderBrandBoxes() {
    const cartContent = document.querySelector(".content__Cart");
    cartContent.innerHTML = "";
    const brandSet = new Set();

    let newCartProducts = structuredClone(cartProducts);
    cartProducts = newCartProducts.map((improvedProduct) => {
      const manufacturerBox = getBrandBoxMarkup(
        improvedProduct.brand,
        improvedProduct.brandProducts[0].product.brand
      );
      if (!brandSet.has(improvedProduct.brand)) {
        brandSet.add(improvedProduct.brand);
        cartContent.appendChild(manufacturerBox);
      }
      return improvedProduct;
    });
    function getBrandBoxMarkup(brand, brandName) {
      const isBrandCheckedSet = getIsBrandCheckedSet();
      const isChecked = isBrandCheckedSet.has(brand) ? "checked" : "";
      const brandTotal = getBrandTotal(brand);
      const manufacturerBox = document.createElement("div");
      manufacturerBox.className = `wrapper__Manufacturer wrapper__Manufacturer__${brand}`;
      manufacturerBox.innerHTML = ` 
          <div class="manufacturer__Header">
            <input type="checkbox" class="checkbox__Manufacturer__${brand}" onclick="brandCheckboxHandler('${brand}')" ${isChecked}/>
            <div class="manufacturer__Name">${brandName}</div>
          </div>
          <div class=" manufacturer__Products__${brand} ${brand}">
         
          </div>
          <div class="manufacturer__Total__${brand} manufacturer__Total" >
            Total:<input class="total__Manufacturer total__Manufacturer__${brand}" value=${brandTotal} disabled  />
            $
            </div>
        `;
      return manufacturerBox;
    }
  }
  function renderCartProducts() {
    const productSet = new Set();
    let newCartProducts = structuredClone(cartProducts);
    cartProducts = newCartProducts.map((brandGroup) => {
      brandGroup.brandProducts.forEach((brandProduct) => {
        const manufacturerBox = document.querySelector(`.${brandGroup.brand}`);
        const manufacturerProduct = getManufacturerProductMarkup(brandProduct.product.id);
        if (!productSet.has(brandProduct.product.id)) {
          manufacturerBox.appendChild(manufacturerProduct);
          productSet.add(brandProduct.product.id);
        } else {
          let oldProduct = document.querySelector(
            `.wrapper__Product__Cart__${brandProduct.product.id}`
          );
          if (oldProduct) {
            oldProduct.remove();
          }
          if (manufacturerBox) {
            manufacturerBox.appendChild(manufacturerProduct);
            productSet.add(brandProduct.product.id);
          }
        }
      });
      return brandGroup;
    });
    function getManufacturerProductMarkup(id) {
      const currentImprovedProduct = getProduct(id);
      const {
        product: { title, brand, price },
        count,
        isChecked,
      } = currentImprovedProduct;
      const manufacturerProduct = document.createElement("div");
      manufacturerProduct.className = `wrapper__Product__Cart wrapper__Product__Cart__${id} `;
      manufacturerProduct.innerHTML = `
        <div class=product__Cart__Data >
         <input type="checkbox" class="product__Checkbox checkbox__Product__${id} checkbox__Product__${brand}"  onclick="productCheckboxHandler(${id})" ${
        isChecked ? "checked" : ""
      }  />
      <div class="cart__Title">${title}</div>
          <div class="cart__Price">${price}$</div>
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
  }
  function renderGrandTotal() {
    const grandTotalValue = getGrandTotal();
    const wrapperCart = document.querySelector(".wrapper__Cart");
    const wrapperGrandTotal = document.querySelector(".wrapper__Grand__Total");
    const newWrapperGrandTotal = document.createElement("div");
    newWrapperGrandTotal.className = "wrapper__Grand__Total";
    newWrapperGrandTotal.innerHTML = `<span><label for="">
           Grand Total:
            <input class="grand__Total" disabled type="number" value=${grandTotalValue}  />
           </label>$</span>`;
    wrapperGrandTotal.remove();
    wrapperCart.appendChild(newWrapperGrandTotal);
  }
}
//Helpers:
function getProduct(id) {
  let allProducts = [];
  cartProducts.forEach((improvedProduct) => {
    allProducts = allProducts.concat(improvedProduct.brandProducts);
  });
  idProduct = allProducts.filter((brandProduct) => brandProduct.product.id === id)[0];
  return idProduct;
}
function getBrandSet() {
  const brandSet = new Set();
  cartProducts.forEach((brandGroup) => {
    brandSet.add(brandGroup.brand);
  });
  return brandSet;
}
function getProductSet() {
  const productSet = new Set();
  cartProducts.forEach((brandGroup) => {
    brandGroup.brandProducts.forEach((brandProduct) => {
      productSet.add(brandProduct.product.id);
    });
  });
  return productSet;
}
function getBrandTotal(brand) {
  let brandTotalArray = [];
  let brandTotal = 0;
  cartProducts.forEach((brandGroup) => {
    if (brandGroup.brand === brand) {
      let newBrandProducts = [...brandGroup.brandProducts];
      newBrandProducts
        .filter((brandProduct) => brandProduct.isChecked === true)
        .map((brandProduct) => {
          const totalProduct = brandProduct.product.price * brandProduct.count;
          brandTotalArray.push(totalProduct);
        });
    }
  });
  if (brandTotalArray.length !== 0) {
    brandTotal = brandTotalArray.reduce((brandTotal, productTotal) => brandTotal + productTotal, 0);
  }
  return brandTotal;
}
function getGrandTotal() {
  const brandTotalArray = [];

  cartProducts.forEach((brandGroup) => {
    brandTotalArray.push(getBrandTotal(brandGroup.brand));
  });
  if (brandTotalArray.length === 0) {
    return;
  }
  const grandTotal = brandTotalArray.reduce((grandTotal, brandTotal) => grandTotal + brandTotal);
  return grandTotal;
}
function getIsBrandCheckedSet() {
  const isBrandCheckedSet = new Set();
  cartProducts.forEach((brandGroup) => {
    if (brandGroup.isChecked === true) {
      isBrandCheckedSet.add(brandGroup.brand);
    }
  });
  return isBrandCheckedSet;
}
function readProductCount(id) {
  const count = Number(document.querySelector(`.controller__Display__${id}`).value);
  return { count: count };
}
function trimWhiteSpace(string) {
  return string.replace(/\s/g, "");
}
function trimSpecialCharacters(string) {
  return string.replace(/^a-zA-Z0-9 ]/g, "").replace(/[&-']/g, "");
}
function checkTruthyValues(arr) {
  return arr.every((element) => element === true);
}
