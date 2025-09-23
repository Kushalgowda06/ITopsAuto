import os

def get_config():
    """
    Loads configuration from environment variables.
    """
    return {
        "version": os.environ.get("VERSION", "v1"),
        "vault_path": os.environ.get("VAULT_PATH", "vault_path"),
        "snow_url": os.environ.get("SNOW_URL", "https://cisicmpengineering1.service-now.com"),
        "snow_username": os.environ.get("SNOW_USERNAME", "ServicenowAPI"),
        "snow_password": os.environ.get("SNOW_PASSWORD"),  # Reads from .env
        "kb_postgre_database": os.environ.get("KB_POSTGRE_DATABASE"),
        "kb_postgre_table": os.environ.get("KB_POSTGRE_TABLE"),
        "kb_postgre_user": os.environ.get("KB_POSTGRE_USER"),
        "kb_postgre_password": os.environ.get("KB_POSTGRE_PASSWORD"),
        "kb_postgre_host": os.environ.get("KB_POSTGRE_HOST"),
        "kb_postgre_port": os.environ.get("KB_POSTGRE_PORT"),
        "openai_key": os.environ.get("OPENAI_KEY"),  # Reads from .env
        "openai_api_version": os.environ.get("OPENAI_API_VERSION"),
        "openai_azure_enpoint": os.environ.get("OPENAI_AZURE_ENPOINT"),
        "openai_model": os.environ.get("OPENAI_MODEL"),
        "api_type": os.environ.get("API_TYPE")
    }

config = get_config()
