import logging
import os

from dotenv import load_dotenv
from dvs.vectorstore import VectorStore

load_dotenv()

logging.getLogger("redis").setLevel(logging.WARNING)
logging.getLogger("redisvl").setLevel(logging.WARNING)
logging.getLogger("sentence_transformers").setLevel(logging.WARNING)

HOSTNAME = os.getenv("REDIS_HOSTNAME")
USERNAME = os.getenv("VAULT_API_KEY")

memory = VectorStore(hostname = HOSTNAME, index = "memory")

memory.query(USERNAME, "what do i love?")
