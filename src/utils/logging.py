import logging
import os

def get_logger(name: str = __name__):
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        level=level
    )
    return logging.getLogger(name)
