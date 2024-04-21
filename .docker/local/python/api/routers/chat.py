from fastapi import APIRouter

from api.schemas.chat import Chat
from api.services.chat_engine import ChatEngine


router = APIRouter()


@router.post("/answer")
async def answer(chat: Chat):
    try:
        params = chat.dict()
        data = ChatEngine().get_answer(
            params['question'],
            params['document_name'],
            params['chat_history']
        )

        return {
            "status": 200,
            **data,
        }

    except Exception as e:
        print(e)

        return {
            "status": 500,
            "message": "gpt_engine Internal Server Error",
            "errors": e,
        }
