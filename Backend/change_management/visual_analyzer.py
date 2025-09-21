# Author - Viraj Purandare
# Created On - Dec 9, 2024
import sys
import os
import json
from typing import List

from PIL import Image
from termcolor import colored

import autogen
from autogen import UserProxyAgent
from autogen.agentchat.contrib.multimodal_conversable_agent import MultimodalConversableAgent

from configuration import config
from vault import Vault

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/itsm")[0]

LLM_PATH = ROOT_PATH + "/llm_app/"
sys.path.append(LLM_PATH)
sys.path.append(ROOT_PATH)

# Azure/OpenAI config
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

# App config
app_conf_path = os.path.join(SCRIPT_PATH, "config", "app_config.json")
with open(app_conf_path, "r") as f:
    app_conf = json.load(f)

# Vault token: from env variable or file
vault_token = os.environ.get("VAULT_TOKEN")
if not vault_token:
    vault_path = os.path.join(SCRIPT_PATH, "config", ".vault_token")
    with open(vault_path, "r") as f:
        vault_token = f.read().strip()

vault_url = app_conf["vault_url"]

# Initiate agents
image_agent = MultimodalConversableAgent(
    name="image_explainer",
    max_consecutive_auto_reply=10,
    llm_config={"config_list": az_config_list, "temperature": 0.5}
)

user_proxy = UserProxyAgent(
    name="user_proxy",
    system_message="A human admin.",
    is_termination_msg=lambda x: "image" in x.get("content", "").rstrip(),
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "coding", "use_docker": False},
    max_consecutive_auto_reply=0
)

# Conversational bot
def chat_with_llm(prompt: str, history_list: List, username: str = "") -> str:
    history = ""
    for entry in history_list[:-2]:
        history += f"{entry.role}: {entry.content}\n"

    if history:
        prompt += f"\n\nHere is the conversation history that sets context for you\n********\n{history}\n********"

    try:
        result = user_proxy.initiate_chat(
            image_agent,
