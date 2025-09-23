import os
import sys
import json
import traceback

from fastapi import APIRouter
from typing import List, Optional
from pydantic import Field, BaseModel
from fastapi.responses import JSONResponse

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/Backend")[0] + "/Backend/itsm"
sys.path.append(ROOT_PATH)

mim_conf_path = ROOT_PATH + "/config/mim_conf.json"
mim_conf_file = open(mim_conf_path, 'r')
mim_conf = json.load(mim_conf_file)
mim_conf_file.close()

from vault import Vault
from llm_app.llm_utils import LLMUtils

router = APIRouter()

vault_url = mim_conf["vault_url"]

vault_token_f = open(ROOT_PATH + "/config/.vault_token")
vault_token = vault_token_f.read().strip()
vault_token_f.close()

class TechAssistPayload(BaseModel):
    query: str
    context: dict


@router.post(f"/api/{mim_conf['api_version']}/act_for_demo_on_ask", status_code = 200)
async def ask_llm_to_act_for_demo(payload: TechAssistPayload):
    query = payload.query
    context = payload.context

    last_activity = "user: " + query

    # Call the task that acts on end machines
    response = {}

    try:
        act_instance = LLMUtils()
        (output, context) = act_instance.ask_llm_to_act_for_demo(query, context)

        last_activity += "\nsystem: " + output

        summary_prompt = "Read the following conversation delimited by 3 back ticks - ```\n\n" + last_activity + "\n\n```\n\n"
        summary_prompt += "Summarize the conversation to update as work notes."

        work_notes_or_comments = act_instance.ask_llm(summary_prompt)

        response["output"] = {"data": {"response": output,
                                       "context": context,
                                       "work_notes_or_comments": work_notes_or_comments
                                       },
                              "message": "Response retrieved successfully."
                              }

        response["code"] = 200
        return JSONResponse(status_code = 200, content = response)
    except Exception as e:
        response["error"] = {"data": {}, "message": str(e)}
        response["code"] = 500

        traceback.print_exc()

        return JSONResponse(status_code = 500, content = response)

