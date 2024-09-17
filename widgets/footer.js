//footer
window.addEventListener('load', () => {
    const footer = document.createElement('footer')
    footer.className = 'footer'
    footer.innerHTML = `
        
          <a
            class="wrapper__Footer__Item Inter opaque"
            href="#"
            aria-label="link to contacts"
            title="Contact us"
            >Contact us</a
          >
          <a
            class="wrapper__Footer__Item Poppins opaque weight600"
            href="/index.html"
            aria-label="link to homepage"
            title="Homepage"
            >Shop-Cart</a
          >
          <div class="wrapper__Footer__Item opaque">
            <a
              class="wrapper__Icon"
              href="https://www.facebook.com"
              title="Facebook"
              aria-label="link to facebook"
              ><i class="fa-brands fa-solid fa-facebook-f fa-lg"></i
            ></a>
            <a
              class="wrapper__Icon"
              href="https://www.instagram.com"
              title="Instagram"
              aria-label="link to instagram"
              ><i class="fa-brands fa-solid fa-instagram fa-lg"></i
            ></a>
            <a
              class="wrapper__Icon"
              href="https://www.twitter.com"
              title="Twitter"
              aria-label="link to twitter"
              ><i class="fa-brands fa-solid fa-twitter fa-lg"></i
            ></a>
          </div>
    `

    document.body.appendChild(footer)
})
