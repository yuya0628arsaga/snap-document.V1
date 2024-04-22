from pydantic import BaseModel


class Chat(BaseModel):
    question: str
    document_name: str
    chat_history: list