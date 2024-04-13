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
from langchain.embeddings import OpenAIEmbeddings
import settings

MANUAL = 'Man_Digest_v9'


@app.get("/test")
async def test():
    """ChromaDB にドキュメントのベクトルデータを永久保存する
    """

    client = chromadb.PersistentClient(path=f"./chromadb_data/{MANUAL}")

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



# from api.models.rag_2 import Rag_2
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI

from langchain.prompts import PromptTemplate
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT

# Q&A用Chain
from langchain.chains import ConversationalRetrievalChain
from langchain.chains import LLMChain
from langchain.chains.question_answering import load_qa_chain

@app.get("/test2")
async def test():

    GPT_MODEL = 'gpt-3.5-turbo'


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
        persist_directory=f"./chromadb_data/{MANUAL}",
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
    )



    # return_source_documents=True でソースも取得
    #### qa = ConversationalRetrievalChain.from_llm(LLM, retriever=retriever, return_source_documents=True)

    question = '回路シミュレーションでSパラメータ解析はどのように実行すればいいですか？'
    # question = 'SPICEモデルはどこのフォルダに入れればいいですか？'
    chat_history = []

    # ベクトル間の距離を閾値としたフィルターを設定し、関連度がより強いものしか参照しないようにできます。ここでは、 vectordbkwargs 内のdictに、 search_distance というキー名で格納します。 vector store が探していれば、 search distance に閾値を設定してフィルタがかけられる
    vectordbkwargs = {"search_distance": 0.9}

    result = qa({"question": question, "chat_history": chat_history})
    # result = qa({"question": question, "chat_history": chat_history, "vectordbkwargs": vectordbkwargs})



    print(result["answer"])
    # print(result["source_documents"])

    return result["answer"]


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