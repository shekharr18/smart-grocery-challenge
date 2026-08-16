from database import get_connection

conn = None
cursor = None

try:
    conn = get_connection()
    cursor = conn.cursor()

    print("Connected to Aiven MySQL!")
    print("Creating tables...")

    # USERS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    """)

    print("users table OK")

    # PRODUCTS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            quantity INT NOT NULL DEFAULT 0,
            image VARCHAR(500)
        )
    """)

    print("products table OK")

    # ORDERS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            status VARCHAR(50) NOT NULL DEFAULT 'Placed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    print("orders table OK")

    # ORDER ITEMS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            price DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id)
                REFERENCES orders(id)
                ON DELETE CASCADE,
            FOREIGN KEY (product_id)
                REFERENCES products(id)
        )
    """)

    print("order_items table OK")

    conn.commit()

    print()
    print("==========================================")
    print(" ALL TABLES CREATED SUCCESSFULLY!")
    print("==========================================")

except Exception as e:

    if conn:
        conn.rollback()

    print()
    print("==========================================")
    print(" ERROR")
    print("==========================================")
    print(e)

finally:

    if cursor:
        cursor.close()

    if conn:
        conn.close()