from abc import ABC, abstractmethod
from typing import Any
from pydantic import Field
from enrichmcp.entity import EnrichModel
from vectorstore import VectorStore

class MemoryNote(EnrichModel):
    """A single note entry.

    Parameters
    ----------
    title:
        Short title summarizing the note.
    content:
        The full body of the note.
    """

    title: str = Field(description="Note title")
    content: str = Field(description="Note content")

class ContextSummary(EnrichModel):
    """A summary of an LLM chat conversation context.

    This model captures the essential information from a chat session
    that can be retrieved later to provide context to future conversations.
    The summary is designed to be concise yet comprehensive enough for
    an LLM to understand the key discussion points and outcomes.

    Parameters
    ----------
    title:
        Brief title describing the main topic or purpose of the conversation.
    summary:
        Paragraph summary highlighting the key points, decisions, and outcomes
        from the chat conversation. Should be concise but comprehensive.
    """

    title: str = Field(description="Brief title describing the conversation topic")
    summary: str = Field(description="Paragraph summary of key points, decisions, and outcomes")

class MemoryStore(ABC):
    """Abstract base class for memory note store"""

    @abstractmethod
    def save(self, project: str, note: MemoryNote) -> None:
        """Save a new note under a specific project."""

    @abstractmethod
    def search(self, project: str, query: str) -> Any:
        """Search for notes under a specific project based on a query."""

class ContextStore(ABC):
    """Abstract base class for context summary store"""

    @abstractmethod
    def save(self, project: str, context: ContextSummary) -> None:
        """Save a new context summary under a specific project."""

    @abstractmethod
    def search(self, project: str, query: str) -> Any:
        """Search for context summaries under a specific project based on a query."""

class MemoryVectorStore(MemoryStore):
    """Concrete implementation of a memory store using a vector database."""

    def __init__(self, user: str, vector_store: VectorStore):
        self.vector_store = vector_store
        self.user = user

    def save(self, project: str, note: MemoryNote) -> None:
        """Save a new note in the vector store."""
        self.vector_store.add(project=project, user=self.user, sentence=note.content)

    def search(self, project: str, query: str):
        """Search for notes based on a query."""
        return self.vector_store.query(query)

class ContextVectorStore(ContextStore):
    """Concrete implementation of a context store using a vector database."""

    def __init__(self, user: str, vector_store: VectorStore):
        self.vector_store = vector_store
        self.user = user

    def save(self, project: str, context: ContextSummary) -> None:
        """Save a new context summary in the vector store."""
        # Combine title and summary for better searchability
        content = f"{context.title}: {context.summary}"
        self.vector_store.add(project=project, user=self.user, sentence=content)

    def search(self, project: str, query: str):
        """Search for context summaries based on a query."""
        return self.vector_store.query(query)
