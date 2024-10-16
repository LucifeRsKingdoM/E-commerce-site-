// Product data array with descriptions
const products = [
    { id: 1, name: "Product 1", price: 20, image: "https://via.placeholder.com/150", description: "Description for Product 1" },
    { id: 2, name: "Product 2", price: 30, image: "https://via.placeholder.com/150", description: "Description for Product 2" },
    { id: 3, name: "Product 3", price: 25, image: "https://via.placeholder.com/150", description: "Description for Product 3" },
    { id: 4, name: "Product 4", price: 15, image: "https://via.placeholder.com/150", description: "Description for Product 4" },
];

// Display product listings on the home page
function displayProducts() {
    const productContainer = document.getElementById("product-list");
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.className = "product";
        productElement.innerHTML = `
            <a href="product${product.id}.html">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
            </a>
        `;
        productContainer.appendChild(productElement);
    });
}

// Add a product to the cart and calculate total price
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const qty = parseInt(document.getElementById(`qty-${product.id}`).value) || 1; // Default to 1 if input is empty
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.qty += qty; // Update quantity
        alert(`Updated quantity of ${product.name}. Total quantity: ${existingProduct.qty}`);
    } else {
        cart.push({ ...product, qty });
        alert(`${product.name} has been added to the cart!`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateTotalAmount(); // Update the total amount after adding to cart
}

// Display cart items on the cart page without any alerts
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = '';  // Clear previous items

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <p>Description: ${item.description}</p>
            <p>Quantity: <input type="number" value="${item.qty}" min="1" onchange="updateCartItem(${item.id}, this.value)" /></p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    updateTotalAmount();  // Update the total amount displayed
}

// Update quantity of a specific item in the cart
function updateCartItem(productId, qty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.qty = parseInt(qty) || 1; // Ensure quantity is a number
        localStorage.setItem("cart", JSON.stringify(cart));
        updateTotalAmount();  // Update total amount
    }
}

// Remove an item from the cart without any alerts
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();  // Re-render the cart items after removal
}

// Update the total amount based on quantity
function updateTotalAmount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;
    cart.forEach(item => {
        total += item.qty * item.price;
    });

    document.getElementById("total-amount").textContent = `Grand Total: $${total}`;
}

// Checkout function to proceed with order details
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Order Details:\n";
    cart.forEach(item => {
        message += `Product: ${item.name}, Price: $${item.price}, Qty: ${item.qty}, Total: $${item.qty * item.price}\n`;
    });

    let grandTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
    message += `\nGrand Total: $${grandTotal}\n`;

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    message += `\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nPayment Method: ${paymentMethod}\n`;

    // Encode the message for WhatsApp
    let encodedMessage = encodeURIComponent(message);
    let whatsappLink = `https://wa.me/919008587582?text=${encodedMessage}`;

    // Redirect to WhatsApp
    window.location.href = whatsappLink;

    // Clear the cart after redirecting
    localStorage.removeItem("cart");
}

// Display individual product details
function displayProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const productDetails = document.getElementById("product-details");
    if (product) {
        productDetails.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>${product.description}</p>
            <input type="number" id="qty-${product.id}" placeholder="Qty" min="1" value="1" />
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
    } else {
        productDetails.innerHTML = `<p>Product not found.</p>`;
    }
}
