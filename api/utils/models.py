"""Pydantic models for API validation"""
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# User models
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Progress models
class ProgressUpdate(BaseModel):
    section_id: str
    module_id: str
    completed: bool

class ModuleProgress(BaseModel):
    completed: bool
    completed_at: Optional[datetime] = None

class AssessmentScore(BaseModel):
    assessment_id: str
    score: float
    answers: Dict[str, Any]
    completed_at: datetime

class AssessmentSubmission(BaseModel):
    assessment_id: str
    answers: Dict[str, Any]
    score: float

class ProgressResponse(BaseModel):
    completed_sections: List[str]
    module_progress: Dict[str, ModuleProgress]
    assessment_scores: List[AssessmentScore]
    total_progress: float
    last_accessed_module: Optional[str] = None

# Tools models
class RiceCalculationCreate(BaseModel):
    feature_name: str
    reach: float = Field(..., ge=0)
    impact: float = Field(..., ge=0, le=10)
    confidence: float = Field(..., ge=0, le=100)
    effort: float = Field(..., gt=0)

class RiceCalculationResponse(BaseModel):
    id: str
    feature_name: str
    reach: float
    impact: float
    confidence: float
    effort: float
    score: float
    created_at: datetime

class Story(BaseModel):
    story: str
    category: str
    priority: str

class UserStoryCreate(BaseModel):
    project_name: str
    stories: List[Story]