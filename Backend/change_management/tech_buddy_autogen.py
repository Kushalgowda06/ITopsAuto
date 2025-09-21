# Author - Viraj Purandare
# Created On - Dec 9, 2024

import sys
import os
import json
from typing import List

from PIL import Image
from termcolor import colored

import autogen
from autogen.coding import LocalCommandLineCodeExecutor
from autogen import Agent, AssistantAgent, ConversableAgent, UserProxyAgent
from autogen.agentchat.contrib.img_utils import _to_pil, get_image_data
from autogen.agentchat.contrib.multimodal_conversable_agent import MultimodalConversableAgent
from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent
from autogen.code_utils import DEFAULT_MODEL, UNKNOWN, content_str, execute_code, extract_code, infer_lang

from vertexai.generative_models import HarmBlockThreshold, HarmCategory

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/change_management")[0]

LLM_PATH = ROOT_PATH + "/llm_app/"
sys.path.append(LLM_PATH)
sys.path.append(ROOT_PATH)

from vault import Vault
from configuration import config

# LLM / API Config
api_key = config["openai_key"]
api_version = config["openai_api_version"]
azure_endpoint = config["openai_azure_enpoint"]
model = config["openai_model"]
api_type = config["api_type"]

az_config_list = [{
    "model": model,
    "api_type": api_type,
    "base_url": azure_endpoint,
    "api_key": api_key,
    "api_version": api_version
}]

# Asset configurations
app_conf_path = SCRIPT_PATH + "/config/app_config.json"
with open(app_conf_path, "r") as app_conf_file:
    app_conf = json.load(app_conf_file)

# Vault token
vault_token = os.environ.get("VAULT_TOKEN")
if not vault_token:
    vault_path = SCRIPT_PATH + "/config/.vault_token"
    with open(vault_path, "r") as vault_file:
        vault_token = vault_file.read().strip()

vault_url = app_conf["vault_url"]

# Assistant backstory
assist_backstory_path = SCRIPT_PATH + "/config/assistant_backstory.txt"
with open(assist_backstory_path, "r") as assist_backstory_f:
    assistant_backstory = assist_backstory_f.read()

# Initialize Agents
assistant = ConversableAgent(
    "assistant",
    system_message=assistant_backstory,
    code_execution_config=False,
    llm_config={"config_list": az_config_list},
    human_input_mode="NEVER",
    max_consecutive_auto_reply=2,
    is_termination_msg=lambda msg: "exitcode: 0 (execution succeeded)" in msg["content"].lower(),
)

code_executor = ConversableAgent(
    "code_executor_agent",
    code_execution_config={"work_dir": "coding", "use_docker": False},
    human_input_mode="NEVER",
    llm_config=False,
)

agents = {"assistant": "assistant", "user": "code_executor_agent"}

generic_agent = ConversableAgent(
    "generic_agent",
    llm_config={"config_list": az_config_list},
    human_input_mode="NEVER",
)


# Conversational bot
def chat_with_llm(prompt: str, history_list: List, username: str = ""):
    cred_details = ""
    if username:
        vault_session = Vault(vault_url, vault_token)
        secrets = vault_session.list_secrets("/")

        allowed_secrets = [s for s in secrets if s.startswith(username)]
        if allowed_secrets:
            cred_details += "\n********Here are credentials if required. Choose relevant for relevant actions********"
            for user_path in allowed_secrets:
                status, creds = vault_session.retrieve_secret(user_path)
                purpose = user_path.split(username + "_")[-1].strip()
                cred_details += f"\n\n{purpose or 'User'} credentials - "
                cred_details += f"\nUsername - {list(creds.keys())[0]}\nPassword - {creds[list(creds.keys())[0]]}"

    prompt += cred_details

    history = ""
    for entry in history_list[:-2]:
        history += entry.role + ": " + entry.content + "\n"

    if history:
        history = history.replace(cred_details, "").replace("exitcode: 0 (execution succeeded)", "")
        prompt += "\n\nHere is the conversation history that sets context for you\n********\n" + history + "\n********"

    prompt += "\n\nIf you do not find the relevant credentials, please try all given in a loop."
    prompt += "\n\nIf API key is required, try password as API key."

    summary_prompt = (
        "Summarize the user's request response in a detailed or concise manner, based on the user's preference."
        f"\nUser's query was - {prompt}"
        "\n\nRESPONSE SHOULD NOT CONTAIN CREDENTIALS."
    )

    try:
        result = code_executor.initiate_chat(
            assistant,
            message=prompt,
            summary="last_msg"
        )
        try:
            result = result.summary['content']
        except Exception:
            result = result.summary
    except Exception as e:
        result = str(e)

    final_response_prompt = (
        "Read the following details -\n\n----------------\nUSER QUERY -\n" + prompt +
        "\n\nRESPONSE -\n" + result + "\n----------------" +
        "\n\nUsing this information, form exact response to the user's latest query only." +
        "\nENSURE TO EXCLUDE ANY CREDENTIAL DETAILS IN YOUR RESPONSE."
    )

    result = ask_llm_in_isolation(final_response_prompt)
    return result.content


class Response:
    def __init__(self):
        self.content = ""


def ask_llm_in_isolation(prompt: str) -> Response:
    response = Response()
    messages = [{"content": prompt, "role": "user"}]
    try:
        response.content = generic_agent.generate_reply(messages)
        try:
            response.content = response["content"]
        except Exception:
            pass
    except Exception as e:
        response.content = str(e)
    return response
