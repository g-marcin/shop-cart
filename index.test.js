global.fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

import {
  screen,
  fireEvent,
} from "@testing-library/dom"
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

import { increaseProductCount, decreaseProductCount, checkTruthyValues } from "./helpers.js"
import { addToCartHandler } from "./index.js"
import response from "./mocks/response.json"
import { getProductCardHTMLMarkup } from "./markup/productCard.js";

beforeEach(() => {
  document.body.innerHTML = html;  
});

describe("index.html-core", () => {
  it("checks if jest is working", () => {
    expect(true).toBe(true);
  });

  it("checks that footer is rendering", () => {
    const footerScript = fs.readFileSync(
      path.resolve(__dirname, "./widgets/footer.js"),
      "utf8",
    );
    eval(footerScript);

    window.dispatchEvent(new Event("load"));
    const FOOTER_SELECTOR = "footer";
    const footer = document.querySelector(FOOTER_SELECTOR);

    expect(footer).not.toBeNull();
  });

  it("checks that header is rendering", () => {
    const headerScript = fs.readFileSync(
      path.resolve(__dirname, "./widgets/header.js"),
      "utf8",
    );
    eval(headerScript);

    window.dispatchEvent(new Event("load"));
    const HEADER_SELECTOR = "header";
    const header = document.querySelector(HEADER_SELECTOR);
    expect(header).not.toBeNull();
  });

  it("checks products endpoint", async () => {
    const ENDPOINT_URL = "https://dummyjson.com/products?limit=1";
    const response = await fetch(ENDPOINT_URL);
    expect(response.ok).toBeTruthy();
  });

  it("checks product cart rendering", () => {
    const singleProduct = getProductCardHTMLMarkup(response.products[0])
    const shop_content = screen.getByTestId('shop_content')
    shop_content.appendChild(singleProduct)
  
    expect(shop_content.innerHTML).toBeTruthy();
  });

  it("checks shop_product counter plus button", async () => {
    window.increaseProductCount = increaseProductCount
    const shop_content = screen.getByTestId('shop_content')
    const singleProduct = getProductCardHTMLMarkup(response.products[0])
    shop_content.appendChild(singleProduct)
    


    const counter_plus = screen.getByTestId("shop_product_plus");
    const controller_display = screen.getByTestId("shop_product_display");

    fireEvent.click(counter_plus);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(controller_display.value).toBe("1");

  });

  it("checks shop_product counter minus button", async () => {
    window.increaseProductCount = increaseProductCount
    window.decreaseProductCount = decreaseProductCount
    const shop_content = screen.getByTestId('shop_content')
    const singleProduct = getProductCardHTMLMarkup(response.products[0])
    shop_content.appendChild(singleProduct)
    
    const counter_plus = screen.getByTestId("shop_product_plus");
    const counter_minus = screen.getByTestId("shop_product_minus");
    const controller_display = screen.getByTestId("shop_product_display");

    fireEvent.click(counter_plus);
    await new Promise((resolve) => setTimeout(resolve, 500));
    fireEvent.click(counter_plus);
    await new Promise((resolve) => setTimeout(resolve, 500));
    fireEvent.click(counter_minus);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(controller_display.value).toBe("1");

  });

  it('adds product to cart on add to cart button click', async ()=>{
    window.increaseProductCount = increaseProductCount
    window.addToCartHandler = addToCartHandler
    const shop_content = screen.getByTestId('shop_content')
    const singleProduct = getProductCardHTMLMarkup(response.products[0])
    shop_content.appendChild(singleProduct)
    


    const counter_plus = screen.getByTestId("shop_product_plus");
    const add_to_cart = screen.getByTestId('add_to_cart')

    fireEvent.click(counter_plus);
    await new Promise((resolve) => setTimeout(resolve, 500));
    fireEvent.click(add_to_cart);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  );


describe("index.html-helpers", () => {
  it("checks if checkTruthyValues helper is working correctly", () => {
    const TRUTHY_VALUES = [1, "string", true];
    const FALSY_VALUES = [0, "", false, null, undefined, NaN, 10];
    expect(checkTruthyValues(TRUTHY_VALUES)).toBeTruthy();
    expect(checkTruthyValues(FALSY_VALUES)).toBeFalsy();
  });

  it('remove all cart products on clear button click', ()=>{
      const cartMarkup = `
      <div class="wrapper__Cart">
          <div class="header__Cart">
            <div class="logo__Cart">
              <i class="fa-solid fa-cart-shopping"></i>
              <h2>THE CART</h2> 
            </div>
            
            <button class="cart__reset" onclick="resetCart()" >clear</button>
          </div>
          <div class="content__Cart" data-testid="content-cart"></div>
          <div class="wrapper__Grand__Total">
            <label for="">
              Grand Total:
              <input
                class="grand__Total"
                disabled
                type="number"
                value="0"
                title="grand Total"
                data-testid="grand_total_input"
              />
            </label>
            <span>$</span>
          </div>
        </div>
      `  
  })
})})

