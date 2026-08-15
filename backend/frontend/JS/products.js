// =====================================================
// SMART GROCERY - PRODUCTS PAGE
// =====================================================

// =====================================================
// LOGIN PROTECTION
// =====================================================

const loggedInUser = JSON.parse(
    localStorage.getItem("user")
);

if (!loggedInUser) {
    alert("Please login first.");
    window.location.href = "/HTML/login.html";
}


// =====================================================
// ELEMENTS
// =====================================================

const productsContainer =
    document.getElementById("productsContainer");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const resultText =
    document.getElementById("resultText");

const cartCount =
    document.getElementById("cartCount");

const cartMessage =
    document.getElementById("cartMessage");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// VARIABLES
// =====================================================

let allProducts = [];


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

    try {

        productsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading products...</p>
            </div>
        `;

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        console.log("Products API:", data);

        if (!data.success) {
            throw new Error(
                data.message || "Unable to load products"
            );
        }

        allProducts = data.products || [];

        loadCategories();

        displayProducts(allProducts);

    } catch (error) {

        console.error("Products error:", error);

        productsContainer.innerHTML = `
            <div class="no-products">

                <div class="icon">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Products
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>
        `;

        resultText.textContent =
            "Unable to load products.";
    }
}


// =====================================================
// LOAD CATEGORIES
// =====================================================

function loadCategories() {

    if (!categoryFilter) {
        return;
    }

    const categories = [
        ...new Set(
            allProducts
                .map(product => product.category)
                .filter(category => category)
        )
    ];

    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;

    categories.sort().forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts(products) {

    if (!productsContainer) {
        return;
    }

    if (products.length === 0) {

        productsContainer.innerHTML = `
            <div class="no-products">

                <div class="icon">
                    🛒
                </div>

                <h2>
                    No Products Found
                </h2>

                <p>
                    Try another search or category.
                </p>

            </div>
        `;

        resultText.textContent =
            "No products found.";

        return;
    }


    resultText.textContent =
        `${products.length} product(s) found`;


    productsContainer.innerHTML = "";


    products.forEach(product => {

        const card =
            createProductCard(product);

        productsContainer.appendChild(card);
    });
}


// =====================================================
// CREATE PRODUCT CARD
// =====================================================

function createProductCard(product) {

    const card =
        document.createElement("div");

    card.className = "product-card";


    const quantity =
        Number(product.quantity) || 0;


    let stockClass = "available";
    let stockText = `${quantity} available`;

    if (quantity <= 0) {

        stockClass = "out";
        stockText = "Out of stock";

    } else if (quantity <= 5) {

        stockClass = "low";
        stockText = `Only ${quantity} left`;

    }


    // Product image
    let imageHTML = "";

    if (product.image) {

        imageHTML = `
            <img
                src="${escapeAttribute(product.image)}"
                alt="${escapeAttribute(product.name)}"
                onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=&quot;font-size:60px&quot;>🛒</span>';"
            >
        `;

    } else {

        imageHTML = `
            <span style="font-size:60px;">
                🛒
            </span>
        `;
    }


    card.innerHTML = `

        <div class="product-image">

            ${imageHTML}

        </div>


        <div class="product-info">

            <div class="product-category">
                ${escapeHTML(product.category || "Grocery")}
            </div>


            <div class="product-name">
                ${escapeHTML(product.name)}
            </div>


            <div class="product-price">
                ₹${Number(product.price).toFixed(2)}
            </div>


            <div class="stock ${stockClass}">
                ${stockText}
            </div>


            <div class="product-actions">

                <div class="quantity-control">

                    <button
                        type="button"
                        class="minus-btn">
                        −
                    </button>

                    <span class="quantity-value">
                        1
                    </span>

                    <button
                        type="button"
                        class="plus-btn">
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="add-cart-btn"
                    ${quantity <= 0 ? "disabled" : ""}>

                    Add to Cart

                </button>

            </div>

        </div>
    `;


    // Quantity
    let selectedQuantity = 1;

    const quantityValue =
        card.querySelector(".quantity-value");

    const minusBtn =
        card.querySelector(".minus-btn");

    const plusBtn =
        card.querySelector(".plus-btn");

    const addCartBtn =
        card.querySelector(".add-cart-btn");


    minusBtn.addEventListener(
        "click",
        function () {

            if (selectedQuantity > 1) {

                selectedQuantity--;

                quantityValue.textContent =
                    selectedQuantity;
            }
        }
    );


    plusBtn.addEventListener(
        "click",
        function () {

            if (selectedQuantity < quantity) {

                selectedQuantity++;

                quantityValue.textContent =
                    selectedQuantity;
            }
        }
    );


    addCartBtn.addEventListener(
        "click",
        function () {

            addToCart(
                product,
                selectedQuantity
            );
        }
    );


    return card;
}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(product, quantity) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existingProduct =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
        );


    if (existingProduct) {

        const currentQuantity =
            Number(
                existingProduct.cartQuantity
            ) || 0;

        const stockQuantity =
            Number(product.quantity) || 0;

        if (
            currentQuantity + quantity >
            stockQuantity
        ) {

            showCartMessage(
                "Not enough stock available."
            );

            return;
        }


        existingProduct.cartQuantity =
            currentQuantity + quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: Number(product.price),

            image: product.image || "",

            cartQuantity: quantity
        });
    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showCartMessage(
        `${product.name} added to cart 🛒`
    );
}


// =====================================================
// UPDATE CART COUNT
// =====================================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let count = 0;


    cart.forEach(item => {

        count +=
            Number(item.cartQuantity) || 1;
    });


    if (cartCount) {

        cartCount.textContent =
            count;
    }
}


// =====================================================
// SEARCH + FILTER + SORT
// =====================================================

function filterProducts() {

    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    const selectedSort =
        sortFilter
            ? sortFilter.value
            : "default";


    let filtered =
        allProducts.filter(product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();

            const category =
                String(
                    product.category || ""
                ).toLowerCase();


            const matchesSearch =
                name.includes(searchTerm) ||
                category.includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category ===
                    selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );
        });


    // SORT

    if (selectedSort === "price-low") {

        filtered.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    } else if (selectedSort === "price-high") {

        filtered.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    } else if (selectedSort === "name") {

        filtered.sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        );
    }


    displayProducts(filtered);
}


// =====================================================
// CART MESSAGE
// =====================================================

function showCartMessage(message) {

    if (!cartMessage) {
        return;
    }


    cartMessage.textContent =
        message;


    cartMessage.classList.add("show");


    setTimeout(
        function () {

            cartMessage.classList.remove(
                "show"
            );

        },
        2000
    );
}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "cart"
            );


            window.location.href =
                "/HTML/login.html";
        }
    );
}


// =====================================================
// SECURITY HELPERS
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHTML(value);
}


// =====================================================
// EVENT LISTENERS
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );
}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );
}


if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        filterProducts
    );
}


// =====================================================
// START
// =====================================================

updateCartCount();

loadProducts();