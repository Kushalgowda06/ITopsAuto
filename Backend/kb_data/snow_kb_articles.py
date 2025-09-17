import os
import sys
import datetime

import json
import requests

from langchain.schema import Document
from langchain_community.document_loaders import UnstructuredHTMLLoader

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split('\\kb_data')[0]
print(ROOT_PATH)

sys.path.append(ROOT_PATH)

from vault import Vault
from database.vectordb_connector import VectorDatabase

class ServiceNowKBArticles:
    def __init__(self):
        

        #Collect servicenow configuration details
        app_conf_path = ROOT_PATH + '\\config\\app_config.json'

        app_conf_file = open(app_conf_path, 'r')
        app_conf = json.load(app_conf_file)
        app_conf_file.close()

        # Initiate vault
        vault_path = ROOT_PATH + '\\config\\.vault_token'

        vault_file = open(vault_path, 'r')
        vault_token = vault_file.read().strip()
        vault_file.close()

        vault_url = app_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        # Fetch ServiceNow credentials
        self.snow_url = app_conf['snow_url']
        snow_tag = app_conf['snow_tag']

        if self.snow_url.endswith('/'):
            self.snow_url = self.snow_url[:-1]

        snow_creds = self.vault_session.retrieve_secret(snow_tag)
        if snow_creds[0]:
            for k, v in snow_creds[1].items():
                self.snow_username = k
                self.snow_password = v
        else:
            self.snow_username = None
            self.snow_password = None

        self.headers = {'content-type': 'application/json'}

    # Fetch list of change requests
    def get_kb_articles_details(self, number = None):
        target_url = self.snow_url + '/api/now/table/kb_knowledge'

        filters = {}
        # filters['sysparm_query'] = 'category=Outlook^'
        # filters['sysparm_query'] = 'short_descriptionLIKELinux^'

        if number != None:
            filters['sysparm_query'] = 'number=' + number

        filters['sysparm_fields'] = 'sys_id,number,category,short_description,text'

        filters['sysparm_display_value'] = 'true'
        filters['sysparm_exclude_reference_link'] = 'true'

        if 'sysparm_query' in filters.keys():
            filters['sysparm_query'] += '^workflow_state=published'
        else:
            filters['sysparm_query'] = '^workflow_state=published'

        if filters != {}:
            target_url += '?'

        for fl_nm, fl_val in filters.items():
            target_url += '&' + fl_nm + '=' + fl_val

        try:
            response = requests.get(target_url, auth = (self.snow_username, self.snow_password), \
                    headers = self.headers, verify = False)

            kb_articles = response.json()['result']
            print(len(kb_articles))
        except Exception as e:
            print(str(e))
            return []

        for ind in range(len(kb_articles)):
            f_path = SCRIPT_PATH + '\\' + kb_articles[ind]['number'] + '.html'
            f = open(f_path, 'w+')
            try:
                f.write(kb_articles[ind]['text'])
                f.close()
            except:
                #os.remove(f_path)
                continue

            # Parse HTML content of the document using langchain document loader
            loader = UnstructuredHTMLLoader(f_path)
            data = loader.load()
            kb_articles[ind]['text'] = data[0].page_content
            kb_articles[ind]['kb_link'] = self.snow_url + '/now/nav/ui/classic/params/target/kb_view.do%3Fsys_kb_id%3D' + kb_articles[ind]['sys_id']

            os.remove(f_path)

        return kb_articles

if __name__ == '__main__':
    sn_kb_art_obj = ServiceNowKBArticles()
    kb_articles = sn_kb_art_obj.get_kb_articles_details()

    # for kb_article in kb_articles:
    #     print(kb_article['number'])
    # exit()

    kb_documents = []
    for kb_article in kb_articles:

        if kb_article['text'] != None:
            content = 'Short Description - ' + kb_article['short_description'] + '\n\n'
            content += 'Content - \n' + kb_article['text']
            try:
                metadata = {'number': kb_article['number'], 'kb_link': kb_article['kb_link']}
            except:
                metadata = {'number': kb_article['number'], 'kb_link': "NA"}

        kb_documents.append(
            {
                "content": content,
                "metadata": metadata
            }
        )
    db = VectorDatabase()
    count = db.insert_data(kb_documents, 'kb_articles')
    print(count, 'documents inserted into kb_articles table')
 