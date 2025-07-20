import json
from node import VectorStore
import os
from dotenv import load_dotenv

load_dotenv()

def load(filename: str):
    with open(filename, "r") as f:
        return json.load(f)

HOSTNAME = os.getenv("REDIS_HOSTNAME")

context = VectorStore(hostname = HOSTNAME, index = "context")
memory = VectorStore(hostname = HOSTNAME, index = "memory")

context.seed(load("context.json"))
memory.seed(load("memory.json"))