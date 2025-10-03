"""Submit assessment endpoint for Vercel"""
import asyncio
from datetime import datetime

from ..utils.database import get_database
from ..utils.auth import get_current_user
from ..utils.models import AssessmentSubmission
from ..utils.response import success_response, error_response

async def handler(event, context):
    """Handle submit assessment"""
    try:
        # Get authorization header
        headers = event.get('headers', {})
        auth_header = headers.get('authorization') or headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return error_response(401, "Missing or invalid authorization header")
        
        # Extract token
        token = auth_header.split(' ')[1]
        
        # Parse request body
        import json
        body = json.loads(event.get('body', '{}'))
        
        # Validate input
        try:
            assessment = AssessmentSubmission(**body)
        except Exception as e:
            return error_response(400, "Invalid input", str(e))
        
        # Get database
        db = await get_database()
        
        # Get current user
        current_user = await get_current_user(db, token)
        if not current_user:
            return error_response(401, "Invalid token")
        
        user_id = current_user["_id"]
        
        # Create assessment score record
        assessment_score = {
            "assessment_id": assessment.assessment_id,
            "score": assessment.score,
            "answers": assessment.answers,
            "completed_at": datetime.utcnow()
        }
        
        # Update user progress with new assessment score
        await db.user_progress.update_one(
            {"user_id": user_id},
            {
                "$push": {"assessment_scores": assessment_score},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return success_response({
            "message": "Assessment submitted successfully", 
            "score": assessment.score
        })
        
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