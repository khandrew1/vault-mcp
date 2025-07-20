import os
import sys

# Add parent directory to Python path to import dvs module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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

import logging
import sys

# Send all logging to stderr, and raise the level so INFO/DEBUG don’t go to stdout
logging.basicConfig(stream=sys.stderr, level=logging.WARNING)

# Silence redis‑py’s own loggers
logging.getLogger("redis").setLevel(logging.ERROR)
logging.getLogger("redis.cluster").setLevel(logging.ERROR)

# If redisvl has its own logger namespace, silence that too:
logging.getLogger("redisvl").setLevel(logging.ERROR)

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
async def get_all_projects():
    """Retrieve all projects from the memory vector store"""
    return { "projects": db.get_all_projects(user) }

@app.create
async def create_note(
    title: str,
    content: str,
    project: str = "general"
) -> Note:
    """Create a new note in the memory vector store

    This should be used whenever something useful about a user is learned.
    Remember useful details and summarize them in a short sentence. This call is relevant
    in all conversations.

    Projects are used to group notes together, run `get_all_projects` FIRST
    in order to see the best fit. If nothing fits, create a new project.
    If no project is specified, it will default to 'general'.
    """
    note = Note(title=title, content=content)
    memory_vector_store.save(project, note) 
    return Note.model_validate(note.model_dump())

@app.retrieve
async def get_note(query: str) -> Note | None:
    """Search for notes in the memory vector store based on a query."""
    results = memory_vector_store.search("general", query=query)
    if results:
        return {"content": results[0].content, "title": results[0].title}
    return None

@app.create
async def create_context(
    title: str,
    summary: str,
    project: str = "general"
) -> Context:
    """Create a new context summary in the context vector store

    This should be used to save important conversation context that can be
    retrieved later to provide background for future conversations. This tool
    should only be called specifically when the user asks to save context.
    
    Projects are used to group context summaries together, run `get_all_projects` FIRST
    in order to see the best fit. If nothing fits, create a new project.
    If no project is specified, it will default to 'general'.
    """
    context = Context(title=title, summary=summary)
    context_vector_store.save(project, context)
    return Context.model_validate(context.model_dump())

@app.retrieve
async def get_context(query: str, project: str = "general") -> Context | None:
    """Search for context summaries in the context vector store based on a query."""
    results = context_vector_store.search(project, query=query)
    if results:
        # Parse the content back into title and summary
        content = results[0].content
        if ": " in content:
            title, summary = content.split(": ", 1)
            return {"title": title, "summary": summary}
        else:
            return {"title": "Context", "summary": content}
    return None

if __name__ == "__main__":
    app.run()