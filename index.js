document.addEventListener("DOMContentLoaded", initialise);

let allProducts;
let cart = [];

// Initialization function
function initialise() {
    fetchProducts();
    filterCategories();
    searchProduct();
    openCart();
    closeCart(); // Asegúrate de agregar esto
}

// Fetch products from the API
async function fetchProducts() {
    try {
        const resp = await fetch("https://fakestoreapi.com/products");
        const data = await resp.json();
        allProducts = data;
        displayProducts(allProducts);
    } catch (error) {
        console.error(error);
    }
}

// Display products in the UI
function displayProducts(products) {
    const list = document.querySelector("#list"); // Cambia a #list
    list.innerHTML = ""; // Clear existing list
    products.forEach((product) => {
        const { image, category, price, title, id } = product;
        list.innerHTML += `
      <li class="card">
        <div class="img-content">
          <img src=${image} alt=${category} />
        </div>
        <div class="card-content">
          <p class="card-price">$${price.toFixed(2)}</p>
          <h4 class="card-title">${title.substring(0, 45)}...</h4>
          <p class="card-desc hide">${category.toUpperCase()}</p>
          <div class="btn-container">
            <button class="card-btn" onclick="addToCart(${id})">Add to Cart</button>
          </div>
        </div>
      </li>
    `;
    });
}

// Filter products by category
function filterCategories() {
    const select = document.querySelector("#filter-btn");
    select.addEventListener("change", filterProducts);

    function filterProducts(e) {
        const option = e.target.value;
        let filteredProducts;

        switch (option) {
            case "all":
                filteredProducts = allProducts;
                break;
            case "men":
                filteredProducts = allProducts.filter((product) => product.category === "men's clothing");
                break;
            case "women":
                filteredProducts = allProducts.filter((product) => product.category === "women's clothing");
                break;
            case "jewellery":
                filteredProducts = allProducts.filter((product) => product.category === "jewelery");
                break;
            case "electronics":
                filteredProducts = allProducts.filter((product) => product.category === "electronics");
                break;
            default:
                filteredProducts = allProducts;
        }

        displayProducts(filteredProducts);
    }
}

// Search for products by title
function searchProduct() {
    const searchInput = document.querySelector("#search-input");
    const list = document.querySelector("#list");

    searchInput.addEventListener("keyup", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = allProducts.filter((product) => product.title.toLowerCase().includes(searchTerm));
        displayProducts(filteredProducts);
    });
}

// Add to cart functionality
function addToCart(id) {
    const existingProduct = cart.find((product) => product.id === id);
    if (existingProduct) {
        alert("Product already added to the cart");
    } else {
        const productToAdd = allProducts.find((product) => product.id === id);
        cart.push({ ...productToAdd, quantity: 1 });
        shoppingCart(); // Llama aquí para actualizar el carrito
    }
}

// Shopping cart display
function shoppingCart() {
    const cartList = document.querySelector("#cart-list");
    const cartTotal = document.querySelector("#cart-total");
    const cartNumber = document.querySelector(".cart-number-container");
    cartList.innerHTML = ""; // Clear previous cart items

    let totalSum = 0;
    let cartHTML = cart.map((product) => {
        const { title, price, quantity, id } = product;
        totalSum += price * quantity;
        return `
      <li id="item-container">
        <div class="cart-title">
          <h3>${title.substring(0, 30)}...</h3>
        </div>
        <div class="cart-quantity-container">
          <p class="cart-price">$${price.toFixed(2)}</p>
          <div class="button-quantity-container">
            <button class="plus" onclick="increment(${id})">+</button>
            <p>${quantity}</p>
            <button class="minus" onclick="decrement(${id})">-</button>
          </div>
          <p id="item-total">$${(price * quantity).toFixed(2)}</p>
          <div class="remove-cart-item">
            <button onclick="deleteCartItem(${id})">X</button>
          </div>
        </div>
      </li>
    `;
    }).join("");
  
    cartList.innerHTML = cartHTML;
    cartTotal.innerHTML = totalSum > 0 ? `<button id="checkout" onclick="checkout()">Pay Now: $${totalSum.toFixed(2)}</button>` : `No items in the cart`;
    cartNumber.innerHTML = cart.length > 0 ? cart.length : '';
}

// Increment quantity
function increment(id) {
    const cartProduct = cart.find((product) => product.id === id);
    if (cartProduct) {
        cartProduct.quantity++;
        shoppingCart();
    }
}+













// Decrement quantity
function decrement(id) {
    const cartProduct = cart.find((product) => product.id === id);
    if (cartProduct && cartProduct.quantity > 1) {
        cartProduct.quantity--;
        shoppingCart();
    }
}

// Delete item from cart
function deleteCartItem(id) {
    cart = cart.filter((product) => product.id !== id);
    shoppingCart();
}

// Checkout function
function checkout() {
    cart = [];
    shoppingCart();
    const cartList = document.querySelector("#cart-list");
    cartList.innerHTML = `<p class="checkout-message">Thank you for your purchase</p>`;
}

// Open and close cart modal
function openCart() {
    const cartBtn = document.querySelector(".cart-container");
    cartBtn.addEventListener("click", seeModal);
}

function seeModal() {
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.remove("hide");
    body.classList.add("modal-open");
}

function closeCart() {
    const closeBtn = document.querySelector(".fa-xmark");
    closeBtn.addEventListener("click", closeModal);
}

function closeModal() {
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.add("hide");
    body.classList.remove("modal-open");
}
