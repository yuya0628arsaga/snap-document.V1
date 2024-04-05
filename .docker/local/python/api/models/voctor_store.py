import uuid

from langchain.vectorstores import Chroma
from langchain.storage import InMemoryStore
from langchain.schema.document import Document
from langchain.embeddings import OpenAIEmbeddings
from langchain.retrievers.multi_vector import MultiVectorRetriever


class VectorStore(object):
    """ベクトルストアを操作するクラス"""

    def __init__(self):
        # Multivector Retrieverの作成
        # MEMO::OpenAIEmbeddingsクラス は OpenAIの Embeddings API をラッピングしたもの(p.103)
        # MEMO::OpenAIの Embeddings API によってテキストはベクトル化される
        # MEMO::Chroma はローカルで使用可能な Vector store(ベクトルを保存できるDB)(p.104)
        # 子チャンクのインデックス付けに使用するベクトルストア（公式：https://python.langchain.com/docs/modules/data_connection/retrievers/multi_vector）
        vectorstore = Chroma(collection_name="multi_modal_rag", embedding_function=OpenAIEmbeddings())
        # 親ドキュメントのストレージ層
        docstore = InMemoryStore()

        # MEMO::Retriever とはテキスト(質問)に関連するドキュメント(文書の一部)を得るインターフェースのこと(p.104)
        self.id_key='doc_id'
        self.retriever = MultiVectorRetriever(vectorstore=vectorstore, docstore=docstore, id_key=self.id_key)

    def create_vectorstore(self, texts, image_summaries, img_base64_list):
        """テキストデータ、画像サマリ をベクトルストアに保存する関数

        Args:
            texts (str): pdfのテキスト部分
            image_summaries (list[str]): 画像のサマリ
            img_base64_list (list[str]): 画像のbase64データ

        Returns:
            MultiVectorRetriever: retriever
        """
        self.store_texts(texts=texts)
        self.store_image_summaries(image_summaries=image_summaries, img_base64_list=img_base64_list)

        return self.retriever

    def store_texts(self, texts):
        """Add texts: テキストデータをベクトルストアに保存する関数

        Args:
            texts (str): pdfのテキスト部分

        Returns:
            None
        """
        doc_ids = [str(uuid.uuid4()) for _ in texts]

        # i がindex(0, 1, 2..)で s がそれぞれの配列の要素
        # for i, s in enumerate(texts):
        #     retriever.vectorstore.add_documents([Document(page_content=s, metadata={id_key: doc_ids[i]})])

        # 先に処理を走らせて結果をキャッシュに保存するみたいなことできないの？
        documents = []
        for i, s in enumerate(texts):
          documents.append(Document(page_content=s, metadata={self.id_key: doc_ids[i]}))

        self.retriever.vectorstore.add_documents(documents)

        self.retriever.docstore.mset(list(zip(doc_ids, texts)))


    def store_image_summaries(self, image_summaries, img_base64_list):
        """Add image summaries: 画像サマリをベクトルストアに保存する関数

        Args:
            image_summaries (list[str]): 画像のサマリ
            img_base64_list (list[str]): 画像のbase64データ

        Returns:
            None
        """
        img_ids = [str(uuid.uuid4()) for _ in img_base64_list]
        for i, s in enumerate(image_summaries):
            self.retriever.vectorstore.add_documents([Document(page_content=s, metadata={self.id_key: img_ids[i]})])
        self.retriever.docstore.mset(list(zip(img_ids, img_base64_list)))

    def store_tables():
        """Add tables: テーブルをベクトルストアに保存する関数

        Args:

        Returns:
            None
        """
        # Add tables
        # table_ids = [str(uuid.uuid4()) for _ in tables]
        # for i, s in enumerate(table_summaries):
        #     retriever.vectorstore.add_documents([Document(page_content=s, metadata={id_key: table_ids[i]})])
        # retriever.docstore.mset(list(zip(table_ids, tables)))
