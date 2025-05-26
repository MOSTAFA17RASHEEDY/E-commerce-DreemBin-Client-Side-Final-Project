let allProducts = [];

// Fetch products ONCE and use for both best sellers and search
fetch("../Shared/JSON/products.json")
  .then((response) => response.json())
  .then((products) => {
    allProducts = products;

    // Featured products (Best Sellers)
    const bestSellers = allProducts.filter((product) => product.BestSell);
    const ul = document.getElementById("featured-products-list");
    ul.innerHTML = "";
    bestSellers.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="ProductContainer">
          <button>Shop Now</button>
          <div class="ProductImgContainer">
            <img src="..${product.image}" alt="${product.title}" />
          </div>
          <h3>${product.title}</h3>
          <p>$ ${product.price.toFixed(2)} USD</p>
        </div>
      `;
      ul.appendChild(li);
    });
  })
  .catch((error) => {
    console.error("Error loading products:", error);
  });

// Fetch categories (no change needed)
fetch("../Shared/JSON/Categories.json")
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
        window.location.href = `../Products/All Products/AllProducts.html?category=${encodeURIComponent(
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
        <img src="..${product.image}" alt="${product.title}" />
        <span>${product.title}</span>
      `;
      div.onclick = () => {
        window.location.href = `../Products/All Products/AllProducts.html?product=${encodeURIComponent(
          product.title
        )}`;
      };
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

function toggleCart() {
  cartSidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

function addToCart(name, price, image) {
  const existingItem = cartItems.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ name, price, quantity: 1, image });
  }
  renderCart();
}

function updateQuantity(index, quantity) {
  cartItems[index].quantity = parseInt(quantity);
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  renderCart();
}

function removeItem(index) {
  cartItems.splice(index, 1);
  renderCart();
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

  if (cartItems.length > 0) {
    cartFooter.innerHTML = `
    <p><strong>Subtotal</strong><span>: $${total.toFixed(2)} USD</span></p>
    <button class="checkout-btn">Continue to Checkout</button>
  `;
  } else {
    cartFooter.innerHTML = `
    <div style="text-align: center; padding: 30px;">
      <img src="../Shared/Images/emptycart.png" style="width: 150px; opacity: 0.6;" />
      <p style="margin-top: 10px;">No products inside your cart.</p>
      <button onclick="toggleCart()" class="checkout-btn">Start Shopping</button>
    </div>
  `;
  }
}
renderCart();
