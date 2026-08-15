// ==========================================================
// SMART GROCERY - CART + RAZORPAY PAYMENT
// ==========================================================


// ==========================================================
// LOGIN PROTECTION
// ==========================================================

const loggedInUser =
    JSON.parse(
        localStorage.getItem("user")
    );

if (!loggedInUser) {

    alert("Please login first.");

    window.location.href =
        "/HTML/login.html";
}


// ==========================================================
// ELEMENTS
// ==========================================================

const cartContainer =
    document.getElementById(
        "cartContainer"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const totalItemsElement =
    document.getElementById(
        "totalItems"
    );

const subtotalElement =
    document.getElementById(
        "subtotal"
    );

const totalPriceElement =
    document.getElementById(
        "totalPrice"
    );

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );

const clearCartBtn =
    document.getElementById(
        "clearCartBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ==========================================================
// GET CART
// ==========================================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    } catch (error) {

        console.error(
            "Cart read error:",
            error
        );

        return [];
    }
}


// ==========================================================
// SAVE CART
// ==========================================================

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// ==========================================================
// CART COUNT
// ==========================================================

function updateCartCount() {

    const cart =
        getCart();

    let count = 0;

    cart.forEach(
        function(item) {

            count += Number(
                item.cartQuantity || 1
            );

        }
    );

    if (cartCount) {

        cartCount.textContent =
            count;
    }
}


// ==========================================================
// DISPLAY CART
// ==========================================================

function displayCart() {

    const cart =
        getCart();

    if (!cartContainer) {
        return;
    }


    // ------------------------------------------------------
    // EMPTY CART
    // ------------------------------------------------------

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <div style="font-size:50px;">
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some groceries to your cart
                    before checking out.
                </p>

                <a
                    href="/HTML/products.html"
                >
                    Browse Products
                </a>

            </div>

        `;

        updateSummary();

        return;
    }


    // ------------------------------------------------------
    // CART ITEMS
    // ------------------------------------------------------

    cartContainer.innerHTML = "";


    cart.forEach(
        function(item, index) {

            const quantity =
                Number(
                    item.cartQuantity || 1
                );

            const price =
                Number(
                    item.price || 0
                );

            const itemTotal =
                price * quantity;


            const itemDiv =
                document.createElement(
                    "div"
                );

            itemDiv.className =
                "cart-item";


            const image =
                item.image ||
                "/IMAGES/grocery.png.png";


            itemDiv.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${image}"
                        alt="${item.name}"
                        onerror="
                            this.src='/IMAGES/grocery.png.png'
                        "
                    >

                </div>


                <div class="cart-item-details">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${item.category || ""}
                    </p>

                    <strong>
                        ₹${price.toFixed(2)}
                    </strong>

                </div>


                <div class="cart-quantity">

                    <button
                        class="quantity-btn"
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        class="quantity-btn"
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>


                <div class="cart-item-total">

                    ₹${itemTotal.toFixed(2)}

                </div>


                <button
                    class="remove-btn"
                    onclick="removeItem(${index})"
                >
                    Remove
                </button>

            `;


            cartContainer.appendChild(
                itemDiv
            );

        }
    );


    updateSummary();
}


// ==========================================================
// CHANGE QUANTITY
// ==========================================================

function changeQuantity(
    index,
    change
) {

    const cart =
        getCart();

    if (!cart[index]) {
        return;
    }

    let quantity =
        Number(
            cart[index].cartQuantity || 1
        );

    quantity += change;


    if (quantity <= 0) {

        cart.splice(
            index,
            1
        );

    } else {

        cart[index].cartQuantity =
            quantity;
    }


    saveCart(cart);

    displayCart();

    updateCartCount();
}


// ==========================================================
// REMOVE ITEM
// ==========================================================

function removeItem(index) {

    const cart =
        getCart();

    cart.splice(
        index,
        1
    );

    saveCart(cart);

    displayCart();

    updateCartCount();
}


// ==========================================================
// UPDATE SUMMARY
// ==========================================================

function updateSummary() {

    const cart =
        getCart();

    let totalItems = 0;

    let subtotal = 0;


    cart.forEach(
        function(item) {

            const quantity =
                Number(
                    item.cartQuantity || 1
                );

            const price =
                Number(
                    item.price || 0
                );

            totalItems +=
                quantity;

            subtotal +=
                price * quantity;

        }
    );


    if (totalItemsElement) {

        totalItemsElement.textContent =
            totalItems;
    }


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" + subtotal.toFixed(2);
    }


    if (totalPriceElement) {

        totalPriceElement.textContent =
            "₹" + subtotal.toFixed(2);
    }
}


// ==========================================================
// GET TOTAL
// ==========================================================

function getCartTotal() {

    const cart =
        getCart();

    let total = 0;


    cart.forEach(
        function(item) {

            const quantity =
                Number(
                    item.cartQuantity || 1
                );

            const price =
                Number(
                    item.price || 0
                );

            total +=
                price * quantity;

        }
    );


    return total;
}


// ==========================================================
// CHECKOUT BUTTON
// ==========================================================

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        startPayment
    );
}


// ==========================================================
// START RAZORPAY PAYMENT
// ==========================================================

