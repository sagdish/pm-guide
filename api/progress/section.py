"""Update section progress endpoint for Vercel"""
import asyncio
from datetime import datetime

from ..utils.database import get_database
from ..utils.auth import get_current_user
from ..utils.models import ProgressUpdate
from ..utils.response import success_response, error_response

async def get_user_progress(db, user_id):
    """Get user progress (helper function)"""
    return await db.user_progress.find_one({"user_id": user_id})

def calculate_total_progress(completed_sections, module_progress):
    """Calculate total progress percentage"""
    total_sections = 6  # 6 main modules
    total_possible_sections = 20  # Approximate number of sub-sections
    
    # Weight module completion more heavily
    completed_modules = sum(1 for module in module_progress.values() if module.get("completed", False))
    module_weight = (completed_modules / total_sections) * 60  # 60% weight
    
    # Section completion weight
    section_weight = (len(completed_sections) / total_possible_sections) * 40  # 40% weight
    
    return min(100.0, module_weight + section_weight)

async def handler(event, context):
    """Handle update section progress"""
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
            progress_update = ProgressUpdate(**body)
        except Exception as e:
            return error_response(400, "Invalid input", str(e))
        
        # Get database
        db = await get_database()
        
        # Get current user
        current_user = await get_current_user(db, token)
        if not current_user:
            return error_response(401, "Invalid token")
        
        user_id = current_user["_id"]
        progress = await get_user_progress(db, user_id)
        
        if not progress:
            return error_response(404, "User progress not found")
        
        # Update completed sections
        completed_sections = progress["completed_sections"]
        if progress_update.completed and progress_update.section_id not in completed_sections:
            completed_sections.append(progress_update.section_id)
        elif not progress_update.completed and progress_update.section_id in completed_sections:
            completed_sections.remove(progress_update.section_id)
        
        # Update module progress if this completes a module
        module_progress = progress["module_progress"]
        if progress_update.module_id in module_progress:
            module_progress[progress_update.module_id]["completed"] = progress_update.completed
            if progress_update.completed:
                module_progress[progress_update.module_id]["completed_at"] = datetime.utcnow()
            else:
                module_progress[progress_update.module_id]["completed_at"] = None
        
        # Calculate new total progress
        total_progress = calculate_total_progress(completed_sections, module_progress)
        
        # Update database
        await db.user_progress.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "completed_sections": completed_sections,
                    "module_progress": module_progress,
                    "total_progress": total_progress,
                    "last_accessed_module": progress_update.module_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return success_response({
            "message": "Progress updated successfully", 
            "total_progress": total_progress
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