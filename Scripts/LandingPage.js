let allProducts = [];

// Fetch products ONCE and use for both best sellers and search
fetch("/Shared/JSON/products.json")
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;

    // Featured products (Best Sellers)
    const bestSellers = allProducts.filter((product) => product.BestSell);
    const ul = document.getElementById("featured-products-list");

    bestSellers.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a class="ProductContainer" href="../Pages/ProductDetails.html?id=${
          product.id
        }" class="hover-button" style="display:block;text-decoration:none; color:inherit;">
          <button>Shop Now</button>
          <div class="ProductImgContainer">
            <img src="${product.image}" alt="${product.title}" />
          </div>
          <h3>${product.title}</h3>
          <p>$ ${product.price.toFixed(2)} USD</p>
        </a>
      `;
      ul.appendChild(li);
    });
  })
  .catch((error) => {
    console.error("Error loading products:", error);
  });

fetch("/Shared/JSON/Categories.json")
  .then((response) => response.json())
  .then((categories) => {
    const ul = document.getElementById("CategoryList");
    ul.innerHTML = "";

    categories.forEach((category) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="ImgContanier">
          <img src="${category.image}" alt="${category.title}" />
        </div>
        <h3>${category.title}</h3>
      `;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        window.location.href = `../Pages/AllProducts.html?category=${encodeURIComponent(
          category.title.toLowerCase()
        )}`;
      });
      ul.appendChild(li);
    });
  })
  .catch((error) => {
    console.error("Error loading categories:", error);
  });

// --- Search Functionality ---
const searchInput = document.getElementById("SearchInput");
const searchDropdown = document.getElementById("searchDropdown");
const clearSearch = document.getElementById("clearSearch");

const inputParent = searchInput.parentElement;
inputParent.style.position = "relative";
searchDropdown.style.position = "absolute";
searchDropdown.style.top = `${
  searchInput.offsetTop + searchInput.offsetHeight + 2
}px`;
searchDropdown.style.left = `${searchInput.offsetLeft}px`;
searchDropdown.style.width = `${searchInput.offsetWidth}px`;

function renderDropdown(items, message = "") {
  searchDropdown.innerHTML = "";
  if (message) {
    searchDropdown.innerHTML = `<div class="search-message">${message}</div>`;
  } else {
    items.forEach((product) => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `
      <a href="../Pages/ProductDetails.html?id=${product.id}"  style="display:block;text-decoration:none; color:inherit; display:flex; align-items:center;">
        <img src="${product.image}" alt="${product.title}" />
        <span>${product.title}</span>
        </a>
      `;

      searchDropdown.appendChild(div);
    });
  }
  searchDropdown.style.display = "block";
}

function hideDropdown() {
  searchDropdown.style.display = "none";
}

searchInput.addEventListener("input", function () {
  const value = this.value.trim();
  if (!value) {
    renderDropdown([], "Lets Search for your product ...");
    clearSearch.style.display = "none";
    return;
  }
  clearSearch.style.display = "inline";
  const matches = allProducts
    .filter((p) => p.title.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 5);

  if (matches.length > 0) {
    renderDropdown(matches);
  } else {
    renderDropdown([], "There is no Product with this name !");
  }
});

searchInput.addEventListener("focus", function () {
  if (!this.value.trim()) {
    renderDropdown([], "Lets Search for your product ...");
  }
});

clearSearch.addEventListener("click", function () {
  searchInput.value = "";
  hideDropdown();
  clearSearch.style.display = "none";
});

document.addEventListener("click", function (e) {
  if (
    !searchInput.contains(e.target) &&
    !searchDropdown.contains(e.target) &&
    e.target !== clearSearch
  ) {
    hideDropdown();
  }
});

const cartSidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartFooter = document.getElementById("cartFooter");

let cartItems = [];

const savedCart = localStorage.getItem("cartItems");
if (savedCart) {
  cartItems = JSON.parse(savedCart);
}
renderCart();
function toggleCart() {
  cartSidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

// Add vibration when product is added
function addToCart(name, price, image) {
  // Check if user is logged in
  const session = JSON.parse(sessionStorage.getItem("userSession") || "null");
  if (!session) {
    showTopMessage("You must log in first!");
    return;
  }

  const existingItem = cartItems.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ name, price, quantity: 1, image });
  }
  renderCart();
  if (typeof refreshProductCount === "function" && window.currentProductTitle) {
    refreshProductCount(window.currentProductTitle);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Vibrate animation
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.classList.remove("vibrate");
    void cartCount.offsetWidth;
    cartCount.classList.add("vibrate");
  }
}

