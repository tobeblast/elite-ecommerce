// Home page features div
async function homePageProduct() {
  try {
    const respones = await fetch("https://fakestoreapi.com/products?limit=4");
    const data = await respones.json();
    const productListEl = document.getElementById("home-page-features");
    productListEl.innerHTML = "";
    data.forEach((product) => {
      const card = document.createElement("div");
      card.className = "card px-0 position-relative feature";

      card.innerHTML = `
            <div class="d-flex align-items-center justify-content-center pt-5">
              <img src="${product.image}" alt="${
        product.title
      }" width="200px" height="200px"/>
            </div>
            <div class="position-absolute container">
              <div
                class="d-flex align-items-center justify-content-between pt-3"
              >
                <p class="best-seller rounded-pill text-center px-2 py-1">
                  ${product.category?.name || "New"}
                </p>
                <p class="percentage rounded-pill text-center px-2 py-1">
                  -${Math.floor(Math.random() * 30)}%
                </p>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title product-title">${product.title}</h5>
              <p class="card-text product-description">
                ${product.description.substring(0, 90)}...
              </p>
              <div
                class="price-add-to-cart d-flex align-items-center justify-content-between"
              >
                <div
                  class="new-price-old-price d-flex align-items-center justify-content-between gap-2"
                >
                  <p class="new-price fs-4"><b>$${product.price.toFixed(
                    0
                  )}</b></p>
                  <p class="old-price">$${(product.price + 50).toFixed(1)}</p>
                </div>
                
                  <button class="add-to-cart text-white" data-id="${
                    product.id
                  }" >Add to cart</button>
              </div>
            </div>
      `;

      productListEl.appendChild(card);
    });

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const product = data.find((p) => p.id == id);
        addToCart(product);
        if (
          confirm(`Are you sure you want to add ${product.title} to the cart`)
        ) {
          alert(`${product.title} added to cart 🎉 🎉 🎉`);
        } else {
          alert(`${product.title} not added to cart`);
          return;
        }
      });
    });
  } catch (error) {
    console.error("something happen loading the product", error);
  }
}

// Product page displaying of images
async function loadProduct() {
  try {
    const respones = await fetch("https://fakestoreapi.com/products");
    const data = await respones.json();
    const productListEl = document.getElementById("product-list");
    productListEl.innerHTML = "";
    data.forEach((product) => {
      const card = document.createElement("div");
      card.className = "card px-0 position-relative feature";

      card.innerHTML = `
            <div class="d-flex align-items-center justify-content-center pt-5">
              <img src="${product.image}" alt="${
        product.title
      }" width="200px" height="200px"/>
            </div>

            <div class="card-body">
              <h5 class="card-title product-title">${product.title}</h5>
              <p class="card-text product-description">
                ${product.description.substring(0, 90)}...
              </p>
              <div
                class="price-add-to-cart d-flex align-items-center justify-content-between"
              >
                <div
                  class="new-price-old-price d-flex align-items-center justify-content-between gap-2"
                >
                  <p class="new-price fs-4"><b>$${product.price}</b></p>
                  <p class="old-price">$${(product.price + 50).toFixed(2)}</p>
                </div>
                
                  <button class="add-to-cart text-white" data-id="${
                    product.id
                  }" >Add to cart</button>
              </div>
            </div>
      `;

      productListEl.appendChild(card);
    });

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const product = data.find((p) => p.id == id);
        addToCart(product);
        if (
          confirm(`Are you sure you want to add ${product.title} to the cart`)
        ) {
          alert(`${product.title} added to cart 🎉 🎉 🎉`);
        } else {
          alert(`${product.title} not added to cart`);
          return;
        }
      });
    });
  } catch (error) {
    console.error("something happen loading the product", error);
  }
}

// Add to cart function
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1; // increase quantity
  } else {
    cart.push({ ...product, quantity: 1 }); // add with quantity
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  document.getElementById("cart-count").textContent = count;
}

// cart functions
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const cartCountEl = document.getElementById("cart-count");

  cartItemsEl.innerHTML = ""; // Clear table

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>`;
    subtotalEl.textContent = "$0";
    totalEl.textContent = "$0";
    cartCountEl.textContent = "0";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Product"><img src="${item.image}" alt="${
      item.title
    }" width="60"/></td>
      <td data-label="Title">${item.title}</td>
      <td data-label="Price">$${item.price}</td>
      <td data-label="Quantity">
        <input type="number" value="${
          item.quantity
        }" min="1" class="quantity-input" data-index="${index}" />
      </td>
      <td data-label="Total" class="line-total">$${lineTotal.toFixed(2)}</td>
      <td data-label="Action">
        <button class="remove-btn btn btn-danger btn-sm" data-index="${index}">Remove</button>
      </td>
    `;

    cartItemsEl.appendChild(row);
  });

  // Update totals
  subtotalEl.textContent = `$${subtotal}`;
  totalEl.textContent = `$${subtotal}`;
  cartCountEl.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Event listeners for quantity change
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = e.target.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity = parseInt(e.target.value);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });
  });

  // Event listeners for remove
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const item = cart[index];
      if (
        confirm(`Are you sure you want to remove ${item.title} from the cart?`)
      ) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        // Item removed
        alert(`${item.title} removed from cart`);
        loadCart();
      } else {
        alert("Item not removed");
        return;
      }
    });
  });
}

// Check Out Function
function loadOrderSummary() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Cart data:", cart);
  let orderItemsContainer = document.getElementById("order-items");
  let orderTotal = document.getElementById("total");
  const placeOrderBtnEl = document.getElementById("place-order");

  orderItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" alt="${
      item.title
    }" width="60" height="60" style="object-fit:cover; border-radius:8px;" />
        <div>
          <p class="mb-0 fw-bold">${item.title}</p>
          <small>Quantity: ${item.quantity}</small>
        </div>
      </div>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    orderItemsContainer.appendChild(li);
    total += item.price * item.quantity;
  });

  // Add shipping
  let shipping = 5;
  if (cart.length > 0) {
    let shippingLi = document.createElement("li");
    shippingLi.innerHTML = `<span>Shipping</span> <span>$${shipping}</span>`;
    orderItemsContainer.appendChild(shippingLi);
    total += shipping;
  }

  // Update total
  if (orderTotal) {
    orderTotal.textContent = `Total: $${total}`;
  }

  // Clear cart and order summary and redirect on place order
  if (placeOrderBtnEl) {
    placeOrderBtnEl.addEventListener("click", () => {
      if (confirm("Are you ready to place this order")) {
        alert("Your order has been placed successfully 🎉 🎉");
      } else {
        alert("Your order has been canclled");
        return;
      }
      localStorage.removeItem("cart"); // Clear cart
      orderItemsContainer.innerHTML = "";
      if (orderTotal) {
        orderTotal.textContent = "Total: $0";
      }
      updateCartCount();
      window.location.href = "../index.html"; // Redirect to home page
    });
  }

  if (cart.length === 0) {
    orderItemsContainer.innerHTML = `<p class="text-center fs-5">Your cart is empty</p>`;
    placeOrderBtnEl.disabled = true;
  }
}

// Calling of functions on page load
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("home-page-features")) {
    homePageProduct();
  }

  if (document.getElementById("product-list")) {
    loadProduct();
  }

  if (document.getElementById("cart-items")) {
    loadCart();
  }

  if (document.querySelector(".order-summary")) {
    loadOrderSummary();
  }

  updateCartCount();
});
