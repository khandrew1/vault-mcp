import logging
import os
import sys

from dotenv import load_dotenv
from dvs.vectorstore import VectorStore
from enrichmcp import EnrichMCP
from memory import MemoryNote, VectorMemoryStore

load_dotenv()

# supress logging from stdio
logging.getLogger("huggingface_hub").setLevel(logging.WARNING)
logging.getLogger("redis").setLevel(logging.WARNING)
logging.getLogger("redisvl").setLevel(logging.WARNING)
logging.getLogger("sentence_transformers").setLevel(logging.WARNING)

user = os.getenv("VAULT_API_KEY", "default")
hostname = os.getenv("REDIS_HOSTNAME", "localhost")
app = EnrichMCP(title="vault-mcp", description="An MCP to save and load context and memories")

store = VectorStore(hostname, "memory")
memory_store = VectorMemoryStore(user, store)

@app.entity
class Note(MemoryNote):
    """A note stored in the memory_vector_store"""

@app.create
async def create_note(
    content: str,
) -> Note:
    """
    Create a new note in the memory vector store

    This should be used whenever something useful about a user is learned.
    Remember useful details and summarize them in a short sentence. This call is relevant
    in all conversations.
    """
    note = memory_store.save(content)
    return Note.model_validate(note.model_dump())

@app.retrieve
async def get_note(query: str) -> list[Note]:
    """
    Search for notes in the memory vector store based on a query

    This should be used whenever something should be remembered in this or
    a previous converstaion. You will recieve at most three results.
    """
    results = memory_store.query(query)
    return [Note.model_validate(note.model_dump()) for note in results]

if __name__ == "__main__":
    app.run()
