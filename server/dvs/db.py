import redis
from redis.commands.search.field import TextField, NumericField, TagField
from redis.commands.search.index_definition import IndexDefinition, IndexType
from redis.commands.search.query import Query
import time
import json

class Database:
    def __init__(self, host = "redis://localhost", port = "6379", password = "password"):
        self.r = redis.Redis(
            host=host, port=port,
            username="default",
            password=password
        )

        schema = (
            TextField("id"),
            TextField("name"),
            TagField("projects"),
            NumericField("createdAt")
        )

        self.r.ft("vault:users").dropindex(delete_documents=False)

        self.r.ft("vault:users").create_index(
            schema,
            definition=IndexDefinition(
                prefix=["user:"], index_type=IndexType.HASH
            )
        )

    def get_user(self, id): 
        result = self.r.ft("vault:users").search(Query(f'@id:{id}'))
        
        if result.docs:
            doc = result.docs[0]

            return {
                "id": doc.id,
                "name": doc.name,
                "projects": doc.projects.split(","),
                "createdAt": doc.createdAt
            }
        
        else:
            return {}
    
    def add_user(self, user):
        id = user["id"]

        data = {
            **user,
            "projects": ",".join(user["projects"]),
            "createdAt": int(time.time())
        }

        self.r.hset(f"user:{id}", mapping=data)

    def get_all_projects(self, id):
        result = self.r.ft("vault:users").search(Query(f'@id:{id}'))
        
        if result.docs:
            doc = result.docs[0]

            return doc.projects.split(",")
        
        else:
            return []

    def seed(self, filename):
        with open(filename, "r") as f:
            contents = json.load(f)

        for content in contents:
            self.add_user(content)