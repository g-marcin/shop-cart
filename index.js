let improvedCartProducts = [];
window.addEventListener("load", async () => {
  renderShop();
  initializeCartDisplay();
  function initializeCartDisplay() {
    getDataFromLocalStorage();
    renderCart();
    function getDataFromLocalStorage() {
      if (window.localStorage.getItem("improvedCartProductsJSON")) {
        improvedCartProducts = JSON.parse(window.localStorage.getItem("improvedCartProductsJSON"));
      }
    }
  }
  async function renderShop() {
    const response = await fetch("https://dummyjson.com/products");
    const jsonData = await response.json();
    const { products } = jsonData;
    products.map((fetchedProduct) => {
      renderFetchedProduct(fetchedProduct, fetchedProduct.id);
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
        <h3 class="product__Brand__${fetchedProduct.id}">${fetchedProduct.brand}</h3>
        <h4 class="product__Title__${fetchedProduct.id} ">${fetchedProduct.title}</h4>
        <div class="product__Description">${fetchedProduct.description}</div>
        <div class="flex"><div class="product__Price__${fetchedProduct.id}">${fetchedProduct.price}</div>$</div>
        </div>
       </div>
       <div class="product__Controller">
        <div class="product__Counter">
          <input
            type="number"
            disabled
            class="counter__Display"
            value="0"
          />
          <div>
            <button class="counter__Product" onclick="incrementCountHandler(event)">+</button>
            <button class="counter__Product"  onclick="decrementCountHandler(event)">-</button>
          </div>
          </div>  
          <button class="button__DisplayAddToCartHandlerButton" onClick='addToCartHandler(event,${fetchedProduct.id})'><i class="fa-solid fa-cart-plus fa-xl"></i></button>
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
    const improvedCartProductsJSON = JSON.stringify(improvedCartProducts);
    window.localStorage.clear();
    window.localStorage.setItem("improvedCartProductsJSON", improvedCartProductsJSON);
  }
});
//load/save:

//Handlers:
function addToCartHandler(e, id) {
  console.log(getShopProductData(id));
  const { title, brand, price } = getShopProductData(id);
  const count = Number(
    e.target.parentElement.parentElement.querySelector(".counter__Display").value
  );
  const brandSet = getImprovedBrandSet();
  if (count === 0) {
    return;
  }
  const findProduct = getImprovedProduct(id);
  if (!findProduct) {
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
    improvedCartProducts.push({
      brand: brand,
      isChecked: true,
      brandProducts: [
        {
          product: { id: id, price: price, title: title, brand: brand },
          isChecked: true,
          count: count,
        },
      ],
    });
  }
  function updateExistingBrandGroup() {
    let newImprovedCartProducts = [...improvedCartProducts];
    newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
      if (brandGroup.brand === brand) {
        brandGroup.brandProducts.push({
          product: { id: id, price: price, title: title, brand: brand },
          isChecked: true,
          count: count,
        });
      }
    });
  }
  function updateProductCount() {
    let newImprovedCartProducts = [...improvedCartProducts];
    newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
      let newBrandProducts = [...brandGroup.brandProducts];
      newBrandProducts = newBrandProducts.map((brandProduct) => {
        if (brandProduct.product.id === id) {
          brandProduct.count += count;
        }
        return brandProduct;
      });

      return brandGroup;
    });
    improvedCartProducts = [...newImprovedCartProducts];
  }
  function resetCounterDisplay() {
    e.target.parentElement.parentElement.querySelector(".counter__Display").value = "0"; //x
  }
  resetCounterDisplay();
  renderCart();
}
function productCheckboxHandler(id) {
  const isCheckedArray = [];
  const currentProduct = getImprovedProduct(id);
  const {
    product: { brand },
  } = currentProduct;
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
    let newBrandProducts = [...brandGroup.brandProducts];
    newBrandProducts = newBrandProducts.map((brandProduct) => {
      if (brandProduct.product.id === id) {
        brandProduct.isChecked = !brandProduct.isChecked;
      }
      if (brandGroup.brand === brand) {
        brandGroup.isChecked = false;
      }
      isCheckedArray.push(brandProduct.isChecked);
      return brandProduct;
    });
    if (allAreTrue(isCheckedArray)) {
      brandGroup.isChecked = true;
    }
    return brandGroup;
  });

  improvedCartProducts = [...newImprovedCartProducts];
  renderCart();
}
function brandCheckboxHandler(brand) {
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
    if (brandGroup.brand === brand) {
      brandGroup.isChecked = !brandGroup.isChecked;
      brandGroup.brandProducts.map((brandProduct) => {
        brandProduct.isChecked = brandGroup.isChecked;
      });
    }
  });
  renderCart();
}
function incrementCountHandler(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  counterDisplay.value++;
  if (e.target.className === "counter__Cart") {
    incrementCartCount(id);
  }
  function incrementCartCount(id) {
    let newImprovedCartProducts = [...improvedCartProducts];
    newImprovedCartProducts = newImprovedCartProducts.map(({ brand, brandProducts, isChecked }) => {
      let newBrandProducts = [...brandProducts];
      newBrandProducts = newBrandProducts.map((brandProduct) => {
        if (brandProduct.product.id === id) {
          brandProduct.count++;
        }
        return brandProduct;
      });
    });
    renderCart();
  }
}
function decrementCountHandler(e, id) {
  const counterDisplay = e.target.parentElement.parentElement.querySelector(".counter__Display");
  if (Number(counterDisplay.value) >= 2) {
    counterDisplay.value--;
  }
  if (e.target.className === "counter__Cart") {
    decrementCartCount(id);
  }
  function decrementCartCount(id) {
    if (Number(counterDisplay.value) < 1) {
      return;
    }
    let newImprovedCartProducts = [...improvedCartProducts];
    newImprovedCartProducts = newImprovedCartProducts.map((outerProduct) => {
      let newBrandProducts = [...outerProduct.brandProducts];
      newBrandProducts = newBrandProducts.map((brandProduct) => {
        if (brandProduct.product.id === id) {
          brandProduct.count--;
        }
        return brandProduct;
      });
      return outerProduct;
    });
    improvedCartProducts = [...newImprovedCartProducts];
    renderCart();
  }
}
function deleteProductHandler(id) {
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts
    .map((brandGroup) => {
      brandGroup.brandProducts = brandGroup.brandProducts.filter(
        (brandProduct) => brandProduct.product.id !== id
      );
      if (brandGroup.brandProducts.length === 0) {
        let newImprovedCartProducts = [...improvedCartProducts];
        newImprovedCartProducts = newImprovedCartProducts.filter((brandGroup) => {});
      }
      return brandGroup;
    })
    .filter((brandGroup) => brandGroup.brandProducts.length !== 0);

  improvedCartProducts = [...newImprovedCartProducts];
  renderCart();

  function removeManufacturerBox(brand) {
    const wrapperManufacturer = document.querySelector(`.wrapper__Manufacturer__${brand}`);
    wrapperManufacturer.remove();
  }
  function removeProduct(brand) {
    const product = document.querySelector(`.wrapper__Product__Cart__${id}`);
    product.remove();
  }
}
//Renderers:

