const PAGE_LOAD = "load";
const PAGE_UNLOAD = "unload";
const UNHANDLED_REJECTION = "unhandledrejection";
const BASE_URL = "https://dummyjson.com/products";
const FETCH_PRODUCTS_LIMIT = 50;
const IS_NODE_ENVIRONMENT = typeof module !== "undefined";
const IS_BROWSER_ENVIRONMENT = typeof module === "undefined";

export const constants = {
  PAGE_LOAD,
  PAGE_UNLOAD,
  UNHANDLED_REJECTION,
  BASE_URL,
  FETCH_PRODUCTS_LIMIT,
  IS_BROWSER_ENVIRONMENT,
  IS_NODE_ENVIRONMENT,
};
