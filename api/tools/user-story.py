"""User story endpoint for Vercel"""
import asyncio
from datetime import datetime
from bson import ObjectId

from ..utils.database import get_database
from ..utils.auth import get_current_user
from ..utils.models import UserStoryCreate
from ..utils.response import success_response, error_response

async def handler(event, context):
    """Handle user story save or get"""
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
        
        # Handle GET request (get user stories)
        if event.get('httpMethod') == 'GET':
            # Get user stories sorted by creation date (newest first)
            stories = await db.user_stories.find(
                {"user_id": user_id}
            ).sort("created_at", -1).limit(20).to_list(20)
            
            # Convert ObjectId to string for JSON serialization
            for story in stories:
                story["_id"] = str(story["_id"])
                story["user_id"] = str(story["user_id"])
            
            return success_response({"user_stories": stories})
        
        # Handle POST request (save user stories)
        elif event.get('httpMethod') == 'POST':
            # Parse request body
            import json
            body = json.loads(event.get('body', '{}'))
            
            # Validate input
            try:
                story_data = UserStoryCreate(**body)
            except Exception as e:
                return error_response(400, "Invalid input", str(e))
            
            # Format user stories
            formatted_stories = []
            for story in story_data.stories:
                formatted_story = f"As a [user type], I want to {story.story.lower()} so that [benefit]."
                formatted_stories.append({
                    "story": story.story,
                    "category": story.category,
                    "priority": story.priority,
                    "formatted_story": formatted_story
                })
            
            # Create user story record
            story_dict = {
                "_id": ObjectId(),
                "user_id": user_id,
                "stories": formatted_stories,
                "project_name": story_data.project_name,
                "created_at": datetime.utcnow()
            }
            
            # Save to database
            result = await db.user_stories.insert_one(story_dict)
            
            return success_response({
                "message": "User stories saved successfully",
                "id": str(result.inserted_id),
                "story_count": len(formatted_stories)
            })
        
        else:
            return error_response(405, "Method not allowed")
        
    except Exception as e:
        return error_response(500, "Internal server error", str(e))

def main(event, context):
    """Main entry point for Vercel"""
    # Handle OPTIONS for CORS
    if event.get('httpMethod') == 'OPTIONS':
        return success_response({})
    
    if event.get('httpMethod') not in ['GET', 'POST']:
        return error_response(405, "Method not allowed")
    
    # Run async handler
    return asyncio.run(handler(event, context))