// ==========================================
// ORDER DETAILS
// ==========================================

const user =
    JSON.parse(localStorage.getItem("user"));


// ==========================================
// LOGIN PROTECTION
// ==========================================

if (!user) {

    alert("Please login first.");

    window.location.href =
        "/HTML/login.html";
}


// ==========================================
// ELEMENTS
// ==========================================

const orderDetails =
    document.getElementById("orderDetails");

const cartCount =
    document.getElementById("cartCount");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// GET ORDER ID
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const orderId =
    urlParams.get("id");


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
// LOAD ORDER
// ==========================================

async function loadOrderDetails() {

    if (!orderId) {

        orderDetails.innerHTML = `
            <div class="error-box">
                ❌ Order ID not found.
            </div>
        `;

        return;
    }


    try {

        // Get order information

        const ordersResponse =
            await fetch(
                "/api/orders/" +
                user.id
            );


        const ordersData =
            await ordersResponse.json();


        if (!ordersData.success) {

            throw new Error(
                ordersData.message
            );

        }


        const order =
            ordersData.orders.find(
                function(item) {

                    return String(item.id) ===
                        String(orderId);

                }
            );


        if (!order) {

            orderDetails.innerHTML = `
                <div class="error-box">
                    ❌ Order not found.
                </div>
            `;

            return;
        }


        // Get order items

        const itemsResponse =
            await fetch(
                "/api/orders/" +
                orderId +
                "/items"
            );


        const itemsData =
            await itemsResponse.json();


        if (!itemsData.success) {

            throw new Error(
                itemsData.message
            );

        }


        displayOrder(
            order,
            itemsData.items || []
        );


    } catch (error) {

        console.error(error);

        orderDetails.innerHTML = `
            <div class="error-box">

                ❌ Unable to load order details.

                <br><br>

                ${error.message || ""}

            </div>
        `;
    }
}


// ==========================================
// DISPLAY ORDER
// ==========================================

function displayOrder(order, items) {

    const date =
        order.created_at
            ? new Date(
                order.created_at
              ).toLocaleString()
            : "Date unavailable";


    let itemsHTML = "";


    if (items.length === 0) {

        itemsHTML = `
            <p class="no-items">
                No product details available.
            </p>
        `;

    } else {

        items.forEach(function(item) {

            const price =
                Number(item.price || 0);

            const quantity =
                Number(item.quantity || 1);

            const itemTotal =
                price * quantity;


            itemsHTML += `

                <div class="item-row">

                    <div>

                        <h3>
                            🛒
                            ${item.product_name || "Product"}
                        </h3>

                        <p>
                            ₹${price.toFixed(2)}
                            ×
                            ${quantity}
                        </p>

                    </div>

                    <strong>
                        ₹${itemTotal.toFixed(2)}
                    </strong>

                </div>

            `;
        });
    }


    const total =
        Number(
            order.total_amount || 0
        ).toFixed(2);


    orderDetails.innerHTML = `

        <div class="details-card">

            <div class="details-header">

                <div>

                    <h1>
                        Order #${order.id}
                    </h1>

                    <p>
                        📅 ${date}
                    </p>

                </div>


                <span class="status">
                    ${order.status || "Placed"}
                </span>

            </div>


            <div class="products-section">

                <h2>
                    Products
                </h2>

                <div class="items-list">

                    ${itemsHTML}

                </div>

            </div>


            <div class="total-section">

                <span>
                    Total Amount
                </span>

                <strong>
                    ₹${total}
                </strong>

            </div>

        </div>
    `;
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

            localStorage.removeItem("user");

            localStorage.removeItem("cart");

            window.location.href =
                "/HTML/login.html";
        }
    );
}


// ==========================================
// START
// ==========================================

updateCartCount();

loadOrderDetails();