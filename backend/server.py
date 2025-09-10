from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from bson import ObjectId
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-pm-guide-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI(title="Product Management Guide API", version="1.0.0")

# Database dependency
async def get_database():
    return db

# Auth functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    if not ObjectId.is_valid(user_id):
        raise credentials_exception
        
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    
    return user

# Models
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

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ProgressUpdate(BaseModel):
    section_id: str
    module_id: str
    completed: bool

class AssessmentSubmission(BaseModel):
    assessment_id: str
    answers: Dict[str, Any]
    score: float

class RiceCalculationCreate(BaseModel):
    feature_name: str
    reach: float
    impact: float
    confidence: float
    effort: float

# Legacy models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth", tags=["authentication"])
progress_router = APIRouter(prefix="/api/progress", tags=["progress"])
tools_router = APIRouter(prefix="/api/tools", tags=["tools"])

# Authentication routes
@auth_router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
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
    access_token_expires = timedelta(hours=24)
    access_token = create_access_token(
        data={"sub": str(result.inserted_id)}, expires_delta=access_token_expires
    )
    
    # Update last login
    await db.users.update_one(
        {"_id": result.inserted_id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user_dict["_id"]),
            email=user_dict["email"],
            name=user_dict["name"],
            role=user_dict["role"],
            created_at=user_dict["created_at"],
            last_login=user_dict.get("last_login")
        )
    )

@auth_router.post("/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin):
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(hours=24)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )
    
    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            role=user["role"],
            created_at=user["created_at"],
            last_login=user.get("last_login")
        )
    )

@auth_router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        name=current_user["name"],
        role=current_user["role"],
        created_at=current_user["created_at"],
        last_login=current_user.get("last_login")
    )

# Progress routes
@progress_router.get("")
async def get_progress(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    progress = await db.user_progress.find_one({"user_id": user_id})
    
    if not progress:
        # Create default progress
        progress = {
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
            "last_accessed_module": None
        }
    else:
        # Remove MongoDB-specific fields that are not JSON serializable
        progress.pop("_id", None)
        progress.pop("user_id", None)
    
    return progress

@progress_router.post("/section")
async def update_section_progress(
    progress_update: ProgressUpdate, 
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["_id"]
    
    # Get current progress
    progress = await db.user_progress.find_one({"user_id": user_id})
    if not progress:
        progress = {
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
            "total_progress": 0.0
        }
    
    # Update completed sections
    completed_sections = progress["completed_sections"]
    if progress_update.completed and progress_update.section_id not in completed_sections:
        completed_sections.append(progress_update.section_id)
    elif not progress_update.completed and progress_update.section_id in completed_sections:
        completed_sections.remove(progress_update.section_id)
    
    # Update module progress
    module_progress = progress["module_progress"]
    if progress_update.module_id in module_progress:
        module_progress[progress_update.module_id]["completed"] = progress_update.completed
        if progress_update.completed:
            module_progress[progress_update.module_id]["completed_at"] = datetime.utcnow()
    
    # Calculate total progress
    total_sections = 6
    completed_modules = sum(1 for module in module_progress.values() if module.get("completed", False))
    total_progress = (completed_modules / total_sections) * 100
    
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
        },
        upsert=True
    )
    
    return {"message": "Progress updated successfully", "total_progress": total_progress}

@progress_router.post("/assessment")
async def submit_assessment(
    assessment: AssessmentSubmission,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["_id"]
    
    assessment_score = {
        "assessment_id": assessment.assessment_id,
        "score": assessment.score,
        "answers": assessment.answers,
        "completed_at": datetime.utcnow()
    }
    
    await db.user_progress.update_one(
        {"user_id": user_id},
        {
            "$push": {"assessment_scores": assessment_score},
            "$set": {"updated_at": datetime.utcnow()}
        },
        upsert=True
    )
    
    return {"message": "Assessment submitted successfully", "score": assessment.score}

# Tools routes
@tools_router.post("/rice-calculation")
async def save_rice_calculation(
    calculation_data: RiceCalculationCreate,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["_id"]
    
    # Calculate RICE score
    if calculation_data.effort == 0:
        score = 0
    else:
        score = (calculation_data.reach * calculation_data.impact * (calculation_data.confidence / 100)) / calculation_data.effort
    
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
    
    result = await db.rice_calculations.insert_one(calculation_dict)
    
    return {
        "id": str(result.inserted_id),
        "feature_name": calculation_dict["feature_name"],
        "score": calculation_dict["score"],
        "saved": True
    }

@tools_router.get("/rice-history")
async def get_rice_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    
    calculations = await db.rice_calculations.find(
        {"user_id": user_id}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    response_list = []
    for calc in calculations:
        response_list.append({
            "id": str(calc["_id"]),
            "feature_name": calc["feature_name"],
            "reach": calc["reach"],
            "impact": calc["impact"],
            "confidence": calc["confidence"],
            "effort": calc["effort"],
            "score": calc["score"],
            "created_at": calc["created_at"]
        })
    
    return {"calculations": response_list}

# Legacy routes
@api_router.get("/")
async def root():
    return {"message": "Product Management Guide API", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include all routers
app.include_router(auth_router)
app.include_router(progress_router)
app.include_router(tools_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
