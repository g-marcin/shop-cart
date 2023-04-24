cartProducts = [
  {
    brand: "Apple",
    isChecked: true,
    brandProducts: [
      { product: { id: 1 }, isChecked: false, count: 0 },
      { product: { id: 2 }, isChecked: false, count: 0 },
      { product: { id: 3 }, isChecked: false, count: 0 },
    ],
  },
  {
    brand: "Samsung",
    isChecked: true,
    brandProducts: [
      { product: { id: 1 }, isChecked: false, count: 0 },
      { product: { id: 2 }, isChecked: false, count: 0 },
      { product: { id: 3 }, isChecked: false, count: 0 },
    ],
  },
];

let newImprovedCartProducts = [...improvedCartProducts];
newImprovedCartProducts = newImprovedCartProducts.map(({ brand, brandProducts, isChecked }) => {
  let newBrandProducts = [...brandProducts];
  newBrandProducts = newBrandProducts.map((product) => {
    return product;
  });
});
