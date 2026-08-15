// ==========================================
// SMART GROCERY - MY ORDERS
// ==========================================

// ==========================================
// LOGIN PROTECTION
// ==========================================

const loggedInUser = JSON.parse(localStorage.getItem("user"));

if (!loggedInUser) {
    alert("Please login first.");
    window.location.href = "/HTML/login.html";
}


// ==========================================
// ELEMENTS
// ==========================================

const ordersContainer = document.getElementById("ordersContainer");
const logoutBtn = document.getElementById("logoutBtn");
const cartCount = document.getElementById("cartCount");


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(function (item) {
        count += Number(item.cartQuantity) || 1;
    });

    if (cartCount) {
        cartCount.textContent = count;
    }
}


// ==========================================
// LOAD USER ORDERS
// ==========================================

async function loadOrders() {

    if (!loggedInUser) {
        return;
    }

    if (!ordersContainer) {
        console.error("ordersContainer not found.");
        return;
    }

    ordersContainer.innerHTML = `
        <div class="loading">
            Loading your orders...
        </div>
    `;

    try {

        const response = await fetch(
            "/api/orders/" + loggedInUser.id
        );

        if (!response.ok) {
            throw new Error(
                "Server returned status " + response.status
            );
        }

        const data = await response.json();

        console.log("Orders API Response:", data);

        if (!data.success) {

            ordersContainer.innerHTML = `
                <div class="error-message">
                    ${data.message || "Unable to load orders."}
                </div>
            `;

            return;
        }

        const orders = data.orders || [];

        // ==========================================
        // NO ORDERS
        // ==========================================

        if (orders.length === 0) {

            ordersContainer.innerHTML = `
                <div class="empty-orders">

                    <div class="icon">
                        📦
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You have not placed any grocery orders yet.
                    </p>

                    <a
                        href="/HTML/products.html"
                        class="shop-btn">
                        Start Shopping
                    </a>

                </div>
            `;

            return;
        }


        // ==========================================
        // DISPLAY ORDERS
        // ==========================================

        ordersContainer.innerHTML = "";

        orders.forEach(function (order) {

            const orderCard = document.createElement("div");

            orderCard.className = "order-card";

            let orderDate = "Date unavailable";

            if (order.created_at) {

                const date = new Date(order.created_at);

                if (!isNaN(date.getTime())) {
                    orderDate = date.toLocaleString();
                }
            }


            const totalAmount =
                Number(order.total_amount || 0).toFixed(2);


            orderCard.innerHTML = `
                
                <div class="order-top">

                    <div>

                        <div class="order-id">
                            Order #${order.id}
                        </div>

                        <div class="order-date">
                            ${orderDate}
                        </div>

                    </div>

                    <span class="status">
                        ${order.status || "Placed"}
                    </span>

                </div>


                <div class="order-info">

                    <div class="info-box">

                        <p>
                            Order Amount
                        </p>

                        <strong>
                            ₹${totalAmount}
                        </strong>

                    </div>


                    <div class="info-box">

                        <p>
                            Order Status
                        </p>

                        <strong>
                            ${order.status || "Placed"}
                        </strong>

                    </div>

                </div>


                <div class="order-actions">

                    <button
                        class="view-btn"
                        data-order-id="${order.id}">

                        View Items

                    </button>

                </div>


                <div
                    class="order-details"
                    id="details-${order.id}">

                </div>

            `;


            ordersContainer.appendChild(orderCard);


            // ======================================
            // VIEW ITEMS BUTTON
            // ======================================

            const viewButton =
                orderCard.querySelector(".view-btn");


            viewButton.addEventListener(
                "click",
                function () {

                    viewOrderItems(
                        order.id,
                        viewButton
                    );

                }
            );

        });

    }
    catch (error) {

        console.error(
            "Load orders error:",
            error
        );

        ordersContainer.innerHTML = `
            
            <div class="error-message">

                Unable to load your orders.

                <br><br>

                Please make sure Flask is running.

            </div>

        `;
    }
}


// ==========================================
// VIEW ORDER ITEMS
// ==========================================

async function viewOrderItems(orderId, button) {

    const details =
        document.getElementById(
            "details-" + orderId
        );


    if (!details) {

        console.error(
            "Order details container not found."
        );

        return;
    }


    // ==========================================
    // HIDE ITEMS IF ALREADY OPEN
    // ==========================================

    if (details.classList.contains("show")) {

        details.classList.remove("show");

        button.textContent = "View Items";

        return;
    }


    // ==========================================
    // LOADING
    // ==========================================

    button.textContent = "Loading...";


    try {

        const response = await fetch(
            "/api/orders/" + orderId + "/items"
        );


        if (!response.ok) {

            throw new Error(
                "Server returned status " + response.status
            );

        }


        const data = await response.json();


        console.log(
            "Order Items:",
            data
        );


        if (!data.success) {

            details.innerHTML = `
                
                <p>
                    ${data.message || "Unable to load items."}
                </p>

            `;

            details.classList.add("show");

            button.textContent = "View Items";

            return;
        }


        const items = data.items || [];


        // ==========================================
        // NO ITEMS
        // ==========================================

        if (items.length === 0) {

            details.innerHTML = `
                
                <h3>
                    Order Items
                </h3>

                <p>
                    No items found for this order.
                </p>

            `;

        }
        else {

            let itemsHTML = `
                
                <h3>
                    Order Items
                </h3>

            `;


            items.forEach(function (item) {

                const productName =
                    item.product_name || "Product";


                const quantity =
                    Number(item.quantity) || 1;


                const price =
                    Number(item.price || 0).toFixed(2);


                itemsHTML += `
                    
                    <div class="item-row">

                        <span>
                            ${productName}
                            × ${quantity}
                        </span>

                        <strong>
                            ₹${price}
                        </strong>

                    </div>

                `;

            });


            details.innerHTML = itemsHTML;

        }


        details.classList.add("show");

        button.textContent = "Hide Items";

    }
    catch (error) {

        console.error(
            "Order items error:",
            error
        );


        details.innerHTML = `
            
            <p>
                Unable to load order items.
            </p>

        `;


        details.classList.add("show");

        button.textContent = "View Items";

    }

}


// ==========================================
// LOGOUT
// ==========================================

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


            localStorage.removeItem("user");

            localStorage.removeItem("cart");


            window.location.href =
                "/HTML/login.html";

        }
    );

}


// ==========================================
// START ORDERS PAGE
// ==========================================

updateCartCount();

loadOrders();