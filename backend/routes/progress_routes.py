from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from typing import Dict, Any

from ..models import (
    ProgressUpdate, 
    AssessmentSubmission, 
    ProgressResponse,
    AssessmentScore,
    ModuleProgress
)
from ..auth import get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])

# This will be injected in the main server file
async def get_database() -> AsyncIOMotorDatabase:
    pass

async def get_user_progress(db: AsyncIOMotorDatabase, user_id: ObjectId) -> Dict[str, Any]:
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

def calculate_total_progress(completed_sections: list, module_progress: dict) -> float:
    """Calculate total progress percentage"""
    total_sections = 6  # 6 main modules
    total_possible_sections = 20  # Approximate number of sub-sections
    
    # Weight module completion more heavily
    completed_modules = sum(1 for module in module_progress.values() if module.get("completed", False))
    module_weight = (completed_modules / total_sections) * 60  # 60% weight
    
    # Section completion weight
    section_weight = (len(completed_sections) / total_possible_sections) * 40  # 40% weight
    
    return min(100.0, module_weight + section_weight)

@router.get("", response_model=ProgressResponse)
async def get_progress(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get user progress"""
    user_id = current_user["_id"]
    progress = await get_user_progress(db, user_id)
    
    # Convert to response format
    module_progress = {}
    for module_id, module_data in progress["module_progress"].items():
        module_progress[module_id] = ModuleProgress(
            completed=module_data.get("completed", False),
            completed_at=module_data.get("completed_at")
        )
    
    assessment_scores = []
    for score_data in progress.get("assessment_scores", []):
        assessment_scores.append(AssessmentScore(
            assessment_id=score_data["assessment_id"],
            score=score_data["score"],
            answers=score_data["answers"],
            completed_at=score_data["completed_at"]
        ))
    
    return ProgressResponse(
        completed_sections=progress["completed_sections"],
        module_progress=module_progress,
        assessment_scores=assessment_scores,
        total_progress=progress["total_progress"],
        last_accessed_module=progress.get("last_accessed_module")
    )

@router.post("/section")
async def update_section_progress(
    progress_update: ProgressUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update section completion progress"""
    user_id = current_user["_id"]
    progress = await get_user_progress(db, user_id)
    
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
    
    return {"message": "Progress updated successfully", "total_progress": total_progress}

@router.post("/assessment")
async def submit_assessment(
    assessment: AssessmentSubmission,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Submit assessment results"""
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
    
    return {"message": "Assessment submitted successfully", "score": assessment.score}