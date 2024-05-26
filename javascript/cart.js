let cart = JSON.parse(localStorage.getItem('cart')) || [];
let timeouts = {};

const addToCart = (id, name, price, imageUrl) => {
    const existingProduct = cart.find(product => product.id === id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1, imageUrl });
    }
    saveCart();
    updateCartUI();
};

const updateCartUI = () => {
    updateCartForNavbar('cart-body', 'subtotal-price', 'tps-price', 'tvq-price', 'total-price', 'cart-count');
    
    if (window.location.href.includes('checkout.html')) {
        updateCartForCheckout('cart-content', 'subtotal-price-checkout', 'tps-price-checkout', 'tvq-price-checkout', 'total-price-checkout');
    }
};

const updateCartForNavbar = (cartBodyId, subtotalPriceId, tpsPriceId, tvqPriceId, totalPriceId, cartCountId) => {
    const cartBody = document.getElementById(cartBodyId);
    const subtotalPrice = document.getElementById(subtotalPriceId);
    const tpsPrice = document.getElementById(tpsPriceId);
    const tvqPrice = document.getElementById(tvqPriceId);
    const totalPrice = document.getElementById(totalPriceId);
    const cartCount = document.getElementById(cartCountId);

    cartBody.innerHTML = '';
    let subtotal = 0;
    cart.forEach(product => {
        if (product.quantity > 0 || (product.quantity === 0 && timeouts[product.id])) {
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <div class="checkout-product">
                    <div class="product-cart">
                        <h3 class="title mb-2">${product.name}</h3>
                        <div class="product-content">
                            <div class="product-content-inner">
                                <div>
                                    <img src="${product.imageUrl}" alt="${product.name}">
                                </div>
                                <div class="d-flex align-items-center">
                                    <button class="quantity-modify decrease" onclick="modifyQuantity('${product.id}', -1)">-</button>
                                    <input class="quantity-input text-center" style="width: 60px;" value="${product.quantity}" min="0" max="1000" data-id="${product.id}" onchange="updateQuantityFromInput(this)">
                                    <button class="quantity-modify increase" onclick="modifyQuantity('${product.id}', 1)">+</button>
                                </div>
                            </div>
                            <div class="custom-price-margin p-2">Price: $${(product.price * product.quantity).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;
            cartBody.appendChild(row);
            subtotal += product.price * product.quantity;
        }
    });

    calculateAndDisplayTotals(subtotal, subtotalPriceId, tpsPriceId, tvqPriceId, totalPriceId, cartCountId);
};

const updateCartForCheckout = (cartContentId, subtotalPriceId, tpsPriceId, tvqPriceId, totalPriceId) => {
    const cartContent = document.getElementById(cartContentId);

    cartContent.innerHTML = '';
    let subtotal = 0;
    cart.forEach(product => {
        if (product.quantity > 0 || (product.quantity === 0 && timeouts[product.id])) { 
            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <div class="checkout-product">
                    <div class="product-cart">
                        <h2 class="title mb-2 justify-content-center d-flex pt-3">${product.name}</h2>
                        <div class="product-content ">
                            <div class="product-content-inner">
                                <div>
                                    <img src="${product.imageUrl}" alt="${product.name}">
                                </div>
                                <div class="d-flex align-items-center">
                                    <button class="quantity-modify decrease" onclick="modifyQuantity('${product.id}', -1)">-</button>
                                    <input class="quantity-input text-center" style="width: 60px;" value="${product.quantity}" min="0" max="1000" data-id="${product.id}" onchange="updateQuantityFromInput(this)">
                                    <button class="quantity-modify increase" onclick="modifyQuantity('${product.id}', 1)">+</button>
                                </div>
                            </div>
                            <div class="custom-price-margin price-text p-2">Price: $${(product.price * product.quantity).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;
            cartContent.appendChild(row);
            subtotal += product.price * product.quantity;
        }
    });

    calculateAndDisplayTotals(subtotal, subtotalPriceId, tpsPriceId, tvqPriceId, totalPriceId);
};

const calculateAndDisplayTotals = (subtotal, subtotalPriceId, tpsPriceId, tvqPriceId, totalPriceId, cartCountId = null) => {
    const tpsRate = 0.05; // 5% GST
    const tvqRate = 0.09975; // 9.975% QST
    const tps = subtotal * tpsRate;
    const tvq = subtotal * tvqRate;
    const total = subtotal + tps + tvq;
    
    document.querySelectorAll(`#${subtotalPriceId}, #subtotal-price`).forEach(element => {
        element.textContent = `$${subtotal.toFixed(2)}`;
    });
    document.querySelectorAll(`#${tpsPriceId}, #tps-price`).forEach(element => {
        element.textContent = `$${tps.toFixed(2)}`;
    });
    document.querySelectorAll(`#${tvqPriceId}, #tvq-price`).forEach(element => {
        element.textContent = `$${tvq.toFixed(2)}`;
    });
    document.querySelectorAll(`#${totalPriceId}, #total-price`).forEach(element => {
        element.textContent = `$${total.toFixed(2)}`;
    });

    if (cartCountId) {
        document.getElementById(cartCountId).textContent = cart.reduce((acc, product) => acc + product.quantity, 0);
    }
};

const modifyQuantity = (productId, change) => {
    const product = cart.find(p => p.id === productId);
    if (product) {
        const newQuantity = product.quantity + change;
        product.quantity = Math.max(0, Math.min(1000, newQuantity));
        if (product.quantity > 0) {
            if (timeouts[productId]) {
                clearTimeout(timeouts[productId]);
                delete timeouts[productId];
            }
        } else {
            if (!timeouts[productId]) {
                timeouts[productId] = setTimeout(() => {
                    if (product.quantity === 0) {
                        cart = cart.filter(p => p.id !== productId);
                        delete timeouts[productId];
                        saveCart();
                        updateCartUI();
                    }
                }, 3000);
            }
        }
        saveCart();
        updateCartUI();
    }
};

const updateQuantityFromInput = (input) => {
    const productId = input.getAttribute('data-id');
    const quantity = parseInt(input.value) || 0;
    const product = cart.find(p => p.id === productId);
    if (product) {
        const initialQuantity = product.quantity;
        product.quantity = Math.max(0, Math.min(1000, quantity));
        if (initialQuantity !== 0 && product.quantity === 0) {
            timeouts[productId] = setTimeout(() => {
                if (product.quantity === 0) {
                    cart = cart.filter(p => p.id !== productId);
                    delete timeouts[productId];
                    saveCart();
                    updateCartUI();
                }
            }, 3000);
        } else if (timeouts[productId]) {
            clearTimeout(timeouts[productId]);
            delete timeouts[productId];
        }
        saveCart();
        updateCartUI();
    }
};

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

$(document).ready(function () {
    $('.dropdown-toggle').dropdown();

    $('.dropdown-menu').on('click', function (event) {
        event.stopPropagation();
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest('.dropdown').length) {
            $('.dropdown').find('.dropdown-menu').removeClass('show');
        }
    });

    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartUI();
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
