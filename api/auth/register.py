"""User registration endpoint for Vercel"""
import asyncio
from datetime import datetime
from bson import ObjectId

from ..utils.database import get_database
from ..utils.auth import get_password_hash, create_access_token, get_user_by_email, user_to_response
from ..utils.models import UserCreate, TokenResponse
from ..utils.response import success_response, error_response

async def handler(event, context):
    """Handle user registration"""
    try:
        # Parse request body
        import json
        body = json.loads(event.get('body', '{}'))
        
        # Validate input
        try:
            user_data = UserCreate(**body)
        except Exception as e:
            return error_response(400, "Invalid input", str(e))
        
        # Get database
        db = await get_database()
        
        # Check if user already exists
        existing_user = await get_user_by_email(db, user_data.email)
        if existing_user:
            return error_response(400, "Email already registered")
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        user_dict = {
            "_id": ObjectId(),
            "email": user_data.email,
            "password": hashed_password,
            "name": user_data.name,
            "role": "learner",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": None
        }
        
        # Insert user into database
        result = await db.users.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        # Initialize user progress
        progress_dict = {
            "_id": ObjectId(),
            "user_id": result.inserted_id,
            "completed_sections": [],
            "module_progress": {
                "pm-basics": {"completed": False, "completed_at": None},
                "discovery": {"completed": False, "completed_at": None},
                "product-sense": {"completed": False, "completed_at": None},
                "metrics": {"completed": False, "completed_at": None},
                "ai-era": {"completed": False, "completed_at": None},
                "tools": {"completed": False, "completed_at": None}
            },
            "assessment_scores": [],
            "total_progress": 0.0,
            "last_accessed_module": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.user_progress.insert_one(progress_dict)
        
        # Create access token
        from datetime import timedelta
        access_token_expires = timedelta(hours=24)
        access_token = create_access_token(
            data={"sub": str(result.inserted_id)}, expires_delta=access_token_expires
        )
        
        # Update last login
        await db.users.update_one(
            {"_id": result.inserted_id},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        response_data = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_to_response(user_dict)
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