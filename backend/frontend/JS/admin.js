// ==========================================================
// SMART GROCERY - ADMIN DASHBOARD
// ==========================================================


// ==========================================================
// LOGIN CHECK
// ==========================================================

const loggedInUser =
    JSON.parse(localStorage.getItem("user"));


if (!loggedInUser) {

    alert("Please login first.");

    window.location.href =
        "/HTML/login.html";

}


// ==========================================================
// ELEMENTS
// ==========================================================

const totalProducts =
    document.getElementById("totalProducts");

const totalOrders =
    document.getElementById("totalOrders");

const totalUsers =
    document.getElementById("totalUsers");

const totalSales =
    document.getElementById("totalSales");


const productForm =
    document.getElementById("productForm");

const productsContainer =
    document.getElementById("productsContainer");

const ordersContainer =
    document.getElementById("ordersContainer");

const usersContainer =
    document.getElementById("usersContainer");


const logoutBtn =
    document.getElementById("logoutBtn");


const refreshProducts =
    document.getElementById("refreshProducts");

const refreshOrders =
    document.getElementById("refreshOrders");

const refreshUsers =
    document.getElementById("refreshUsers");


// ==========================================================
// ORDER MODAL ELEMENTS
// ==========================================================

const orderModal =
    document.getElementById("orderModal");

const closeOrderModal =
    document.getElementById("closeOrderModal");

const modalCloseBtn =
    document.getElementById("modalCloseBtn");

const modalCancelOrder =
    document.getElementById("modalCancelOrder");

const modalOrderNumber =
    document.getElementById("modalOrderNumber");

const orderModalContent =
    document.getElementById("orderModalContent");


let currentOrderId = null;


// ==========================================================
// LOAD STATISTICS
// ==========================================================

async function loadStatistics() {

    try {

        const response =
            await fetch("/api/admin/stats");


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load statistics"
            );

        }


        if (data.success && data.stats) {

            totalProducts.textContent =
                data.stats.total_products || 0;


            totalOrders.textContent =
                data.stats.total_orders || 0;


            totalUsers.textContent =
                data.stats.total_users || 0;


            totalSales.textContent =
                Number(
                    data.stats.total_sales || 0
                ).toFixed(2);

        }

    }

    catch (error) {

        console.error(
            "Statistics Error:",
            error
        );

    }

}


// ==========================================================
// LOAD PRODUCTS
// ==========================================================

async function loadProducts() {

    productsContainer.innerHTML = `

        <p class="loading">
            Loading products...
        </p>

    `;


    try {

        const response =
            await fetch("/api/products");


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load products"
            );

        }


        const products =
            data.products || [];


        if (products.length === 0) {

            productsContainer.innerHTML = `

                <p class="loading">
                    No products found.
                </p>

            `;

            return;

        }


        let html = `

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        products.forEach(
            function(product) {

                const productName =
                    String(
                        product.name || ""
                    )
                    .replace(
                        /'/g,
                        "\\'"
                    );


                html += `

                    <tr>

                        <td>
                            ${product.id}
                        </td>

                        <td>
                            ${product.name || "-"}
                        </td>

                        <td>
                            ${product.category || "-"}
                        </td>

                        <td>
                            ₹${Number(
                                product.price || 0
                            ).toFixed(2)}
                        </td>

                        <td>
                            ${product.quantity || 0}
                        </td>

                        <td>

                            <button
                                class="edit-btn"
                                onclick="editProduct(
                                    ${product.id},
                                    '${productName}',
                                    ${Number(product.price || 0)},
                                    ${Number(product.quantity || 0)}
                                )">

                                ✏️ Edit

                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteProduct(
                                    ${product.id}
                                )">

                                🗑️ Delete

                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        html += `

                    </tbody>

                </table>

            </div>

        `;


        productsContainer.innerHTML =
            html;

    }

    catch (error) {

        console.error(
            "Products Error:",
            error
        );


        productsContainer.innerHTML = `

            <p class="loading">

                ❌ ${error.message}

            </p>

        `;

    }

}


// ==========================================================
// ADD PRODUCT
// ==========================================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "productName"
                ).value.trim();


            const category =
                document.getElementById(
                    "productCategory"
                ).value;


            const price =
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                );


            const quantity =
                Number(
                    document.getElementById(
                        "productQuantity"
                    ).value
                );


            const imageElement =
                document.getElementById(
                    "productImage"
                );


            const image =
                imageElement
                    ? imageElement.value.trim()
                    : "";


            if (
                !name ||
                !category ||
                isNaN(price) ||
                isNaN(quantity) ||
                price < 0 ||
                quantity < 0
            ) {

                alert(
                    "Please enter valid product details."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "/api/products",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    name:
                                        name,

                                    category:
                                        category,

                                    price:
                                        price,

                                    quantity:
                                        quantity,

                                    image:
                                        image

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not add product"
                    );

                }


                alert(
                    "Product added successfully!"
                );


                productForm.reset();


                await loadProducts();

                await loadStatistics();

            }

            catch (error) {

                console.error(
                    "Add Product Error:",
                    error
                );


                alert(
                    "Error: " +
                    error.message
                );

            }

        }
    );

}


