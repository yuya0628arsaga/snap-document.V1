from fastapi import FastAPI, HTTPException

import api.controller.chatbot

app = FastAPI()


@app.get("/hello")
async def hello():

    try:
        # answer, docs_by_type, pdf_pages = api.controller.chatbot.answer('Sパラメータ解析のやり方は？')
        answer, docs_by_type, pdf_pages = ('ChatGPTに読ませて質問をする、と書きました。どのようにそれを実現するのかという説明から始めていきましょう。\
                                              ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。\
                                              そのため、以下に示す流れで、PDFのデータをDBに格納し、その中から質問に関連する内容を取り出してPromptに埋め込むことで、ChatGPTがその知識を前提条件として利用しつつ質問に答えることを可能にしましょう。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。ChatGPTは2109までのデータで学習が行われた人工知能です。そのため、最近起こった出来事や、わたしたちが読ませるPDFの内容については知識を持っていないことが多いです。もちろん、あなたが読ませるPDFがChatGPTの学習に使われてたなら、ChatGPTがその内容を知っている可能性はありますが…。dsds', 'python根拠', [1, 2 , 3])
        print(answer)

        # raise HTTPException(status_code=404, detail="python エラー")
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




# from api.models.chatbot_engine_2 import ChatbotEngine2
import chromadb
from chromadb.config import Settings
import os
from chromadb.utils import embedding_functions
from api.models.s3 import S3
import uuid
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema.document import Document

@app.get("/test")
async def test():

    client = chromadb.PersistentClient(path="./chromadb_data")

    # openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    #     api_key='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',
    #     model_name="text-embedding-ada-002"
    # )


    collection = client.create_collection(name="langchain", embedding_function=CustomOpenAIEmbeddings(
        openai_api_key="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"
    ))
    # collection = client.create_collection(name="langchain")

    texts = S3().get_pdf_text('Man_Digest_v9')

    doc_ids = [str(uuid.uuid4()) for _ in texts]

    id_key='doc_id'
    documents = []
    for i, s in enumerate(texts):
        documents.append({'content': s, 'metadata': {id_key: doc_ids[i]}})
        # documents.append(Document(page_content=s, metadata={id_key: doc_ids[i]}))


    metadatas = []
    for i, s in enumerate(texts):
        metadatas.append({id_key: doc_ids[i]})

    print(metadatas)
    print(doc_ids)

    collection.add(
        documents=texts,
        metadatas=metadatas,
        ids=doc_ids
    )

    # chunk_size = 10
    # for i in range(0, len(documents), chunk_size):
    #     chunk_docs = documents[i:i + chunk_size]
    #     chunk_ids = doc_ids[i:i + chunk_size]
    #     content_list = [d['content'] for d in chunk_docs]
    #     metadata_list = [d['metadata'] for d in chunk_docs]
    #     print(f"Adding chunk: {i // chunk_size + 1}")
    #     collection.add(documents=content_list, metadatas=metadata_list, ids=chunk_ids)



    # client = chromadb.Client()
    # # collection = client.create_collection(name="langchain")
    # collection = client.get_collection(name="langchain")
    # results = collection.query(
    #     query_texts=["解析"],
    #     n_results=2
    # )

    return '保存成功'

@app.get("/test2")
async def test():
    # client = chromadb.Client()
    client = chromadb.PersistentClient(path="./chromadb_data")
    # collection = client.create_collection(name="langchain")
    # collection = client.get_collection(name="langchain", embedding_function=OpenAIEmbeddings())
    collection = client.get_collection(name="langchain", embedding_function=CustomOpenAIEmbeddings(
        openai_api_key=""
    ))
    # collection = client.get_collection(name="langchain")
    results = collection.query(
        # query_texts=["Sパラメータ解析"],
        query_texts=["SPICEモデルはどこのフォルダに入れればいいですか？"],
        n_results=2
    )
    return results



class CustomOpenAIEmbeddings(OpenAIEmbeddings):

    def __init__(self, openai_api_key, *args, **kwargs):
        super().__init__(openai_api_key=openai_api_key, *args, **kwargs)

    def _embed_documents(self, texts):
        embeddings = [
            self.client.create(input=text, model="text-embedding-ada-002").data[0].embedding
            for text in texts
        ]
        return embeddings

    def __call__(self, input):
        return self._embed_documents(input)