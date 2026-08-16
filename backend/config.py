import os
from dotenv import load_dotenv

# ==========================================================
# LOAD .ENV FILE
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ENV_FILE = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_FILE)


# ==========================================================
# MYSQL / AIVEN DATABASE CONFIGURATION
# ==========================================================

DB_HOST = os.getenv("DB_HOST", "localhost")

DB_PORT = int(
    os.getenv("DB_PORT", "3306")
)

DB_USER = os.getenv(
    "DB_USER",
    "root"
)

DB_PASSWORD = os.getenv(
    "DB_PASSWORD",
    ""
)

DB_NAME = os.getenv(
    "DB_NAME",
    "smart_grocery"
)


# ==========================================================
# RAZORPAY CONFIGURATION
# ==========================================================

RAZORPAY_KEY_ID = os.getenv(
    "RAZORPAY_KEY_ID",
    ""
)

RAZORPAY_KEY_SECRET = os.getenv(
    "RAZORPAY_KEY_SECRET",
    ""
)


# ==========================================================
# FLASK CONFIGURATION
# ==========================================================

FLASK_ENV = os.getenv(
    "FLASK_ENV",
    "production"
)

PORT = int(
    os.getenv("PORT", "5000")
)


# ==========================================================
# DEBUG INFORMATION
# ==========================================================

print("==========================================")
print(" SMART GROCERY CONFIGURATION")
print("==========================================")
print("DB HOST       :", DB_HOST)
print("DB PORT       :", DB_PORT)
print("DB USER       :", DB_USER)
print("DB NAME       :", DB_NAME)

print(
    "RAZORPAY KEY  :",
    "SET" if RAZORPAY_KEY_ID else "NOT SET"
)

print(
    "RAZORPAY SECRET:",
    "SET" if RAZORPAY_KEY_SECRET else "NOT SET"
)

print("FLASK ENV     :", FLASK_ENV)
print("PORT          :", PORT)
print("==========================================")