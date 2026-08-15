// ==========================================
// SMART GROCERY CHALLENGE
// ==========================================


// ==========================================
// SETTINGS
// ==========================================

let budget = 1000;

let products = [];

let basket = [];


// ==========================================
// ELEMENTS
// ==========================================

const budgetElement =
    document.getElementById("budget");

const spentElement =
    document.getElementById("spent");

const remainingElement =
    document.getElementById("remaining");

const scoreElement =
    document.getElementById("score");

const percentageElement =
    document.getElementById("percentage");

const progressElement =
    document.getElementById("progress");

const productsContainer =
    document.getElementById("challengeProducts");

const basketContainer =
    document.getElementById("basketItems");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const resultIcon =
    document.getElementById("resultIcon");

const newChallengeBtn =
    document.getElementById("newChallengeBtn");

const cartCount =
    document.getElementById("cartCount");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        const data =
            await response.json();

        console.log(
            "Challenge Products:",
            data
        );


        if (!data.success) {

            productsContainer.innerHTML =
                "<p>Unable to load products.</p>";

            return;
        }


        products =
            data.products || [];


        displayProducts();


    } catch (error) {

        console.error(error);

        productsContainer.innerHTML = `
            <p>
                ❌ Cannot connect to Flask server.
            </p>
        `;
    }
}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts() {

    productsContainer.innerHTML = "";


    if (products.length === 0) {

        productsContainer.innerHTML =
            "<p>No products available.</p>";

        return;
    }


    products.forEach(function(product) {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        const icon =
            getProductIcon(
                product.category
            );


        card.innerHTML = `

            <div class="product-icon">
                ${icon}
            </div>

            <h3>
                ${product.name}
            </h3>

            <p class="category">
                ${product.category}
            </p>

            <p class="price">
                ₹${Number(product.price).toFixed(2)}
            </p>

            <button
                class="add-btn"
                onclick="addToBasket(${product.id})"
            >
                + Add
            </button>

        `;


        productsContainer.appendChild(card);

    });
}


// ==========================================
// PRODUCT ICON
// ==========================================

function getProductIcon(category) {

    const icons = {

        Grains: "🌾",

        Dairy: "🥛",

        Bakery: "🍞",

        Fruits: "🍎",

        Vegetables: "🥕"

    };


    return icons[category] || "🛒";
}


// ==========================================
// ADD TO BASKET
// ==========================================

function addToBasket(productId) {

    const product =
        products.find(
            function(item) {

                return item.id === productId;

            }
        );


    if (!product) {
        return;
    }


    const existing =
        basket.find(
            function(item) {

                return item.id === productId;

            }
        );


    if (existing) {

        existing.quantity++;

    } else {

        basket.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            quantity: 1

        });

    }


    updateChallenge();
}


// ==========================================
// REMOVE FROM BASKET
// ==========================================

function removeFromBasket(productId) {

    basket =
        basket.filter(
            function(item) {

                return item.id !== productId;

            }
        );


    updateChallenge();
}


// ==========================================
// CALCULATE TOTAL
// ==========================================

function calculateSpent() {

    let total = 0;


    basket.forEach(function(item) {

        total +=
            item.price *
            item.quantity;

    });


    return total;
}


// ==========================================
// UPDATE CHALLENGE
// ==========================================

function updateChallenge() {

    const spent =
        calculateSpent();


    const remaining =
        budget - spent;


    let percentage =
        (spent / budget) * 100;


    if (percentage > 100) {
        percentage = 100;
    }


    if (percentage < 0) {
        percentage = 0;
    }


    // SCORE

    let score = 0;


    if (spent > 0 && spent <= budget) {

        score =
            Math.round(
                (remaining / budget) * 100
            );

    }


    if (spent === budget) {
        score = 100;
    }


    // UPDATE UI

    budgetElement.textContent =
        "₹" + budget.toFixed(2);


    spentElement.textContent =
        "₹" + spent.toFixed(2);


    remainingElement.textContent =
        "₹" + Math.max(remaining, 0).toFixed(2);


    scoreElement.textContent =
        score;


    percentageElement.textContent =
        Math.round(percentage) + "%";


    progressElement.style.width =
        percentage + "%";


    displayBasket(
        spent
    );


    updateResult(
        spent,
        score
    );
}


// ==========================================
// DISPLAY BASKET
// ==========================================

function displayBasket(spent) {

    basketContainer.innerHTML = "";


    if (basket.length === 0) {

        basketContainer.innerHTML = `
            <p class="empty">
                No products selected yet.
            </p>
        `;

        return;
    }


    basket.forEach(function(item) {

        const itemTotal =
            item.price *
            item.quantity;


        const row =
            document.createElement("div");


        row.className =
            "basket-item";


        row.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <p>
                    ₹${item.price.toFixed(2)}
                    ×
                    ${item.quantity}
                </p>

            </div>

            <div>

                <strong>
                    ₹${itemTotal.toFixed(2)}
                </strong>

                <button
                    class="remove-btn"
                    onclick="removeFromBasket(${item.id})"
                >
                    Remove
                </button>

            </div>

        `;


        basketContainer.appendChild(row);

    });
}


// ==========================================
// RESULT
// ==========================================

function updateResult(
    spent,
    score
) {

    if (spent === 0) {

        resultIcon.textContent =
            "🎯";

        resultTitle.textContent =
            "Keep Going!";

        resultMessage.textContent =
            "Add groceries and stay within your budget.";

        return;
    }


    if (spent > budget) {

        resultIcon.textContent =
            "⚠️";

        resultTitle.textContent =
            "Budget Exceeded!";

        resultMessage.textContent =
            "Try removing some products to get back within ₹1000.";

        return;
    }


    if (score >= 80) {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "Excellent Shopping!";

        resultMessage.textContent =
            "You managed your grocery budget very well.";

        return;
    }


    if (score >= 50) {

        resultIcon.textContent =
            "🎉";

        resultTitle.textContent =
            "Challenge Completed!";

        resultMessage.textContent =
            "Great job! You stayed within your budget.";

        return;
    }


    resultIcon.textContent =
        "👍";

    resultTitle.textContent =
        "Challenge Active";

    resultMessage.textContent =
        "You're within budget. Try to shop smarter!";
}


// ==========================================
// NEW CHALLENGE
// ==========================================

function newChallenge() {

    basket = [];

    budget = 1000;

    updateChallenge();

}


if (newChallengeBtn) {

    newChallengeBtn.addEventListener(
        "click",
        newChallenge
    );

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let count = 0;


    cart.forEach(function(item) {

        count +=
            Number(item.cartQuantity) || 1;

    });


    if (cartCount) {

        cartCount.textContent =
            count;

    }
}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            if (
                !confirm(
                    "Are you sure you want to logout?"
                )
            ) {
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


// ==========================================
// START
// ==========================================

updateCartCount();

loadProducts();

updateChallenge();