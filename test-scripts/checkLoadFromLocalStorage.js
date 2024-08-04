import * as puppeteer from 'puppeteer' 
import dotenv from 'dotenv';

dotenv.config();
import {addProductToCart} from "./addProductToCart.js"


export async function checkLoadFromLocalStorage(){
   const {browser, page} = addProductToCart()
   page.close()
   const newPage = await browser.newPage()
   await newPage.waitForTimeout(2000)
    newPage.goTo(  `http://localhost:3001`,
        { timeout: 80000 }
)
    
}