window.addEventListener("load", () => {
  const header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `
       <a class="logo" href="/" title="logo" aria-label="link to homepage">Shop-Cart</a>
       <div class="wrapper__Navbar">
         <div class="wrapper__Links">
           <a class="separator-3 Inter" title="Support" aria-label="link to support page" href="#"
             >Support
           </a>
           <div class="separator-3"></div>
           <a class="Inter" href="#" title="Services" aria-label="link to services page">
             Services</a
           >
         </div>
         <div class="separator-5"></div>
         <button class="dropdown__Account" aria-label="open account menu" type="menu">
           Account
           <div class="wrapper__Icon"></div>
           <i id="caret-down-icon" class="fa-solid fa-caret-down fa-2xs"></i>
         </button>
       </div>
       <button
         class="button__Hamburger"
         title="hamburger-menu"
         aria-label="open mobile menu"
         type="menu"
       >
         <i class="fa-solid fa-bars fa-xl"></i>
       </button>
     `;

  document.body.insertBefore(header, document.body.firstChild);
});
