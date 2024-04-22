from fastapi import FastAPI

######################################################
# 「RuntimeError: Your system has an unsupported version of sqlite3. Chroma  requires sqlite3 >= 3.35.0.」
# 上記エラーの解消コード
# このコードを他のモジュールより先に読み込む必要あり
__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
######################################################

app = FastAPI()

from api.routers import chat
from api.routers import chroma

app.include_router(chat.router)
app.include_router(chroma.router)