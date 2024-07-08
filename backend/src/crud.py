from uuid import UUID
from datetime import datetime, timezone
from typing import Type, TypeVar, Optional, Any, Generic, List, Union, Dict
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder
from dateutil import parser
from .models import Base, User, Journal, Category
from .utils import DatabaseSession, verify_password, hash_pass

ModelType = TypeVar("ModelType", bound=Base)

class CRUDBase():
	def __init__(self, model: Type[ModelType]): ## 
		"""
		Base CRUD object with default methods to Create, Read, Update, Delete (CRUD).

		Params:
		* `model`: A SQLAlchemy model class
		"""
		self.db = DatabaseSession()
		self.model = model
	
	def __del__(self):
		try:
			if self.db:
				self.db.close()
		except Exception:
			pass
	
	def exist(self, id: str) -> bool:
		## todo: use sqlalchemy exists clause
		return bool(self.get(id))
	
	def get(self, id: str, refresh:bool=False) -> Optional[ModelType]:
		db = self.db
		obj = db.query(self.model).filter(self.model.id == id).first()
		if refresh:
			db.refresh(obj)
		return obj
	
	def create(self, obj_in: Any) -> ModelType:
		db = self.db
		obj_in_data = jsonable_encoder(obj_in)
		db_obj = self.model(**obj_in_data)  # type: ignore
		db.add(db_obj)
		db.commit()        
		db.refresh(db_obj)
		return db_obj
	

class CrudUser(CRUDBase):
	model: User = User

	def __init__(self):
		""" Crud user """
		super().__init__(self.model)

	def get(self, id: str, refresh:bool=False) -> User:
		return super().get(id, refresh=refresh)
	
	def filter(self, email: str, limit: int = 0) -> Union[User, List[User]]:
		db = self.db
		model: User = self.model
		query = db.query(model)
		query = query.filter(model.email == email)
		if limit == 1:
			return query.first()
		if limit:
			return query.limit(limit).all()
		return query.all()
	
	def create(self, obj: dict) -> User:
		return super().create(obj)
	
	def authenticate(self, email: str, password: str):
		user = self.filter(email, limit=1)
		if not user:
			return False
		if not verify_password(password, user.hash_password):
			return False
		return user
	
	def register(self, email: str, password:str):
		user = self.filter(email, limit=1)
		if user:
			raise HTTPException(
				status_code=status.HTTP_406_NOT_ACCEPTABLE,
				detail="User already exists",
			)
		hashed_pass = hash_pass(password)
		user = User(email=email, hash_password=hashed_pass)
		self.db.add(user)
		self.db.commit()
		self.db.refresh(user)
		return user
	
	def update(self, id:UUID, name:str=None, age:int=None, password:str =None):
		user = self.get(id)
		if not user:
			raise Exception('user not found')
		user_profile = user.profile or {}
		if name:
			user_profile['name'] = name
		if age:
			user_profile['age'] = age
		if name or age:
			user.profile = user_profile
		if password:
			hashed_pass = hash_pass(password)
			user.hash_password = hashed_pass
		self.db.add(user)
		self.db.commit()
		self.db.refresh(user)
		return user

class CrudCategory(CRUDBase):
	model: Category = Category

	def __init__(self):
		""" Crud Category """
		super().__init__(self.model)

	def filter(self, name:str=None, user_id:str=None, limit: int = 0) -> Union[Category, List[Category]]:
		db = self.db
		model: Category = self.model
		query = db.query(model)
		if name:
			query = query.filter(model.name == name)
		if user_id:
			query = query.filter(model.user_id == user_id)
		if limit == 1:
			return query.first()
		if limit:
			return query.limit(limit).all()
		return query.all()
	
	def create(self, name:str, user_id:UUID) -> Category:
		category = self.filter(name, user_id=user_id, limit=1)
		if category:
			return category
		category = Category(name=name, user_id=user_id)
		self.db.add(category)
		self.db.commit()
		self.db.refresh(category)
		return category

class CrudJournal(CRUDBase):
	model: Journal = Journal

	def __init__(self):
		""" Crud Journal """
		super().__init__(self.model)

	def get(self, id:str, refresh:bool=False) -> Journal:
		return super().get(id, refresh=refresh)
	
	def filter(self, user_id:str=None, id:str=None, title:str=None, category_id:str=None, from_date:str=None, to_date:str=None, limit:int = 0) -> Union[Journal, List[Journal]]:
		db = self.db
		model: Journal = self.model
		query = db.query(model)
		if id:
			query = query.filter(model.id == id)
		if user_id:
			query = query.filter(model.user_id == user_id)
		if title:
			query = query.filter(model.title == title)
		if category_id:
			query = query.filter(model.category_id == category_id)
		if from_date:
			from_date_dt = parser.isoparse(from_date)
			query = query.filter(model.created_at >= from_date_dt)
		if to_date:
			to_date_dt = parser.isoparse(to_date)
			query = query.filter(model.created_at <= to_date_dt)
		if limit == 1:
			return query.first()
		if limit:
			return query.limit(limit).all()
		return query.all()
	
	def create(self, user_id:UUID, title:str, content:str, category:str=None):
		kwargs = {}
		if category:
			category = CrudCategory().create(category, user_id=user_id)
			kwargs['category_id'] = category.id
		journal = Journal(title=title, content=content, user_id=user_id, **kwargs)
		self.db.add(journal)
		self.db.commit()
		self.db.refresh(journal)
		return journal
	
	def update(self, id:UUID, content:str):
		journal = self.get(id)
		if not journal:
			raise Exception('journal not found')
		journal.content = content
		self.db.add(journal)
		self.db.commit()
		self.db.refresh(journal)
		return journal
	
	def delete(self, id:UUID):
		journal = self.get(id)
		if not journal:
			raise Exception('journal not found')
		self.db.delete(journal)
		self.db.commit()
		return id
	