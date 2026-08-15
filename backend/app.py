
# ==========================================================
# SMART GROCERY CHALLENGE
# FLASK BACKEND + MYSQL + RAZORPAY TEST PAYMENT
# ==========================================================

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import get_connection

import os
import hmac
import hashlib

from decimal import Decimal
from datetime import datetime

from dotenv import load_dotenv
import razorpay


# ==========================================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(os.path.join(BASE_DIR, ".env"))

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")


# ==========================================================
# CHECK RAZORPAY CONFIGURATION
# ==========================================================

print()
print("==========================================")
print(" RAZORPAY CONFIGURATION")
print("==========================================")

if RAZORPAY_KEY_ID:
    print("Razorpay Key ID :", RAZORPAY_KEY_ID)
else:
    print("ERROR: RAZORPAY_KEY_ID not found")

if RAZORPAY_KEY_SECRET:
    print("Razorpay Secret : Loaded")
else:
    print("ERROR: RAZORPAY_KEY_SECRET not found")

print("==========================================")
print()


# ==========================================================
# RAZORPAY CLIENT
# ==========================================================

razorpay_client = None

if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(
        auth=(
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        )
    )


# ==========================================================
# FLASK APP
# ==========================================================

app = Flask(__name__)

CORS(app)


# ==========================================================
# PROJECT PATHS
# ==========================================================

FRONTEND_DIR = os.path.join(
    BASE_DIR,
    "frontend"
)

HTML_DIR = os.path.join(
    FRONTEND_DIR,
    "HTML"
)

CSS_DIR = os.path.join(
    FRONTEND_DIR,
    "CSS"
)

JS_DIR = os.path.join(
    FRONTEND_DIR,
    "JS"
)

IMAGES_DIR = os.path.join(
    FRONTEND_DIR,
    "IMAGES"
)


# ==========================================================
# STARTUP INFORMATION
# ==========================================================

print()
print("==========================================")
print(" SMART GROCERY FLASK SERVER")
print("==========================================")
print("BASE DIR   :", BASE_DIR)
print("FRONTEND   :", FRONTEND_DIR)
print("HTML DIR   :", HTML_DIR)
print("CSS DIR    :", CSS_DIR)
print("JS DIR     :", JS_DIR)
print("IMAGES DIR :", IMAGES_DIR)
print("SERVER     : http://127.0.0.1:5000")
print("==========================================")
print()


# ==========================================================
# HELPER - JSON SAFE
# ==========================================================

def json_safe(value):

    if isinstance(value, Decimal):
        return float(value)

    if isinstance(value, datetime):
        return value.strftime(
            "%Y-%m-%d %H:%M:%S"
        )

    return value


# ==========================================================
# HELPER - IMAGE URL
# ==========================================================

def make_image_url(image):

    if not image:
        return "/IMAGES/grocery.png.png"

    image = str(image).strip()

    if image == "":
        return "/IMAGES/grocery.png.png"

    if image.startswith("http://"):
        return image

    if image.startswith("https://"):
        return image

    if image.startswith("/IMAGES/"):
        return image

    image = image.replace("\\", "/")

    if image.startswith("IMAGES/"):
        return "/" + image

    if "/IMAGES/" in image:
        image = image.split(
            "/IMAGES/",
            1
        )[1]

    image = image.split("/")[-1]

    return "/IMAGES/" + image


# ==========================================================
# HELPER - FETCH PRODUCTS
# ==========================================================

def fetch_products():

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        try:

            cursor.execute("""
                SELECT
                    id,
                    name,
                    category,
                    price,
                    quantity,
                    image
                FROM products
                ORDER BY id ASC
            """)

            products = cursor.fetchall()

        except Exception as e:

            print(
                "Image column not available:",
                e
            )

            conn.rollback()

            cursor.close()

            cursor = conn.cursor(
                dictionary=True
            )

            cursor.execute("""
                SELECT
                    id,
                    name,
                    category,
                    price,
                    quantity
                FROM products
                ORDER BY id ASC
            """)

            products = cursor.fetchall()

            for product in products:
                product["image"] = (
                    "/IMAGES/grocery.png.png"
                )

        for product in products:

            product["id"] = int(
                product["id"]
            )

            product["name"] = str(
                product.get("name") or ""
            )

            product["category"] = str(
                product.get("category")
                or "Grocery"
            )

            product["price"] = float(
                product.get("price") or 0
            )

            product["quantity"] = int(
                product.get("quantity") or 0
            )

            product["image"] = make_image_url(
                product.get("image")
            )

        return products

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# HOME
# ==========================================================

