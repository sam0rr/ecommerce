let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    attachInputEvent();
    attachDocumentClickEvent();
    prefetchAllProducts();
});

function attachDocumentClickEvent() {
    document.addEventListener('click', function (event) {
        const suggestionsBox = document.getElementById('suggestions-box');
        const searchInput = document.getElementById('search-input');
        if (!suggestionsBox.contains(event.target) && !searchInput.contains(event.target)) {
            suggestionsBox.classList.remove('visible');
        }
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = "";
    searchInput.dataset.selectedId = "";
    localStorage.removeItem('selectedProductName');
    localStorage.removeItem('selectedProductId');
}

function attachInputEvent() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', handleInput);
    searchInput.addEventListener('keydown', handleEnterKey);
    searchInput.addEventListener('click', handleInput);
}

function handleInput(event) {
    updateSuggestions(event.target.value);
}

function handleEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const selectedId = searchInput.dataset.selectedId || localStorage.getItem('selectedProductId');
    if (selectedId) {
        window.location.href = `detail.html?id=${selectedId}`;
    } else {
        alert("Please select a product from the suggestions or enter a valid product name.");
    }
}

function updateSuggestions(inputText) {
    let filteredProducts = allProducts;
    if (inputText.length > 0) {
        filteredProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(inputText.toLowerCase())
        );
    }
    displaySortedProducts(filteredProducts, inputText);
}

async function prefetchAllProducts() {
    let limit = 30;
    let skip = 0;
    let totalProducts = 0;

    do {
        const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
        const data = await response.json();
        allProducts = allProducts.concat(data.products);
        totalProducts = data.total;
        skip += limit;
    } while (allProducts.length < totalProducts);
}

function normalizeText(text) {
    return text.toLowerCase();
}

function displaySortedProducts(products, inputText = '') {
    let suggestionsHTML = '';
    if (products.length > 0) {
        products.sort((a, b) => sortProducts(a, b, inputText));
        products.forEach(product => {
            suggestionsHTML += `<div onclick="selectProduct('${product.id}', '${product.title}')">
                <span>${product.title}</span>
            </div>`;
        });
    } else {
        suggestionsHTML = '<div>No results found</div>';
    }
    const suggestionsBox = document.getElementById('suggestions-box');
    suggestionsBox.innerHTML = suggestionsHTML;
    suggestionsBox.classList.add('visible');
}

function sortProducts(a, b, inputText) {
    const nameA = normalizeText(a.title);
    const nameB = normalizeText(b.title);
    const searchText = normalizeText(inputText);
    if (searchText) {
        if (nameA.startsWith(searchText) && !nameB.startsWith(searchText)) {
            return -1;
        } else if (!nameA.startsWith(searchText) && nameB.startsWith(searchText)) {
            return 1;
        }
    }
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
}

function selectProduct(id, title) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = title;
    searchInput.dataset.selectedId = id;
    localStorage.setItem('selectedProductId', id);
    localStorage.setItem('selectedProductName', title);
    document.getElementById('suggestions-box').classList.remove('visible');
}
