from vectorstore import VectorStore
import os
from dotenv import load_dotenv

load_dotenv()

HOSTNAME = os.getenv("REDIS_HOSTNAME")

context = VectorStore(hostname = HOSTNAME, index = "context")
memory = VectorStore(hostname = HOSTNAME, index = "memory")

context.seed("context.json")
memory.seed("memory.json")