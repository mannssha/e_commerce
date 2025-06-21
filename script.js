let allProducts = []; // Store all products globally

// Load products on page load
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Fetching Products...");

    fetch("http://localhost:5000/api/products")
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            displayProducts(products);
        })
        .catch(error => console.error("❌ Error fetching products:", error));
});

// Display products dynamically
function displayProducts(products) {
    const productContainer = document.getElementById("products");
    productContainer.innerHTML = ""; // Clear existing content

    products.forEach(product => {
        let div = document.createElement("div");
        div.classList.add("product");

        div.innerHTML = `
            <img src="${product.image}" width="150" onerror="this.src='placeholder.jpg';">
            <h3>${product.name}</h3>
            <p>$${parseFloat(product.price || 0).toFixed(2)}</p>
            <button class="add-to-cart">Add to Cart</button>
            <button class="buy-now">Buy Now</button>
        `;

        // Add to Cart
        div.querySelector(".add-to-cart").addEventListener("click", () => {
            addToCart(product._id, product.name, product.price);
        });

        // Buy Now
        div.querySelector(".buy-now").addEventListener("click", () => {
            buyNow(product._id, product.name, product.price);
        });

        productContainer.appendChild(div);
    });
}

// Search products
function searchProducts() {
    const query = document.getElementById("searchBox").value.toLowerCase();
    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query)
    );
    displayProducts(filtered);
}

// Add to cart
function addToCart(productId, productName, productPrice) {
    productPrice = parseFloat(productPrice);
    if (isNaN(productPrice) || productPrice <= 0) {
        alert("❌ Error: Invalid product price.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, productName, productPrice, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${productName} added to cart!`);
    window.location.href = "cart.html";
}

// Buy now (direct to checkout with one item)
function buyNow(productId, productName, productPrice) {
    productPrice = parseFloat(productPrice);
    if (isNaN(productPrice) || productPrice <= 0) {
        alert("Invalid product price.");
        return;
    }

    const cart = [{ productId, productName, productPrice, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
}
