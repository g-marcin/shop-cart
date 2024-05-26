
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
const { checkTruthyValues } = require('./index.js');
global.fetch = require('node-fetch');;

document.body.innerHTML = html;  


describe('index.html-core', () => {
    it('checks if jest is working', () => {
        expect(true).toBe(true);
        console.log(JSON.stringify(document.body.innerHTML));
    })
    
    it('checks that footer is rendering', () => { 
        const FOOTER_SELECTOR = 'footer'
        const footer = document.querySelector(FOOTER_SELECTOR);
        expect(footer).not.toBeNull();  
    })
    
    it('checks that header is rendering', () => {     
        const HEADER_SELECTOR = 'header'
        const header = document.querySelector(HEADER_SELECTOR);   
        expect(header).not.toBeNull();  
    })
    
    it('checks if the endpoint is responding', async () => {
        const ENDPOINT_URL = 'https://dummyjson.com/products?limit=1'
        const response = await fetch(ENDPOINT_URL);
        expect(response.ok).toBeTruthy();
    });

    it('checks that products are rendering', () => {
        //TODO check if products are rendering
    })
})

describe('index.html-helpers', () => {
    it('checks if checkTruthyValues helper is working correctly', () => {
        const TRUTHY_VALUES = [1,"string", true]
        const FALSY_VALUES = [0, "", false, null, undefined, NaN, 10]
        expect(checkTruthyValues(TRUTHY_VALUES)).toBeTruthy();
        expect(checkTruthyValues(FALSY_VALUES)).toBeFalsy();
    })
})

