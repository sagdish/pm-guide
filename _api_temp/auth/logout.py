"""User logout endpoint for Vercel"""
import asyncio

from ..utils.response import success_response, error_response

async def handler(event, context):
    """Handle user logout (client-side token removal)"""
    try:
        # Get authorization header (just for validation)
        headers = event.get('headers', {})
        auth_header = headers.get('authorization') or headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return error_response(401, "Missing or invalid authorization header")
        
        return success_response({"message": "Successfully logged out"})
        
    except Exception as e:
        return error_response(500, "Internal server error", str(e))

def main(event, context):
    """Main entry point for Vercel"""
    # Handle OPTIONS for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return success_response({})
    
    if event.get('httpMethod') != 'POST':
        return error_response(405, "Method not allowed")
    
    # Run async handler
    return asyncio.run(handler(event, context))