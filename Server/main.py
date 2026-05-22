from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from security import (
    inspect_archive_limits,
    remove_file,
    run_analysis_in_worker,
    run_antivirus_scan,
    stream_upload_to_tempfile,
    validate_analyze_api_key,
)
import os
import time
import logging
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

allowed_origin = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {
    ".dd", ".img", ".e01", ".ex01", ".l01", ".s01",
    ".pcap", ".pcapng",
    ".pdf", ".docx", ".xlsx", ".txt", ".csv", ".log",
    ".jpg", ".jpeg", ".png", ".bmp", ".tiff",
    ".zip", ".tar", ".gz",
}

MAX_FILE_SIZE = 500 * 1024 * 1024


def get_api_user(authorization: str | None = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = parts[1]

    admin_token = os.getenv("ADMIN_TOKEN")
    investigator_token = os.getenv("INVESTIGATOR_TOKEN")

    if admin_token and token == admin_token:
        return {"id": "admin", "role": "admin", "token": token}
    if investigator_token and token == investigator_token:
        return {"id": "investigator", "role": "investigator", "token": token}

    raise HTTPException(status_code=403, detail="Forbidden")


def write_audit(entry: str):
    try:
        with open("server_audit.log", "a") as f:
            f.write(entry + "\n")
    except Exception:
        logger.warning("Failed to write audit log")


@app.get("/api/stats")
async def get_case_stats(current_user: dict = Depends(get_api_user)):
    ...