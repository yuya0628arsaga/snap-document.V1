from pydantic import BaseModel


class Chat(BaseModel):
    question: str
    document_name: str
    chat_history: list
    is_get_pdf_page: bool

class GetImagesParams(BaseModel):
    answer: str