import kagglehub
from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
import models
import uuid
import os
from typing import Optional

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

print("Starting Gemma 4 Backend with Database...")

# Simulated Model Download
print("Downloading/Loading Gemma-4-e2b (Edge version)...")
path = kagglehub.model_download("google/gemma-4/transformers/gemma-4-e2b")
print("Path to model files:", path)


class ReportRequest(BaseModel):
    text: str
    ward: str
    state_region: str
    image_url: Optional[str] = None

@app.post("/api/reports")
async def create_report(report: ReportRequest, db: Session = Depends(get_db)):
    """
    Simulates Gemma 4 categorizing a report and saves it to the database.
    """
    print(f"Received report from {report.ward}, {report.state_region}: {report.text}")
    
    # Simulate Gemma 4 analysis
    category = "Road Infrastructure"
    severity = "High (Hazard)"
    keywords = "Sinkhole, Traffic, Hazard"
    priority = "High"
    color = "#ef4444" # Red for high priority
    
    if "water" in report.text.lower() or "leak" in report.text.lower():
        category = "Sanitation & Water"
        severity = "Medium"
        keywords = "Water Leak, Pipe Burst"
        priority = "Medium"
        color = "#f59e0b"
    
    ticket_id = f"TKT-{uuid.uuid4().hex[:4].upper()}"
    
    new_issue = models.Issue(
        ticket_id=ticket_id,
        text=report.text,
        category=category,
        severity=severity,
        keywords=keywords,
        priority=priority,
        color=color,
        state_region=report.state_region,
        ward=report.ward,
        status="Pending Triage",
        image_url=report.image_url
    )
    
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    
    return new_issue

@app.get("/api/reports")
async def get_reports(db: Session = Depends(get_db)):
    """
    Fetch all reports for the Admin queue.
    """
    issues = db.query(models.Issue).order_by(models.Issue.created_at.desc()).all()
    return issues


class TextReport(BaseModel):
    text: str

@app.post("/api/categorize")
async def categorize_issue(report: TextReport):
    # Kept for backward compatibility with older components
    return {
        "category": "Road Infrastructure",
        "severity": "High (Hazard)",
        "keywords": "Sinkhole, Traffic, Hazard"
    }

@app.post("/api/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
        
    return {
        "pothole": "98.2%",
        "water": "12.4%",
        "faded": "45.1%",
        "description": "Severe pothole detected on the roadway, posing a significant hazard.",
        "image_url": f"http://127.0.0.1:8000/uploads/{file.filename}"
    }

class RouteRequest(BaseModel):
    issue_id: str

@app.post("/api/auto-route")
async def auto_route_issue(request: RouteRequest):
    return {
        "issue": f"Massive Sinkhole (ID: {request.issue_id})",
        "dept": "Emergency Response / PWD",
        "status": "Agent Routed",
        "time": "Just now",
        "color": "#3b82f6"
    }
