"""SQLAlchemy models for Reset Era. Mirrors infra/supabase/schema.sql."""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, unique=True, nullable=False)
    timezone = Column(String, default="America/Chicago")
    preferred_tone = Column(String, default="neutral")
    created_at = Column(DateTime, default=datetime.utcnow)

    brain_dumps = relationship("BrainDump", back_populates="user")
    tasks = relationship("Task", back_populates="user")


class BrainDump(Base):
    __tablename__ = "brain_dumps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    raw_input = Column(Text, nullable=False)
    input_mode = Column(String, default="text")
    energy_level = Column(String)
    available_minutes = Column(Integer)
    processing_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="brain_dumps")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    source_brain_dump_id = Column(UUID(as_uuid=True), ForeignKey("brain_dumps.id"))
    title = Column(Text, nullable=False)
    description = Column(Text)
    status = Column(String, default="active")
    category = Column(String)
    urgency_score = Column(Float, default=0)
    impact_score = Column(Float, default=0)
    effort_score = Column(Float, default=0)
    priority_score = Column(Float, default=0)
    avoidance_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="tasks")


class DailyPlan(Base):
    __tablename__ = "daily_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    date = Column(DateTime, nullable=False)
    reasoning_summary = Column(Text)
    estimated_total_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
