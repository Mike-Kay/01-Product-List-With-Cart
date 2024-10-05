import {
  getElement,
  productsList,
  getLocalStorage,
  setStorageItem,
} from "./src/utils.js";
import displayProducts from "./src/displayProducts.js";
import { addToCartDOM } from "./src/cart/setupCart.js";

const productItemsDOM = getElement(".product-items");
const cartDOM = getElement(".cart");
const cartItemsDOM = getElement(".cart-items");
const cartItemCountDOM = getElement(".cart-item-count");
const cartTotalDOM = getElement(".order-total h3");
const alertDOM = getElement(".alert");
const confirmationModalDOM = getElement(".confirmation-modal");
const orderedItemsCon = getElement(".ordered-items-container");
const newOrderBtn = getElement(".new-order-btn");
const loader = getElement(".page-loading");

const init = () => {
  displayProducts(productsList, getElement(".product-items"));
  productItemsFuntionality();
  updateData();
  cartFunctionality();
  setTimeout(() => {
    loader.style.display = "none";
  }, 1000);
};

let cart = getLocalStorage("productListCart");

const addToCart = (id) => {
  const item = cart.find((cartItem) => cartItem.category === id);
  if (!item) {
    // find item in product list and add to cart
    let product = productsList.find((product) => product.category === id);
    product = { ...product, amount: 1 };
    let total = product.amount * product.price;
    product = { ...product, totalPrice: total };
    cart = [...cart, product];
    cartDOM.classList.add("show");
    addToCartDOM(product);
  }
};

// Products Funtionality
const productItemsFuntionality = () => {
  productItemsDOM.addEventListener("click", (e) => {
    const element = e.target;
    const parent = e.target.parentElement;
    const id = element.dataset.category;

    const productDOM = [...document.querySelectorAll(".product")].find(
      (product) => product.dataset.category === id
    );
    const productItemQTYDOM = productDOM.querySelector(
      ".product-item-quantity"
    );

    const addToCartBtn =
      element.classList.contains("addToCart-btn") ||
      parent.classList.contains("addToCart-btn");

    if (addToCartBtn) {
      productDOM.classList.add("show");
      cartDOM.classList.add("show");
      addToCart(id);
      productItemQTYDOM.textContent = 1;
      alertStatus("item added to cart", "success");
    }

    const increaseBtn =
      element.classList.contains("increase-btn") ||
      element.classList.contains("increase-icon");
    if (increaseBtn) {
      productItemQTYDOM.textContent = itemsQTYState(id, "increase");
    }

    const decreaseBtn =
      element.classList.contains("decrease-btn") ||
      element.classList.contains("decrease-icon");
    if (decreaseBtn) {
      const amount = itemsQTYState(id, "decrease");
      if (amount < 1) {
        productDOM.classList.remove("show");
        const cartItem = [...cartDOM.querySelectorAll(".cart-item")].find(
          (item) => item.dataset.category === id
        );
        removeCartItem(id);
        cartItem.remove();
        alertStatus("item removed from cart", "danger");
      }
      productItemQTYDOM.textContent = amount;
    }

    cartItemCountDOM.textContent = `(${cartItemsCount()})`;
    cartItemsTotal();
    setStorageItem("productListCart", cart);
    if (cart.length < 1) setBackToDefault();
  });
};

const updateData = () => {
  const productDOM = [...productItemsDOM.querySelectorAll(".product")];
  productDOM.forEach((product) => {
    cart.forEach((cartItem) => {
      if (product.dataset.category === cartItem.category) {
        product.classList.add("show");
        const productQTYDOM = product.querySelector(".product-item-quantity");
        productQTYDOM.textContent = cartItem.amount;
      }
    });
  });
  cartItemCountDOM.textContent = `(${cartItemsCount()})`;

  renderCartItems();
  cartItemsTotal();
};

const renderCartItems = () => {
  if (cart.length >= 1) {
    cartDOM.classList.add("show");
    cart.forEach((cartItem) => addToCartDOM(cartItem));
  }
};