function updateQuantity(index, quantity) {
  cartItems[index].quantity = parseInt(quantity);
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  renderCart();
  if (typeof refreshProductCount === "function" && window.currentProductTitle) {
    refreshProductCount(window.currentProductTitle);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function removeItem(index) {
  cartItems.splice(index, 1);
  renderCart();
  if (typeof refreshProductCount === "function" && window.currentProductTitle) {
    refreshProductCount(window.currentProductTitle);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;
    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} USD</p>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
        <input type="number" min="1" value="${
          item.quantity
        }" onchange="updateQuantity(${index}, this.value)">
      </div>
    `;
  });

  // Update cart count
  const cartCount = document.getElementById("cartCount");
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = count;

  if (cartItems.length > 0) {
    cartFooter.innerHTML = `
      <p><strong>Subtotal</strong><span>: $${total.toFixed(2)} USD</span></p>
      <button class="checkout-btn" id="checkoutBtn">Continue to Checkout</button>
    `;
    // Add event listener for checkout
    document.getElementById("checkoutBtn").onclick = handleCheckout;
  } else {
    cartFooter.innerHTML = `
      <div style="text-align: center; padding: 30px;">
        <img src="/Shared/Images/emptycart.png" style="width: 150px; opacity: 0.6;" />
        <p style="margin-top: 10px;">No products inside your cart.</p>
        <button onclick="toggleCart()" class="checkout-btn">Start Shopping</button>
      </div>
    `;
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

renderCart();

function handleCheckout() {
  if (cartItems.length === 0) return;

  let orders = [];
  const savedOrders = localStorage.getItem("orders");
  if (savedOrders) {
    orders = JSON.parse(savedOrders);
  }

  orders.push({
    date: new Date().toISOString(),
    items: cartItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  cartItems = [];
  renderCart();
  if (typeof refreshProductCount === "function" && window.currentProductTitle) {
    refreshProductCount(window.currentProductTitle);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  showCartMessage("Your order has been placed!");
}

function showCartMessage(msg) {
  let msgDiv = document.createElement("div");
  msgDiv.textContent = msg;
  msgDiv.style.cssText = `
    background: #b4ddff;
    color: #222;
    padding: 12px 20px;
    border-radius: 8px;
    text-align: center;
    margin: 15px 0;
    font-weight: bold;
    font-size: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    z-index: 1000;
  `;
  msgDiv.id = "cart-success-msg";
  cartSidebar.insertBefore(msgDiv, cartSidebar.firstChild);

  setTimeout(() => {
    if (msgDiv.parentNode) msgDiv.parentNode.removeChild(msgDiv);
  }, 3000);
}

function showTopMessage(msg) {
  // Remove any existing message
  const oldMsg = document.getElementById("top-login-msg");
  if (oldMsg) oldMsg.remove();

  const msgDiv = document.createElement("div");
  msgDiv.textContent = msg;
  msgDiv.id = "top-login-msg";
  msgDiv.style.cssText = `
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: #b4ddff;
    color: #222;
    padding: 16px 32px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    z-index: 2000;
    transition: top 0.4s cubic-bezier(.4,2,.6,1);
  `;
  document.body.appendChild(msgDiv);

  // Animate drop down
  setTimeout(() => {
    msgDiv.style.top = "20px";
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    msgDiv.style.top = "-60px";
    setTimeout(() => {
      if (msgDiv.parentNode) msgDiv.parentNode.removeChild(msgDiv);
    }, 400);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById("logoutLink");
  const session = JSON.parse(sessionStorage.getItem("userSession") || "null");
  if (!session) {
    logoutLink.textContent = "Log In";
    logoutLink.href = "/Login/Login.html";
  } else {
    logoutLink.textContent = "Log Out";
    logoutLink.href = "../Pages/Login.html";
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "../Pages/Login.html";
    });
  }
});
function toggleMenu() {
  const navList = document.querySelector(".RightPartOfNav .Lists ul");
  navList.style.display = navList.style.display === "none" ? "flex" : "none";
}
