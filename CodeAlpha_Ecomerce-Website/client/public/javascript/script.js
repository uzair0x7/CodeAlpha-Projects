const API_BASE = "http://localhost:5000/api";

async function loadNavbar() {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  try {
    const response = await fetch("navbar.html");
    if (!response.ok) throw new Error("Failed to load navbar");
    const html = await response.text();
    placeholder.innerHTML = html;


    const navbarToggle = document.getElementById("navbar-toggle");
    const navbar = document.querySelector(".navbar");
    if (navbarToggle && navbar) {
      navbarToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
      });


      const menuLinks = document.querySelectorAll(".navbar-menu a, .navbar-menu button");
      menuLinks.forEach(link => {
        link.addEventListener("click", () => {
          navbar.classList.remove("active");
        });
      });
    }
  } catch (error) {
    console.error("Navbar loading error:", error);
  }
}

function getToken() {
  return localStorage.getItem("token");
}

function setAuthData(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
  return !!getToken();
}

function updateNavbar() {
  const userArea = document.getElementById("user-area");
  if (!userArea) return;

  const user = getCurrentUser();

  if (isLoggedIn() && user) {
    userArea.innerHTML = `
      <span class="navbar-welcome">Welcome back, ${user.name}</span>
      <button id="logout-btn" class="navbar-logout">Logout</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault();
      clearAuthData();
      window.location.href = "index.html";
    });
  } else {
    userArea.innerHTML = `
      <a href="login.html" class="navbar-auth-link">Login</a>
      <a href="register.html" class="navbar-auth-link">Register</a>
    `;
  }
}

function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.product === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product: productId, quantity });
  }
  saveCart(cart);
  updateNavbar();
  alert("Added to cart!");
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.product !== productId);
  saveCart(cart);
  updateNavbar();
  if (window.location.pathname.endsWith("cart.html")) {
    renderCart();
  }
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;
  const cart = getCart();
  const item = cart.find((item) => item.product === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    if (window.location.pathname.endsWith("cart.html")) {
      renderCart();
    }
  }
}

function clearCart() {
  localStorage.removeItem("cart");
  updateNavbar();
}

async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return await res.json();
}

async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

async function register(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

async function placeOrder(items) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Order failed");
  return data;
}

function renderProductCard(product) {
  return `
    <div class="product-card">
      <img class="product-card-img" src="${product.imageUrl}" alt="${product.name}">
      <div class="product-card-info">
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-desc">${product.description.substring(0, 80)}...</p>
        <p class="product-card-price">$${product.price.toFixed(2)}</p>
        <div class="product-card-actions">
          <a href="product.html?id=${product._id}" class="btn">Details</a>
          <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

async function displayProducts() {
  const container = document.getElementById("product-list");

  if (!container) return;

  try {
    const products = await fetchProducts();

    container.innerHTML = products.map(renderProductCard).join("");

    gsap.from(".product-card", {
      y: 40,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.3,
    });
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

async function displayProductDetails() {
  const container = document.getElementById("product-details");
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) {
    container.innerHTML =
      '<div class="alert alert-error">Product ID missing</div>';
    return;
  }
  try {
    const product = await fetchProduct(productId);
    container.innerHTML = `
      <div class="product-detail-card">
        <img class="product-detail-img" src="${product.imageUrl}" alt="${product.name}">
        <div class="product-detail-info">
          <h2 class="product-detail-title">${product.name}</h2>
          <p class="product-detail-desc">${product.description}</p>
          <p class="product-detail-price">$${product.price.toFixed(2)}</p>
          <div class="product-detail-actions">
            <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
            <a href="index.html" class="btn">Back to Products</a>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

async function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }
  let html = "";
  let total = 0;
  for (const item of cart) {
    try {
      const product = await fetchProduct(item.product);
      total += product.price * item.quantity;
      html += `
        <div class="cart-item">
          <img class="cart-item-img" src="${product.imageUrl}" alt="${product.name}">
          <div class="cart-item-details">
            <h3 class="cart-item-title">${product.name}</h3>
            <p class="cart-item-price">$${product.price.toFixed(2)} each</p>
          </div>
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateQuantity('${product._id}', ${item.quantity - 1})">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity('${product._id}', ${item.quantity + 1})">+</button>
          </div>
          <p class="cart-item-total">$${(product.price * item.quantity).toFixed(2)}</p>
          <button class="btn btn-remove" onclick="removeFromCart('${product._id}')">Remove</button>
        </div>
      `;
    } catch (error) {
      console.error(error);
    }
  }
  html += `<div class="cart-total">Total: $${total.toFixed(2)}</div>`;
  container.innerHTML = html;
}

function handleLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const data = await login(email, password);
      setAuthData(data.token, data.user);
      updateNavbar();
      const redirect =
        new URLSearchParams(window.location.search).get("redirect") ||
        "index.html";
      window.location.href = redirect;
    } catch (error) {
      alert(error.message);
    }
  });
}

function handleRegisterForm() {
  const form = document.getElementById("register-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const data = await register(name, email, password);
      setAuthData(data.token, data.user);
      updateNavbar();
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

async function renderCheckout() {
  const container = document.getElementById("checkout-summary");
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML =
      '<p class="empty-cart">Your cart is empty. <a href="index.html">Go shopping</a></p>';
    return;
  }
  let html = "";
  let total = 0;
  for (const item of cart) {
    try {
      const product = await fetchProduct(item.product);
      total += product.price * item.quantity;
      html += `
        <div class="checkout-item">
          <img class="checkout-item-img" src="${product.imageUrl}" alt="${product.name}">
          <div class="checkout-item-details">
            <h3 class="checkout-item-title">${product.name}</h3>
            <p class="checkout-item-qty">Quantity: ${item.quantity}</p>
          </div>
          <p class="checkout-item-total">$${(product.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
    } catch (error) {
      console.error(error);
    }
  }
  html += `<div class="checkout-total">Total: $${total.toFixed(2)}</div>`;
  container.innerHTML = html;
}

async function handleCheckout() {
  const btn = document.getElementById("place-order");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    if (!isLoggedIn()) {
      window.location.href = "login.html?redirect=checkout.html";
      return;
    }
    const cart = getCart();
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    try {
      await placeOrder(cart);
      clearCart();
      window.location.href = "order-confirmation.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
   await loadNavbar();  
  updateNavbar();

  const path = window.location.pathname;

  if (path.endsWith("index.html") || path === "/") {
    displayProducts();
  } else if (path.endsWith("product.html")) {
    displayProductDetails();
  } else if (path.endsWith("cart.html")) {
    renderCart();
  } else if (path.endsWith("login.html")) {
    handleLoginForm();
  } else if (path.endsWith("register.html")) {
    handleRegisterForm();
  } else if (path.endsWith("checkout.html")) {
    renderCheckout();
    handleCheckout();
  }
});
