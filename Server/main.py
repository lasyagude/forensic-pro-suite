from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from engine import ForensicEngine
import asyncio
import tempfile
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
async def run_forensic_pipeline(file: UploadFile = File(...), current_user: dict = Depends(get_api_user)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' is not permitted. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    tmp_path = None
    try:
        user_id = current_user.get("id")
        sha256 = hashlib.sha256()
        md5 = hashlib.md5()
        total = 0

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            while True:
                chunk = await file.read(65536)
                if not chunk:
                    break
                total += len(chunk)
                if total == 0:
                    continue
                if total > MAX_FILE_SIZE:
                    raise HTTPException(status_code=413, detail="File exceeds the 500 MB size limit.")
                tmp.write(chunk)
                sha256.update(chunk)
                md5.update(chunk)
            tmp_path = tmp.name

        if total == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        pre_hashes = {"sha256": sha256.hexdigest(), "md5": md5.hexdigest()}
        # only investigators or admins can upload
        if current_user.get("role") not in ("investigator", "admin"):
            raise HTTPException(status_code=403, detail="Insufficient role")

        engine = ForensicEngine(tmp_path, precomputed_hashes=pre_hashes)
        report = engine.run_automated_process()

        await asyncio.sleep(2)

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
            "magic_signature": report['metadata']['magic_signature'],
            "threat_level": report['threat_level'],
            "status": "COMPLETED",
            "report_generated": True,
            "findings": f"Advanced Forensic Analysis: {report['metadata']['magic_signature']} detected. Integrity verified via Dual-Hash (SHA256+MD5)."
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Forensic pipeline error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during forensic analysis.")
    finally:
        # cleanup
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError as e:
                logger.warning(f"Failed to cleanup temp file {tmp_path}: {str(e)}")
        # audit
        audit_entry = f"user={user_id if 'user_id' in locals() else 'unknown'} filename={getattr(file, 'filename', '')} size={total if 'total' in locals() else 0}"
        write_audit(audit_entry)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
