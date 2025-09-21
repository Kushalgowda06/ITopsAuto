import json
import os

from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from typing import Optional
from .file_upload import UploadService

SCRIPT_PATH = os.path.dirname(__file__)

# Use Linux-style paths
mim_conf_path = SCRIPT_PATH.split('/change_management')[0] + '/config/mim_conf.json'

# Load configuration
with open(mim_conf_path, 'r') as mim_conf_file:
    mim_conf = json.load(mim_conf_file)

# Vault token from environment variable (optional)
vault_token = os.environ.get("VAULT_TOKEN")
if vault_token:
    print("Vault token found in environment.")
else:
    print("Vault token not set in environment; skipping vault initialization.")

router = APIRouter()
upload_service = UploadService()

# =========================
# Routes
# =========================
@router.post(f"/api/{mim_conf['api_version']}/change_management_file/upload_image/", status_code=200)
async def file_upload(file: Optional[UploadFile] = File(default=None)):
    if file is None:
        return {"detail": "No File provided, Skipping upload"}
                
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    # Optional: validate content type or extension
    allowed_types = {"image/png", "image/jpeg", "image/svg"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    try:
        result = upload_service.upload_file(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {e}")
    finally:
        await file.close()

    return result
