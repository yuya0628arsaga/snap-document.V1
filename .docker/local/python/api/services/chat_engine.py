from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT
from langchain.callbacks import get_openai_callback
# Q&A用Chain
from langchain.chains import ConversationalRetrievalChain
from langchain.chains import LLMChain
from langchain.chains.question_answering import load_qa_chain

from api.services.chroma_engine import ChromaEngine
import settings


GPT_MODEL_LIST = [
    'gpt-4o',
    'gpt-3.5-turbo'
]
MAX_TOKENS = 1024
TEMPERATURE = 0

IMG_STORE_S3_DIR = settings.IMG_STORE_S3_DIR or 'outputs'
IMG_EXTENSION = settings.IMG_EXTENSION or 'jpg'


class ChatEngine(object):
    """GPTと通信するクラス"""

    def __init__(self, model, max_tokens=MAX_TOKENS, temperature=TEMPERATURE) -> None:
        if model not in GPT_MODEL_LIST:
            raise GptModelNotExistError(f"{model}モデルは存在しません。")

        self.LLM = ChatOpenAI(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
        )

        self.chroma_engine = ChromaEngine()

    def _make_prompt_qg(self):
        """Question generator （質問・履歴を投げる段階）で投げるプロンプトの作成
            (デフォルトでは CONDENSE_QUESTION_PROMPT が使われる)
        """

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

        return prompt_qg

    def _make_prompt_qa(self):
        """QA の最終質問のプロンプト"""

        # 翻訳::次の文脈を使用して、最後の質問に答えてください。答えがわからない場合は、答えをでっち上げようとせず、わからないと言ってください。
        prompt_template_qa = """You are a helpful assistant. Please answer in Japanese! If the context is not relevant, please answer the question by using your own knowledge about the topic.

        {context}

        Question: {question}
        Answer in Japanese:"""

        prompt_qa = PromptTemplate(
                template=prompt_template_qa,
                input_variables=["context", "question"]
        )

        return prompt_qa

    def _make_qa(self, prompt_qg, prompt_qa, retriever):
        """qa作成"""
        question_generator = LLMChain(llm=self.LLM, prompt=prompt_qg)
        # question_generator = LLMChain(llm=LLM, prompt=CONDENSE_QUESTION_PROMPT)  # デフォルトのプロント使いたかったらこう書く

        doc_chain = load_qa_chain(llm=self.LLM, chain_type="stuff", prompt=prompt_qa)

        qa = ConversationalRetrievalChain(
                retriever=retriever,
                question_generator=question_generator,
                combine_docs_chain=doc_chain,
                return_source_documents=True,
        )

        return qa

    def _get_answer_from_gpt(self, qa, question, chat_history):
        """GPTに質問を投げて回答を取得"""

        with get_openai_callback() as cb:
            result = qa({"question": question, "chat_history": chat_history})

            print(result["answer"])
            print(result["source_documents"])

            return {
                "answer": result["answer"],
                "source_documents": result["source_documents"],
                "token_counts": {
                    'prompt_tokens': cb.prompt_tokens,
                    'completion_tokens': cb.completion_tokens,
                },
                "cost": cb.total_cost
            }

    def get_answer(self, question, document_name, chat_history, is_get_pdf_page):
        """回答を返却

        Args:
            question (str): 質問
            document_name (str): ドキュメント名
            chat_history (list[str]): 会話履歴
            is_get_pdf_page (bool): PDFページの取得フラグ

        Returns:
            dict:
                {
                    "answer": str,
                    "source_documents": str,
                    "pdf_pages": list[int],
                    "token_counts": int,
                    "cost": int,
                }
        """
        chat_history = [tuple(history) for history in chat_history]

        prompt_qg = self._make_prompt_qg()
        prompt_qa = self._make_prompt_qa()
        retriever = self.chroma_engine.get_retriever(document_name)

        qa = self._make_qa(prompt_qg, prompt_qa, retriever)

        result = self._get_answer_from_gpt(qa, question, chat_history)
        # is_get_pdf_page がfalseの場合は pdfページの取得処理を実行しない
        pdf_pages = self._get_pdf_pages(result['source_documents']) if is_get_pdf_page else []

        return {
            **result,
            "pdf_pages": pdf_pages,
        }

    def _get_pdf_pages(self, source_documents):
        """回答する際に参照したPDFページを取得"""
        pdf_pages = [document.metadata['page'] + 1 for document in source_documents]

        return pdf_pages

class GptModelNotExistError(Exception):
    """存在しないGPTモデルを指定したエラー"""