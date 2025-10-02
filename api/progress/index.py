"""Get user progress endpoint for Vercel"""
import asyncio
from bson import ObjectId
from datetime import datetime

from ..utils.database import get_database
from ..utils.auth import get_current_user
from ..utils.models import ProgressResponse, ModuleProgress, AssessmentScore
from ..utils.response import success_response, error_response

async def get_user_progress(db, user_id):
    """Get or create user progress"""
    progress = await db.user_progress.find_one({"user_id": user_id})
    
    if not progress:
        # Create default progress if it doesn't exist
        progress_dict = {
            "_id": ObjectId(),
            "user_id": user_id,
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
        progress = progress_dict
    
    return progress

async def handler(event, context):
    """Handle get user progress"""
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
        progress = await get_user_progress(db, user_id)
        
        # Convert to response format
        module_progress = {}
        for module_id, module_data in progress["module_progress"].items():
            module_progress[module_id] = {
                "completed": module_data.get("completed", False),
                "completed_at": module_data.get("completed_at")
            }
        
        assessment_scores = []
        for score_data in progress.get("assessment_scores", []):
            assessment_scores.append({
                "assessment_id": score_data["assessment_id"],
                "score": score_data["score"],
                "answers": score_data["answers"],
                "completed_at": score_data["completed_at"]
            })
        
        response_data = {
            "completed_sections": progress["completed_sections"],
            "module_progress": module_progress,
            "assessment_scores": assessment_scores,
            "total_progress": progress["total_progress"],
            "last_accessed_module": progress.get("last_accessed_module")
        }
        
        return success_response(response_data)
        
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