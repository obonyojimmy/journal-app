from typing import Type, TypeVar, Optional, Any, Generic, List, Union, Dict
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from .models import Base, User
from .utils import DatabaseSession, verify_password

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
	
	def create(self, obj: dict) -> User:
		return super().create(obj)
	
	def authenticate(self, email: str, password: str):
		user = self.get(email)
		if not user:
			return False
		if not verify_password(password, user.hash_password):
			return False
		return user
