"""Get current user endpoint for Vercel"""
import asyncio

from ..utils.database import get_database
from ..utils.auth import get_current_user, user_to_response
from ..utils.response import success_response, error_response

async def handler(event, context):
    """Handle get current user"""
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
        
        return success_response(user_to_response(current_user))
        
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