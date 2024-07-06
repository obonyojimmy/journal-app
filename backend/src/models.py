from uuid import uuid4
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import UUID, JSON, ARRAY
from sqlalchemy.orm import relationship, backref, synonym, aliased, declarative_base, Mapped
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Enum, TEXT, UniqueConstraint


Base = declarative_base()

class User(Base):
	__tablename__ = "user"
	id = Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False, default=uuid4)
	email = Column(String, nullable=False, index=True)
	hash_password = Column(String, nullable=False)
	profile = Column(JSON, nullable=True, default={})
	created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.now(tz=timezone.utc))
	updated_at = Column(DateTime(timezone=True), nullable=True)
	## relationships
	journals = relationship("Journal", back_populates="user")
	categories = relationship("Category", back_populates="user")

class Category(Base):
	__tablename__ = "category"
	id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid4)
	name = Column(String, index=True)
	user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
	## relationships
	user = relationship("User", back_populates="categories")
	journals = relationship("Journal", back_populates="category")

class Journal(Base):
	__tablename__ = "journal"
	id = Column(UUID(as_uuid=True), primary_key=True, nullable=False,   default=uuid4)
	title = Column(String, index=True)
	content = Column(String)
	user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
	category_id = Column(UUID(as_uuid=True), ForeignKey("category.id"), nullable=True)
	created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.now(tz=timezone.utc))
	updated_at = Column(DateTime(timezone=True), nullable=True)
	## relationships
	user = relationship("User", back_populates="journals")
	category = relationship("Category", back_populates="journals")