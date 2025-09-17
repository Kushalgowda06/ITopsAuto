# Author - Viraj Purandare
# Created On - August 4, 2024

import os
import sys
import json

from langchain.prompts import (
        ChatPromptTemplate,
        PromptTemplate,
        SystemMessagePromptTemplate,
        HumanMessagePromptTemplate,
        AIMessagePromptTemplate
        )

from langchain.schema import Document

SCRIPT_PATH = os.path.dirname(__file__)

ROOT_PATH = SCRIPT_PATH.split('\\knowledge_management')[0]
sys.path.append(ROOT_PATH)

from database.vectordb_connector import VectorDatabase
from llm_app.llm_utils import LLMUtils

class KnowledgeAssistant:
    def __init__(self):
        pass

    def get_contextual_response(self, query):
        vector_db_obj = VectorDatabase()
        kb_articles = vector_db_obj.retrieve_data(query = query, collection = 'kb_articles')

        response = 'Reference KB Articles - \n'

        # Orgzanize KB articles
        page_contents = {}
        for doc in kb_articles:
            if doc['metadata']['number'] not in response:
                response += doc['metadata']['number'] + '\n' # + ' - Similarity - ' + str(round(doc['similarity'] * 100, 2)) # + '% - KB Link - ' + doc['metadata']['link'] + '\n'
            if doc['metadata']['number'] not in page_contents:
                page_contents[doc['metadata']['number']] = ''
           
            page_contents[doc['metadata']['number']] += doc['content']

        articles = ''

        # Handle absence of relevant KB articles
        if page_contents == {}:
            response += 'No relevant knowledge articles found in respository. However, you can try below solution - \n\n'

            system_message = 'You are a technical SME who likes to create a knowledge article that consists of step by step solution with all relevant commands and examples for elaboration.'
            system_message_prompt = SystemMessagePromptTemplate.from_template(system_message)

            human_message = query
            human_message_prompt = HumanMessagePromptTemplate.from_template(human_message)

        else:
            # Summarize the content of KB articles
            response += '\n\n'

            system_message = 'Summarize the knowledge you go through in a generic fashion without including sensitive data. For the the given issue, represent the issue summary, diagosis and resolution suggestions professionally. I need strictly 3 things and no intro and conclusion. Also, ensure to use VM IPs, database names or specific naes those appear real while contextualizing solutions.'
            system_message_prompt = SystemMessagePromptTemplate.from_template(system_message)

            human_message = '''
            Consider a following content delimited by 3 back ticks - 

            ```
            {articles}
            ```

            The content is a collection of articles. Go through all articles and form a sequence of steps to resolve the issue. Make sure to include a reference of knowledge article number in brackets.

            It should be to the point and mainly should include commands and 1 line elaboration per command.
            The response should be in context to the following question delimited by 3 back ticks - ```
            ''' 

            human_message += query + '```'
            human_message += 'You can ignore some steps if they are not relevant to direct resolution of the issue.'

            count = 1
            for kb_number, kb_content in page_contents.items():
                articles += str(count) + '. Article number - ' + kb_number + '\n' + 'Article summary - ' + kb_content
                articles += '\n---------------------------------------------------------------------------------------------\n'

                count += 1

            articles = articles.strip()

            human_message_prompt = HumanMessagePromptTemplate.from_template(human_message)
            human_message_prompt.prompt.input_variables = [articles]

        # Form a prompt for contextualization
        chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

        llm_obj = LLMUtils()
        summary = llm_obj.ask_llm(chat_prompt)

        # Tag KB articles with links
        final_response = ''
        for line in response.split('\n'):
            if 'Similarity' in line and 'KB Link' in line:
                if line.split(' - Similarity - ')[0].strip() in summary:
                    final_response += line + '\n'
            else:
                final_response += line + '\n'

        response += summary
        return response

'''
ka = KnowledgeAssistant()
print(ka.get_contextual_response(query = 'Testing'))
'''
