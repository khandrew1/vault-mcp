from dotenv import load_dotenv
import os
from redisvl.index import SearchIndex
from redis import Redis
from redisvl.query import VectorQuery
from redisvl.utils.vectorize import HFTextVectorizer

load_dotenv()

class VectorStore:
    def __init__(self, hostname = "redis://localhost:6379", index = "context"):
        self.schema = {
            "index": {
                "name": index,
                "prefix": f"user_{index}",
            },
            "fields": [
                {
                    "name": "content",
                    "type": "text"
                },
                {
                    "name": "embedding",
                    "type": "vector",
                    "attrs": {
                        "dims": 784,
                        "distance_metric": "cosine",
                        "algorithm": "flat",
                        "datatype": "float32"
                    }
                }
            ]
        }

        client = Redis.from_url(hostname)
        self.index = SearchIndex.from_dict(self.schema, redis_client=client, validate_on_load=True)
        self.index.create(overwrite=True, drop=False)

        self.hf = HFTextVectorizer(model="sentence-transformers/all-MiniLM-L6-v2")

    def query(self, sentence):
        vector = self._embed(sentence)

        query = VectorQuery(
            vector=vector,
            vector_field_name="embedding",
            return_fields=["content"],
            num_results=3
        )

        return self.index.query(query)
    
    def add(self, sentence):
        data = {
            "content": sentence,
            'embedding': self._embed(sentence)
        }

        self.index.load([data])

    def seed(self, data):
        self.index.load(data)
    
    def _embed(self, sentence: str):
        return self.hf.embed(sentence)