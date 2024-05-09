import os
import shutil
import uuid

import chromadb
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

import settings
from api.models.s3 import S3
from api.models.s3 import S3KeyNotExistsError


VECTOR_DATA_STORE_BASE_DIR = './chromadb_datas'
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
        """ChromaDB にドキュメントのベクトルデータを永久保存する"""
        vector_data_store_dir = f"{VECTOR_DATA_STORE_BASE_DIR}/{document_name}"
        if os.path.isdir(vector_data_store_dir):
            print(f"Warning: ローカルにベクトルデータが既に存在します。{vector_data_store_dir} を一旦削除してから再度お試しください。")
            shutil.rmtree(vector_data_store_dir)

        s3 = S3()
        key = f"{PDF_TEXT_DATA_S3_DIR}/{document_name}.txt"
        if not s3.check_s3_key_exists(key):
            raise S3KeyNotExistsError(f"S3キー: {key} が存在しません。PDFドキュメントの.txtデータをS3に保存してください。")

        client = chromadb.PersistentClient(path=f"./{VECTOR_DATA_STORE_BASE_DIR}/{document_name}")

        collection = client.create_collection(name="langchain", embedding_function=_CustomOpenAIEmbeddings(
            openai_api_key=settings.OPENAI_API_KEY
        ))

        texts = s3.get_pdf_text(key)

        doc_ids = [str(uuid.uuid4()) for _ in texts]

        id_key='doc_id'
        documents = []
        for i, s in enumerate(texts):
            documents.append({'content': s, 'metadata': {id_key: doc_ids[i]}})
            # documents.append(Document(page_content=s, metadata={id_key: doc_ids[i]}))

        metadatas = []
        for i, s in enumerate(texts):
            metadatas.append({id_key: doc_ids[i]})

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