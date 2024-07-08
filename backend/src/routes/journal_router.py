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
    """ create a journal entry """
    crud_journal = CrudJournal()
    journal = crud_journal.create(user_id=valid_user.id, title=title, content=content, category=category)
    return Journal.model_validate(journal)

@router.get("/journal")
async def list_journal(
    valid_user: User = Depends(validate_user),
    category_id: Optional[str] = Query(None, description="filter by this category"),
    from_date: Optional[str] = Query(None, description="filter starting from this date"),
    to_date: Optional[str] = Query(None, description="filter ending from this date"),
) -> Union[Journal, List[Journal]]:
    """ List and filter journals """
    crud_journal = CrudJournal()
    journals = crud_journal.filter(user_id=valid_user.id, category_id=category_id, from_date=from_date, to_date=to_date)
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
    """ Get journal by Id """
    crud_journal = CrudJournal()
    journal = crud_journal.filter(user_id=valid_user.id, id=id, limit=1)
    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="journal not found",
        )
    return Journal.model_validate(journal)

@router.put("/journal/{id}")
async def update_journal(
    id: UUID = Path(..., description="the journal id"),
    content: str = Form(..., description="contnet to update"),
    valid_user: User = Depends(validate_user)
) -> Journal:
    """ update journal """
    crud_journal = CrudJournal()
    journal = crud_journal.filter(user_id=valid_user.id, id=id, limit=1)
    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="journal not found",
        )
    journal =  crud_journal.update(journal.id, content=content)
    return Journal.model_validate(journal)

@router.delete("/journal/{id}")
async def delete_journal(
    id: UUID = Path(..., description="the journal id"),
    valid_user: User = Depends(validate_user)
) -> str:
    """ Delete journal """
    crud_journal = CrudJournal()
    journal = crud_journal.filter(user_id=valid_user.id, id=id, limit=1)
    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="journal not found",
        )
    delete_id =  crud_journal.delete(journal.id)
    return str(delete_id)
    
