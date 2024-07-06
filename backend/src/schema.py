from uuid import UUID, uuid4
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timedelta, timezone
from typing import Mapping, Any, Optional, List, Dict, Union

class UserProfile(BaseModel):
	name: Optional[str]  = Field(None, description="user full name")
	age: Optional[int]  = Field(None, description="user age")

class User(BaseModel):
	model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
	id: Union[UUID, str]  = Field(description="user id")
	email: str  = Field(description="email address")
	profile: Optional[UserProfile]  = Field(None, description="user profile")
	
class Token(BaseModel):
	access_token: str = Field(None, description="access token")
	refresh_token: Optional[str] = Field(None, description="refresh token")
	token_type: str

class Category(BaseModel):
	model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
	id: Union[UUID, str]  = Field(description="category id", default_factory=uuid4 )
	name: str = Field(..., description="category name")

class JournalBase(BaseModel):
	model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
	id: Union[UUID, str]  = Field(description="journal id", default_factory=uuid4 )
	title: str = Field(None, description="journal title")
	content: str = Field(None, description="journal summary")
	created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
	updated_at: Optional[datetime] = Field(None, description="last update date")

class Journal(JournalBase):
	category: Optional[Category] = Field(None, description="the category")