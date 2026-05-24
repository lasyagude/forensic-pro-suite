from exif import Image
from typing import Dict, Any, Optional

def extract_exif_data(image_bytes: bytes) -> Dict[str, Any]:
    try:
        img = Image(image_bytes)
        has_metadata = img.has_exif
        if not has_metadata:
            return {"status": "skipped", "message": "No EXIF data found."}
    except Exception as e:
        error_msg = str(e)
        if "TiffByteOrder" in error_msg or "unpack operation" in error_msg:
            return {
                "status": "skipped", 
                "message": f"Image file contains non-standard or corrupt metadata byte arrays (AI-generated graphic or screenshot detected)."
            }
        return {"status": "error", "message": f"Failed to initialize image parser: {error_msg}"}
        
    try:
        if not hasattr(img, 'gps_latitude') or not hasattr(img, 'gps_longitude'):
            return {"status": "skipped", "message": "EXIF block present but lacks embedded geospatial tags"}
            
        latitude = img.gps_latitude
        longitude = img.gps_longitude
        latitude_ref = img.gps_latitude_ref if hasattr(img, 'gps_latitude_ref') else 'N'
        longitude_ref = img.gps_longitude_ref if hasattr(img, 'gps_longitude_ref') else 'E'

        if not isinstance(latitude, (tuple, list)) or not isinstance(longitude, (tuple, list)):
            return {"status": "skipped", "message": "EXIF block present but geospatial tags are not in expected format"}
            
        if len(latitude) < 3 or len(longitude) < 3:
            return {"status": "skipped", "message": "EXIF block present but geospatial tags are too short to be valid"}
            
        lat_dd = float(latitude[0]) + float(latitude[1]) / 60 + float(latitude[2]) / 3600
        lon_dd = float(longitude[0]) + float(longitude[1]) / 60 + float(longitude[2]) / 3600

        if latitude_ref == 'S':
            lat_dd = -lat_dd
        if longitude_ref == 'W':
            lon_dd = -lon_dd

        timestamp: Optional[str] = getattr(img, "datetime_original", None)

        return {
            "status": "success",
            "latitude": round(lat_dd, 6),
            "longitude": round(lon_dd, 6),
            "timestamp": timestamp
        }
   
    except Exception as e:
        return {"status": "error", "message": f"Failed to extract EXIF data: {str(e)}"}
