import os
import pathlib
import shutil

import chromadb
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader

import settings


VECTOR_DATA_STORE_BASE_DIR = './chromadb_data'
PDF_TEXT_DATA_S3_DIR = 'documents_text'


class ChromaEngine(object):
    """Chromaを操作するクラス"""

    def __init__(self) -> None:
        pass

    def get_retriever(self, document_name):
        """retriever取得

        Args:
            document_name (str): ドキュメント名

        Returns:
            retriever

        Raises:
            NoVectorDataError: ドキュメントのベクトルデータが存在しない場合
        """
        vector_data_store_dir = f"{VECTOR_DATA_STORE_BASE_DIR}/{document_name}"
        if not os.path.isdir(vector_data_store_dir):
            # FixMe::存在しない場合にベクトルデータを自動生成させる処理にする？
            raise NoVectorDataError('ドキュメント {document_name}のベクトルデータが存在しません')

        vectordb = Chroma(
            persist_directory=vector_data_store_dir,
            embedding_function=_CustomOpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        )

        return vectordb.as_retriever()

    def store(self, document_name):
        """PDFのページごとにテキストを抽出しChromaに保存（ChromaDB にドキュメントのベクトルデータを永久保存する）"""
        vector_data_store_dir = f"{VECTOR_DATA_STORE_BASE_DIR}/{document_name}"
        if os.path.isdir(vector_data_store_dir):
            print(f"Warning: ローカルにベクトルデータが既に存在します。{vector_data_store_dir} を一旦削除してから再度お試しください。")
            shutil.rmtree(vector_data_store_dir)

        client = chromadb.PersistentClient(path=f"./{VECTOR_DATA_STORE_BASE_DIR}/{document_name}")

        db = Chroma(
            persist_directory=vector_data_store_dir,
            embedding_function=_CustomOpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY),
            client=client,
        )

        # PDFからページごとにテキストを抽出する処理
        # TODO::将来的にローカルではなくS3からPDFを取得できるようにしたい
        pdf_path = pathlib.Path(
            f"api/documents/{document_name}.pdf"
        )
        pdf_loader = PyPDFLoader(pdf_path)
        documents = pdf_loader.load()
        print(documents)

        db.add_documents(documents=documents, embedding=_CustomOpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY))

        return 'PDFのページごとに保存成功'


class _CustomOpenAIEmbeddings(OpenAIEmbeddings):

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


class NoVectorDataError(Exception):
    """ドキュメントのベクトルデータが存在しないエラー"""