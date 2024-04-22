from fastapi import APIRouter, HTTPException

from api.schemas.chat import Chat
from api.services.chat_engine import ChatEngine


router = APIRouter()


@router.post("/chat/answer")
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

    except HTTPException as e:
        # raise HTTPException(status_code=404, detail="python エラー")
        print(e)
        return {
            "status": e.status_code,
            "message": e.detail,
            "errors": e,
        }

    except Exception as e:
        print(e)
        return {
            "status": 500,
            "message": "gpt_engine Internal Server Error",
            "errors": e,
        }

# サンプルデータを返却
@router.post("/test3")
async def test3(chat: Chat):

    result = {
        "answer": "Sパラメータ解析を実行するには、まず図33のSパラメータ解析設定画面で解析を設定します。その後、解析実行ボタンを押して解析を開始します。解析が進むにつれてログダイアローグに途中経過が表示されます。解析が完了すると、図19のようにS11特性が表示されます。解析が終了したら、解析ボタンを押してください。",
        "source_documents": ""
    }
    from api.services.chat_engine import ChatEngine
    base64_images = ChatEngine()._get_images(result["answer"])
    pdf_pages = [1, 2, 3]
    return {
            "status": 200,
            "answer": result["answer"],
            "source_documents": result["source_documents"],
            "base64_images": base64_images,
            "pdf_pages": pdf_pages,
            "token_counts": {
                'prompt_tokens': 6,
                'completion_tokens': 28,
            },
            "cost": 0.00628
    }