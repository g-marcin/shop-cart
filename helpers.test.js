const fs = require("fs");
const path = require("path");
import {
    screen,
    fireEvent,
} from "@testing-library/dom"
import { increaseProductCount, decreaseProductCount, checkTruthyValues } from "./helpers.js"
import { getProductCardHTMLMarkup } from "./markup/productCard.js";
import response from "./mocks/response.json"



describe("index.html-helpers", () => {
    const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
    beforeEach(() => {
        document.body.innerHTML = html;  
    });

    it("checks if checkTruthyValues helper is working correctly", () => {
      
      const TRUTHY_VALUES = [1, "string", true];
      const FALSY_VALUES = [0, "", false, null, undefined, NaN, 10];
      expect(checkTruthyValues(TRUTHY_VALUES)).toBeTruthy();
      expect(checkTruthyValues(FALSY_VALUES)).toBeFalsy();
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

    const outputPath = path.resolve(__dirname, "./jsdom1.html");
    fs.writeFileSync(outputPath, document.documentElement.outerHTML, "utf8");

    });

    afterAll(()=>{
        const outputPath = path.resolve(__dirname, "./jsdom/helpers/jsdom.html");
        fs.writeFileSync(outputPath, document.documentElement.outerHTML, "utf8");
    })
});

