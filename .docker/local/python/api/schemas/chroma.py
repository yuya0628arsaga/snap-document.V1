from pydantic import BaseModel


class StoreChroma(BaseModel):
    document_name: str