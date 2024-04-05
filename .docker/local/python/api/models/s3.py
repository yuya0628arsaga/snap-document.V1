import boto3
import base64
import uuid

import settings


class S3(object):
    """S3の操作をラッピングしてるクラス"""

    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.REGION
        )

    def get_pdf_text(self, pdf_name):
        """S3からPDFのテキストデータを取得する

        Args:
            pdf_name (str): 拡張子を除いたPDFのファイル名（例. Man_Digest_v9）

        Returns:
            list[str]:
        """
        try:
            # S3からオブジェクトを取得
            response = self.s3.get_object(
                Bucket=settings.BUCKET_NAME,
                Key=f"documents_text/{pdf_name}.txt"
            )
            pdf_texts_binary_data = response["Body"].read()
            pdf_texts_data = pdf_texts_binary_data.decode()

            # strをlist型に変換
            texts = eval(pdf_texts_data)

            return texts
        except Exception as e:
            print(f"S3 Error: {e}")
            raise

    # base64を元の画像にdecodeする
    def convert_b64_string_to_binary(img_base64):
        """base64をデコードする"""
        return base64.b64decode(img_base64.encode("UTF-8"))

    # base64形式の画像をS3にアップロード
    def upload_s3_base64(self, data):
        s3_folder = 'outputs/'
        key = f"{s3_folder}{uuid.uuid4()}.jpg"
        self.s3.put_object(
          Bucket=settings.BUCKET_NAME,
          Key=key,
          Body=self.convert_b64_string_to_binary(data),
          ContentType='image/jpg')

        return key

    # 画像のbinaryデータを取得
    def get_s3_object(self, s3_img_path):
        # S3からオブジェクトを取得
        response = self.s3.get_object(
            Bucket=settings.BUCKET_NAME,
            Key=s3_img_path
        )
        binary_data = response["Body"].read()
        return binary_data
