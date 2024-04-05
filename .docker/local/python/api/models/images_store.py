import os
import base64

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
# from langchain.chat_models import ChatOpenAI
from langchain_community.chat_models import ChatOpenAI
from langchain.schema.messages import HumanMessage
from google.cloud.firestore_v1.base_query import FieldFilter

import settings

GCP_PROJECT = "mel-document-v2-db"

class ImageStore(object):
    openai_api_key = settings.OPENAI_API_KEY

    def __init__(self):

        # firebaseの認証のやつ
        # cred = credentials.Certificate("./service_account.json")
        # firebase_admin.initialize_app(cred, {
        #     'projectId': GCP_PROJECT,
        # })

        self.db = firestore.client()


    # 画像サマリをfirestoreに保存する処理（リリース時に一回行うだけで良い）
    def storeImagesToFirestore(self, path):
        # firebaseの認証のやつ
        cred = credentials.Certificate("./service_account.json")
        firebase_admin.initialize_app(cred, {
            'projectId': GCP_PROJECT,
        })

        db = firestore.client()

        # self.logger.info("------------- 解析&保存 START------------- ") # ログ
        for img_file in sorted(os.listdir(path)):
            if img_file.endswith('.jpg'):
                # img_prompt = "画像を日本語で詳細に説明してください。"
                img_prompt = "画像を一言で説明してください。"

                img_path = os.path.join(path, img_file)
                base64_image = self.encode_image(img_path)
                # GPTが解析した画像サマリを取得
                img_summary = self.gpt_summarize_iamge(base64_image, img_prompt)
                # self.logger.info(f"image_summary: {img_summary}")

                # firestoreに保存
                import uuid
                uuid = str(uuid.uuid4())
                images_doc = db.collection("document_images").document(uuid)
                images_doc.set({"img_path" : img_path, "img_samary" : img_summary})

        # self.logger.info("------------- 解析&保存 終了--------------") # ログ

    # GPTによる画像解析
    def gpt_summarize_iamge(self, img_base64, prompt):
        chat = ChatOpenAI(openai_api_key=self.openai_api_key, model="gpt-4-vision-preview", max_tokens=1024)
        msg = chat.invoke([
            HumanMessage(content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
            ])
        ])
        return msg.content

    def encode_image(self, image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    # 一回実行
    # storeImagesToFirestore("./storage/images/")

    # 画像サマリと画像base64 を取得
    def summarize_images(self, path):
        img_base64_list = []
        image_summaries = []

        # ディレクトリが存在しない場合
        if not os.path.isdir(path):
            return image_summaries, img_base64_list

        for img_file in sorted(os.listdir(path)):
            if img_file.endswith('.jpg'):
                img_path = os.path.join(path, img_file)
                base64_image = self.encode_image(img_path)
                # logger.info(f"base64_image: {base64_image}") # ログ
                img_base64_list.append(base64_image)

                # DBから取得したサマリ（DBにwhere img_pathして取得する）
                image_docs = (
                  self.db.collection("document_images")
                  .where(filter=FieldFilter("img_path", "==", img_path))
                  .stream()
                )

                for image_doc in image_docs:
                    img_samary = image_doc.to_dict()["img_samary"]
                    # self.logger.info(f"img_samary: {img_samary}") # ログ
                    image_summaries.append(img_samary)

        # self.logger.info(f"image_summaries: {image_summaries}") # ログ
        # logger.info(f"img_base64_list: {img_base64_list}") # ログ
        # self.logger.info('------------------------------------------') # ログ

        return img_base64_list, image_summaries


    # img_base64_list, image_summaries = summarize_images("./storage/images/")



    # def get_images_data():
    #   img_base64_list = []

    #   image_summaries = ['この画像は、コンピュータープログラムのスクリーンショットのようです。プログラムのインターフェースは日本語で表示されており、何らかのシミュレーションや解析を行うためのもののように見えます。\n\n画面の上部にはいくつかのタブがあり、「tuto-1」、「START tuto-1」、「GEOM」、「SCHM」などと書かれています。これらはおそらく、プログラムの異なる機能にアクセスするためのタブでしょう。「NSSSCHM - S-NAP」というタイトルも見えますが、これはプログラムの名前か、特定のモジュールの名前かもしれません。\n\n中央には「Sパラメータ解析」というタイトルのウィンドウが表示されています。これはおそらく、Sパラメータ（Scattering parameters）と呼ばれる、電子部品や回路の特性を解析するためのツールを指していると考えられます。ウィンドウ内には様々な設定項目があり：\n\n- 「スタート周波数[Hz]」と「ストップ周波数[Hz]」にはそれぞれ「0.1G」と「2G」と入力されています。これは周波数範囲が0.1ギガヘルツから2ギガヘルツまでであることを示しています。\n- 「センター周波数[Hz]」と「周波数帯域[Hz]」には「1G」と入力されており、これは中心周波数が1ギガヘルツであることを示しています。\n- 「周波数解像度[Hz]」の部分には何も入力されていませんが、入力することで解析の精度を設定できると思われます。\n\n右下には「周波数条件」「周波数設定」というボタンがあり、解析の詳細設定を行うためのものと思われます。また、「OK」と「キャンセル」というボタンもあり、設定を適用または破棄するためのものです。\n\nウィンドウの右側にはグラフが見えますが、詳細は切れていて見えません。全体的に、このスクリーンショットは電気工学や電子工学の分野の専門家が使用するソフトウェアの一部であると考えられます。']

    #   return img_base64_list, image_summaries
