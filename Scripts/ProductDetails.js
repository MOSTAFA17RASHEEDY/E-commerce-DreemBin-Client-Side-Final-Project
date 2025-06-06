function showProductDetails(productId) {
  fetch("/Shared/JSON/products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id == productId);
      if (product) {
        displayProductDetails(product);
      } else {
        window.location.href = "../Pages/404.html"; // Redirect to 404 if not found
      }
    });
}

function displayProductDetails(product) {
  window.currentProductTitle = product.title;
  // Get cart from localStorage
  let cartItems = [];
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
  }
  // Find this product in cart
  const cartItem = cartItems.find((item) => item.name === product.title);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const detailContainer = document.querySelector(".product-detail");
  const priceHTML = product.discountedPrice
    ? `<p><span class="original-price" style="text-decoration: line-through; color: #888;">$${product.price.toFixed(
        2
      )} USD</span> 
        <span class="price-discounted">$${product.discountedPrice.toFixed(
          2
        )} USD</span></p>`
    : `<p>$${product.price.toFixed(2)} USD</p>`;

  detailContainer.innerHTML = `
        <div class="image-section">
            <img src="${product.image}" alt="${
    product.title
  }" class="main-image">
        </div>
        <div class="product-details">
            <h1>${product.title}</h1>
            <p class="subtitle">${product.subtitle}</p>
            <div class="price-container">
                ${priceHTML}
            </div>
            <div class="product-actions">
                <label class="cartlab">Quantity in cart</label>
                <input type="number" class="cartnum" min="1" value=${cartQuantity} style="display: none;"/>
                <span id="cartProductCount" >${cartQuantity}</span>
                <button class="button-primary-2" id="addToCartBtn">Add to Cart</button>
            </div>
            <p class="product-detail-shipping">Free shipping on orders over $299USD</p>
            <div class="product-description">
                ${product.description || ""}
            </div>
            <ul class="features-list">
                ${
                  product.features
                    ? product.features.map((f) => `<li>${f}</li>`).join("")
                    : ""
                }
            </ul>
        </div>
    `;

  // Add event listener for Add to Cart button
  const addToCartBtn = document.getElementById("addToCartBtn");
  const quantityInput = detailContainer.querySelector(".cartnum");
  const cartProductCount = document.getElementById("cartProductCount");
  addToCartBtn.addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value) || 1;
    for (let i = 0; i < quantity; i++) {
      addToCart(
        product.title,
        product.discountedPrice || product.price,
        product.image
      );
    }
    // Update the in-cart count after adding
    let updatedCart = [];
    const updatedSavedCart = localStorage.getItem("cartItems");
    if (updatedSavedCart) {
      updatedCart = JSON.parse(updatedSavedCart);
    }
    const updatedItem = updatedCart.find((item) => item.name === product.title);
    cartProductCount.textContent = `${updatedItem ? updatedItem.quantity : 0}`;
  });
  // After updating cartItems and localStorage
  if (typeof refreshProductCount === "function" && window.currentProductTitle) {
    refreshProductCount(window.currentProductTitle);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  if (productId) {
    showProductDetails(productId);
  } else {
    window.location.href = "../Pages/AllProducts.html";
  }
});

function refreshProductCount(productTitle) {
  const cartProductCount = document.getElementById("cartProductCount");
  if (!cartProductCount) return;
  let updatedCart = [];
  const updatedSavedCart = localStorage.getItem("cartItems");
  if (updatedSavedCart) {
    updatedCart = JSON.parse(updatedSavedCart);
  }
  const updatedItem = updatedCart.find((item) => item.name === productTitle);
  cartProductCount.textContent = `${updatedItem ? updatedItem.quantity : 0}`;
}

// Listen for cart changes in other tabs/windows and update the count
window.addEventListener("storage", function (e) {
  if (e.key === "cartItems" && window.currentProductTitle) {
    refreshProductCount(window.currentProductTitle);
  }
});
