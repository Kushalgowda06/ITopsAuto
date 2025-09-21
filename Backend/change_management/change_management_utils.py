import json
import os
import sys
import datetime
import base64

from .change_assistant import ChangeAssistant
from .itsm_connector import ITSM
#import visual_analyzer

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = os.path.dirname(SCRIPT_PATH.split('/change_management/')[0])
sys.path.append(ROOT_PATH)
sys.path.append(SCRIPT_PATH)

from vault import Vault
import tech_buddy_autogen
import visual_analyzer

class ChangeManagement:
    def __init__(self):
        """Initialize the Change Management system."""
        print(f"SCRIPT PATH -------------{SCRIPT_PATH}")
        print(f"ROOT_PATH ---------------{ROOT_PATH}")
        conf_f_path = ROOT_PATH + '/config/mim_conf.json'

        # Read configuration file
        with open(conf_f_path) as conf_f:
            mim_conf = json.load(conf_f)

        self.snow_url = mim_conf['snow_url']
        if self.snow_url.endswith('/'):
            self.snow_url = self.snow_url[:-1]

        # Use VAULT_TOKEN from environment variable
        vault_token = os.environ.get("VAULT_TOKEN")
        if not vault_token:
            raise ValueError("VAULT_TOKEN environment variable is not set!")

        vault_url = mim_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        self.ke_category = mim_conf["ke_category_name"]

        if mim_conf['proxy_url']:
            self.proxies = {
                "http": mim_conf['proxy_url'],
                "https": mim_conf['proxy_url']
            }
        else:
            self.proxies = None

        snow_tag = mim_conf['snow_tag']

        if self.snow_url.endswith('\\'):
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
