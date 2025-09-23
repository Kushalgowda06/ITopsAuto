from pydantic import BaseModel
from typing import Dict, Any, Union

# Responses
class SuccessResponse(BaseModel):
    code: int
    output: Dict[str, Any]

class ErrorResponse(BaseModel):
    code: int
    error: Dict[str, Any]

ResponseModel = Union[SuccessResponse, ErrorResponse]

# LLM requests
class LLMRequest(BaseModel):
    query: str

class LLMRequestWithContext(BaseModel):
    query: str
    context: dict

# Merge KB model (needed for merge_kb_articles route)
class merge_kb_model(BaseModel):
    article1: str
    article2: str
