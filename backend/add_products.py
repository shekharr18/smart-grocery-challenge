from database import get_connection

products = [
    ("Apple", "Fruits", 120, 50, "apple.jpg"),
    ("Banana", "Fruits", 60, 50, "banana.png"),
    ("Bread", "Bakery", 40, 30, "bread.jpg"),
    ("Curd", "Dairy", 50, 30, "curd.jpg"),
    ("Eggs", "Dairy", 70, 50, "eggs.jpg"),
    ("Flour", "Grocery", 55, 40, "flour.jpg"),
    ("Milk", "Dairy", 60, 50, "milk.jpg"),
    ("Oil", "Grocery", 150, 30, "oil.jpg"),
    ("Onion", "Vegetables", 40, 50, "onion.jpg"),
    ("Potato", "Vegetables", 35, 50, "potato.jpg"),
    ("Rice", "Grocery", 80, 50, "rice.jpg"),
    ("Salt", "Grocery", 25, 50, "salt.jpg"),
    ("Sugar", "Grocery", 45, 50, "sugar.jpg"),
    ("Tea", "Beverages", 120, 30, "tea.jpg"),
    ("Tomato", "Vegetables", 50, 50, "tomato.jpg")
]

conn = None
cursor = None

try:
    conn = get_connection()
    cursor = conn.cursor()

    print("Connected to Aiven MySQL!")
    print("Adding grocery products...")

    # Clear existing products first
    cursor.execute("DELETE FROM products")

    query = """
        INSERT INTO products
        (name, category, price, quantity, image)
        VALUES (%s, %s, %s, %s, %s)
    """

    cursor.executemany(query, products)

    conn.commit()

    print()
    print("==========================================")
    print(" PRODUCTS ADDED SUCCESSFULLY!")
    print(" Total products:", len(products))
    print("==========================================")

except Exception as e:

    if conn:
        conn.rollback()

    print()
    print("ERROR:")
    print(e)

finally:

    if cursor:
        cursor.close()

    if conn:
        conn.close()