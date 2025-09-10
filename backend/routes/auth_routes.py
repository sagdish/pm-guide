from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
from bson import ObjectId

from ..models import UserCreate, UserLogin, TokenResponse, UserResponse
from ..auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_user_by_email,
    get_current_user,
    user_to_response,
    security
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# This will be injected in the main server file
async def get_database() -> AsyncIOMotorDatabase:
    pass

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Register a new user"""
    # Check if user already exists
    existing_user = await get_user_by_email(db, user_data.email)
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
        user=user_to_response(user_dict)
    )

@router.post("/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_database)):
    """Login user"""
    user = await authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
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
        user=user_to_response(user)
    )

@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user (client should delete token)"""
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user information"""
    return user_to_response(current_user)