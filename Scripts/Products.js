document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;
  const urlParams = new URLSearchParams(window.location.search);
  let currentCategory = urlParams.get("category")?.toLowerCase() || "all";
  let currentSort = "Normal";
  let products = [];
  let categories = [];

  const productGrid = document.getElementById("productGrid");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const pageIndicator = document.getElementById("pageIndicator");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const pagination = document.querySelector(".pagination");
  const shopTitle = document.querySelector("#shop h1");
  const sortBySelect = document.getElementById("sortBy");

  fetch(window.location.origin + "/Shared/JSON/Categories.json")
    .then((response) => response.json())
    .then((data) => {
      categories = data;
      const validCategories = categories.map((category) => category.title.toLowerCase());
      if (currentCategory !== "all" && !validCategories.includes(currentCategory)) {
        currentCategory = "all";
      }

      categoryButtons.forEach((button) => {
        const buttonCategory = button.getAttribute("data-category")?.toLowerCase();
        if (buttonCategory === currentCategory) {
          button.classList.add("active-category");
        } else {
          button.classList.remove("active-category");
        }
      });

      return fetch(window.location.origin + "/Shared/JSON/products.json");
    })
    .then((response) => response.json())
    .then((data) => {
      products = data;
      updateProducts();
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });

  function getTotalPagesForCategory(category, filteredProducts) {
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
      ? `<p><span class="original-price" style="text-decoration: line-through;">$${product.price.toFixed(2)} USD</span> 
         <span class="price-discounted">$${product.discountedPrice.toFixed(2)} USD</span></p>`
      : `<p>$${product.price.toFixed(2)} USD</p>`;

    article.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}">
        <a href="../Pages/ProductDetails.html?id=${product.id}" class="hover-button">View Details</a>
      </div>
      <h2 class="product-title">${product.title}</h2>
      <div class="product-price-wrap">
        ${priceHTML}
      </div>
    `;
    return article;
  }

  function updateProducts() {
    let filteredProducts = products.filter((product) => {
      return currentCategory === "all" || product.category.toLowerCase() === currentCategory;
    });

    let sortedProducts = [...filteredProducts];

    if (currentSort === "priceLowToHigh") {
      sortedProducts.sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;
        return priceA - priceB;
      });
    } else if (currentSort === "priceHighToLow") {
      sortedProducts.sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;
        return priceB - priceA;
      });
    } else if (currentSort === "Offer") {
      sortedProducts = sortedProducts.filter(product => product.discountedPrice !== null);
      sortedProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
    }

    const totalPages = getTotalPagesForCategory(currentCategory, sortedProducts);
    productGrid.innerHTML = "";

    let displayProducts = sortedProducts;
    if (currentCategory === "all") {
      displayProducts = sortedProducts.filter(product => product.page === currentPage);
    }

    if (displayProducts.length === 0) {
      const noProductsMessage = document.createElement("div");
      noProductsMessage.classList.add("no-products");
      noProductsMessage.textContent = "No products found.";
      productGrid.appendChild(noProductsMessage);
    } else {
      displayProducts.forEach((product) => {
        const productElement = createProductElement(product);
        productGrid.appendChild(productElement);
      });
    }

    const selectedCategory = categories.find(
      (category) => category.title.toLowerCase() === currentCategory
    );
    shopTitle.textContent = currentCategory === "all" ? "Shop" : selectedCategory?.title || "Shop";

    pagination.style.display = currentCategory === "all" && totalPages > 1 ? "" : "none";
    pageIndicator.textContent = `${currentPage} / ${totalPages}`;
    prevBtn.style.display = currentPage === 1 ? "none" : "inline-block";
    nextBtn.style.display = currentPage === totalPages ? "none" : "inline-block";
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active-category"));
      button.classList.add("active-category");
      currentCategory = button.getAttribute("data-category")?.toLowerCase() || "all";
      currentPage = 1;
      const params = new URLSearchParams(window.location.search);
      params.set("category", currentCategory);
      window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
      updateProducts();
    });
  });

  sortBySelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    currentPage = 1;
    updateProducts();
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = getTotalPagesForCategory(currentCategory, products);
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