function renderCart() {
  renderImprovedBrandBoxes();
  renderImprovedCartProducts();
  renderGrandTotal();
  function renderImprovedBrandBoxes() {
    const cartContent = document.querySelector(".content__Cart");
    cartContent.innerHTML = "";
    const brandSet = new Set();

    let newImprovedCartProducts = [...improvedCartProducts];
    newImprovedCartProducts = newImprovedCartProducts.map((improvedProduct) => {
      const manufacturerBox = getManufacturerBoxMarkup(improvedProduct.brand);
      if (!brandSet.has(improvedProduct.brand)) {
        brandSet.add(improvedProduct.brand);
        cartContent.appendChild(manufacturerBox);
      }
      return improvedProduct;
    });
    improvedCartProducts = [...newImprovedCartProducts];
    function getManufacturerBoxMarkup(brand) {
      const isBrandCheckedSet = getImprovedIsBrandCheckedSet();
      const isChecked = isBrandCheckedSet.has(brand) ? "checked" : "";
      const brandTotal = getImprovedBrandTotal(brand);
      const manufacturerBox = document.createElement("div");
      manufacturerBox.className = `wrapper__Manufacturer__${brand}`;
      manufacturerBox.innerHTML = ` 
          <div class="manufacturer__Header">
            <input type="checkbox" class="checkbox__Manufacturer__${brand}" onclick="brandCheckboxHandler('${brand}')" ${isChecked}/>
            <div class="manufacturer__Name">${brand}</div>
          </div>
          <div class="manufacturer__Products__${brand} ${brand}">
         
          </div>
          <div class="manufacturer__Total__${brand} manufacturer__Total" >
            Total:<input disabled class="total__Manufacturer total__Manufacturer__${brand}" value=${brandTotal} />
          </div>
        `;
      return manufacturerBox;
    }
  }
  function renderImprovedCartProducts() {
    const productSet = new Set();
    let newImprovedCartProducts = [...improvedCartProducts];
    newImprovedCartProducts = newImprovedCartProducts.map(({ brand, brandProducts, isChecked }) => {
      let newBrandProducts = [...brandProducts];
      newBrandProducts = newBrandProducts.map((brandProduct) => {
        const manufacturerBox = document.querySelector(`.${brand}`);
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
        return brandProduct;
      });
    });
    function getManufacturerProductMarkup(id) {
      const currentImprovedProduct = getImprovedProduct(id);
      const {
        product: { title, brand, price },
        count,
        isChecked,
      } = currentImprovedProduct;
      const manufacturerProduct = document.createElement("div");
      manufacturerProduct.className = `wrapper__Product__Cart__${id}`;
      manufacturerProduct.innerHTML = `
        <div class=product__Cart__Data >
          <label for=""> <input type="checkbox" class="checkbox__Product__${id} checkbox__Product__${brand}"  onclick="productCheckboxHandler(${id})" ${
        isChecked ? "checked" : ""
      }  />${title}</label>
          <div>${price}</div>
          <div class="product__Counter" >
          <form>
          <input
            type="number"
            min="1"
            class="counter__Display counter__Display__${id}"
            value=${count}
          />
          </form>
          <div class="wrapper__Counter">
            <button class="counter__Cart" onclick="incrementCountHandler(event,${id})">+</button>
            <button class="counter__Cart" onclick="decrementCountHandler(event,${id})">-</button>
          </div>
        </div>
        <button class="button__Delete" onclick="deleteProductHandler(${id})"><i class="fa-solid fa-trash fa-lg"></i></button>
        </div>
      `;
      return manufacturerProduct;
    }
  }
  function renderGrandTotal() {
    const grandTotalValue = getImprovedGrandTotal();
    const wrapperCart = document.querySelector(".wrapper__Cart");
    const wrapperGrandTotal = document.querySelector(".wrapper__Grand__Total");
    const newWrapperGrandTotal = document.createElement("div");
    newWrapperGrandTotal.className = "wrapper__Grand__Total";
    newWrapperGrandTotal.innerHTML = `<label for="">
           Grand Total:
            <input class="grand__Total" disabled type="number" value=${grandTotalValue}  />
           </label>`;
    wrapperGrandTotal.remove();
    wrapperCart.appendChild(newWrapperGrandTotal);
  }
}

