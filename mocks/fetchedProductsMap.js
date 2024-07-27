const response = require("./response.json");

const fetchedProductsMap = new Map();
fetchedProductsMap.set("1", response.products[0]);

module.exports = { fetchedProductsMap };
