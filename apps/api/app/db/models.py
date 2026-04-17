"""SQLAlchemy models for Reset Era. Mirrors infra/supabase/schema.sql."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.types import TypeDecorator, CHAR


class UUIDType(TypeDecorator):
    """Platform-independent UUID type. Uses CHAR(36) for SQLite, native UUID for PostgreSQL."""

    impl = CHAR(36)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            return str(value)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            return uuid.UUID(value) if not isinstance(value, uuid.UUID) else value
        return value


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    timezone = Column(String, default="America/Chicago")
    preferred_tone = Column(String, default="neutral")
    created_at = Column(DateTime, default=datetime.utcnow)

    brain_dumps = relationship("BrainDump", back_populates="user")


class BrainDump(Base):
    __tablename__ = "brain_dumps"

    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id"))
    raw_input = Column(Text, nullable=False)
    input_mode = Column(String, default="text")
    energy_level = Column(String)
    available_minutes = Column(Integer)
    processing_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="brain_dumps")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=True)
    source_brain_dump_id = Column(String, nullable=True)
    title = Column(Text, nullable=False)
    description = Column(Text)
    status = Column(String, default="active")
    category = Column(String)
    urgency_score = Column(Float, default=0)
    impact_score = Column(Float, default=0)
    effort_score = Column(Float, default=0)
    priority_score = Column(Float, default=0)
    avoidance_count = Column(Integer, default=0)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DailyPlan(Base):
    __tablename__ = "daily_plans"

    id = Column(UUIDType, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id"))
    date = Column(DateTime, nullable=False)
    reasoning_summary = Column(Text)
    estimated_total_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
