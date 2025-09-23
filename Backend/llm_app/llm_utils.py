import os
import sys
from typing import Dict
import re
from .configuration import config
import autogen

# Paths
SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("/llm_app")[0]
sys.path.append(ROOT_PATH)

class LLMUtils:
    def __init__(self):
        self.api_key = config["openai_key"]
        self.api_version = config["openai_api_version"]
        self.azure_endpoint = config["openai_azure_enpoint"]
        self.model = config["openai_model"]
        self.api_type = config["api_type"]
        self.system_prompt = "You are a helpful assistant that responds to queries associated to IT stuff."

    def ask_llm(self, query: str = ""):
        input_prompt = f"{query}"
        az_config_list = [{
            "model": self.model,
            "api_type": self.api_type,
            "base_url": self.azure_endpoint,
            "api_key": self.api_key,
            "api_version": self.api_version
        }]
        llm_config = {"config_list": az_config_list, "temperature": 0.5}

        generic_agent = autogen.ConversableAgent(
            name="generic_agent",
            llm_config=llm_config,
            human_input_mode="NEVER"
        )
        response = generic_agent.generate_reply(
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": input_prompt}
            ]
        )
        return response

    def ask_llm_with_context(self, query: str = "", context: dict = {}):
        input_prompt = f"{query}"
        messages = [{"role": "system", "content": self.system_prompt}] if context == {} else []
        messages += [{"role": "user", "content": input_prompt}]

        az_config_list = [{
            "model": self.model,
            "api_type": self.api_type,
            "base_url": self.azure_endpoint,
            "api_key": self.api_key,
            "api_version": self.api_version
        }]
        llm_config = {"config_list": az_config_list, "temperature": 0.5}

        generic_agent = autogen.ConversableAgent(
            name="generic_agent",
            llm_config=llm_config,
            human_input_mode="NEVER"
        )

        response = generic_agent.generate_reply(messages=messages)
        messages += [{"role": "system", "content": response}]
        return response, messages
