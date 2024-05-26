function getProductDetails(productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            displayProductDetails(product);
        })
        .catch(err => console.error(err));
}

function displayProductDetails(product) {
    document.title = product.title;

    var detailsContainer = document.getElementById("product-details");
    detailsContainer.innerHTML = `
        <div class="col-md-6">
            <img src="${product.thumbnail}" class="img-fluid" alt="${product.title}">
        </div>
        <div class="col-md-6">
            <h2 class= "my-4" style = "font-size : 36px !important;">${product.title}</h2>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>SKU:</strong> ${product.sku}</p>
            <p><strong>Weight:</strong> ${product.weight}g</p>
            <p><strong>Dimensions:</strong> ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm</p>
            <p><strong>Warranty:</strong> ${product.warrantyInformation}</p>
            <p><strong>Shipping:</strong> ${product.shippingInformation}</p>
            <p><strong>Availability:</strong> ${product.availabilityStatus}</p>
            <p><strong>Price:</strong> $${product.price} <small style=" color: #036e5f ">(Discount: ${product.discountPercentage}%)</small></p>
            <p class = "my-2">${product.description}</p>
            <button class="btn btn-primary add-to-cart my-4" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}" data-image-url="${product.thumbnail}">Add to Cart</button>
        </div>
        <div class="col-12">
            <h2 class="my-4">Reviews</h2>
            <div class="reviews">
                ${product.reviews.map(review => `
                    <div class="review my-4">
                        <p><strong>${review.reviewerName}</strong> (${review.reviewerEmail})</p>
                        <p>Rating: ${review.rating}/5</p>
                        <p>${review.comment}</p>
                        <small class="my-2" style = "color: #036e5f ">${new Date(review.date).toLocaleDateString()}</small>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listener to the "Add to Cart" button
    document.querySelector('.add-to-cart').addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const imageUrl = this.getAttribute('data-image-url');
        addToCart(id, name, price, imageUrl);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        getProductDetails(productId);
    }
});
