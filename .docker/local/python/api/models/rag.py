from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain.schema.output_parser import StrOutputParser
from base64 import b64decode
# from langchain.chat_models import ChatOpenAI
from langchain_openai import ChatOpenAI
from langchain.schema.messages import HumanMessage
from langchain.callbacks.base import BaseCallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

import settings

class Rag(object):
    # クラス変数
    openai_api_key=settings.OPENAI_API_KEY

    def __init__(self):
        pass

    def rag_application(self, question, retriever):
        # 質問に関連する文章を、textsと画像サマリを保存したベクトルDBから探してくる
        # MEMO::Retriever とはテキスト(質問)に関連するドキュメント(文書の一部)を得るインターフェースのこと(p.104)
        # MEMO::Retriever の内部では 与えられたテキスト(質問)をベクトル化して、Vector storeに保存された文書のうち、ベクトルの距離が近いものを探している(p.106)
        docs = retriever.get_relevant_documents(question)

        # self.logger.info(f"参照したドキュメントの箇所: {docs}")

        # 取得した文章が「画像サマリの一部」なのかどうかをチェックする
        # docs_by_type = { "images": ['docsの中から取得したbase64にした文字列(画像は複数もあり)'], "texts": ['docsの中から取得したテキスト部分'] }
        # 例. docs_by_type = { "images": ['画像１のbase64', '画像２のbase64'], "texts": ['テキストA', 'テキストB', 'テキストC'] }
        docs_by_type = self.split_image_text_types(docs)
        # logger.info(f"参照した画像＋ドキュメント: {docs_by_type}")

        # # テーブルの取得と表示
        # if len(docs_by_type["texts"]):
        #     for doc_id in docs_by_type["texts"]:
        #         doc = retriever.docstore.mget([doc_id])
        #         try:
        #             doc_html = convert_html(doc)
        #             display(HTML(doc_html))
        #         except Exception as e:
        #             print(doc)

        model = ChatOpenAI(
            openai_api_key=self.openai_api_key,
            model="gpt-4-vision-preview",
            max_tokens=1024,
            temperature=0,
            # streaming=True,
            # callback_manager=BaseCallbackManager([StreamingStdOutCallbackHandler()])
        )

        # MEMO::chain については p.106~
        chain = (
            {"context": retriever | RunnableLambda(self.split_image_text_types), "question": RunnablePassthrough()}
            | RunnableLambda(self.generate_prompt)
            | model
            | StrOutputParser()
        )
        answer = chain.invoke(question)
        # stream_answer = chain.stream(question)

        return answer, docs_by_type


    def split_image_text_types(self, docs):
        b64 = []
        text = []
        for doc in docs:
            try:
                b64decode(doc)
                b64.append(doc)
            except Exception:
                text.append(doc)
        return {"images": b64, "texts": text}


    def plt_img_base64(self, img_base64):
        image_html = f'<img src="data:image/jpeg;base64,{img_base64}" />'

    # def convert_html(element):
    #     input_text = str(element)
    #     prompt_text = f"""
    #     回答例にならって、テキストをHTMLテーブル形式に変換してください:

    #     テキスト：
    #     {input_text}

    #     回答例：
    #     項目 果物(kg) お菓子(kg) ナッツ(kg) 飲み物(L) 予想 45 20 15 60 実績 50 25 10 80
    #     差(実績-予想) 5 5 -5 -20
    #     →
    #     <table>
    #       <tr>
    #         <th>項目</th>
    #         <th>果物(kg)</th>
    #         <th>お菓子(kg)</th>
    #      ・・・
    #       </tr>
    #     </table>
    #     """
    #     message = HumanMessage(content=[
    #                 {"type": "text", "text": prompt_text}
    #               ])
    #     model = ChatOpenAI(model="gpt-3.5-turbo", max_tokens=1024)
    #     response = model.invoke([message])
    #     return response.content

    def generate_prompt(self, dict):
        format_texts = "\n\n".join(dict["context"]["texts"])

        # self.logger.info(f"追加情報（docs_by_typeのtexts部分）: {format_texts}")

        # prompt_text = f"""
        # 以下の質問に基づいて回答を生成してください。
        # 回答は、提供された追加情報を考慮してください。

        # 質問: {dict["question"]}

        # 追加情報: {format_texts}
        # """

        prompt_text = f"""
        以下の質問に基づいて回答を生成してください。
        回答は、提供された追加情報を考慮してください。
        ステップバイステップで考えてください。
        情報が正確かどうか自問に自答を重ねてください。

        質問: {dict["question"]}

        追加情報: {format_texts}
        """
        message_content = [{"type": "text", "text": prompt_text}]

        # トークン数出力
        # get_token_count(prompt_text)

        # 画像が存在する場合のみ画像URLを追加
        # dict["context"]["images"] は base64の文字列
        # TODO::このコードって１枚目の画像しか考慮に入れてない？？（dict['context']['images'][0]になってて[1]が考慮されていない）
        if dict["context"]["images"]:
            image_url = f"data:image/jpeg;base64,{dict['context']['images'][0]}"
            message_content.append({"type": "image_url", "image_url": {"url": image_url}})
            # logger.info(f"プロンプトに使用されるimage_url: {image_url}")

        return [HumanMessage(content=message_content)]
