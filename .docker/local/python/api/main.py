from fastapi import FastAPI

import api.controller.chatbot

app = FastAPI()


@app.get("/hello")
async def hello():
    answer, docs_by_type, pdf_pages = api.controller.chatbot.answer('Sパラメータ解析のやり方は？')

    # for chunk in stream_answer:
    #     next_text = chunk
    #     print(next_text)

    # docs_by_type = 555555

    print(answer)

    return {
        "answer": answer,
        "docs_by_type": docs_by_type,
        "pdf_pages": pdf_pages,
    }