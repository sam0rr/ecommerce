var cardContainer = document.getElementById("card-container");
var allProducts = []; 

function drawCard(product) {
  var card = document.createElement("div");
  card.classList.add("col");
  card.classList.add("mb-4");
  card.innerHTML = `
      <div class="card h-100 card-settings" data-id="${product.id}" data-category="${product.category}">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text"><strong>Category:</strong> ${product.category}</p>
              <p class="card-text"><strong>Rating:</strong> ${product.rating}/5 (${product.stock} in stock)</p>
              <p class="card-text"><strong>Price:</strong> $${product.price}</p>
              <div class="button-align text-center custom-gap">
                  <button class="btn btn-primary button-products add-to-cart" id="add-to-cart-${product.id}" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}" data-image-url="${product.thumbnail}">Add to Cart</button>
                  <button class="btn btn-secondary button-products product-details" data-id="${product.id}">Product Details</button>
              </div>
          </div>
      </div>
  `;
  cardContainer.appendChild(card);
}

function getProductsFromAPI(url) {
  fetch(url)
    .then(res => res.json())
    .then(json => {
      allProducts = json.products;

      var topRatedProducts = allProducts.filter(product => product.rating > 4.7);

      topRatedProducts.sort((a, b) => b.rating - a.rating);
 
      topRatedProducts.forEach(product => drawCard(product));
    })
    .finally(attachEventListenersToButtons);
}

function attachEventListenersToButtons() {
  var addToCartButtons = document.getElementsByClassName("add-to-cart");
  Array.from(addToCartButtons).forEach(button => {
    button.addEventListener("click", function () {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      const imageUrl = button.getAttribute('data-image-url');
      addToCart(id, name, price, imageUrl);
    });
  });

  var productDetailsButtons = document.getElementsByClassName("product-details");
  Array.from(productDetailsButtons).forEach(button => {
    button.addEventListener("click", function () {
      const id = button.getAttribute('data-id');
      window.location.href = `detail.html?id=${id}`;
    });
  });
}

getProductsFromAPI('https://dummyjson.com/products?limit=1000');
