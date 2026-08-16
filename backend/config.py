
import os
from dotenv import load_dotenv

# Load .env when running locally
load_dotenv()

# ==========================================================
# DATABASE CONFIGURATION
# ==========================================================

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


# ==========================================================
# VALIDATE DATABASE CONFIGURATION
# ==========================================================

required_database_variables = {
    "DB_HOST": DB_HOST,
    "DB_USER": DB_USER,
    "DB_PASSWORD": DB_PASSWORD,
    "DB_NAME": DB_NAME
}

missing_variables = [
    name
    for name, value in required_database_variables.items()
    if not value
]

if missing_variables:
    raise RuntimeError(
        "Missing database environment variables: "
        + ", ".join(missing_variables)
    )


# ==========================================================
# RAZORPAY CONFIGURATION
# ==========================================================

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

