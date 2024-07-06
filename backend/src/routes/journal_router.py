from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Form, Query, Path, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional, Union, Any
from uuid import UUID
from src.schema import  User, Journal
from src.crud import CrudJournal
from src.utils import validate_user

router = APIRouter()

@router.post("/journal")
async def create_journal(
    title: str = Form(..., description="jounal title"),
    content: str = Form(..., description="jounal content"),
    category: Optional[str] = Form(None, description="jounal category"),
    valid_user: User = Depends(validate_user)
) -> Journal:
    crud_journal = CrudJournal()
    journal = crud_journal.create(user_id=valid_user.id, title=title, content=content, category=category)
    return Journal.model_validate(journal)

@router.get("/journal")
async def list_journal(
    valid_user: User = Depends(validate_user)
) -> Union[Journal, List[Journal]]:
    crud_journal = CrudJournal()
    journals = crud_journal.filter(user_id=valid_user.id)
    if not journals:
        return []
    if isinstance(journals, list):
        return [Journal.model_validate(j) for j in journals]
    return Journal.model_validate(journals)

@router.get("/journal/{id}")
async def get_journal(
    id: UUID = Path(..., description="the journal id"),
    valid_user: User = Depends(validate_user)
) -> Journal:
    crud_journal = CrudJournal()
    journal = crud_journal.filter(user_id=valid_user.id, id=id, limit=1)
    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="journal not found",
        )
    return Journal.model_validate(journal)
    
