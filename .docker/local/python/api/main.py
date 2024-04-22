from fastapi import FastAPI

from api.routers import chat
from api.routers import chroma


app = FastAPI()

app.include_router(chat.router)
app.include_router(chroma.router)