async function startPayment() {

    const cart =
        getCart();


    // ------------------------------------------------------
    // CHECK CART
    // ------------------------------------------------------

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    // ------------------------------------------------------
    // CHECK USER
    // ------------------------------------------------------

    if (!loggedInUser) {

        alert(
            "Please login first."
        );

        window.location.href =
            "/HTML/login.html";

        return;
    }


    const totalAmount =
        getCartTotal();


    if (totalAmount <= 0) {

        alert(
            "Invalid cart amount."
        );

        return;
    }


    // ------------------------------------------------------
    // DISABLE BUTTON
    // ------------------------------------------------------

    checkoutBtn.disabled =
        true;

    checkoutBtn.textContent =
        "Opening Payment...";


    try {

        // ==================================================
        // STEP 1
        // CREATE RAZORPAY ORDER
        // ==================================================

        const orderResponse =
            await fetch(
                "/api/payment/create-order",
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            amount:
                                totalAmount,

                            user_id:
                                loggedInUser.id

                        })

                }
            );


        const orderData =
            await orderResponse.json();


        console.log(
            "Razorpay order:",
            orderData
        );


        if (
            !orderResponse.ok ||
            !orderData.success
        ) {

            throw new Error(
                orderData.message ||
                "Unable to create payment order"
            );
        }


        // ==================================================
        // STEP 2
        // CHECK RAZORPAY SCRIPT
        // ==================================================

        if (
            typeof Razorpay ===
            "undefined"
        ) {

            throw new Error(
                "Razorpay Checkout script is not loaded."
            );
        }


        // ==================================================
        // STEP 3
        // RAZORPAY OPTIONS
        // ==================================================

        const options = {

            key:
                orderData.key_id,

            amount:
                orderData.amount,

            currency:
                orderData.currency,

            name:
                "Smart Grocery",

            description:
                "Grocery Order Payment",

            order_id:
                orderData.order_id,


            prefill: {

                name:
                    loggedInUser.fullname ||
                    "",

                email:
                    loggedInUser.email ||
                    ""

            },


            theme: {

                color:
                    "#218c2a"

            },


            handler:
                async function(response) {

                    console.log(
                        "Payment response:",
                        response
                    );


                    await verifyPayment(
                        response,
                        totalAmount,
                        cart
                    );

                },


            modal: {

                ondismiss:
                    function() {

                        checkoutBtn.disabled =
                            false;

                        checkoutBtn.textContent =
                            "Proceed to Checkout 🛍️";

                        console.log(
                            "Payment popup closed"
                        );

                    }

            }

        };


        // ==================================================
        // STEP 4
        // OPEN RAZORPAY
        // ==================================================

        const razorpay =
            new Razorpay(
                options
            );


        razorpay.on(
            "payment.failed",
            function(response) {

                console.error(
                    "Payment failed:",
                    response
                );


                alert(
                    "Payment failed.\n\n" +
                    (
                        response.error &&
                        response.error.description
                        ?
                        response.error.description
                        :
                        "Please try again."
                    )
                );


                checkoutBtn.disabled =
                    false;

                checkoutBtn.textContent =
                    "Proceed to Checkout 🛍️";

            }
        );


        razorpay.open();


    } catch (error) {

        console.error(
            "PAYMENT ERROR:",
            error
        );


        alert(
            "Unable to start payment.\n\n"
            + error.message
        );


        checkoutBtn.disabled =
            false;

        checkoutBtn.textContent =
            "Proceed to Checkout 🛍️";
    }
}


// ==========================================================
// VERIFY PAYMENT
// ==========================================================

async function verifyPayment(
    response,
    totalAmount,
    cart
) {

    try {

        // --------------------------------------------------
        // SEND PAYMENT DETAILS TO FLASK
        // --------------------------------------------------

        const verifyResponse =
            await fetch(
                "/api/payment/verify",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_order_id:
                                response.razorpay_order_id,

                            razorpay_signature:
                                response.razorpay_signature

                        })

                }
            );


        const verifyData =
            await verifyResponse.json();


        console.log(
            "Payment verification:",
            verifyData
        );


        if (
            !verifyResponse.ok ||
            !verifyData.success
        ) {

            throw new Error(
                verifyData.message ||
                "Payment verification failed"
            );
        }


        // ==================================================
        // PAYMENT VERIFIED
        // ==================================================

        // Now save the order in MySQL.

        const orderResponse =
            await fetch(
                "/api/orders",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            user_id:
                                loggedInUser.id,

                            items:
                                cart,

                            total_amount:
                                totalAmount,

                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_order_id:
                                response.razorpay_order_id

                        })

                }
            );


        const orderData =
            await orderResponse.json();


        console.log(
            "Database order:",
            orderData
        );


        if (
            !orderResponse.ok ||
            !orderData.success
        ) {

            throw new Error(
                orderData.message ||
                "Payment succeeded but order creation failed"
            );
        }


        // ==================================================
        // SUCCESS
        // ==================================================

        localStorage.removeItem(
            "cart"
        );


        alert(
            "🎉 Payment Successful!\n\n" +
            "Order ID: " +
            orderData.order_id +
            "\n\n" +
            "Payment ID: " +
            response.razorpay_payment_id
        );


        window.location.href =
            "/HTML/orders.html";


    } catch (error) {

        console.error(
            "VERIFY ERROR:",
            error
        );


        alert(
            "Payment verification error.\n\n"
            + error.message
        );


        checkoutBtn.disabled =
            false;

        checkoutBtn.textContent =
            "Proceed to Checkout 🛍️";
    }
}


// ==========================================================
// CLEAR CART
// ==========================================================

if (clearCartBtn) {

    clearCartBtn.addEventListener(
        "click",
        function() {

            if (
                confirm(
                    "Are you sure you want to clear your cart?"
                )
            ) {

                localStorage.removeItem(
                    "cart"
                );

                displayCart();

                updateCartCount();

            }

        }
    );
}


// ==========================================================
// LOGOUT
// ==========================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

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
// INITIALIZE
// ==========================================================

displayCart();

updateCartCount();

updateSummary();