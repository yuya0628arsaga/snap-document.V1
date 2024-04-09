from fastapi import FastAPI, HTTPException

import api.controller.chatbot

app = FastAPI()


@app.get("/hello")
async def hello():

    try:
        # answer, docs_by_type, pdf_pages = api.controller.chatbot.answer('Sパラメータ解析のやり方は？')
        answer, docs_by_type, pdf_pages = ('python回答', 'python根拠', [1, 2 , 3])
        print(answer)

        raise HTTPException(status_code=404, detail="python エラー")
        # raise TypeError(detail="Typeエラーだよ")

        return {
            "status": 200,
            "answer": answer,
            "docs_by_type": docs_by_type,
            "pdf_pages": pdf_pages,
        }

    except HTTPException as e:
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