const displayProducts = (products, container) => {
  const productItems = products
    .map((product) => {
      const { image, name, category, price } = product;
      const img = image.mobile;

      return `
    <!-- single product -->
            <article class="product" data-category="${category}">
              <div class="item-container">
                <img src=${img} alt="${name} image" class="product-img img">

                <!-- button design -->
                <div class="btn-container">
                  <!-- main -->
                  <button type="button" class="addToCart-btn design-btn btn" data-category="${category}">
                    <img src="./assets/images/icon-add-to-cart.svg" alt="" class="product-cart-icon" data-category="${category}">
                    add to Cart
                  </button>

                  <!-- hover -->
                  <div class="design-btn hoverBtn-container">
                    <button type="button" class="decrease-btn icon-btn btn" data-category="${category}">
                      <img src="./assets/images/icon-decrement-quantity.svg" alt="- icon" class="decrease-icon" data-category="${category}">
                    </button>
                    <p class="product-item-quantity" data-category="${category}"></p>
                    <button type="button" class="increase-btn icon-btn btn" data-category="${category}">
                      <img src="./assets/images/icon-increment-quantity.svg" alt="+ icon" class="increase-icon" data-category="${category}">
                    </button>
                  </div>
                </button>
                </div>
              </div>

              <!-- product footer -->
              <footer class="product-footer">
                <p class="product-category">${category}</p>
                <h3 class="product-name">${name}</h3>
                <p class="product-price">$${price}</p>
              </footer>
            </article>
            <!-- end of single product -->`;
    })
    .join("");
  container.innerHTML = productItems;
};

export default displayProducts;
