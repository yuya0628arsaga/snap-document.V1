import os
from os.path import join, dirname
from dotenv import load_dotenv

load_dotenv(verbose=True)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

AWS_ACCESS_KEY_ID=os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY=os.environ.get("AWS_SECRET_ACCESS_KEY")
REGION=os.environ.get("REGION")
BUCKET_NAME=os.environ.get("BUCKET_NAME")

APP_ENV=os.environ.get("APP_ENV")

IMG_STORE_S3_DIR=os.environ.get("IMG_STORE_S3_DIR")
IMG_EXTENSION=os.environ.get("IMG_EXTENSION")