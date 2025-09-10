from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from typing import List

from ..models import (
    RiceCalculationCreate,
    RiceCalculationResponse,
    UserStoryCreate,
    Story
)
from ..auth import get_current_user

router = APIRouter(prefix="/api/tools", tags=["tools"])

# This will be injected in the main server file
async def get_database() -> AsyncIOMotorDatabase:
    pass

def calculate_rice_score(reach: float, impact: float, confidence: float, effort: float) -> float:
    """Calculate RICE score"""
    if effort == 0:
        return 0
    return (reach * impact * (confidence / 100)) / effort

@router.post("/rice-calculation", response_model=RiceCalculationResponse)
async def save_rice_calculation(
    calculation_data: RiceCalculationCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Save RICE calculation"""
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
    
    return RiceCalculationResponse(
        id=str(calculation_dict["_id"]),
        feature_name=calculation_dict["feature_name"],
        reach=calculation_dict["reach"],
        impact=calculation_dict["impact"],
        confidence=calculation_dict["confidence"],
        effort=calculation_dict["effort"],
        score=calculation_dict["score"],
        created_at=calculation_dict["created_at"]
    )

@router.get("/rice-history", response_model=List[RiceCalculationResponse])
async def get_rice_history(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user's RICE calculation history"""
    user_id = current_user["_id"]
    
    # Get calculations sorted by creation date (newest first)
    calculations = await db.rice_calculations.find(
        {"user_id": user_id}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    # Convert to response format
    response_list = []
    for calc in calculations:
        response_list.append(RiceCalculationResponse(
            id=str(calc["_id"]),
            feature_name=calc["feature_name"],
            reach=calc["reach"],
            impact=calc["impact"],
            confidence=calc["confidence"],
            effort=calc["effort"],
            score=calc["score"],
            created_at=calc["created_at"]
        ))
    
    return response_list

@router.delete("/rice-calculation/{calculation_id}")
async def delete_rice_calculation(
    calculation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a RICE calculation"""
    user_id = current_user["_id"]
    
    if not ObjectId.is_valid(calculation_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid calculation ID"
        )
    
    # Delete calculation (only if it belongs to the user)
    result = await db.rice_calculations.delete_one({
        "_id": ObjectId(calculation_id),
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    
    return {"message": "Calculation deleted successfully"}

@router.post("/user-story")
async def save_user_stories(
    story_data: UserStoryCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Save user stories"""
    user_id = current_user["_id"]
    
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
    
    return {
        "message": "User stories saved successfully",
        "id": str(result.inserted_id),
        "story_count": len(formatted_stories)
    }

@router.get("/user-stories")
async def get_user_stories(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user's saved user stories"""
    user_id = current_user["_id"]
    
    # Get user stories sorted by creation date (newest first)
    stories = await db.user_stories.find(
        {"user_id": user_id}
    ).sort("created_at", -1).limit(20).to_list(20)
    
    # Convert ObjectId to string for JSON serialization
    for story in stories:
        story["_id"] = str(story["_id"])
        story["user_id"] = str(story["user_id"])
    
    return {"user_stories": stories}