const itemsQTYState = (id, state) => {
  let newAmount;
  const cartItemDOM = [...cartDOM.querySelectorAll(".cart-item")].find(
    (cartItem) => cartItem.dataset.category === id
  );
  const cartItemQtyDOM = cartItemDOM.querySelector(".item-quantity");
  const cartItemQtyTotalDOM = cartItemDOM.querySelector(".item-quantity-total");

  cart = cart.map((cartItem) => {
    if (cartItem.category === id) {
      if (state === "increase") cartItem.amount += 1;
      else if (state === "decrease") cartItem.amount -= 1;
      newAmount = cartItem.amount;
      cartItem.totalPrice = cartItem.price * cartItem.amount;
      cartItemQtyDOM.textContent = `${cartItem.amount}x`;
      cartItemQtyTotalDOM.textContent = `$${cartItem.totalPrice}`;
    }
    return cartItem;
  });

  return newAmount;
};

let total;
const cartItemsTotal = () => {
  const cartTotal = cart.reduce((total, cartItem) => {
    total += cartItem.totalPrice;
    return total;
  }, 0);
  cartTotalDOM.textContent = `$${cartTotal}`;
  total = cartTotal;
  return cartTotal;
};

const cartItemsCount = () => {
  let count = 0;
  cart.forEach((cartItem) => {
    count += cartItem.amount;
  });
  return count;
};

// Cart Functionality
const cartFunctionality = () => {
  cartDOM.addEventListener("click", (e) => {
    const element = e.target;
    const parent = e.target.parentElement;
    const id = element.dataset.category;

    let parentElement;

    const removeBtn =
      element.classList.contains("remove-cart-item") ||
      parent.classList.contains("remove-cart-item");

    if (removeBtn) {
      removeCartItem(id);
      if (parent.classList.contains("cart-item")) {
        parentElement = parent;
      } else if (parent.classList.contains("remove-cart-item")) {
        parentElement = parent.parentElement;
      }

      parentElement.remove();
      alertStatus("item removed from cart", "danger");
      const productDOM = [...productItemsDOM.querySelectorAll(".product")].find(
        (product) => product.dataset.category === id
      );
      productDOM.classList.remove("show");
    }

    if (element.classList.contains("confirm-order-btn")) {
      confirmationModalDOM.classList.add("show");
      confirmationionalModal();
    }

    cartItemCountDOM.textContent = `(${cartItemsCount()})`;
    cartItemsTotal();
    setStorageItem("productListCart", cart);
    if (cart.length < 1) setBackToDefault();
  });
};

const removeCartItem = (id) => {
  cart = cart.filter((cartItem) => cartItem.category !== id);
};

const setBackToDefault = () => {
  cartDOM.classList.remove("show");
  [...productItemsDOM.querySelectorAll(".product")].forEach((productItem) =>
    productItem.classList.remove("show")
  );
  cartItemCountDOM.textContent = "(0)";
  localStorage.removeItem("productListCart");
};

const alertStatus = (text, status) => {
  alertDOM.textContent = text;
  alertDOM.classList.add(`alert-${status}`);
  setTimeout(() => {
    alertDOM.textContent = "";
    alertDOM.classList.remove(`alert-${status}`);
  }, 500);
};

const confirmationionalModal = () => {
  const orderedItems = cart.map((cartItem) => {
    const { amount, image, name, price, totalPrice } = cartItem;
    const img = image.mobile;
    return `
    <!-- single item -->
            <article class="ordered-item">
              <img src="${img}" alt="" class="oredered-item-img">
              <div>
                <h4 class="item-name">${name}</h4>
                <span class="item-quantity">${amount}x</span>
                <span class="item-price">@ $${price}</span>
              </div>
              <p class="item-quantity-total">$${totalPrice}</p>
            </article>
            <!-- end of single item -->
    `;
  });

  orderedItemsCon.innerHTML = `
  <div class="ordered-items">
            ${orderedItems.join("")}
          </div>
          <div class="order-total">
            <span>order total</span>
            <h3>$${total}</h3>
          </div>`;
};
newOrderBtn.addEventListener("click", () => {
  confirmationModalDOM.classList.remove("show");
  let cartItemsArr = [...cartItemsDOM.querySelectorAll(".cart-item")];
  cartItemsArr.forEach((item) => {
    item.remove();
  });
  cart = [];
  setBackToDefault();
});

window.addEventListener("DOMContentLoaded", init);
