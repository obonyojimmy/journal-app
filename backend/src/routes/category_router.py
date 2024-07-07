from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Form, Query, Path, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional, Union, Any
from uuid import UUID
from src.schema import  User, Category
from src.crud import CrudCategory
from src.utils import validate_user

router = APIRouter()

@router.get("/category")
async def list_categories(
    valid_user: User = Depends(validate_user)
) -> Union[Category, List[Category]]:
    """ filter categories that have being created by users """
    crud_category = CrudCategory()
    category = crud_category.filter(user_id=valid_user.id)
    if isinstance(category, list):
        return [Category.model_validate(j) for j in category]
    return Category.model_validate(category)
