from fastapi import FastAPI, UploadFile, File, HTTPException, Request
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


@app.get("/api/stats")
async def get_case_stats():
    try:
        from supabase import create_client
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_ANON_KEY")

        if not url or not key:
            raise HTTPException(status_code=500, detail="Supabase credentials not configured.")

        client = create_client(url, key)
        response = client.table("cases").select("status").execute()
        cases = response.data

        total = len(cases)
        pending = sum(1 for c in cases if (c.get("status") or "").lower() == "pending")
        verified = sum(1 for c in cases if (c.get("status") or "").lower() == "verified")

        return {
            "total": total,
            "pending": pending,
            "verified": verified,
            "reports_generated": verified
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Stats endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching stats.")


@app.post("/api/analyze")
async def run_forensic_pipeline(request: Request, file: UploadFile = File(...)):
    try:
        validate_analyze_api_key(request.headers.get("x-analyze-key"))

        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type '{ext}' is not permitted. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )

        tmp_path = None
        archive_metadata = None

        try:
            tmp_path, _ = await stream_upload_to_tempfile(file, ext)
            archive_metadata = inspect_archive_limits(tmp_path, file.filename or "")
            antivirus_result = run_antivirus_scan(tmp_path)
            report = run_analysis_in_worker(tmp_path)
        finally:
            if tmp_path:
                remove_file(tmp_path)

        return {
            "id": f"CASE-{int(time.time())}",
            "filename": file.filename,
            "hash": f"SHA256: {report['hash_sha256']}",
            "hash_md5": f"MD5: {report['hash_md5']}",
            "size": f"{report['metadata']['size_bytes']} bytes",
            "created": report['metadata']['created'],
            "modified": report['metadata']['modified'],
            "accessed": report['metadata']['accessed'],
            "permissions": report['metadata']['permissions'],
            "exif_metadata": report['metadata']['exif'],
            "magic_signature": report['metadata']['magic_signature'],
            "threat_level": report['threat_level'],
            "status": "COMPLETED",
            "report_generated": True,
            "findings": f"Advanced Forensic Analysis: {report['metadata']['magic_signature']} detected. Integrity verified via Dual-Hash (SHA256+MD5).",
            "antivirus_scan": antivirus_result,
            "archive_inspection": archive_metadata,
            "analysis_mode": "isolated-worker",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Forensic pipeline error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during forensic analysis.")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError as e:
                logger.warning(f"Failed to cleanup temp file {tmp_path}: {str(e)}")