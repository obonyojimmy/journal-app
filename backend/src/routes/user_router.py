from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Form, Query, Path, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional, Union, Any
from uuid import UUID
from src.schema import  User
from src.crud import CrudUser
from src.utils import validate_user

router = APIRouter()

@router.post("/user")
async def register_user(
    email: str = Form(..., description="registration email"),
	password: Optional[str] = Form(..., description="registration password"),
) -> User:
    crud_user = CrudUser()
    user = crud_user.register(email, password)
    return user

@router.get("/user")
async def get_user(
    valid_user: User = Depends(validate_user)
    #id: UUID = Path(..., description="the user id")
) -> User:
    return valid_user
    
