from pydantic import BaseModel
from typing import Dict, Any, Union

# Existing models
class SuccessResponse(BaseModel):
    code: int
    output: Dict[str, Any]

class ErrorResponse(BaseModel):
    code: int
    error: Dict[str, Any]

ResponseModel = Union[SuccessResponse, ErrorResponse]

class LLMRequest(BaseModel):
    query: str

class LLMRequestWithContext(BaseModel):
    query: str
    context: dict

# Merge KB model
class merge_kb_model(BaseModel):
    article1: str
    article2: str

# Refine KB model (add this)
class refine_kb_model(BaseModel):
    article: str
