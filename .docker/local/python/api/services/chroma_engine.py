from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

import settings


DATA_STORE_DIR = './chromadb_datas'

class ChromaEngine(object):
    """Chromaを操作するクラス"""

    def __init__(self, document_name) -> None:
        self.vectordb = Chroma(
            persist_directory=f"{DATA_STORE_DIR}/{document_name}",
            embedding_function=_CustomOpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        )

    def get_retriever(self):
        """retriever取得"""
        # retriever.search_kwargs["distance_metric"] = "cos"
        # retriever.search_kwargs["fetch_k"] = 100
        # retriever.search_kwargs["maximal_marginal_relevance"] = True
        # retriever.search_kwargs["k"] = 7
        return self.vectordb.as_retriever()


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
