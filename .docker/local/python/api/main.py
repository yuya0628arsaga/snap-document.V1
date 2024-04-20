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
from api.models.s3 import S3
import uuid
# from langchain.embeddings import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
import settings

MANUAL = 'Man_Digest_v9'


@app.get("/test")
async def test():
    """ChromaDB にドキュメントのベクトルデータを永久保存する
    """

    # client = chromadb.PersistentClient(path=f"./chromadb_data/{MANUAL}")
    client = chromadb.PersistentClient(path=f"./chromadb_datas/{MANUAL}")

    # openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    #     api_key='',
    #     model_name="text-embedding-ada-002"
    # )


    collection = client.create_collection(name="langchain", embedding_function=CustomOpenAIEmbeddings(
        openai_api_key=settings.OPENAI_API_KEY
    ))
    # collection = client.create_collection(name="langchain")

    texts = S3().get_pdf_text(MANUAL)

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

    # collection.add(
    #     documents=texts,
    #     metadatas=metadatas,
    #     ids=doc_ids
    # )

    # 100個ずつ保存
    chunk_size = 100
    for i in range(0, len(documents), chunk_size):
        chunk_docs = documents[i:i + chunk_size]
        chunk_ids = doc_ids[i:i + chunk_size]
        content_list = [d['content'] for d in chunk_docs]
        metadata_list = [d['metadata'] for d in chunk_docs]
        print(f"Adding chunk: {i // chunk_size + 1}")
        collection.add(documents=content_list, metadatas=metadata_list, ids=chunk_ids)


    return '保存成功'



from pydantic import BaseModel
from typing import Union

class Chat(BaseModel):
    question: str
    document_name: str
    chat_history: list


# from api.models.rag_2 import Rag_2
# from langchain.vectorstores import Chroma
from langchain_community.vectorstores import Chroma
# from langchain.chat_models import ChatOpenAI
from langchain_openai import ChatOpenAI

from langchain.prompts import PromptTemplate
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT

# Q&A用Chain
from langchain.chains import ConversationalRetrievalChain
from langchain.chains import LLMChain
from langchain.chains.question_answering import load_qa_chain

from api.services.pdf_helper import PdfHelper

