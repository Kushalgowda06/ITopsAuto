import os
import sys
import datetime
from .configuration import config

import autogen

from fastapi import APIRouter, Body, Depends
# from project.user.model import *
# from project.auth.auth_handler import signJWT,decodeJWT
# from project.auth.auth_bearer import JWTBearer
# from project.knowledge_management_app.model import *

import os, sys, datetime, json, requests
from typing import *
from .configuration import config
from loguru import logger
import uuid
from fastapi.responses import JSONResponse
# from project.ticket_app.ticket_utils import *
# from project.knowledge_management_app.knowledge_management_utils import *

from fastapi import HTTPException
from fastapi import Request
# import icecream as ic
############################

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split("\\llm_app")[0]

sys.path.append(ROOT_PATH)

# logger_llm = logger.bind(api="llm_app_details")
# logger_llm.add("project/logs/llm_app_log.log", rotation="100 MB", retention="10 days", level="INFO", backtrace=True, diagnose=True)


#################
class LLMUtils:
        
    def __init__(self):

        self.api_key = config["openai_key"]
        self.api_version = config["openai_api_version"]
        self.azure_endpoint = config["openai_azure_enpoint"]
        self.model = config["openai_model"]
        self.api_type = config["api_type"]

        self.system_prompt = "You are a helpful assistant that responds to queries associated to IT stuff."
    

    def ask_llm(self, query:str = ""):

        input_prompt=f"{query}"

        az_config_list = [{
                "model": self.model,
                "api_type": self.api_type,
                "base_url": self.azure_endpoint,
                "api_key": self.api_key,
                "api_version": self.api_version
            }]

        # LLM configurations
        llm_config = {
            
            "config_list": az_config_list,
            "temperature": 0.5
        }

        # Agent definition
        generic_agent = autogen.ConversableAgent(
            name = "generic_agent",
            llm_config = llm_config,
            human_input_mode = "NEVER"
        )

        response = generic_agent.generate_reply(
            messages=[            
                {"role": "system", "content": self.system_prompt},                
                {"role": "user", "content": input_prompt}]
        )

        return response

    def ask_llm_with_context(self, query:str = "", context:dict = {}):

        input_prompt=f"{query}"

        # Define context and maintain conversation history
        messages = []
        if context == {}:
            messages = [
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": input_prompt}
                    ]
        else:
            messages += [
                    {"role": "user", "content": input_prompt}
                    ]

        az_config_list = [{
                "model": self.model,
                "api_type": self.api_type,
                "base_url": self.azure_endpoint,
                "api_key": self.api_key,
                "api_version": self.api_version
            }]

        # LLM configurations
        llm_config = {
            "config_list": az_config_list,
            "temperature": 0.5
            }

        # Agent definition
        generic_agent = autogen.ConversableAgent(
            name = "generic_agent",
            llm_config = llm_config,
            human_input_mode = "NEVER"
            )

        response = generic_agent.generate_reply(
            messages = messages
            )

        messages += [
                {"role": "system", "content": response}
                ]

        return (response, messages)


    # Ask llm to pretend an act for demo
    def ask_llm_to_act_for_demo(self, query:str = "", context:dict = {}):
        backstory_f = open(ROOT_PATH + "\\config\\demo_story.txt", "r")
        assistant_backstory = backstory_f.read()
        backstory_f.close()

        input_prompt = f"{query}"

        az_config_list = [{
                "model": self.model,
                "api_type": self.api_type,
                "base_url": self.azure_endpoint,
                "api_key": self.api_key,
                "api_version": self.api_version
            }]

        # LLM configurations
        llm_config = {
            "config_list": az_config_list,
            "temperature": 0.5
            }

        demo_agent = autogen.AssistantAgent(
                "demo_agent",
                llm_config = llm_config,
                human_input_mode = "NEVER",
                system_message = assistant_backstory
                )

        # Organize run context
        if context == {}:
            context["context"] = []

        history = ""
        for entry in context["context"]:
            history += entry["role"] + ": " + entry["content"] + "\n"

        context["context"].append({"role": "user", "content": input_prompt})

        if history != "":
            input_prompt += "\n\nHere is the conversation history that sets context for you\n********\n" + history + "\n********"

        summary_prompt = "Summarize the user's request response in a detailed or concise manner, based on the user's preference."
        summary_prompt += "\nUser's query was - " + input_prompt
        summary_prompt += "\n\nRESPONSE SHOULD NOT CONTAIN CREDENTIALS."

        result = demo_agent.generate_reply(
                messages = [
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": input_prompt}]
                )

        final_response_prompt = "Read the following details -\n\n----------------\nUSER QUERY -\n" + input_prompt
        final_response_prompt += "\n\nRESPONSE -\n" + result + "\n----------------"
        final_response_prompt += "\n\nUsing this information, form exact response to the user's latest query only."
        final_response_prompt += "\nENSURE TO EXCLUDE ANY CREDENTIAL DETAILS IN YOUR RESPONSE."

        result = self.ask_llm(final_response_prompt)
        context["context"].append({"role": "system", "content": result})

        return (result, context)


    def merge_kb_articles(self,kb_article_1:str, kb_article_2:str)->Dict:

        """The function accepts two different articles and merges them in to a coherent singular article """

        try:


            system_prompt_html="""

            You are a knowledge management assistant.

            I have two knowledge articles that need to be merged into a single, professional ITSM-style article.

            Please:
            - Analyze both articles for overlapping, conflicting, and complementary content.
            - Correct spelling and grammar issues.
            - Merge into a unified, non-redundant article with clear structure (headings, bullets, tables).
            - Include a summary at the top and a 'See Also' section at the bottom if relevant.


            Then:
            - Convert the merged article into a complete, semantic HTML page using Bootstrap.
            - Include DOCTYPE, head, body, and responsive layout.
            - Apply basic CSS for readability and professional ITSM tone.
            - Avoid JavaScript or dynamic scripting.
            - Ensure the HTML is valid and ready to be rendered in a browser.

          Return only the final output HTML as raw,
          unescaped content-do not wrap it in quotes, do not escape characters, and do not include \\n or \\".


            """

            system_prompt_analysis="""

            You are a knowledge management assistant.

            I have two knowledge articles that need to be merged into a single, professional ITSM-style article.

            Please:
            - Analyze both articles for overlapping, conflicting, and complementary content.
            - Correct spelling and grammar issues.
            - Merge into a unified, non-redundant article with clear structure (headings, bullets, tables).
            - Include a summary at the top and a 'See Also' section at the bottom if relevant.

            Track findings in Python lists:
            - overlapping_list: overlapping content [kb_article_1 or kb_article_2]
            - conflicting_list: conflicting content [kb_article_1 or kb_article_2]
            - complementary_info_list: complementary content [kb_article_1 or kb_article_2]
            - grammar_correct_list: phrases corrected [kb_article_1 or kb_article_2]


            Return only the following Python dictionary as output, with no additional explanation or formatting:
                {

                "details": {
                    "grammar": grammar_correct_list,
                    "overlapping": overlapping_list,
                    "conflicting": conflicting_list,
                    "complementary": complementary_info_list
                }
                }


            """



            input_prompt=f"""
                        Here are the two article,
                        Article1: {kb_article_1}

                        Article2: {kb_article_2}


                        """

            az_config_list = [{
                    "model": self.model,
                    "api_type": self.api_type,
                    "base_url": self.azure_endpoint,
                    "api_key": self.api_key,
                    "api_version": self.api_version
                }]


            llm_config = {

                "config_list": az_config_list,
                "temperature": 1
            }


            merging_agent = autogen.ConversableAgent(
                name="article_merger",
                llm_config=llm_config,
                human_input_mode="NEVER"
            )



            html_response = merging_agent.generate_reply(
                messages=[

                    {"role": "system", "content": system_prompt_html},

                    {"role": "user", "content": input_prompt}]
            )


            analysis_response = merging_agent.generate_reply(
                messages=[

                    {"role": "system", "content": system_prompt_analysis},

                    {"role": "user", "content": input_prompt}]
            )



            cleaned_html_response = re.sub(r"^```html\s*|\s*```$", "", html_response.strip())
            cleaned_analysis_response = re.sub(r"^```python\s*|\s*```$", "", analysis_response.strip())

            # print(cleaned_html_response)
            # print(cleaned_analysis_response)
            output_dict={}
            output_dict['code']=200


            output_dict['data']={"merged_article": cleaned_html_response,
                                 "details":eval(cleaned_analysis_response)["details"]}




            logger_llm.info(f"API merge_kb_articles called user:{current_user}")

            return output_dict




        except Exception as e:


            output_dict={}
            output_dict['code']=400
            output_dict['error']=str(e)

            logger_llm.error(f"Error occurred in API merge_kb_articles {str(e)} user: {current_user}")
            return output_dict


    def refine_kb_article(self, input_kb_article:str)-> Dict:

        """This function accepts the input knowledge article and introduced
        necessary changes as per ServiceNow standards """

        try:


            system_prompt="""
                Please ensure your Knowledge Base article meets the following standards:

                Basic Information
                - Title: Clear, concise, and searchable (e.g., “Resolving SSH Timeout on Azure VM”)
                - Category/Subcategory: Correctly classified for easy discovery


                Content Quality
                - Minimum Word Count: At least 150-200 words
                - Structured Format:
                - Summary
                - Step-by-step instructions: Detail atleast two sub-steps (bullet them) for each step and provide some explanation for each.
                - Validation steps
                - Troubleshooting section
                - Related links or articles
                - Language: Free of spelling and grammar errors
                - Tone: Professional, neutral, and easy to understand

                Search Optimization
                - Include relevant keywords users might search for
                - Avoid vague or overly technical jargon unless necessary

                Compliance and Accuracy
                - No sensitive data (e.g., passwords, internal IPs)
                - Content must be technically accurate and validated
                - SME review or peer validation recommended
                
                After refining,
                Convert the article into clean, semantic HTML.
                Use Bootstrap for styling.
                Apply basic CSS styling for headings, sections, bullet points, and emphasis. background should be black and heading should be blue mandatorilty.
                Ensure the layout is responsive and readable on both desktop and mobile.
                Use a professional, clean style suitable for IT service documentation.

                Give the outout in styled format only
                """

            input_prompt=f"""
                    Input Knowledge Article: {input_kb_article}

                        """

            az_config_list = [{
                    "model": self.model,
                    "api_type": self.api_type,
                    "base_url": self.azure_endpoint,
                    "api_key": self.api_key,
                    "api_version": self.api_version
                }]


            llm_config = {

                "config_list": az_config_list,
                "temperature": 0.8
            }


            refine_agent = autogen.ConversableAgent(
                name="article_refiner",
                llm_config=llm_config,
                human_input_mode="NEVER"
            )



            response = refine_agent.generate_reply(
                messages=[

                    {"role": "system", "content": system_prompt},

                    {"role": "user", "content": input_prompt}]
            )


            cleaned_response = re.sub(r"^```[a-zA-Z]*\n?|```$", "", response.strip())
            output_dict={}
            output_dict['code']=200
            output_dict['data']=cleaned_response
            logger_llm.info(f"API refine_kb_articles called user:{current_user}")
            return output_dict


        except Exception as e:

            output_dict={}
            output_dict['code']=400
            output_dict['error']=str(e)
            logger_llm.error(f"Error occurred in API refine_kb_articles user: {current_user}")
            return output_dict




