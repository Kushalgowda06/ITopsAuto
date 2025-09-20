import os
import json
import traceback

from fastapi import APIRouter
from typing import List, Optional 
from pydantic import Field, BaseModel
from fastapi.responses import JSONResponse

from .knowledge_assistant import *

# -------------------------
# Script and root paths
# -------------------------
SCRIPT_PATH = os.path.dirname(os.path.abspath(__file__))
ROOT_PATH = os.path.dirname(SCRIPT_PATH)  # Goes up to /app/knowledge_management
CONFIG_PATH = os.path.join(ROOT_PATH, "config", "mim_conf.json")  # /app/config/mim_conf.json

# -------------------------
# Load mim_conf.json
# -------------------------
with open(CONFIG_PATH, 'r') as mim_conf_file:
    mim_conf = json.load(mim_conf_file)

# -------------------------
# FastAPI router
# -------------------------
router = APIRouter()

class KnowledgeAssistantPayload(BaseModel):
    query: str

@router.post(f"/api/{mim_conf['api_version']}/get_contextual_response/", status_code=200)
async def get_contextual_response(payload: KnowledgeAssistantPayload) -> dict:
    response = {}
    try:
        ka_obj = KnowledgeAssistant()
        data = ka_obj.get_contextual_response(query=payload.query)

        response['output'] = {"data": data, "message": "Contextual response retrieved successfully."}
        response['code'] = 200

        return JSONResponse(status_code=200, content=response)

    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code=500, content=response)
