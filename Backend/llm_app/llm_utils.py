# Backend/llm_app/llm_routes.py

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.responses import JSONResponse
from .llm_utils import LLMUtils
from .model import LLMRequest, LLMRequestWithContext
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets

router = APIRouter()

security = HTTPBasic()

# Basic auth function
def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "rest")
    correct_password = secrets.compare_digest(credentials.password, "!fi$5*4KlHDdRwdbup%ix")
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials.username

llm_instance = LLMUtils()

# Ask LLM in isolation
@router.post("/api/v1/ask_llm_in_isolation/", dependencies=[Depends(authenticate)])
async def ask_llm_in_isolation(payload: LLMRequest):
    try:
        response = llm_instance.ask_llm(payload.query)
        return {"code": 200, "data": response}
    except Exception as e:
        return JSONResponse(status_code=400, content={"code": 400, "error": str(e)})

# Ask LLM with context
@router.post("/api/v1/ask_llm_with_context/", dependencies=[Depends(authenticate)])
async def ask_llm_with_context(payload: LLMRequestWithContext):
    try:
        response, updated_context = llm_instance.ask_llm_with_context(payload.query, payload.context)
        return {"code": 200, "data": {"response": response, "context": updated_context}}
    except Exception as e:
        return JSONResponse(status_code=400, content={"code": 400, "error": str(e)})
