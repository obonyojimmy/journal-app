from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timedelta, timezone
from typing import Mapping, Any, Optional, List, Dict, Union

class UserProfile(BaseModel):
	name: Optional[str]  = Field(description="user full name")
	age: Optional[int]  = Field(description="user age")

class User(BaseModel):
	model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
	id: str  = Field(description="user id")
	email: str  = Field(description="email address")
	profile: UserProfile  = Field(description="user profile")
	
class Token(BaseModel):
	access_token: str
	token_type: str