//Helpers:
function getImprovedProduct(id) {
  let cartProducts = [];
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((improvedProduct) => {
    cartProducts = cartProducts.concat(improvedProduct.brandProducts);
  });
  idProduct = cartProducts.filter((brandProduct) => brandProduct.product.id === id)[0];
  return idProduct;
}
function getImprovedBrandSet() {
  const brandSet = new Set();
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
    brandSet.add(brandGroup.brand);
  });
  return brandSet;
}
function getImprovedProductSet() {
  const productSet = new Set();
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
    let newBrandProducts = [...brandGroup.brandProducts];
    newBrandProducts = newBrandProducts.map((brandProduct) => {
      productSet.add(brandProduct.product.id);
    });
  });
  return productSet;
}
function getImprovedBrandTotal(brand) {
  let brandTotalArray = [];
  let brandTotal = 0;
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
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
function getImprovedGrandTotal() {
  const brandTotalArray = [];
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
    brandTotalArray.push(getImprovedBrandTotal(brandGroup.brand));
  });
  if (brandTotalArray.length === 0) {
    return;
  }
  const grandTotal = brandTotalArray.reduce((grandTotal, brandTotal) => grandTotal + brandTotal);
  return grandTotal;
}
function getImprovedIsBrandCheckedSet() {
  const isBrandCheckedSet = new Set();
  let newImprovedCartProducts = [...improvedCartProducts];
  newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
    if (brandGroup.isChecked === true) {
      isBrandCheckedSet.add(brandGroup.brand);
    }
  });
  return isBrandCheckedSet;
}
function trimWhiteSpace(string) {
  return string.replace(/\s/g, "");
}
function trimSpecialCharacters(string) {
  return string.replace(/^a-zA-Z0-9 ]/g, "").replace(/[&-']/g, "");
}
function allAreTrue(arr) {
  return arr.every((element) => element === true);
}
function getShopProductData(id) {
  const title = document.querySelector(`.product__Title__${id}`).innerText;
  const brand = trimSpecialCharacters(
    trimWhiteSpace(document.querySelector(`.product__Brand__${id}`).innerText)
  );
  const price = Number(document.querySelector(`.product__Price__${id}`).innerText);
  return { title: title, brand: brand, price: price };
}
