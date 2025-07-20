import json
from redisvl.index import SearchIndex
from redis import Redis
from redisvl.query import VectorQuery
from redisvl.utils.vectorize import HFTextVectorizer
import numpy as np

class VectorStore:
    def __init__(self, hostname = "redis://localhost:6379", index = "context"):
        self.schema = {
            "index": {
                "name": index,
                "prefix": f"user_{index}",
            },
            "fields": [
                {
                    "name": "project",
                    "type": "tag"
                },
                {
                    "name": "user",
                    "type": "tag"
                },
                {
                    "name": "content",
                    "type": "text"
                },
                {
                    "name": "embedding",
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

        self.hf = HFTextVectorizer(model="sentence-transformers/all-mpnet-base-v2")

    def query(self, sentence):
        vector = self._embed(sentence).tobytes()
        
        query = VectorQuery(
            vector=vector,
            vector_field_name="embedding",
            return_fields=["project", "user", "content"],
            num_results=3
        )

        return self.index.query(query)
    
    def add(self, project, user, sentence):
        data = {
            "project": project,
            "user": user,
            "content": sentence,
            'embedding': self._embed(sentence).tobytes()
        }

        self.index.load([data])

    def seed(self, filename):
        data = []

        with open(filename, "r") as f:
            contents = json.load(f)

        for content in contents:
            data.append({
                "project": "sample_project",
                "user": "jane_doe",
                "content": content,
                "embedding": self._embed(content).tobytes()
            })

        self.index.load(data)
    
    def _embed(self, sentence: str):
        return np.array(self.hf.embed(sentence), dtype=np.float64)