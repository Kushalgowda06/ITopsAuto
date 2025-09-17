import os
from transformers import AutoTokenizer, AutoModel, AutoModelForSequenceClassification

SCRIPT_PATH = os.path.dirname(__file__)

model_name = "sentence-transformers/all-mpnet-base-v2"

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.save_pretrained(SCRIPT_PATH + "\\model")

'''
model = AutoModel.from_pretrained(model_name)
model.save_pretrained(SCRIPT_PATH + "\\model")
'''

from sentence_transformers import SentenceTransformer

model = SentenceTransformer(model_name)
model.save(SCRIPT_PATH + "\\model")
