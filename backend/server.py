from fastapi import FastAPI, APIRouter, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Product Management Guide API", version="1.0.0")

# Database dependency
async def get_database():
    return db

# Import routes after setting up dependencies
from routes.auth_routes import router as auth_router
from routes.progress_routes import router as progress_router  
from routes.tools_routes import router as tools_router

# Monkey patch the get_database function in route modules
import routes.auth_routes as auth_module
import routes.progress_routes as progress_module
import routes.tools_routes as tools_module

auth_module.get_database = get_database
progress_module.get_database = get_database
tools_module.get_database = get_database

# Update auth dependency in routes
from auth import get_current_user
import auth as auth_module_main

async def get_current_user_with_db(credentials, db=Depends(get_database)):
    return await get_current_user(credentials, db)

# Patch the auth dependency
auth_module_main.db = db

# Create a router with the /api prefix for legacy routes
api_router = APIRouter(prefix="/api")

# Define Models for backward compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
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
