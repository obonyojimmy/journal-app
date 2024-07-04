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
	email = Column(String, nullable=False)
	hash_password = Column(String, nullable=False)
	profile = Column(JSON, nullable=True, default={})
	created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.now(tz=timezone.utc))
	updated_at = Column(DateTime(timezone=True), nullable=True)