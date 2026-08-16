
import mysql.connector
from mysql.connector import Error

from config import (
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
)


def get_connection():
    """
    Create and return a MySQL connection.

    Works with Aiven MySQL using SSL.
    """

    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            port=int(DB_PORT),
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,

            # Aiven requires encrypted connection
            ssl_disabled=False
        )

        if connection.is_connected():
            return connection

        raise Exception("MySQL connection could not be established")

    except Error as e:
        print("MYSQL CONNECTION ERROR:", e)
        raise
