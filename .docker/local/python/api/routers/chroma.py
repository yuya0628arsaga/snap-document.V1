from fastapi import APIRouter

from api.services.chroma_engine import ChromaEngine


router = APIRouter()


@router.get("/chroma/store")
async def store():
    document_name = 'Man_Digest_v9'

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
