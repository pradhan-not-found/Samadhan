from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True)
    text = Column(String)

    # Extracted by AI
    category = Column(String)
    severity = Column(String)
    keywords = Column(String)
    priority = Column(String)
    color = Column(String)

    # Submitter info
    state_region = Column(String)
    ward = Column(String)
    user_email = Column(String, nullable=True)  # link to profile

    # Workflow
    status = Column(String, default="Pending Triage")
    routed_to = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(String, default="citizen")
    ward = Column(String, nullable=True)
    state_region = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

