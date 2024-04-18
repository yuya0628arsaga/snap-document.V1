########### 以下の行はデプロイ用のコード #########################
import settings
if settings.APP_ENV == "local":
    # 開発環境の場合の操作
    pass
else:
    # 本番環境の場合の操作
    __import__('pysqlite3')
    import sys
    sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
#############################################################

from api.models.rag import Rag
from api.models.s3 import S3
from api.models.images_store import ImageStore
from api.models.voctor_store import VectorStore
from api.services.pdf_helper import PdfHelper


class ChatbotEngine(object):
    """ChatbotEngineクラス"""

    openai_api_key=settings.OPENAI_API_KEY

    def __init__(self):
        pass

    def make_answer(self, question):

        config = {
            'manuals': ['Man_Digest_v9', 'PCBmanualV5', 'PCBmanual3DV5'],
            'application_note': True,
            'QA': False,
            'include_image': False,
        }

    #   for manual in config['manuals']:
        # フォルダにマニュアルがあるか確認してなければエラーなりを返す？
        manual = config['manuals'][0]
        texts = S3().get_pdf_text(manual)
        # textsをベクトルストアに入れてgptに投げて結果を取得してユーザーに見せる
        if config['include_image']:
            # 画像のサマリ作成
            images_storage_dir = './storage/images/'
            img_base64_list, image_summaries = ImageStore().summarize_images(images_storage_dir)
        else:
            img_base64_list, image_summaries = ([], [])

        retriever = VectorStore().create_vectorstore(texts, image_summaries, img_base64_list)

        answer, docs_by_type = Rag().rag_application(question, retriever)

        #   pdf_pages = PdfHelper().get_pdf_pages(reference_texts=docs_by_type["texts"])
        pdf_pages = [1, 2, 3]

        return answer, docs_by_type, pdf_pages


    # main = execute_main('Sパラメータのやり方は？')

    # # 一個めのPDF検索結果
    # print(next(main))
    # # 二個めのPDF検索結果
    # print(next(main))
    # # 三個めのPDF検索結果
    # next(main)

    # execute_main("男性の髪色を教えてください")

