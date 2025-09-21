# Author - Viraj Purandare
# Created On - August 19, 2024

import os
import sys
import datetime
import json
import requests

SCRIPT_PATH = os.path.dirname(__file__)
ROOT_PATH = SCRIPT_PATH.split('/itsm')[0]

sys.path.append(ROOT_PATH)

from vault import Vault

class ITSM:
    def __init__(self):
        conf_f_path = os.path.join(ROOT_PATH, 'config', 'app_config.json')

        # Read configuration file
        with open(conf_f_path, 'r') as conf_f:
            app_conf = json.load(conf_f)

        self.snow_url = app_conf['snow_url'].rstrip('/')

        # Initiate vault
        vault_token = os.environ.get("VAULT_TOKEN")
        if vault_token:
            print("Vault token found in environment.")
        else:
            vault_path = os.path.join(ROOT_PATH, 'config', '.vault_token')
            with open(vault_path, 'r') as vault_file:
                vault_token = vault_file.read().strip()

        vault_url = app_conf['vault_url']
        self.vault_session = Vault(vault_url, vault_token)

        snow_tag = app_conf['snow_tag']
        snow_creds = self.vault_session.retrieve_secret(snow_tag)

        if snow_creds[0]:
            for k, v in snow_creds[1].items():
                self.snow_username = k
                self.snow_password = v
        else:
            self.snow_username = None
            self.snow_password = None

        self.auth_status = True
        self.headers = {'Content-Type': 'application/json'}

    def get_ticket_details(self, table='incident', start_ts=None, end_ts=None, conditions=None):
        """
        Fetch list of incidents or other ServiceNow tickets.

        Args:
            table (str): Table name in ServiceNow (default 'incident')
            start_ts (str): Start timestamp in '%Y-%m-%d %H:%M:%S' format
            end_ts (str): End timestamp in '%Y-%m-%d %H:%M:%S' format
            conditions (list): List of dictionaries with keys 'param', 'op', 'val'
        
        Returns:
            list: List of tickets
        """
        if conditions is None:
            conditions = []

        tickets = []
        target_url = f"{self.snow_url}/api/now/table/{table}"

        # Base filter query
        filters = {
            'sysparm_query': 'stateNOT IN6,7^assignment_groupSTARTSWITHZenossGroup^ORassignment_groupSTARTSWITHDWP Operations Center'
        }

        # Add custom conditions
        for condition in conditions:
            filters['sysparm_query'] += f"^{condition['param']}{condition['op']}{condition['val']}"

        # Add date range filter if both start and end are provided
        if start_ts and end_ts:
            try:
                start_ts_obj = datetime.datetime.strptime(start_ts, '%Y-%m-%d %H:%M:%S')
                end_ts_obj = datetime.datetime.strptime(end_ts, '%Y-%m-%d %H:%M:%S')

                if end_ts_obj < start_ts_obj:
                    print("Warning: End timestamp is earlier than start timestamp. Returning empty list.")
                    return tickets

                filters['sysparm_query'] += f"^opened_atBETWEEN{start_ts_obj.strftime('%Y-%m-%d %H:%M:%S')}@{end_ts_obj.strftime('%Y-%m-%d %H:%M:%S')}"

            except ValueError as ve:
                print(f"Error parsing timestamps: {ve}")
                return tickets

        try:
            response = requests.get(
                target_url,
                auth=(self.snow_username, self.snow_password),
                headers=self.headers,
                params=filters
            )
            response.raise_for_status()
            tickets = response.json().get('result', [])

        except requests.exceptions.RequestException as e:
            print(f"Error fetching tickets: {e}")

        return tickets
