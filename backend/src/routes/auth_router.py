from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Form, Query, Header, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional, Union, Any
from uuid import UUID
from src.config import config
from src.schema import Token, User
from src.crud import CrudUser
from src.utils import create_token

router = APIRouter()

@router.post("/token")
async def token_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    crud_user = CrudUser()
    user = crud_user.authenticate(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=config.jwt_token_expire)
    access_token = create_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
