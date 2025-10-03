"""Response utilities for Vercel serverless functions"""
import json
from typing import Any, Dict, Optional

def create_response(
    status_code: int = 200,
    body: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """Create standardized HTTP response for Vercel"""
    default_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
    
    if headers:
        default_headers.update(headers)
    
    response = {
        "statusCode": status_code,
        "headers": default_headers
    }
    
    if body is not None:
        response["body"] = json.dumps(body, default=str)
    
    return response

def error_response(status_code: int, message: str, detail: Optional[str] = None) -> Dict[str, Any]:
    """Create error response"""
    error_body = {"error": message}
    if detail:
        error_body["detail"] = detail
    
    return create_response(status_code, error_body)

def success_response(data: Any, status_code: int = 200) -> Dict[str, Any]:
    """Create success response"""
    return create_response(status_code, data)