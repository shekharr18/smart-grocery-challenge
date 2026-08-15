// ==========================================
// SMART GROCERY CHALLENGE
// DASHBOARD JAVASCRIPT
// ==========================================


// ==========================================
// LOGIN PROTECTION
// ==========================================

let loggedInUser = null;

try {
    loggedInUser = JSON.parse(
        localStorage.getItem("user")
    );
} catch (error) {
    console.error("User data error:", error);
    loggedInUser = null;
}


// If user is not logged in
if (!loggedInUser) {

    alert("Please login first.");

    window.location.href = "/HTML/login.html";
}


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const userNameElement =
    document.getElementById("userName");

const logoutBtn =
    document.getElementById("logoutBtn");

const cartCountElement =
    document.getElementById("cartCount");


// ==========================================
// DASHBOARD STATISTICS ELEMENTS
// ==========================================

const totalProductsElement =
    document.getElementById("totalProducts");

const totalOrdersElement =
    document.getElementById("totalOrders");

const totalSpentElement =
    document.getElementById("totalSpent");


// ==========================================
// DISPLAY USER NAME
// ==========================================

function displayUserName() {

    if (!loggedInUser) {
        return;
    }

    if (!userNameElement) {
        console.warn("userName element not found.");
        return;
    }

    userNameElement.textContent =
        loggedInUser.fullname || "User";
}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

    } catch (error) {

        console.error(
            "Cart data error:",
            error
        );

        cart = [];
    }


    let count = 0;


    if (Array.isArray(cart)) {

        cart.forEach(function(item) {

            const quantity =
                Number(
                    item.cartQuantity ||
                    item.quantity ||
                    1
                );

            count += quantity;

        });

    }


    if (cartCountElement) {

        cartCountElement.textContent =
            count;

    }

}


// ==========================================
// LOAD DASHBOARD STATISTICS
// ==========================================

async function loadDashboardStats() {

    if (!loggedInUser) {

        console.warn(
            "No logged-in user found."
        );

        return;
    }


    if (!loggedInUser.id) {

        console.error(
            "User ID is missing."
        );

        return;
    }


    try {

        console.log(
            "Loading dashboard statistics..."
        );


        // ==================================
        // CALL FLASK API
        // ==================================

        const response =
            await fetch(
                `/api/dashboard/stats/${loggedInUser.id}`
            );


        // Check HTTP response
        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Dashboard API Response:",
            data
        );


        // ==================================
        // CHECK API SUCCESS
        // ==================================

        if (!data.success) {

            console.error(
                "Dashboard statistics failed:",
                data.message
            );

            return;
        }


        // ==================================
        // GET STATISTICS
        // ==================================

        const stats =
            data.stats;


        if (!stats) {

            console.error(
                "Statistics data not found."
            );

            return;
        }


        // ==================================
        // TOTAL PRODUCTS
        // ==================================

        if (totalProductsElement) {

            totalProductsElement.textContent =
                Number(
                    stats.total_products || 0
                );

        }


        // ==================================
        // TOTAL ORDERS
        // ==================================

        if (totalOrdersElement) {

            totalOrdersElement.textContent =
                Number(
                    stats.total_orders || 0
                );

        }


        // ==================================
        // TOTAL SPENT
        // ==================================

        if (totalSpentElement) {

            const amount =
                Number(
                    stats.total_spent || 0
                );


            totalSpentElement.textContent =
                "₹" +
                amount.toFixed(2);

        }


        console.log(
            "Dashboard statistics loaded successfully."
        );

    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );


        // Show safe default values
        if (totalProductsElement) {

            totalProductsElement.textContent =
                "0";

        }


        if (totalOrdersElement) {

            totalOrdersElement.textContent =
                "0";

        }


        if (totalSpentElement) {

            totalSpentElement.textContent =
                "₹0.00";

        }

    }

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            // Remove login information
            localStorage.removeItem(
                "user"
            );


            // Remove cart
            localStorage.removeItem(
                "cart"
            );


            // Go to login page
            window.location.href =
                "/HTML/login.html";

        }
    );

}


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

displayUserName();

updateCartCount();

loadDashboardStats();