import os
import sys
import datetime
import json
import requests
import re
import uuid
from typing import *
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from loguru import logger
import autogen

# -------------------------
# Load CONFIGURATION from environment variable
# -------------------------
config_code = os.environ.get("CONFIGURATION", None)
if config_code:
    # Dynamically create 'config' dictionary in memory
    exec(config_code)
else:
    config = {}  # fallback empty dict if not provided

# -------------------------
# Paths for file access
# -------------------------
SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("\\llm_app")[0]
sys.path.append(ROOT_PATH)

# Example: logger setup (optional)
# logger_llm = logger.bind(api="llm_app_details")
# logger_llm.add("project/logs/llm_app_log.log", rotation="100 MB", retention="10 days", level="INFO", backtrace=True, diagnose=True)

# -------------------------
# Main LLM Utils Class
# -------------------------
class LLMUtils:

    def __init__(self):
        self.api_key = config.get("openai_key")
        self.api_version = config.get("openai_api_version")
        self.azure_endpoint = config.get("openai_azure_enpoint")
        self.model = config.get("openai_model")
        self.api_type = config.get("api_type")
        self.system_prompt = "You are a helpful assistant that responds to queries associated to IT stuff."

    def ask_llm(self, query: str = ""):
        input_prompt = query
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
        input_prompt = query
        messages = context.get("messages", [])
        if not messages:
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": input_prompt}
            ]
        else:
            messages.append({"role": "user", "content": input_prompt})

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
        messages.append({"role": "system", "content": response})
        context["messages"] = messages
        return response, messages

    def ask_llm_to_act_for_demo(self, query: str = "", context: dict = {}):
        try:
            with open(os.path.join(ROOT_PATH, "config/demo_story.txt"), "r") as f:
                assistant_backstory = f.read()
        except Exception:
            assistant_backstory = "You are a demo assistant."

        input_prompt = query
        az_config_list = [{
            "model": self.model,
            "api_type": self.api_type,
            "base_url": self.azure_endpoint,
            "api_key": self.api_key,
            "api_version": self.api_version
        }]

        llm_config = {"config_list": az_config_list, "temperature": 0.5}

        demo_agent = autogen.AssistantAgent(
            "demo_agent",
            llm_config=llm_config,
            human_input_mode="NEVER",
            system_message=assistant_backstory
        )

        if "context" not in context:
            context["context"] = []

        history = ""
        for entry in context["context"]:
            history += f'{entry["role"]}: {entry["content"]}\n'

        context["context"].append({"role": "user", "content": input_prompt})

        if history:
            input_prompt += f"\n\nHere is the conversation history:\n{history}"

        result = demo_agent.generate_reply(
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": input_prompt}
            ]
        )

        context["context"].append({"role": "system", "content": result})
        return result, context

    def merge_kb_articles(self, kb_article_1: str, kb_article_2: str) -> Dict:
        try:
            system_prompt_html = """
                You are a knowledge management assistant.
                Merge the two knowledge articles into a single professional ITSM-style article.
                Return only the final HTML output.
            """

            system_prompt_analysis = """
                You are a knowledge management assistant.
                Analyze the two articles and return a Python dict with:
                grammar, overlapping, conflicting, complementary.
            """

            input_prompt = f"Article1: {kb_article_1}\nArticle2: {kb_article_2}"

            az_config_list = [{
                "model": self.model,
                "api_type": self.api_type,
                "base_url": self.azure_endpoint,
                "api_key": self.api_key,
                "api_version": self.api_version
            }]

            llm_config = {"config_list": az_config_list, "temperature": 1}

            merging_agent = autogen.ConversableAgent(
                name="article_merger",
                llm_config=llm_config,
                human_input_mode="NEVER"
            )

            html_response = merging_agent.generate_reply(
                messages=[
                    {"role": "system", "content": system_prompt_html},
                    {"role": "user", "content": input_prompt}
                ]
            )

            analysis_response = merging_agent.generate_reply(
                messages=[
                    {"role": "system", "content": system_prompt_analysis},
                    {"role": "user", "content": input_prompt}
                ]
            )

            cleaned_html_response = re.sub(r"^```html\s*|\s*```$", "", html_response.strip())
            cleaned_analysis_response = re.sub(r"^```python\s*|\s*```$", "", analysis_response.strip())

            output_dict = {
                "code": 200,
                "data": {
                    "merged_article": cleaned_html_response,
                    "details": eval(cleaned_analysis_response)["details"]
                }
            }
            return output_dict

        except Exception as e:
            return {"code": 400, "error": str(e)}

    def refine_kb_article(self, input_kb_article: str) -> Dict:
        try:
            system_prompt = """
                Refine the knowledge article to meet ITSM standards.
                Convert to clean, semantic HTML with Bootstrap styling.
            """
            input_prompt = f"Input Knowledge Article: {input_kb_article}"

            az_config_list = [{
                "model": self.model,
                "api_type": self.api_type,
                "base_url": self.azure_endpoint,
                "api_key": self.api_key,
                "api_version": self.api_version
            }]

            llm_config = {"config_list": az_config_list, "temperature": 0.8}

            refine_agent = autogen.ConversableAgent(
                name="article_refiner",
                llm_config=llm_config,
                human_input_mode="NEVER"
            )

            response = refine_agent.generate_reply(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": input_prompt}
                ]
            )

            cleaned_response = re.sub(r"^```[a-zA-Z]*\n?|```$", "", response.strip())

            return {"code": 200, "data": cleaned_response}

        except Exception as e:
            return {"code": 400, "error": str(e)}
