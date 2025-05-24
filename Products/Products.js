document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;
  let currentCategory = "all";
  let products = [];

  const productGrid = document.getElementById("productGrid");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const pageIndicator = document.getElementById("pageIndicator");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const pagination = document.querySelector(".pagination");
  const shopTitle = document.querySelector("#shop h1");

  const categoryNames = {
    all: "Shop",
    gifts: "Gifts",
    dining: "Dining",
    serveware: "Serveware",
    Furnishing: "Furnishing",
    bags: "Bags",
    Watches: "Watches",
  };

  fetch(window.location.origin + "/Shared/JSON/products.json") // http://127.0.0.1:5500/ + "/Shared/JSON/products.json"
    .then((response) => response.json())
    .then((data) => {
      products = data;
      updateProducts();
    });
    

  function getTotalPagesForCategory(category) {
    const filteredProducts = products.filter((product) => {
      return category === "all" || product.category === category;
    });

    if (category === "all") {
      const pages = filteredProducts.map((p) => p.page);
      return pages.length > 0 ? Math.max(...pages) : 1;
    } else {
      return 1;
    }
  }

  function createProductElement(product) {
    const article = document.createElement("article");
    article.classList.add("product");
    article.setAttribute("data-category", product.category);
    article.setAttribute("data-page", product.page);

    const priceHTML = product.discountedPrice
      ? `<p> $${product.price.toFixed(
          2
        )} USD <span class="price-discounted">$${product.discountedPrice.toFixed(
          2
        )} USD</span></p>`
      : `<p> $${product.price.toFixed(2)} USD </p>`;

    article.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}">
                <button class="hover-button">View Details</button>
            </div>
            <h2 class="product-title">${product.title}</h2>
            <div class="product-price-wrap">
                ${priceHTML}
            </div>
        `;
    return article;
  }

  function updateProducts() {
    const totalPages = getTotalPagesForCategory(currentCategory);
    productGrid.innerHTML = "";

    products.forEach((product) => {
      const matchCategory =
        currentCategory === "all" || product.category === currentCategory;
      const matchPage =
        currentCategory === "all" ? product.page === currentPage : true;

      if (matchCategory && matchPage) {
        const productElement = createProductElement(product);
        productGrid.appendChild(productElement);
      }
    });

    shopTitle.textContent = categoryNames[currentCategory] || "Shop";

    pagination.style.display =
      currentCategory === "all" && totalPages > 1 ? "" : "none";
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active-category"));
      button.classList.add("active-category");

      currentCategory = button.getAttribute("data-category");
      currentPage = 1;
      updateProducts();
    });
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = getTotalPagesForCategory(currentCategory);
    if (currentPage < totalPages) {
      currentPage++;
      updateProducts();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateProducts();
    }
  });
});

