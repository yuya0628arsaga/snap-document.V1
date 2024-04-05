from fastapi import FastAPI

import api.controller.chatbot

app = FastAPI()


@app.get("/hello")
async def hello():
    main = api.controller.chatbot.answer('Sパラメータ解析のやり方は？')
    stream_answer, docs_by_type, pdf_pages = next(main)
    return {"message": docs_by_type}