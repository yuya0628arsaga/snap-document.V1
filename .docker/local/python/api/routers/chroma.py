from fastapi import APIRouter

from api.services.chroma_engine import ChromaEngine
from api.schemas.chroma import StoreChroma


router = APIRouter()


@router.post("/chroma")
async def store(store_chroma: StoreChroma):
    params = store_chroma.dict()
    document_name = params['document_name']

    try:
        success_message = ChromaEngine().store(document_name)

        return {
            "status": 200,
            "message": success_message,
        }

    except Exception as e:
        print(e)

        return {
            "status": 500,
            "message": "gpt_engine Internal Server Error",
            "errors": e,
        }
