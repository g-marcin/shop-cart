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
newImprovedCartProducts = newImprovedCartProducts.map((brandGroup) => {
  let newBrandProducts = [...brandGroup.brandProducts];
  newBrandProducts = newBrandProducts.map((brandProduct) => {
    return brandProduct;
  });
});

export const test = () => {
  console.log('modules working!');
}

test()
window.alert('modules working!') // this works
window.addEventListener('load', () =>{
  console.log('modules working!')
} )