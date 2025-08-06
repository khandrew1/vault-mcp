from dvs.vectorstore import VectorStore
import os
from dotenv import load_dotenv

load_dotenv()

HOSTNAME = os.getenv("REDIS_HOSTNAME")

memory = VectorStore(hostname = HOSTNAME, index = "memory")

memory._seed("dvs/__mock__/memory.json")
