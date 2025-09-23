# Author - Viraj Purandare
# Created On - April 11, 2024

import os
from pathlib import Path

import chromadb
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from transformers import AutoTokenizer, AutoModel

# Path to this script
SCRIPT_PATH = Path(__file__).parent

# Ensure Transformers works offline
os.environ['TRANSFORMERS_OFFLINE'] = '1'


class KBManager:
    def __init__(self):
        """
        Initialize KBManager with a local embedding model.
        """
        model_dir = SCRIPT_PATH / "model"

        # Load tokenizer and model locally
        tokenizer = AutoTokenizer.from_pretrained(model_dir, local_files_only=True)
        model = AutoModel.from_pretrained(model_dir, local_files_only=True)

        # Initialize HuggingFaceEmbeddings with local model
        self.em_model = HuggingFaceEmbeddings(
            model_name=str(model_dir),
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': False}
        )

    def insert_documents(self, documents, kb_name='', collection_name=''):
        """
        Insert KB articles into Chroma Vector DB.
        """
        persist_dir = SCRIPT_PATH / (kb_name.strip() or 'platform_knowledge_base')

        db = Chroma.from_documents(
            documents,
            self.em_model,
            persist_directory=str(persist_dir),
            collection_name=collection_name or None
        )
        db.persist()
        print(f"{len(documents)} document(s) inserted to {persist_dir}.")

    def retrieve_kb_connection(self, kb_name='', collection_name=''):
        """
        Retrieve KB articles from Chroma Vector DB.
        """
        persist_dir = SCRIPT_PATH / (kb_name.strip() or 'platform_knowledge_base')

        db_connection = Chroma(
            persist_directory=str(persist_dir),
            embedding_function=self.em_model,
            collection_name=collection_name or None
        )
        return db_connection

    def update_kb_document(self, kb_name='', collection_name=''):
        """
        Retrieve and print all documents from a Chroma collection.
        """
        persist_dir = SCRIPT_PATH / kb_name.strip()
        db_update_collection = Chroma(
            persist_directory=str(persist_dir),
            embedding_function=self.em_model,
            collection_name=collection_name
        )

        result = db_update_collection.get()
        print(result)
