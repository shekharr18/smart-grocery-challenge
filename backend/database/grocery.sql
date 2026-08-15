-- =========================================
-- SMART GROCERY CHALLENGE DATABASE
-- =========================================

USE smart_grocery;


-- =========================================
-- 1. USERS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 2. PRODUCTS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 3. CART TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


-- =========================================
-- 4. GROCERY CHALLENGE TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    budget DECIMAL(10,2) NOT NULL DEFAULT 2000.00,
    spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    remaining DECIMAL(10,2) NOT NULL DEFAULT 2000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================
-- 5. SAMPLE PRODUCTS
-- =========================================

INSERT INTO products (name, category, price, quantity, image)
VALUES
('Rice 5kg', 'Grains', 350.00, 1, 'rice.jpg'),
('Wheat Flour 5kg', 'Grains', 280.00, 1, 'wheat.jpg'),
('Milk 1L', 'Dairy', 60.00, 1, 'milk.jpg'),
('Bread', 'Bakery', 45.00, 1, 'bread.jpg'),
('Eggs 12 Pack', 'Dairy', 90.00, 1, 'eggs.jpg'),
('Apples 1kg', 'Fruits', 150.00, 1, 'apple.jpg'),
('Bananas 1kg', 'Fruits', 60.00, 1, 'banana.jpg'),
('Tomatoes 1kg', 'Vegetables', 50.00, 1, 'tomato.jpg'),
('Potatoes 1kg', 'Vegetables', 40.00, 1, 'potato.jpg'),
('Cooking Oil 1L', 'Cooking', 140.00, 1, 'oil.jpg');