from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
import uuid

# Pydantic models for request/response validation
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Models
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1)
    role: str = Field(default="learner")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None

# Progress Models  
class ModuleProgress(BaseModel):
    completed: bool = False
    completed_at: Optional[datetime] = None

class AssessmentScore(BaseModel):
    assessment_id: str
    score: float
    answers: Dict[str, Any]
    completed_at: datetime = Field(default_factory=datetime.utcnow)

class UserProgress(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    completed_sections: List[str] = Field(default_factory=list)
    module_progress: Dict[str, ModuleProgress] = Field(default_factory=dict)
    assessment_scores: List[AssessmentScore] = Field(default_factory=list)
    total_progress: float = 0.0
    last_accessed_module: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ProgressUpdate(BaseModel):
    section_id: str
    module_id: str
    completed: bool

class AssessmentSubmission(BaseModel):
    assessment_id: str
    answers: Dict[str, Any]
    score: float

# RICE Calculator Models
class RiceCalculation(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    feature_name: str
    reach: float
    impact: float
    confidence: float
    effort: float
    score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class RiceCalculationCreate(BaseModel):
    feature_name: str
    reach: float
    impact: float
    confidence: float
    effort: float

class RiceCalculationResponse(BaseModel):
    id: str
    feature_name: str
    reach: float
    impact: float
    confidence: float
    effort: float
    score: float
    created_at: datetime

# User Story Models
class Story(BaseModel):
    story: str
    category: str
    priority: str
    formatted_story: str

class UserStory(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    stories: List[Story]
    project_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserStoryCreate(BaseModel):
    stories: List[Story]
    project_name: Optional[str] = None

# Response Models
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ProgressResponse(BaseModel):
    completed_sections: List[str]
    module_progress: Dict[str, ModuleProgress]
    assessment_scores: List[AssessmentScore]
    total_progress: float
    last_accessed_module: Optional[str]