const products = [
  { id: 1, name: "Submariner", price: 8500, Img:""},
  { id: 2, name: "Daytona", price: 14500, img: "" },
  { id: 3, name: "Datejust", price: 7200, img: "" },
  { id: 4, name: "Oyster Perpetual", price: 5800, img: "" },
  { id: 5, name: "GMT-Master II", price: 10500, img: "" },
  { id: 6, name: "Explorer", price: 6400, img: "" }
];

let cart = JSON.parse(localStorage.getItem('rolex_cart')) || [];

function init() {
    renderProducts();
    renderCart();
}

function renderProducts() {
    const container = document.getElementById('product-list');
    container.innerHTML = products.map(product => {
        const inCart = cart.some(item => item.id === product.id);
        return `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}" class="product-img"/>
                <h3>${product.name}</h3>
                <p>$${product.price.toLocaleString()}</p>
                <button 
                    class="add-btn" 
                    onclick="addToCart(${product.id})"
                    ${inCart ? 'disabled' : ''}>
                    ${inCart ? 'Already in Cart' : 'Add to Cart'}
                </button>
            </div>
        `;
    }).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
    updateApp();
}

function updateQuantity(id, amt) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += amt;
        if (item.quantity <= 0) removeFromCart(id);
    }
    updateApp();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateApp();
}

function clearCart() {
    cart = [];
    updateApp();
}

function updateApp() {
    localStorage.setItem('rolex_cart', JSON.stringify(cart));
    renderProducts();
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const countBadge = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        summary.classList.add('hidden');
        countBadge.innerText = '0';
        return;
    }

    summary.classList.remove('hidden');
    let total = 0;
    let itemCount = 0;

    cartItems.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemCount += item.quantity;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    $${item.price} x ${item.quantity} = $${subtotal}
                </div>
                <div>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <button onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    countBadge.innerText = itemCount;
    totalEl.innerText = total.toLocaleString();
}

function checkout() {
    alert("Order confirmed! Thank you for shopping at Rolex Luxury.");
    clearCart();
}

init();