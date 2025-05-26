function showProductDetails(productId) {
    fetch("/Shared/JSON/products.json")
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (product) {
                displayProductDetails(product);
            } else {
                window.location.href = '/Products/All Products/AllProducts.html';
            }
        });    
}

function displayProductDetails(product) {
    const detailContainer = document.querySelector('.product-detail');
    const priceHTML = product.discountedPrice
        ? `<p><span class="original-price" style="text-decoration: line-through; color: #888;">$${product.price.toFixed(2)} USD</span> 
        <span class="price-discounted">$${product.discountedPrice.toFixed(2)} USD</span></p>`
        : `<p>$${product.price.toFixed(2)} USD</p>`;

    detailContainer.innerHTML = `
        <div class="image-section">
            <img src="${product.image}" alt="${product.title}" class="main-image">
        </div>
        <div class="product-details">
            <h1>${product.title}</h1>
            <p class="subtitle">${product.subtitle}</p>
            <div class="price-container">
                ${priceHTML}
            </div>
            <div class="product-actions">
                <label class="cartlab">Quantity</label>
                <input type="number" class="cartnum" min="1" value="1" />
                <button class="button-primary-2">Add to Cart</button>
            </div>
            <p class="product-detail-shipping">Free shipping on orders over $299USD</p>
            <div class="product-description">
                ${product.description || ''}
            </div>
            <ul class="features-list">
                ${product.features ? product.features.map(f => `<li>${f}</li>`).join('') : ''}
            </ul>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        showProductDetails(productId);
    } else {
        window.location.href = '/Products/All Products/AllProducts.html';
    }
});
