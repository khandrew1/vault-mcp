import json

import numpy as np
from redis import Redis
from redisvl.index import SearchIndex
from redisvl.query import VectorQuery
from redisvl.query.filter import Tag
from redisvl.utils.vectorize import HFTextVectorizer

class VectorStore:
    def __init__(self, hostname = "redis://localhost:6379", index = "memory"):
        self.schema = {
            "index": {
                "name": index,
                "prefix": f"user_{index}",
            },
            "fields": [
                {
                    "name": "user",
                    "type": "tag"
                },
                {
                    "name": "content",
                    "type": "text"
                },
                {
                    "name": "content_embedding",
                    "type": "vector",
                    "attrs": {
                        "dims": 768,
                        "distance_metric": "cosine",
                        "algorithm": "flat",
                        "datatype": "float64"
                    }
                }
            ]
        }

        client = Redis.from_url(hostname)
        self.index = SearchIndex.from_dict(self.schema, redis_client=client, validate_on_load=True)
        self.index.create(overwrite=True, drop=False)

        self.hf = HFTextVectorizer(model="sentence-transformers/msmarco-distilbert-base-v4")

    def query(self, id: str, sentence: str):
        vector: bytes = self._embed(sentence)
        
        query = VectorQuery(
            vector=vector,
            vector_field_name="content_embedding",
            return_fields=["user", "content"],
            num_results=3,
        )

        query.set_filter(Tag("user") == id)

        return self.index.query(query)
    
    def add(self, user, sentence) -> None:
        data = {
            "user": user,
            "content": sentence,
            "content_embedding": self._embed(sentence)
        }

        self.index.load([data])

    def _seed(self, filename) -> None:
        data = []

        with open(filename, "r") as f:
            contents = json.load(f)

        for content in contents:
            data.append({
                "user": "idn_309aTYWEZUoi8sWqDtTs6rK5e3E",
                "content": content,
                "content_embedding": self._embed(content)
            })

        self.index.load(data)
    
    def _embed(self, sentence: str) -> bytes:
        return np.array(self.hf.embed(sentence), dtype=np.float64).tobytes()
