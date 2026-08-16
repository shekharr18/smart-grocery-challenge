import pymysql
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

def create_tables():
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with connection.cursor() as cursor:
            # Drop the old users table if it exists so we can recreate it with the correct columns
            cursor.execute("DROP TABLE IF EXISTS users;")
            
            # Create users table with all required fields including 'fullname'
            cursor.execute("""
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    fullname VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                );
            """)
            print("Tables created successfully in Aiven database!")
        connection.commit()
    finally:
        connection.close()

if __name__ == "__main__":
    create_tables()