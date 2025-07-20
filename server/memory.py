from __future__ import annotations

from pydantic import Field
from enrichmcp.entity import EnrichModel

class MemoryNote(EnrichModel):
    """A single note entry.

    Parameters
    ----------
    id:
        Unique identifier for the note. ``MemoryStore`` implementations
        generate this value when a note is created.
    title:
        Short title summarizing the note.
    content:
        The full body of the note.
    """

    id: str = Field(description="Unique note identifier")
    title: str = Field(description="Note title")
    content: str = Field(description="Note content")

class ChatContextSummary(EnrichModel):
    """A summary of an LLM chat conversation context.

    This model captures the essential information from a chat session
    that can be retrieved later to provide context to future conversations.
    The summary is designed to be concise yet comprehensive enough for
    an LLM to understand the key discussion points and outcomes.

    Parameters
    ----------
    id:
        Unique identifier for the chat context summary.
    title:
        Brief title describing the main topic or purpose of the conversation.
    summary:
        Paragraph summary highlighting the key points, decisions, and outcomes
        from the chat conversation. Should be concise but comprehensive.
    key_topics:
        List of main topics or themes discussed in the conversation.
    """

    id: str = Field(description="Unique chat context summary identifier")
    title: str = Field(description="Brief title describing the conversation topic")
    summary: str = Field(description="Paragraph summary of key points, decisions, and outcomes")
    key_topics: list[str] = Field(default_factory=list, description="Main topics discussed")