@app.post("/test2")
async def test(chat: Chat):

    GPT_MODEL = 'gpt-3.5-turbo'
    # question = '回路シミュレーションでSパラメータ解析はどのように実行すればいいですか？'
    # question = 'SPICEモデルはどこのフォルダに入れればいいですか？'
    question = chat.dict()['question']
    document_name = chat.dict()['document_name']
    chat_history = chat.dict()['chat_history']

    chat_history = [tuple(history) for history in chat_history]


    # Question generator （質問・履歴を投げる段階）で投げるプロンプトの作成
    # デフォルトでは CONDENSE_QUESTION_PROMPT が使われる
    template_qg = \
    """
    次の会話に対しフォローアップの質問があるので、フォローアップの質問を独立した質問に言い換えなさい。

    チャットの履歴:
    {chat_history}

    フォローアップの質問:
    {question}

    言い換えられた独立した質問:
    """

    prompt_qg = PromptTemplate(
            template=template_qg,
            input_variables=["chat_history", "question"],
            output_parser=None,
            partial_variables={},
            template_format='f-string',
            validate_template=True,
    )



    # QA の最終質問のプロンプト
    # 次の文脈を使用して、最後の質問に答えてください。答えがわからない場合は、答えをでっち上げようとせず、わからないと言ってください。
    prompt_template_qa = """You are a helpful assistant. Please answer in Japanese! If the context is not relevant, please answer the question by using your own knowledge about the topic.

    {context}

    Question: {question}
    Answer in Japanese:"""

    prompt_qa = PromptTemplate(
            template=prompt_template_qa,
            input_variables=["context", "question"]
    )
    chain_type_kwargs = {"prompt": prompt_qa}





    vectordb = Chroma(
        persist_directory=f"./chromadb_datas/{document_name}",
        embedding_function=CustomOpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
    )

    retriever = vectordb.as_retriever()
    # retriever.search_kwargs["distance_metric"] = "cos"
    # retriever.search_kwargs["fetch_k"] = 100
    # retriever.search_kwargs["maximal_marginal_relevance"] = True
    # retriever.search_kwargs["k"] = 7

    LLM = ChatOpenAI(
        model=GPT_MODEL,
        max_tokens=1024,
        temperature=0,
    )



    question_generator = LLMChain(llm=LLM, prompt=prompt_qg)
    # question_generator = LLMChain(llm=LLM, prompt=CONDENSE_QUESTION_PROMPT)  # デフォルトのプロント使いたかったらこう書く

    doc_chain = load_qa_chain(llm=LLM, chain_type="stuff", prompt=prompt_qa)

    qa = ConversationalRetrievalChain(
            retriever=retriever,
            question_generator=question_generator,
            combine_docs_chain=doc_chain,
            return_source_documents=True,
    )



    # return_source_documents=True でソースも取得
    #### qa = ConversationalRetrievalChain.from_llm(LLM, retriever=retriever, return_source_documents=True)


    # ベクトル間の距離を閾値としたフィルターを設定し、関連度がより強いものしか参照しないようにできます。ここでは、 vectordbkwargs 内のdictに、 search_distance というキー名で格納します。 vector store が探していれば、 search distance に閾値を設定してフィルタがかけられる
    vectordbkwargs = {"search_distance": 0.9}

    from langchain.callbacks import get_openai_callback
    with get_openai_callback() as cb:

        result = qa({"question": question, "chat_history": chat_history})
        # result = qa({"question": question, "chat_history": chat_history, "vectordbkwargs": vectordbkwargs})

        print(result["answer"])
        print(result["source_documents"])

        source_documents = result["source_documents"]
        source_texts = [document.page_content for document in source_documents]

        pdf_pages = PdfHelper().get_pdf_pages(source_texts, document_name)

        print(pdf_pages)

        base64_images = get_images(result["answer"])

        return {
            "status": 200,
            "answer": result["answer"],
            "source_documents": result["source_documents"],
            "base64_images": base64_images,
            "pdf_pages": pdf_pages,
            "token_counts": {
                'prompt_tokens': cb.prompt_tokens,
                'completion_tokens': cb.completion_tokens,
            },
            "cost": cb.total_cost
        }


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




# @app.get("/test3")
def get_images(answer):
    # answer = 'Sパラメータ解析を実行するには、まず図33のSパラメータ解析設定画面で解析を設定します。その後、解析実行ボタンを押して解析を開始します。解析が進むにつれてログダイアローグに途中経過が表示されます。解析が完了すると、図19のようにS11特性が表示されます。解析が終了したら、解析ボタンを押してください。';

    import re
    import base64
    from  api.models.s3 import S3

    try:
        paths = re.findall(r'図\d+', answer)

        paths_set = set(paths) # 配列の重複削除
        paths = list(paths_set)

        base64_images = []
        s3 = S3()
        for path in paths:
            key = f"outputs/{path}.jpg"
            if s3.check_s3_key_exists(key) is False: continue

            binary = s3.get_s3_object(key)
            # 画像データをBase64エンコードしてフォーマットする
            image_data = base64.b64encode(binary).decode("utf-8")
            base64_images.append({'path': path, 'base64': image_data})

        return base64_images

    except Exception as e:
        print(e)
        return {
            "status": 500,
            "message": "gpt_engine Internal Server Error",
            "errors": e,
        }


@app.post("/test3")
async def test3(chat: Chat):
    chat_history = chat.dict()['chat_history']
    chat_history = [tuple(history) for history in chat_history]

    print(chat_history)
    return {
        "status": 500,
        "message": "gpt_engine Internal Server Error",
        "errors": '',
    }