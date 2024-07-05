from uuid import UUID
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
	access_token: str
	token_type: str

