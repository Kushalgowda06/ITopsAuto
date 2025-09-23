import os
import traceback

from fastapi import APIRouter
from typing import List, Optional 
from pydantic import Field, BaseModel
from fastapi.responses import JSONResponse

from .knowledge_assistant import *

SCRIPT_PATH = os.path.dirname(__file__)

router = APIRouter()

mim_conf_path = SCRIPT_PATH.split('/knowledge_management')[0] + '/config/mim_conf.json'
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

class KnowledgeAssistantPayload(BaseModel):
    query: str

@router.post(f"/api/{mim_conf['api_version']}/get_contextual_response/", status_code=200)
async def get_contextual_response(payload: KnowledgeAssistantPayload) -> dict:
    response = {}
    try:
        ka_obj = KnowledgeAssistant()
        data = ka_obj.get_contextual_response(query = payload.query)

        response['output'] = {"data": data, "message": 'Contextual response retrieved successfully.'}
        response['code'] = 200

        return JSONResponse(status_code = 200, content = response)
    
    except Exception as e:
        response['error'] = {"data": {}, "message": str(e)}
        response['code'] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)
