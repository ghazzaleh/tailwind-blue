let cart = [];
let products = [];

// Fetch all products
async function getAllProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  products = await response.json();
  renderProducts(products);
}

// Render products
function renderProducts(list) {
  const template = list
    .map(
      (product) => `
        <div class="product p-2 cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300" onclick="viewProduct(${product.id})">
            <img src="${product.image}" alt="${product.title}" class="w-full h-[30rem] object-cover rounded">
            <div class="mt-2">
                <h4 class="text-sm font-semibold">${product.title}</h4>
            </div>
            <div class="mt-2 text-gray-700">
                <span>${product.price} تومان</span>
            </div>
        </div>
    `
    )
    .join("");

  document.getElementById("root").innerHTML = `
        <input type="text" id="search" placeholder="جستجو محصولات..." oninput="filterProducts()" class="mb-4 p-2 border border-gray-300 rounded w-full">
        <h2 class="text-2xl font-bold mb-4">محصولات</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">${template}</div>
        <button onclick="viewCart()" class="mt-4 bg-blue-500 text-white p-2 rounded">مشاهده سبد خرید</button>
    `;
}

// Filter products
function filterProducts() {
  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
}

// View single product
async function viewProduct(productId) {
  const product = products.find((p) => p.id === productId);
  const template = `
        <div class="product-details p-4">
            <img src="${product.image}" alt="${product.title}" class="object-contain rounded" style="height: 15rem;">
            <h2 class="text-xl font-bold mt-4">${product.title}</h2>
            <div class="mt-2">${product.description}</div>
            <div class="mt-2">قیمت: ${product.price} تومان</div>
            <button onclick="addToCart(${product.id})" class="mt-4 bg-green-500 text-white p-2 rounded">اضافه به سبد خرید</button>
            <button onclick="processPayment()" class="mt-2 bg-red-500 text-white p-2 rounded">پرداخت</button>
            <button onclick="renderProducts(products)" class="mt-2 bg-gray-300 text-black p-2 rounded">بازگشت به محصولات</button>
        </div>
    `;
  document.getElementById("root").innerHTML = template;
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  cart.push(product);
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  viewCart(); // Update cart view after removal
}

// View cart
function viewCart() {
  if (cart.length === 0) {
    document.getElementById(
      "root"
    ).innerHTML = `<h2 class="text-xl">سبد خرید شما خالی است!</h2>`;
    return;
  }

  const cartItems = cart
    .map(
      (item) => `
        <div class="product p-2 shadow-md hover:shadow-lg transition-shadow duration-300">
            <img src="${item.image}" alt="${item.title}" class="w-full h-[15rem] object-cover rounded">
            <div class="mt-2">
                <h4 class="text-sm font-semibold">${item.title}</h4>
                <div class="mt-2">قیمت: ${item.price} تومان</div>
                <button onclick="removeFromCart(${item.id})" class="mt-2 bg-red-500 text-white p-2 rounded">حذف</button>
            </div>
        </div>
    `
    )
    .join("");

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  document.getElementById("root").innerHTML = `
        <h2 class="text-2xl font-bold">سبد خرید شما</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">${cartItems}</div>
        <div class="mt-4">جمع کل: ${totalPrice} تومان</div>
        <button onclick="processPayment()" class="mt-4 bg-green-500 text-white p-2 rounded">پرداخت</button>
        <button onclick="renderProducts(products)" class="mt-2 bg-gray-300 text-black p-2 rounded">بازگشت به محصولات</button>
    `;
}

// Process payment
function processPayment() {
  const paymentGatewayUrl = "https://your-payment-gateway.com/checkout"; // Set payment gateway URL
  window.location.href = paymentGatewayUrl;
}

// Toggle mobile menu
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Initial fetch
getAllProducts();
