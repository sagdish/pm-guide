"""RICE calculation history endpoint for Vercel"""
import asyncio

from ..utils.database import get_database
from ..utils.auth import get_current_user
from ..utils.response import success_response, error_response

async def handler(event, context):
    """Handle get RICE calculation history"""
    try:
        # Get authorization header
        headers = event.get('headers', {})
        auth_header = headers.get('authorization') or headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return error_response(401, "Missing or invalid authorization header")
        
        # Extract token
        token = auth_header.split(' ')[1]
        
        # Get database
        db = await get_database()
        
        # Get current user
        current_user = await get_current_user(db, token)
        if not current_user:
            return error_response(401, "Invalid token")
        
        user_id = current_user["_id"]
        
        # Get calculations sorted by creation date (newest first)
        calculations = await db.rice_calculations.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(50).to_list(50)
        
        # Convert to response format
        response_list = []
        for calc in calculations:
            response_list.append({
                "id": str(calc["_id"]),
                "feature_name": calc["feature_name"],
                "reach": calc["reach"],
                "impact": calc["impact"],
                "confidence": calc["confidence"],
                "effort": calc["effort"],
                "score": calc["score"],
                "created_at": calc["created_at"]
            })
        
        return success_response(response_list)
        
    except Exception as e:
        return error_response(500, "Internal server error", str(e))

def main(event, context):
    """Main entry point for Vercel"""
    # Handle OPTIONS for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return success_response({})
    
    if event.get('httpMethod') != 'GET':
        return error_response(405, "Method not allowed")
    
    # Run async handler
    return asyncio.run(handler(event, context))