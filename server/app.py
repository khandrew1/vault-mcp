import os

from enrichmcp import EnrichMCP
from dvs.vectorstore import VectorStore
from dvs.db import Database
from memory import (
    MemoryNote, 
    ContextSummary,
    MemoryVectorStore,
    ContextVectorStore,
)

from typing import List
from dotenv import load_dotenv

load_dotenv()

db = Database(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=os.getenv("REDIS_PORT", "6379"),
    password=os.getenv("REDIS_PASSWORD", "password")
)
user = os.getenv("VAULT_API_KEY", "default")
app = EnrichMCP(title="vault-mcp", description="An MCP to save and load context and memories")

memory_vector_store = MemoryVectorStore(user=user, vector_store=VectorStore(hostname=os.getenv("REDIS_HOSTNAME", "default"), index="memory"))
context_vector_store = ContextVectorStore(user=user, vector_store=VectorStore(hostname=os.getenv("REDIS_HOSTNAME", "default"), index="context"))

@app.entity
class Note(MemoryNote):
    """A note stored in the memory_vector_store"""

@app.entity
class Context(ContextSummary):
    """A context summary stored in the context_vector_store"""

@app.retrieve
async def get_all_projects() -> List[str]:
    """Retrieve all projects from the memory vector store"""
    return db.get_all_projects(user)

@app.create
async def create_note(
    title: str,
    content: str,
    project: str
) -> Note:
    """Create a new note in the memory vector store

    This should be used whenever something useful about a user is learned.
    Remember useful details and summarize them in a short sentence. This call is relevant
    in all conversations.

    Projects are used to group notes together, run `get_all_projects` FIRST
    in order to see the best fit. If nothing fits, create a new project.
    """
    note = Note(title=title, content=content)
    memory_vector_store.save(project, note) 
    return Note.model_validate(note.model_dump())

@app.retrieve
async def get_note(query: str) -> Note | None:
    """Search for notes in the memory vector store based on a query."""
    results = memory_project.get_note(query=query)
    if results:
        return Note.model_validate(results[0].model_dump())
    return None

if __name__ == "__main__":
    app.run()