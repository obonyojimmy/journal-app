import jwt
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from typing import Generator, Tuple, Optional
from passlib.context import CryptContext
from fastapi import APIRouter, Form, Query, Header, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from .config import config
from .schema import User

def DatabaseSession():
	url: str = config.postgres_url
	engine = create_engine(url, echo=False, pool_pre_ping=True, pool_size=5, max_overflow=10, pool_recycle=60, pool_use_lifo=True)
	session = sessionmaker(autocommit=False, autoflush=True, bind=engine)
	return session()

def get_db() -> Generator:
	try:
		db = DatabaseSession()
		yield db
	finally:
		db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

credentials_exception = HTTPException(
	status_code=401,
	detail="Could not validate credentials",
	headers={"WWW-Authenticate": "Bearer"},
)

def hash_pass(password:str):
	return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
	return pwd_context.verify(plain_password, hashed_password)

def create_token(data:dict, expires_delta: Optional[timedelta] = None):
	#data = self.model_dump()
	to_encode = data.copy()
	if expires_delta:
		expire = datetime.now(timezone.utc) + expires_delta
	else:
		expire = datetime.now(timezone.utc) + timedelta(minutes=15)
	to_encode.update({"exp": expire})
	encoded_jwt = jwt.encode(to_encode, config.jwt_secret_key, algorithm=config.jwt_algorithm)
	return encoded_jwt


async def validate_user(token: str = Depends(oauth2_scheme)) -> User:
	try:
		payload = jwt.decode(token, config.jwt_secret_key, algorithms=[config.jwt_algorithm])
		email: str = payload.get("sub")
		if email is None:
			raise credentials_exception
	except jwt.PyJWTError:
		raise credentials_exception
	from .crud import CrudUser
	crud_user = CrudUser()
	user = crud_user.filter(email, limit=1)
	if not user:
		raise credentials_exception
	user = User.model_validate(user)
	return user