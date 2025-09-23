# Author - Viraj Purandare
# Created On - April 11, 2024

# Author - Viraj Purandare
# Created On - April 11, 2024

import os
import chromadb
from langchain_community.vectorstores import Chroma  # updated import
from langchain_huggingface import HuggingFaceEmbeddings
from transformers import AutoTokenizer, AutoModel, AutoModelForSequenceClassification

# Path to this script
SCRIPT_PATH = os.path.dirname(__file__)

# Ensure Transformers works offline if models are stored locally
os.environ['TRANSFORMERS_OFFLINE'] = '1'


class KBManager:
    def __init__(self):
        """
        Initialize KBManager with a local embedding model.
        """
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': False}

        self.em_model = HuggingFaceEmbeddings(
            model_name=os.path.join(SCRIPT_PATH, "model"),
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs
        )

    def insert_documents(self, documents, kb_name='', collection_name=''):
        """
        Insert KB articles into Chroma Vector DB.
        """
        persist_dir = os.path.join(SCRIPT_PATH, kb_name.strip() or 'platform_knowledge_base')

        db = Chroma.from_documents(
            documents,
            self.em_model,
            persist_directory=persist_dir,
            collection_name=collection_name or None
        )
        db.persist()
        print(f"{len(documents)} document(s) inserted to {persist_dir}.")

    def retrieve_kb_connection(self, kb_name='', collection_name=''):
        """
        Retrieve KB articles from Chroma Vector DB.
        """
        persist_dir = os.path.join(SCRIPT_PATH, kb_name.strip() or 'platform_knowledge_base')

        db_connection = Chroma(
            persist_directory=persist_dir,
            embedding_function=self.em_model,
            collection_name=collection_name or None
        )
        return db_connection

    def update_kb_document(self, kb_name='', collection_name=''):
        """
        Retrieve and print all documents from a Chroma collection.
        """
        persist_dir = os.path.join(SCRIPT_PATH, kb_name.strip())
        db_update_collection = Chroma(
            persist_directory=persist_dir,
            embedding_function=self.em_model,
            collection_name=collection_name
        )

        result = db_update_collection.get()
        print(result)
