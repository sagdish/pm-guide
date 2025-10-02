"""RICE calculation endpoint for Vercel"""
import asyncio
from datetime import datetime
from bson import ObjectId

from ..utils.database import get_database
from ..utils.auth import get_current_user
from ..utils.models import RiceCalculationCreate
from ..utils.response import success_response, error_response

def calculate_rice_score(reach, impact, confidence, effort):
    """Calculate RICE score"""
    if effort == 0:
        return 0
    return (reach * impact * (confidence / 100)) / effort

async def handler(event, context):
    """Handle RICE calculation"""
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
            calculation_data = RiceCalculationCreate(**body)
        except Exception as e:
            return error_response(400, "Invalid input", str(e))
        
        # Get database
        db = await get_database()
        
        # Get current user
        current_user = await get_current_user(db, token)
        if not current_user:
            return error_response(401, "Invalid token")
        
        user_id = current_user["_id"]
        
        # Calculate RICE score
        score = calculate_rice_score(
            calculation_data.reach,
            calculation_data.impact,
            calculation_data.confidence,
            calculation_data.effort
        )
        
        # Create calculation record
        calculation_dict = {
            "_id": ObjectId(),
            "user_id": user_id,
            "feature_name": calculation_data.feature_name,
            "reach": calculation_data.reach,
            "impact": calculation_data.impact,
            "confidence": calculation_data.confidence,
            "effort": calculation_data.effort,
            "score": score,
            "created_at": datetime.utcnow()
        }
        
        # Save to database
        result = await db.rice_calculations.insert_one(calculation_dict)
        calculation_dict["_id"] = result.inserted_id
        
        response_data = {
            "id": str(calculation_dict["_id"]),
            "feature_name": calculation_dict["feature_name"],
            "reach": calculation_dict["reach"],
            "impact": calculation_dict["impact"],
            "confidence": calculation_dict["confidence"],
            "effort": calculation_dict["effort"],
            "score": calculation_dict["score"],
            "created_at": calculation_dict["created_at"]
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