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
