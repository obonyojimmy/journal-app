from sqlalchemy.orm import Session
from fastapi import APIRouter, Form, Query, Header, HTTPException, Depends
from typing import List, Optional, Union, Any
from uuid import UUID

router = APIRouter()

@router.get("/register")
def register():
	""" handles user registration """
	return "hello world"
