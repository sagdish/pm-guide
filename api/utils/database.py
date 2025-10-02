"""Database utilities for Vercel serverless functions"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

# Global connection pool
_mongo_client: Optional[AsyncIOMotorClient] = None

def get_mongo_client() -> AsyncIOMotorClient:
    """Get MongoDB client with connection pooling for serverless"""
    global _mongo_client
    
    if _mongo_client is None:
        mongo_url = os.environ.get('MONGO_URL')
        if not mongo_url:
            raise ValueError("MONGO_URL environment variable is required")
        
        # Configure for serverless with minimal connections
        _mongo_client = AsyncIOMotorClient(
            mongo_url,
            maxPoolSize=1,  # Minimal pool for serverless
            minPoolSize=0,
            maxIdleTimeMS=30000,  # Close idle connections quickly
            connectTimeoutMS=5000,
            serverSelectionTimeoutMS=5000
        )
    
    return _mongo_client

async def get_database():
    """Get database instance"""
    client = get_mongo_client()
    db_name = os.environ.get('DB_NAME')
    if not db_name:
        raise ValueError("DB_NAME environment variable is required")
    
    return client[db_name]