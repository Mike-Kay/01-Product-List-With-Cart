import { getElement } from "../utils.js";

const cartItemsDOM = getElement(".cart-items");

export const addToCartDOM = (product) => {
  const { category, name, price, amount, totalPrice } = product;
  const article = document.createElement("article");
  article.classList.add("cart-item");
  article.setAttribute("data-category", category);
  article.innerHTML = `<h4 class="item-name">${name}</h4>
              <div class="cart-item-quantity-info">
                <h4 class="cart-item-quantity item-quantity" data-category="${category}">${amount}x</h4>
                <p class="cart-item-price item-price">@ $${price}</p>
                <p class="cart-item-total item-quantity-total" data-category="${category}">$${totalPrice}</p>
              </div>
              <button type="button" class="remove-cart-item btn" data-category="${category}">
                <img src="./assets/images/icon-remove-item.svg" alt="" data-category="${category}">
              </button>`;

  cartItemsDOM.appendChild(article);
};
