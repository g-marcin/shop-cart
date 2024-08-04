global.fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

import {
  screen,
} from "@testing-library/dom"

import response from "./mocks/response.json"
import { getProductCardHTMLMarkup } from "./markup/productCard.js";


const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
beforeEach(() => {
  document.body.innerHTML = html;  
});
describe("index.html-core", () => {
  it("checks if jest is working", () => {
    expect(true).toBe(true);
  });

  it("checks that footer renders", () => {
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

  it("checks that header renders", () => {
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

  it("checks shop product rendering", () => {
    const singleProduct = getProductCardHTMLMarkup(response.products[0])
    const shop_content = screen.getByTestId('shop_content')
    shop_content.appendChild(singleProduct)
  
    expect(shop_content.innerHTML).toBeTruthy();
  });

  afterAll(()=>{
    const outputPath = path.resolve(__dirname, "./jsdom/index/jsdom.html");
    fs.writeFileSync(outputPath, document.documentElement.outerHTML, "utf8");
  })
});