// ==========================================================
// EDIT PRODUCT
// ==========================================================

async function editProduct(
    id,
    oldName,
    oldPrice,
    oldQuantity
) {

    const name =
        prompt(
            "Enter product name:",
            oldName
        );


    if (name === null) {
        return;
    }


    const price =
        prompt(
            "Enter price:",
            oldPrice
        );


    if (price === null) {
        return;
    }


    const quantity =
        prompt(
            "Enter quantity:",
            oldQuantity
        );


    if (quantity === null) {
        return;
    }


    const newPrice =
        Number(price);


    const newQuantity =
        Number(quantity);


    if (
        !name.trim() ||
        isNaN(newPrice) ||
        isNaN(newQuantity) ||
        newPrice < 0 ||
        newQuantity < 0
    ) {

        alert(
            "Invalid product details."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `/api/products/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            name:
                                name.trim(),

                            price:
                                newPrice,

                            quantity:
                                newQuantity

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not update product"
            );

        }


        alert(
            "Product updated successfully!"
        );


        await loadProducts();

        await loadStatistics();

    }

    catch (error) {

        console.error(
            "Update Product Error:",
            error
        );


        alert(
            "Error: " +
            error.message
        );

    }

}


// ==========================================================
// DELETE PRODUCT
// ==========================================================

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/products/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not delete product"
            );

        }


        alert(
            "Product deleted successfully!"
        );


        await loadProducts();

        await loadStatistics();

    }

    catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );


        alert(
            "Error: " +
            error.message
        );

    }

}


// ==========================================================
// LOAD ORDERS
// ==========================================================

async function loadOrders() {

    ordersContainer.innerHTML = `

        <p class="loading">
            Loading orders...
        </p>

    `;


    try {

        const response =
            await fetch(
                "/api/admin/orders"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load orders"
            );

        }


        const orders =
            data.orders || [];


        if (orders.length === 0) {

            ordersContainer.innerHTML = `

                <p class="loading">
                    No orders found.
                </p>

            `;

            return;

        }


        let html = `

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        orders.forEach(
            function(order) {

                const status =
                    String(
                        order.status ||
                        "Placed"
                    );


                const isCancelled =
                    status.toLowerCase() ===
                    "cancelled";


                html += `

                    <tr>

                        <td>
                            #${order.id}
                        </td>

                        <td>
                            ${order.fullname || "Unknown"}
                        </td>

                        <td>
                            ${order.email || "-"}
                        </td>

                        <td>
                            ₹${Number(
                                order.total_amount || 0
                            ).toFixed(2)}
                        </td>

                        <td>

                            <span
                                class="status ${status.toLowerCase()}">

                                ${status}

                            </span>

                        </td>

                        <td>
                            ${formatDate(
                                order.created_at
                            )}
                        </td>

                        <td>

                            <button
                                class="edit-btn"
                                onclick="viewOrder(
                                    ${order.id}
                                )">

                                👁️ View

                            </button>


                            ${
                                !isCancelled
                                ?
                                `
                                <button
                                    class="delete-btn"
                                    onclick="cancelOrder(
                                        ${order.id}
                                    )">

                                    ❌ Cancel

                                </button>
                                `
                                :
                                `
                                <span>
                                    —
                                </span>
                                `
                            }

                        </td>

                    </tr>

                `;

            }
        );


        html += `

                    </tbody>

                </table>

            </div>

        `;


        ordersContainer.innerHTML =
            html;

    }

    catch (error) {

        console.error(
            "Orders Error:",
            error
        );


        ordersContainer.innerHTML = `

            <p class="loading">

                ❌ ${error.message}

            </p>

        `;

    }

}


// ==========================================================
// VIEW ORDER - OPEN MODAL
// ==========================================================