@app.route("/")
def home():

    index_file = os.path.join(
        HTML_DIR,
        "index.html"
    )

    if not os.path.exists(index_file):

        return """
        <h1>Smart Grocery</h1>
        <p>index.html was not found.</p>
        """, 404

    return send_from_directory(
        HTML_DIR,
        "index.html"
    )


# ==========================================================
# HTML ROUTES
# ==========================================================

@app.route("/index.html")
def index_page():

    return send_from_directory(
        HTML_DIR,
        "index.html"
    )


@app.route("/register.html")
def register_page():

    return send_from_directory(
        HTML_DIR,
        "register.html"
    )


@app.route("/login.html")
def login_page():

    return send_from_directory(
        HTML_DIR,
        "login.html"
    )


@app.route("/dashboard.html")
def dashboard_page():

    return send_from_directory(
        HTML_DIR,
        "dashboard.html"
    )


@app.route("/products.html")
def products_page():

    return send_from_directory(
        HTML_DIR,
        "products.html"
    )


@app.route("/cart.html")
def cart_page():

    return send_from_directory(
        HTML_DIR,
        "cart.html"
    )


@app.route("/orders.html")
def orders_page():

    return send_from_directory(
        HTML_DIR,
        "orders.html"
    )


@app.route("/challenge.html")
def challenge_page():

    return send_from_directory(
        HTML_DIR,
        "challenge.html"
    )


# ==========================================================
# HTML FILES
# ==========================================================

@app.route("/HTML/<path:filename>")
def html_files(filename):

    return send_from_directory(
        HTML_DIR,
        filename
    )


# ==========================================================
# CSS
# ==========================================================

@app.route("/CSS/<path:filename>")
def css_files(filename):

    return send_from_directory(
        CSS_DIR,
        filename
    )


# ==========================================================
# JAVASCRIPT
# ==========================================================

@app.route("/JS/<path:filename>")
def js_files(filename):

    return send_from_directory(
        JS_DIR,
        filename
    )


# ==========================================================
# IMAGES
# ==========================================================

@app.route("/IMAGES/<path:filename>")
def image_files(filename):

    file_path = os.path.join(
        IMAGES_DIR,
        filename
    )

    print(
        "IMAGE REQUEST:",
        filename
    )

    if not os.path.exists(file_path):

        print(
            "IMAGE NOT FOUND:",
            file_path
        )

        return jsonify({
            "success": False,
            "message": "Image not found",
            "file": filename
        }), 404

    return send_from_directory(
        IMAGES_DIR,
        filename
    )


# ==========================================================
# API TEST
# ==========================================================

@app.route("/api/test")
def test_api():

    return jsonify({
        "success": True,
        "message":
            "Smart Grocery Backend is Working!"
    })


# ==========================================================
# DATABASE TEST
# ==========================================================

