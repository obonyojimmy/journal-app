import jwt
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
    refresh_token_expires = timedelta(days=config.jwt_refresh_token_days)
    access_token = create_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    refresh_token = create_token(
        data={"sub": user.email}, 
        expires_delta=refresh_token_expires
    )
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

@router.post("/refresh_token")
async def refresh_access_token(refresh_token: str) -> Token:
    try:
        payload = jwt.decode(refresh_token, config.jwt_secret_key, algorithms=[config.jwt_algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    crud_user = CrudUser()
    user = crud_user.filter(email, limit=1)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    access_token_expires = timedelta(minutes=config.jwt_token_expire)
    refresh_token_expires = timedelta(days=config.jwt_refresh_token_days)
    access_token = create_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    refresh_token = create_token(
        data={"sub": user.email}, 
        expires_delta=refresh_token_expires
    )
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")