from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union

# ------------------------
# Response Models
# ------------------------
class SuccessResponse(BaseModel):
    code: int
    output: Dict[str, Any]

class ErrorResponse(BaseModel):
    code: int
    error: Dict[str, Any]

ResponseModel = Union[SuccessResponse, ErrorResponse]

# ------------------------
# LLM Request Models
# ------------------------
class LLMRequest(BaseModel):
    query: str

class LLMRequestWithContext(BaseModel):
    query: str
    context: dict

# ------------------------
# KB Article Models
# ------------------------
class merge_kb_model(BaseModel):
    kb_article_1: str
    kb_article_2: str

class refine_kb_model(BaseModel):
    kb_article: str