@app.route("/api/db-test")
def database_test():

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            "SELECT 1"
        )

        result = cursor.fetchone()

        return jsonify({
            "success": True,
            "message":
                "MySQL Connected Successfully!",
            "result": result[0]
        })

    except Exception as e:

        print(
            "DATABASE ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# REGISTER
# ==========================================================

@app.route("/register", methods=["POST"])
@app.route("/api/register", methods=["POST"])
def register():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message":
                    "No data received"
            }), 400

        fullname = data.get(
            "fullname"
        )

        email = data.get(
            "email"
        )

        password = data.get(
            "password"
        )

        if not fullname or not email or not password:

            return jsonify({
                "success": False,
                "message":
                    "All fields are required"
            }), 400

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("""
            SELECT id
            FROM users
            WHERE email = %s
        """, (email,))

        if cursor.fetchone():

            return jsonify({
                "success": False,
                "message":
                    "Email already registered"
            }), 409

        cursor.execute("""
            INSERT INTO users
            (
                fullname,
                email,
                password
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
        """, (
            fullname,
            email,
            password
        ))

        conn.commit()

        return jsonify({
            "success": True,
            "message":
                "Registration Successful"
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "REGISTER ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# LOGIN
# ==========================================================

@app.route("/login", methods=["POST"])
@app.route("/api/login", methods=["POST"])
def login():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message":
                    "No data received"
            }), 400

        email = data.get(
            "email"
        )

        password = data.get(
            "password"
        )

        if not email or not password:

            return jsonify({
                "success": False,
                "message":
                    "Email and password are required"
            }), 400

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                id,
                fullname,
                email
            FROM users
            WHERE email = %s
            AND password = %s
        """, (
            email,
            password
        ))

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "success": False,
                "message":
                    "Invalid email or password"
            }), 401

        return jsonify({
            "success": True,
            "message":
                "Login Successful",
            "user": user
        })

    except Exception as e:

        print(
            "LOGIN ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# GET PRODUCTS
# ==========================================================

@app.route(
    "/api/products",
    methods=["GET"]
)
def get_products():

    try:

        products = fetch_products()

        return jsonify({
            "success": True,
            "products": products
        })

    except Exception as e:

        print(
            "PRODUCT ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==========================================================
# ADD PRODUCT
# ==========================================================

@app.route(
    "/api/products",
    methods=["POST"]
)
def add_product():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message":
                    "No product data received"
            }), 400

        name = data.get("name")
        category = data.get("category")
        price = data.get("price")
        quantity = data.get(
            "quantity",
            0
        )

        image = data.get(
            "image"
        )

        if not name or not category or price is None:

            return jsonify({
                "success": False,
                "message":
                    "Name, category and price are required"
            }), 400

        conn = get_connection()

        cursor = conn.cursor()

        try:

            cursor.execute("""
                INSERT INTO products
                (
                    name,
                    category,
                    price,
                    quantity,
                    image
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
            """, (
                name,
                category,
                price,
                quantity,
                image
            ))

        except Exception:

            conn.rollback()

            cursor.close()

            cursor = conn.cursor()

            cursor.execute("""
                INSERT INTO products
                (
                    name,
                    category,
                    price,
                    quantity
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s
                )
            """, (
                name,
                category,
                price,
                quantity
            ))

        conn.commit()

        return jsonify({
            "success": True,
            "message":
                "Product added successfully",
            "id": cursor.lastrowid
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# RAZORPAY - PAYMENT CONFIG TEST
# ==========================================================

@app.route(
    "/api/payment/config",
    methods=["GET"]
)
def payment_config():

    if not razorpay_client:

        return jsonify({
            "success": False,
            "message":
                "Razorpay is not configured"
        }), 500

    return jsonify({
        "success": True,
        "key_id": RAZORPAY_KEY_ID
    })


# ==========================================================
# RAZORPAY - CREATE PAYMENT ORDER
# ==========================================================

@app.route(
    "/api/payment/create-order",
    methods=["POST"]
)
def create_payment_order():

    try:

        if not razorpay_client:

            return jsonify({
                "success": False,
                "message":
                    "Razorpay is not configured. Check .env"
            }), 500

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message":
                    "Payment data is required"
            }), 400

        amount = data.get(
            "amount"
        )

        if amount is None:

            return jsonify({
                "success": False,
                "message":
                    "Amount is required"
            }), 400

        amount = float(amount)

        if amount <= 0:

            return jsonify({
                "success": False,
                "message":
                    "Amount must be greater than 0"
            }), 400

        # Razorpay requires paise.
        amount_paise = int(
            round(amount * 100)
        )

        razorpay_order = (
            razorpay_client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "receipt":
                    "grocery_" +
                    datetime.now().strftime(
                        "%Y%m%d%H%M%S"
                    ),
                "payment_capture": 1
            })
        )

        print()
        print(
            "RAZORPAY ORDER CREATED:"
        )
        print(
            "Order ID:",
            razorpay_order["id"]
        )
        print(
            "Amount:",
            amount_paise
        )
        print()

        return jsonify({
            "success": True,
            "key_id":
                RAZORPAY_KEY_ID,
            "order_id":
                razorpay_order["id"],
            "amount":
                amount_paise,
            "currency":
                "INR"
        })

    except Exception as e:

        print()
        print(
            "RAZORPAY CREATE ORDER ERROR:"
        )
        print(
            repr(e)
        )
        print()

        return jsonify({
            "success": False,
            "message":
                str(e)
        }), 500


# ==========================================================
# RAZORPAY - VERIFY PAYMENT
# ==========================================================

@app.route(
    "/api/payment/verify",
    methods=["POST"]
)
def verify_payment():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message":
                    "Payment verification data required"
            }), 400

        payment_id = data.get(
            "razorpay_payment_id"
        )

        order_id = data.get(
            "razorpay_order_id"
        )

        signature = data.get(
            "razorpay_signature"
        )

        if not payment_id or not order_id or not signature:

            return jsonify({
                "success": False,
                "message":
                    "Missing Razorpay payment details"
            }), 400

        if not RAZORPAY_KEY_SECRET:

            return jsonify({
                "success": False,
                "message":
                    "Razorpay secret is missing"
            }), 500

        # Razorpay signature verification
        message = (
            order_id
            + "|"
            + payment_id
        )

        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(
                "utf-8"
            ),
            message.encode(
                "utf-8"
            ),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(
            generated_signature,
            signature
        ):

            print(
                "RAZORPAY SIGNATURE INVALID"
            )

            return jsonify({
                "success": False,
                "message":
                    "Payment verification failed"
            }), 400

        print()
        print(
            "=========================================="
        )
        print(
            " RAZORPAY PAYMENT VERIFIED"
        )
        print(
            "=========================================="
        )
        print(
            "Order ID:",
            order_id
        )
        print(
            "Payment ID:",
            payment_id
        )
        print(
            "=========================================="
        )
        print()

        return jsonify({
            "success": True,
            "message":
                "Payment verified successfully",
            "razorpay_order_id":
                order_id,
            "razorpay_payment_id":
                payment_id
        })

    except Exception as e:

        print(
            "RAZORPAY VERIFY ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message":
                str(e)
        }), 500


# ==========================================================
# RAZORPAY - TEST AUTHENTICATION
# ==========================================================

@app.route(
    "/api/payment/test",
    methods=["GET"]
)
def test_razorpay():

    try:

        if not razorpay_client:

            return jsonify({
                "success": False,
                "message":
                    "Razorpay client not configured"
            }), 500

        # Small test order.
        test_order = (
            razorpay_client.order.create({
                "amount": 100,
                "currency": "INR",
                "receipt":
                    "test_" +
                    datetime.now().strftime(
                        "%Y%m%d%H%M%S"
                    ),
                "payment_capture": 1
            })
        )

        return jsonify({
            "success": True,
            "message":
                "Razorpay authentication successful",
            "order_id":
                test_order["id"],
            "amount":
                test_order["amount"],
            "currency":
                test_order["currency"]
        })

    except Exception as e:

        print()
        print(
            "=========================================="
        )
        print(
            " RAZORPAY AUTHENTICATION ERROR"
        )
        print(
            "=========================================="
        )
        print(
            repr(e)
        )
        print(
            "=========================================="
        )
        print()

        return jsonify({
            "success": False,
            "message":
                "Razorpay authentication failed",
            "error":
                str(e)
        }), 500


# ==========================================================
# PLACE ORDER
# ==========================================================

@app.route(
    "/api/orders",
    methods=["POST"]
)
def place_order():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message":
                    "No order data received"
            }), 400

        user_id = data.get(
            "user_id"
        )

        items = data.get(
            "items",
            []
        )

        total_amount = data.get(
            "total_amount",
            0
        )

        if not user_id:

            return jsonify({
                "success": False,
                "message":
                    "User ID is required"
            }), 400

        if not items:

            return jsonify({
                "success": False,
                "message":
                    "Cart is empty"
            }), 400

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO orders
            (
                user_id,
                total_amount,
                status
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
        """, (
            user_id,
            total_amount,
            "Placed"
        ))

        order_id = cursor.lastrowid

        for item in items:

            product_id = item.get(
                "product_id",
                item.get("id")
            )

            quantity = item.get(
                "quantity",
                item.get(
                    "cartQuantity",
                    1
                )
            )

            price = item.get(
                "price",
                0
            )

            cursor.execute("""
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s
                )
            """, (
                order_id,
                product_id,
                quantity,
                price
            ))

        conn.commit()

        return jsonify({
            "success": True,
            "message":
                "Order placed successfully",
            "order_id":
                order_id
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "ORDER ERROR:",
            e
        )

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# GET USER ORDERS
# ==========================================================

@app.route(
    "/api/orders/<int:user_id>",
    methods=["GET"]
)
def get_user_orders(user_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                id,
                user_id,
                total_amount,
                status,
                created_at
            FROM orders
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (
            user_id,
        ))

        orders = cursor.fetchall()

        for order in orders:

            order["id"] = int(
                order["id"]
            )

            order["user_id"] = int(
                order["user_id"]
            )

            order["total_amount"] = float(
                order["total_amount"] or 0
            )

            order["created_at"] = json_safe(
                order.get(
                    "created_at"
                )
            )

        return jsonify({
            "success": True,
            "orders": orders
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# GET ORDER ITEMS
# ==========================================================

@app.route(
    "/api/orders/<int:order_id>/items",
    methods=["GET"]
)
def get_order_items(order_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                oi.id,
                oi.order_id,
                oi.product_id,
                oi.quantity,
                oi.price,
                p.name AS product_name
            FROM order_items oi
            LEFT JOIN products p
                ON oi.product_id = p.id
            WHERE oi.order_id = %s
            ORDER BY oi.id ASC
        """, (
            order_id,
        ))

        items = cursor.fetchall()

        for item in items:

            item["id"] = int(
                item["id"]
            )

            item["order_id"] = int(
                item["order_id"]
            )

            if item["product_id"] is not None:
                item["product_id"] = int(
                    item["product_id"]
                )

            item["quantity"] = int(
                item["quantity"]
            )

            item["price"] = float(
                item["price"] or 0
            )

        return jsonify({
            "success": True,
            "items": items
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# GET SINGLE ORDER
# ==========================================================

@app.route(
    "/api/order/<int:order_id>",
    methods=["GET"]
)
def get_single_order(order_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                id,
                user_id,
                total_amount,
                status,
                created_at
            FROM orders
            WHERE id = %s
        """, (
            order_id,
        ))

        order = cursor.fetchone()

        if not order:

            return jsonify({
                "success": False,
                "message":
                    "Order not found"
            }), 404

        order["total_amount"] = float(
            order["total_amount"] or 0
        )

        order["created_at"] = json_safe(
            order.get(
                "created_at"
            )
        )

        cursor.execute("""
            SELECT
                oi.id,
                oi.order_id,
                oi.product_id,
                p.name AS product_name,
                p.category,
                oi.quantity,
                oi.price
            FROM order_items oi
            LEFT JOIN products p
                ON oi.product_id = p.id
            WHERE oi.order_id = %s
            ORDER BY oi.id ASC
        """, (
            order_id,
        ))

        items = cursor.fetchall()

        for item in items:

            if item["price"] is not None:
                item["price"] = float(
                    item["price"]
                )

        return jsonify({
            "success": True,
            "order": order,
            "items": items
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# DASHBOARD STATS
# ==========================================================

@app.route(
    "/api/dashboard/stats/<int:user_id>",
    methods=["GET"]
)
def dashboard_stats(user_id):

    conn = None
    cursor = None

    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                COUNT(*) AS total_products
            FROM products
        """)

        product_result = cursor.fetchone()

        total_products = int(
            product_result[
                "total_products"
            ] or 0
        )

        cursor.execute("""
            SELECT
                COUNT(*) AS total_orders,
                COALESCE(
                    SUM(total_amount),
                    0
                ) AS total_spent
            FROM orders
            WHERE user_id = %s
        """, (
            user_id,
        ))

        order_result = cursor.fetchone()

        total_orders = int(
            order_result[
                "total_orders"
            ] or 0
        )

        total_spent = float(
            order_result[
                "total_spent"
            ] or 0
        )

        return jsonify({
            "success": True,
            "stats": {
                "total_products":
                    total_products,
                "total_orders":
                    total_orders,
                "total_spent":
                    total_spent
            }
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# ADMIN - UPDATE ORDER STATUS
# ==========================================================

@app.route(
    "/api/admin/orders/<int:order_id>/status",
    methods=["PUT"]
)
def admin_update_order_status(order_id):

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message":
                    "No status data received"
            }), 400

        status = data.get(
            "status"
        )

        allowed_statuses = [
            "Placed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ]

        if status not in allowed_statuses:

            return jsonify({
                "success": False,
                "message":
                    "Invalid status"
            }), 400

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("""
            UPDATE orders
            SET status = %s
            WHERE id = %s
        """, (
            status,
            order_id
        ))

        conn.commit()

        if cursor.rowcount == 0:

            return jsonify({
                "success": False,
                "message":
                    "Order not found"
            }), 404

        return jsonify({
            "success": True,
            "message":
                "Order status updated successfully",
            "status":
                status
        })

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ==========================================================
# IMAGE TEST
# ==========================================================

@app.route(
    "/api/image-test"
)
def image_test():

    files = []

    if os.path.exists(
        IMAGES_DIR
    ):

        for filename in os.listdir(
            IMAGES_DIR
        ):

            full_path = os.path.join(
                IMAGES_DIR,
                filename
            )

            if os.path.isfile(
                full_path
            ):

                files.append({
                    "name":
                        filename,
                    "url":
                        "/IMAGES/" +
                        filename,
                    "size":
                        os.path.getsize(
                            full_path
                        )
                })

    return jsonify({
        "success": True,
        "images_directory":
            IMAGES_DIR,
        "files":
            files
    })


# ==========================================================
# START SERVER
# ==========================================================

if __name__ == "__main__":

    print()
    print("==========================================")
    print(" SMART GROCERY FLASK SERVER")
    print("==========================================")
    print("Server:")
    print("http://127.0.0.1:5000")
    print("==========================================")
    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
