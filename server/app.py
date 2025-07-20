import os

from enrichmcp import EnrichMCP
from dvs.vectorstore import VectorStore
from dvs.db import Database
from memory import (
    MemoryNote, 
    ContextSummary,
    MemoryVectorStore,
    MemoryProject,
    ContextVectorStore,
    ContextProject,
)

from dotenv import load_dotenv

load_dotenv()

db = Database(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=os.getenv("REDIS_PORT", "6379"),
    password=os.getenv("REDIS_PASSWORD", "password")
)
app = EnrichMCP(title="vault-mcp", description="An MCP to save and load context and memories")

memory_vector_store = MemoryVectorStore(user="default", vector_store=VectorStore(hostname=os.getenv("REDIS_HOSTNAME", "default"), index="memory"))
memory_project = MemoryProject(name="default", store=memory_vector_store)

context_vector_store = ContextVectorStore(user="default", vector_store=VectorStore(hostname=os.getenv("REDIS_HOSTNAME", "default"), index="context"))
context_project = ContextProject(name="default", store=context_vector_store)

@app.entity
class Note(MemoryNote):
    """A note stored in the memory_vector_store"""

@app.entity
class Context(ContextSummary):
    """A context summary stored in the context_vector_store"""

@app.create
async def create_note(
    title: str,
    content: str
) -> Note:
    """Create a new note in the memory vector store
    
    This should be used whenever something useful about a user is learned.
    Remember useful details and summarize them in a short sentence. This call is relevant
    in all conversations.
    """
    note = memory_project.add_note(title=title, content=content) 
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