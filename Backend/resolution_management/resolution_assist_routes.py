import os
import sys
import json
import traceback

from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse

# Get project root (Backend/)
SCRIPT_PATH = os.path.dirname(os.path.abspath(__file__))
ROOT_PATH = os.path.abspath(os.path.join(SCRIPT_PATH, os.pardir))

# Correct config path (Backend/config/mim_conf.json)
mim_conf_path = os.path.join(ROOT_PATH, "config", "mim_conf.json")
with open(mim_conf_path, "r") as f:
    mim_conf = json.load(f)

from vault import Vault
from llm_app.llm_utils import LLMUtils

router = APIRouter()

# Read from mim_conf.json (already loaded earlier)
vault_url = mim_conf["vault_url"]

# Get Vault token from environment variable instead of file
vault_token = os.getenv("VAULT_TOKEN")
if not vault_token:
    raise RuntimeError("VAULT_TOKEN is not set. Please configure it in GitHub Secrets or docker-compose.yml")

class TechAssistPayload(BaseModel):
    query: str
    context: dict


@router.post(f"/api/{mim_conf['api_version']}/act_for_demo_on_ask", status_code=200)
async def ask_llm_to_act_for_demo(payload: TechAssistPayload):
    query = payload.query
    context = payload.context

    last_activity = "user: " + query

    response = {}
    try:
        act_instance = LLMUtils()
        (output, context) = act_instance.ask_llm_to_act_for_demo(query, context)

        last_activity += "\nsystem: " + output

        summary_prompt = (
            "Read the following conversation delimited by 3 back ticks - ```\n\n"
            + last_activity
            + "\n\n```\n\nSummarize the conversation to update as work notes."
        )

        work_notes_or_comments = act_instance.ask_llm(summary_prompt)

        response["output"] = {
            "data": {
                "response": output,
                "context": context,
                "work_notes_or_comments": work_notes_or_comments,
            },
            "message": "Response retrieved successfully.",
        }

        response["code"] = 200
        return JSONResponse(status_code=200, content=response)

    except Exception as e:
        response["error"] = {"data": {}, "message": str(e)}
        response["code"] = 500
        traceback.print_exc()
        return JSONResponse(status_code=500, content=response)
