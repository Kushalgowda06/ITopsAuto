# Backend/llm_app/llm_routes.py

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets
import traceback
from loguru import logger

# Import your models and LLM class
from .llm_utils import LLMUtils
from .model import LLMRequest, LLMRequestWithContext, merge_kb_model, refine_kb_model, ResponseModel
from .configuration import config

# ----------------------------
router = APIRouter()
security = HTTPBasic()

# Logger setup
logger_llm = logger.bind(api="llm_app_details")
logger_llm.add("project/logs/llm_app_log.log", rotation="100 MB", retention="10 days",
               level="INFO", backtrace=True, diagnose=True)

current_user = "system"

# ----------------------------
# Basic authentication
def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "rest")
    correct_password = secrets.compare_digest(credentials.password, "!fi$5*4KlHDdRwdbup%ix")
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials.username

# ----------------------------
# Ask LLM in isolation
@router.post(f"/api/{config['version']}/ask_llm_in_isolation/", status_code=200, response_model=ResponseModel, dependencies=[Depends(authenticate)])
async def ask_llm_in_isolation(payload: LLMRequest):
    response = {}
    try:
        logger_llm.info(f"API llm_generated_response called {current_user}")
        query = payload.query
        llm_instance = LLMUtils()
        output_response = llm_instance.ask_llm(query)

        response["code"] = 200
        response["output"] = {
            "data": output_response,
            "message": "LLM response successfully generated"
        }
        return response
    except Exception as e:
        traceback_str = traceback.format_exc()
        logger_llm.error(f"llm_generated_response failed, error: {str(e)} traceback: {traceback_str}")
        response["code"] = 403
        response["error"] = {"data": {}, "message": str(e)}
        return response

# ----------------------------
# Ask LLM with context
@router.post(f"/api/{config['version']}/ask_llm_with_context/", status_code=200, dependencies=[Depends(authenticate)])
async def ask_llm_with_context(payload: LLMRequestWithContext):
    try:
        llm_instance = LLMUtils()
        response, updated_context = llm_instance.ask_llm_with_context(payload.query, payload.context)
        return {"code": 200, "data": {"response": response, "context": updated_context}}
    except Exception as e:
        traceback_str = traceback.format_exc()
        logger_llm.error(f"ask_llm_with_context failed, error: {str(e)} traceback: {traceback_str}")
        return JSONResponse(status_code=400, content={"code": 400, "error": str(e)})

# ----------------------------
# Merge KB articles
@router.post(f"/api/{config['version']}/merge_kb_articles/", status_code=200, dependencies=[Depends(authenticate)])
async def route_merge_kb_articles(payload: merge_kb_model):
    try:
        llm_instance = LLMUtils()
        output_response = llm_instance.merge_kb_articles(payload.kb_article_1, payload.kb_article_2)
        return JSONResponse(content=output_response)
    except Exception as e:
        traceback_str = traceback.format_exc()
        logger_llm.error(f"merge_kb_articles failed, error: {str(e)} traceback: {traceback_str}")
        return JSONResponse(status_code=400, content={"code": 400, "error": str(e)})

# ----------------------------
# Refine KB articles
@router.post(f"/api/{config['version']}/refine_kb_articles/", status_code=200, dependencies=[Depends(authenticate)])
async def route_refine_kb_articles(payload: refine_kb_model):
    try:
        llm_instance = LLMUtils()
        output_response = llm_instance.refine_kb_article(payload.kb_article)
        return JSONResponse(content=output_response)
    except Exception as e:
        traceback_str = traceback.format_exc()
        logger_llm.error(f"refine_kb_articles failed, error: {str(e)} traceback: {traceback_str}")
        return JSONResponse(status_code=400, content={"code": 400, "error": str(e)})
