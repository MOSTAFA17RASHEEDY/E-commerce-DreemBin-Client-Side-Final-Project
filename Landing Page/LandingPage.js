fetch("../Shared/JSON/products.json")
  .then((response) => response.json())
  .then((products) => {
    const bestSellers = products.filter((product) => product.BestSell);

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
