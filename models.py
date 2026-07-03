from sqlalchemy import Column, Integer, String, DateTime
from database import Base
import datetime

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True) # e.g. TKT-1001
    text = Column(String)
    
    # Extracted by AI
    category = Column(String)
    severity = Column(String)
    keywords = Column(String)
    priority = Column(String)
    color = Column(String) # Hex color for priority
    
    # Submitter info
    state_region = Column(String)
    ward = Column(String)
    
    # Workflow
    status = Column(String, default="Pending Triage")
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