async function viewOrder(orderId) {

    currentOrderId =
        orderId;


    orderModal.classList.add(
        "show"
    );


    modalOrderNumber.textContent =
        "Order #" +
        orderId;


    orderModalContent.innerHTML = `

        <p class="loading">
            Loading order details...
        </p>

    `;


    modalCancelOrder.style.display =
        "block";


    try {

        const response =
            await fetch(
                `/api/orders/${orderId}/items`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load order details"
            );

        }


        const items =
            data.items || [];


        if (items.length === 0) {

            orderModalContent.innerHTML = `

                <p class="loading">
                    No items found for this order.
                </p>

            `;

            return;

        }


        let total =
            0;


        let html = `

            <h3 class="order-items-title">
                🛒 Items
            </h3>

        `;


        items.forEach(
            function(item) {

                const price =
                    Number(
                        item.price || 0
                    );


                const quantity =
                    Number(
                        item.quantity || 0
                    );


                const itemTotal =
                    price *
                    quantity;


                total +=
                    itemTotal;


                html += `

                    <div class="order-item">

                        <div>

                            <div
                                class="order-item-name">

                                ${item.product_name || "Product"}

                            </div>

                            <div
                                class="order-item-details">

                                ${quantity}
                                ×
                                ₹${price.toFixed(2)}

                            </div>

                        </div>


                        <div
                            class="order-item-total">

                            ₹${itemTotal.toFixed(2)}

                        </div>

                    </div>

                `;

            }
        );


        html += `

            <div class="modal-total">

                <span>
                    Total
                </span>

                <span>
                    ₹${total.toFixed(2)}
                </span>

            </div>

        `;


        orderModalContent.innerHTML =
            html;

    }

    catch (error) {

        console.error(
            "Order Details Error:",
            error
        );


        orderModalContent.innerHTML = `

            <p class="loading">

                ❌ ${error.message}

            </p>

        `;

    }

}


// ==========================================================
// CANCEL ORDER
// ==========================================================

async function cancelOrder(orderId) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel Order #" +
            orderId +
            "?"
        );


    if (!confirmCancel) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/orders/${orderId}/cancel`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not cancel order"
            );

        }


        alert(
            "Order #" +
            orderId +
            " cancelled successfully!"
        );


        closeModal();


        await loadOrders();

        await loadProducts();

        await loadStatistics();

    }

    catch (error) {

        console.error(
            "Cancel Order Error:",
            error
        );


        alert(
            "Error: " +
            error.message
        );

    }

}


// ==========================================================
// MODAL CANCEL BUTTON
// ==========================================================

if (modalCancelOrder) {

    modalCancelOrder.addEventListener(
        "click",
        function() {

            if (
                currentOrderId !== null
            ) {

                cancelOrder(
                    currentOrderId
                );

            }

        }
    );

}


// ==========================================================
// CLOSE MODAL
// ==========================================================

function closeModal() {

    orderModal.classList.remove(
        "show"
    );


    currentOrderId =
        null;

}


// ==========================================================
// CLOSE BUTTONS
// ==========================================================

if (closeOrderModal) {

    closeOrderModal.addEventListener(
        "click",
        closeModal
    );

}


if (modalCloseBtn) {

    modalCloseBtn.addEventListener(
        "click",
        closeModal
    );

}


// ==========================================================
// CLICK OUTSIDE MODAL
// ==========================================================

if (orderModal) {

    orderModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                orderModal
            ) {

                closeModal();

            }

        }
    );

}


// ==========================================================
// ESC KEY
// ==========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            orderModal.classList.contains("show")
        ) {

            closeModal();

        }

    }
);


// ==========================================================
// LOAD USERS
// ==========================================================

async function loadUsers() {

    if (!usersContainer) {
        return;
    }


    usersContainer.innerHTML = `

        <p class="loading">
            Loading users...
        </p>

    `;


    try {

        const response =
            await fetch(
                "/api/users"
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Could not load users"
            );

        }


        const users =
            data.users || [];


        if (users.length === 0) {

            usersContainer.innerHTML = `

                <p class="loading">
                    No registered users found.
                </p>

            `;

            return;

        }


        let html = `

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        users.forEach(
            function(user) {

                html += `

                    <tr>

                        <td>
                            ${user.id}
                        </td>

                        <td>
                            ${user.fullname || "-"}
                        </td>

                        <td>
                            ${user.email || "-"}
                        </td>

                    </tr>

                `;

            }
        );


        html += `

                    </tbody>

                </table>

            </div>

        `;


        usersContainer.innerHTML =
            html;

    }

    catch (error) {

        console.error(
            "Users Error:",
            error
        );


        usersContainer.innerHTML = `

            <p class="loading">

                ❌ ${error.message}

            </p>

        `;

    }

}


// ==========================================================
// DATE FORMAT
// ==========================================================

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleString();

}


// ==========================================================
// LOGOUT
// ==========================================================

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


// ==========================================================
// REFRESH PRODUCTS
// ==========================================================

if (refreshProducts) {

    refreshProducts.addEventListener(
        "click",
        function() {

            loadProducts();

            loadStatistics();

        }
    );

}


// ==========================================================
// REFRESH ORDERS
// ==========================================================

if (refreshOrders) {

    refreshOrders.addEventListener(
        "click",
        function() {

            loadOrders();

            loadStatistics();

        }
    );

}


// ==========================================================
// REFRESH USERS
// ==========================================================

if (refreshUsers) {

    refreshUsers.addEventListener(
        "click",
        function() {

            loadUsers();

            loadStatistics();

        }
    );

}


// ==========================================================
// START
// ==========================================================

loadStatistics();

loadProducts();

loadOrders();

loadUsers();