from abc import ABC, abstractmethod
from typing import Any
from pydantic import Field
from enrichmcp.entity import EnrichModel
from dvs.vectorstore import VectorStore

class MemoryNote(EnrichModel):
    """A single note entry.

    Parameters
    ----------
    content:
        The full content of the memory.
    """

    content: str = Field(description="Note content")

class MemoryStore(ABC):
    """Abstract base class for memory note store"""

    @abstractmethod
    def save(self, note: MemoryNote) -> MemoryNote:
        """Save a new note"""

    @abstractmethod
    def query(self, query: str) -> list[MemoryNote]:
        """Search for notes based on a query."""

class VectorMemoryStore(MemoryStore):
    def __init__(self, user: str, store: VectorStore) -> None:
        self.user = user
        self.store = store

    def save(self, content: str) -> MemoryNote:
        note = MemoryNote(
            content=content
        )
        self.store.add(self.user, note.content)

        return note

    def query(self, query: str) -> list[MemoryNote]:
        results = self.store.query(self.user, query)
        return [MemoryNote(content=doc['content']) for doc in results]
