export function getBrandBoxHTMLMarkup(props) {
    const { brand, brandName, brandTotal, isChecked } = props;
  
    const brandBox = document.createElement("div");
    brandBox.className = `wrapper__Manufacturer wrapper__Manufacturer__${brand}`;
    brandBox.innerHTML = ` 
      <div class="manufacturer__Header">
          <input type="checkbox" class="checkbox__Manufacturer__${brand}" onclick="brandCheckboxHandler('${brand}')" ${isChecked}/>
          <div class="manufacturer__Name">
          ${brandName}
          </div>
      </div>
      <div class=" manufacturer__Products__${brand} ${brand}">     
      </div>
      <div class="manufacturer__Total__${brand} manufacturer__Total" >
          Total:<input class="total__Manufacturer total__Manufacturer__${brand}" value=${brandTotal} disabled  />
          $
      </div>
      `;
    return brandBox;
}