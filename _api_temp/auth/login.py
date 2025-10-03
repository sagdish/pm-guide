"""User login endpoint for Vercel"""
import asyncio
from datetime import datetime, timedelta

from ..utils.database import get_database
from ..utils.auth import authenticate_user, create_access_token, user_to_response
from ..utils.models import UserLogin
from ..utils.response import success_response, error_response

async def handler(event, context):
    """Handle user login"""
    try:
        # Parse request body
        import json
        body = json.loads(event.get('body', '{}'))
        
        # Validate input
        try:
            user_credentials = UserLogin(**body)
        except Exception as e:
            return error_response(400, "Invalid input", str(e))
        
        # Get database
        db = await get_database()
        
        # Authenticate user
        user = await authenticate_user(db, user_credentials.email, user_credentials.password)
        if not user:
            return error_response(401, "Incorrect email or password")
        
        # Create access token
        access_token_expires = timedelta(hours=24)
        access_token = create_access_token(
            data={"sub": str(user["_id"])}, expires_delta=access_token_expires
        )
        
        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_to_response(user)
        }
        
        return success_response(response_data)
        
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