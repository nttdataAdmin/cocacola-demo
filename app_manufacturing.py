from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pathlib import Path
from pydantic import BaseModel
from typing import Optional, List, Dict
import json
import os
import zipfile
import io
from datetime import datetime
from openai import AzureOpenAI
from dotenv import load_dotenv
import base64
import random

# OCR Support
try:
    import pytesseract
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    print("Warning: pytesseract/PIL not available. OCR will be simulated.")

try:
    from docx import Document
    DOCX_AVAILABLE = True
except ImportError:
    DOCX_AVAILABLE = False
    print("Warning: python-docx not available.")

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Pepsico Manufacturing Production Line Management",
    description="Production Line Management System with Form Processing and Worker Reallocation"
)

# Azure OpenAI Configuration
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT", "https://oai-mcm-agentic-flow-nprd01.openai.azure.com/")
AZURE_DEPLOYMENT = os.getenv("AZURE_DEPLOYMENT", "gpt-4.1")
AZURE_API_KEY = os.getenv("AZURE_API_KEY", "")
AZURE_API_VERSION = os.getenv("AZURE_API_VERSION", "2024-08-01-preview")

# Output directories
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "Output" / "Manufacturing"
FORMS_DIR = OUTPUT_DIR / "Forms"
PROCESSED_DIR = OUTPUT_DIR / "Processed"
REPORTS_DIR = OUTPUT_DIR / "Reports"

# Create output directories
for dir_path in [OUTPUT_DIR, FORMS_DIR, PROCESSED_DIR, REPORTS_DIR]:
    dir_path.mkdir(parents=True, exist_ok=True)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
)

# Add OPTIONS handler for CORS preflight
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle CORS preflight requests"""
    return {"status": "ok"}

# In-memory storage
uploaded_forms = {}
production_lines = {}
workers = {}
form_processing_results = {}

# Initialize mock data
def initialize_mock_data():
    """Initialize mock production lines and workers"""
    global production_lines, workers, uploaded_forms, form_processing_results
    
    # Create 100 production lines
    for pl_id in range(1, 101):
        production_lines[f"PL-{pl_id:03d}"] = {
            "id": f"PL-{pl_id:03d}",
            "status": "running" if random.random() > 0.1 else "down",  # 90% running
            "workers": [],
            "capacity": 20,
            "skills_required": ["assembly", "quality_check", "packaging"],
            "last_updated": datetime.now().isoformat()
        }
    
    # Create workers (2000 total: 100 lines * 20 workers)
    worker_id = 1
    for pl_id in range(1, 101):
        pl_key = f"PL-{pl_id:03d}"
        for w in range(20):
            skills = random.sample(
                ["assembly", "quality_check", "packaging", "maintenance", "supervision"],
                k=random.randint(2, 4)
            )
            worker = {
                "id": f"W-{worker_id:05d}",
                "name": f"Worker {worker_id}",
                "production_line": pl_key,
                "skills": skills,
                "experience_years": random.randint(1, 15),
                "status": "active"
            }
            workers[worker["id"]] = worker
            production_lines[pl_key]["workers"].append(worker["id"])
            worker_id += 1
    
    # Create some mock form processing results for demo
    mock_forms = [
        {
            "filename": "form_online_01.docx",
            "form_type": "online",
            "content": "Production Line ID: PL-001\nStatus: GO\nManager Name: Emily Davis\nDate: 2025-01-15\nNumber of Workers: 20",
            "classification": "GO",
            "attributes": {
                "production_line_id": "PL-001",
                "manager_name": "Emily Davis",
                "date": "2025-01-15",
                "worker_count": 20,
                "skills_mentioned": ["assembly", "quality_check", "packaging"]
            },
            "uploaded_at": datetime.now().isoformat()
        },
        {
            "filename": "form_online_02.docx",
            "form_type": "online",
            "content": "Production Line ID: PL-025\nStatus: NO-GO\nManager Name: Robert Wilson\nDate: 2025-01-15\nReason: Quality issue detected",
            "classification": "NO-GO",
            "attributes": {
                "production_line_id": "PL-025",
                "manager_name": "Robert Wilson",
                "date": "2025-01-15",
                "reason": "Quality issue detected - production halted for inspection",
                "worker_count": 20,
                "skills_mentioned": ["assembly", "quality_check"]
            },
            "uploaded_at": datetime.now().isoformat(),
            "reallocation_recommendations": {
                "summary": "Workers from PL-025 distributed across 3 available production lines based on skillset matching",
                "recommendations": [
                    {"worker_id": "W-00481", "current_line": "PL-025", "recommended_line": "PL-010", "reason": "Strong assembly skills match", "skill_match_score": 0.95},
                    {"worker_id": "W-00482", "current_line": "PL-025", "recommended_line": "PL-010", "reason": "Quality check expertise", "skill_match_score": 0.92},
                    {"worker_id": "W-00483", "current_line": "PL-025", "recommended_line": "PL-015", "reason": "Packaging skills required", "skill_match_score": 0.88}
                ]
            }
        },
        {
            "filename": "form_handwritten_01.png",
            "form_type": "offline",
            "content": "Production Line: PL-042\nStatus: NO-GO\nManager: John Smith\nDate: 2025-01-15\nReason: Equipment malfunction",
            "classification": "NO-GO",
            "attributes": {
                "production_line_id": "PL-042",
                "manager_name": "John Smith",
                "date": "2025-01-15",
                "reason": "Equipment malfunction - conveyor belt stopped",
                "worker_count": 20,
                "skills_mentioned": ["assembly", "packaging"]
            },
            "uploaded_at": datetime.now().isoformat(),
            "reallocation_recommendations": {
                "summary": "Workers from PL-042 reallocated to lines with matching skill requirements",
                "recommendations": [
                    {"worker_id": "W-00821", "current_line": "PL-042", "recommended_line": "PL-020", "reason": "Assembly line capacity available", "skill_match_score": 0.90},
                    {"worker_id": "W-00822", "current_line": "PL-042", "recommended_line": "PL-020", "reason": "Packaging skills match", "skill_match_score": 0.87}
                ]
            }
        }
    ]
    
    for form in mock_forms:
        uploaded_forms[form["filename"]] = form
        form_processing_results[form["filename"]] = form

initialize_mock_data()

def get_azure_client():
    """Get Azure OpenAI client"""
    return AzureOpenAI(
        azure_endpoint=AZURE_ENDPOINT,
        api_key=AZURE_API_KEY,
        api_version=AZURE_API_VERSION
    )

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        if not DOCX_AVAILABLE:
            return "DOCX parsing not available."
        from io import BytesIO
        doc = Document(BytesIO(file_content))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""

def extract_text_from_image(file_content: bytes) -> str:
    """Extract text from image using OCR"""
    try:
        if OCR_AVAILABLE:
            image = Image.open(io.BytesIO(file_content))
            text = pytesseract.image_to_string(image)
            return text
        else:
            # Simulate OCR for demo
            return "SIMULATED OCR: Production Line Status Form\nLine: PL-042\nStatus: No-Go\nDate: 2025-01-15\nManager: John Smith\nReason: Equipment malfunction\nWorkers: 20\nSkills: assembly, quality_check, packaging"
    except Exception as e:
        print(f"Error in OCR: {e}")
        return ""

def classify_form_type(text: str) -> str:
    """Classify form as Go or No-Go using LLM"""
    # First try keyword-based classification (fast fallback)
    text_upper = text.upper()
    no_go_keywords = ["DOWN", "NO-GO", "NOGO", "STOPPED", "BROKEN", "MALFUNCTION", "ISSUE", "PROBLEM", "ERROR", "FAILURE"]
    go_keywords = ["GO", "RUNNING", "OPERATIONAL", "ACTIVE", "OK", "NORMAL", "WORKING"]
    
    # Check for explicit keywords first
    if any(keyword in text_upper for keyword in no_go_keywords):
        return "NO-GO"
    if any(keyword in text_upper for keyword in go_keywords):
        return "GO"
    
    # Try LLM if API key is available
    if AZURE_API_KEY:
        try:
            client = get_azure_client()
            
            prompt = f"""You are analyzing a production line status form. Classify it as either "GO" or "NO-GO".

Form Text:
{text}

A "GO" form means the production line is operational and running normally.
A "NO-GO" form means the production line is down, has issues, or is not operational.

Respond with ONLY one word: either "GO" or "NO-GO"."""

            response = client.chat.completions.create(
                model=AZURE_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": "You are an expert in manufacturing production line analysis."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=10
            )
            
            result = response.choices[0].message.content.strip().upper()
            if "NO-GO" in result or "NOGO" in result or "DOWN" in result:
                return "NO-GO"
            return "GO"
        except Exception as e:
            print(f"Error classifying form with LLM: {e}, using keyword fallback")
    
    # Final fallback: default to GO if unclear
    return "GO"

def extract_form_attributes(text: str) -> Dict:
    """Extract attributes from form text using LLM or regex fallback"""
    import re
    
    # Default attributes
    attributes = {
        "production_line_id": None,
        "manager_name": None,
        "date": None,
        "reason": None,
        "worker_count": None,
        "skills_mentioned": []
    }
    
    # Try regex extraction first (fast, no API needed)
    # Extract production line ID
    pl_match = re.search(r'PL-?\s*(\d{1,3})', text, re.IGNORECASE)
    if pl_match:
        pl_num = pl_match.group(1).zfill(3)
        attributes["production_line_id"] = f"PL-{pl_num}"
    
    # Extract manager name
    manager_match = re.search(r'Manager[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', text, re.IGNORECASE)
    if manager_match:
        attributes["manager_name"] = manager_match.group(1)
    
    # Extract date
    date_match = re.search(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2})', text)
    if date_match:
        attributes["date"] = date_match.group(1)
    
    # Extract worker count
    worker_match = re.search(r'Workers?[:\s]+(\d+)', text, re.IGNORECASE)
    if worker_match:
        attributes["worker_count"] = int(worker_match.group(1))
    
    # Extract reason
    reason_match = re.search(r'Reason[:\s]+(.+?)(?:\n|$)', text, re.IGNORECASE)
    if reason_match:
        attributes["reason"] = reason_match.group(1).strip()
    
    # Extract skills
    skills_keywords = ["assembly", "quality_check", "packaging", "maintenance", "supervision"]
    found_skills = [skill for skill in skills_keywords if skill.lower() in text.lower()]
    if found_skills:
        attributes["skills_mentioned"] = found_skills
    
    # Try LLM extraction if API key is available (for better accuracy)
    if AZURE_API_KEY:
        try:
            client = get_azure_client()
            
            prompt = f"""Extract the following information from this production line form:

Form Text:
{text}

Extract and return in JSON format:
{{
    "production_line_id": "PL-XXX format or null",
    "manager_name": "name or null",
    "date": "date or null",
    "reason": "reason for status or null",
    "worker_count": number or null,
    "skills_mentioned": ["skill1", "skill2"] or []
}}

Only include fields that are clearly present in the form. Return valid JSON only."""

            response = client.chat.completions.create(
                model=AZURE_DEPLOYMENT,
                messages=[
                    {"role": "system", "content": "You are an expert in extracting structured data from forms."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            result_text = response.choices[0].message.content.strip()
            # Clean JSON
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0].strip()
            
            llm_attributes = json.loads(result_text)
            # Merge LLM results with regex results (LLM takes precedence)
            for key, value in llm_attributes.items():
                if value is not None and value != []:
                    attributes[key] = value
        except Exception as e:
            print(f"Error extracting attributes with LLM: {e}, using regex fallback")
    
    return attributes

def recommend_worker_reallocation(no_go_line_id: str, available_lines: List[str]) -> Dict:
    """Recommend worker reallocation using LLM/SLM"""
    try:
        client = get_azure_client()
        
        # Get workers from the down line
        down_line = production_lines.get(no_go_line_id, {})
        worker_ids = down_line.get("workers", [])
        workers_data = [workers.get(wid, {}) for wid in worker_ids]
        
        # Get available lines info
        available_lines_data = []
        for line_id in available_lines:
            line = production_lines.get(line_id, {})
            available_lines_data.append({
                "id": line_id,
                "status": line.get("status"),
                "current_workers": len(line.get("workers", [])),
                "capacity": line.get("capacity", 20),
                "skills_required": line.get("skills_required", [])
            })
        
        prompt = f"""You are a production line manager. A production line {no_go_line_id} is down and has {len(workers_data)} workers that need to be reallocated.

Workers from down line:
{json.dumps(workers_data, indent=2)}

Available production lines:
{json.dumps(available_lines_data, indent=2)}

Recommend how to reallocate these workers to available production lines based on:
1. Worker skills matching line requirements
2. Line capacity (each line can have up to 20 workers)
3. Optimal distribution

Return JSON format:
{{
    "recommendations": [
        {{
            "worker_id": "W-XXXXX",
            "current_line": "{no_go_line_id}",
            "recommended_line": "PL-XXX",
            "reason": "explanation",
            "skill_match_score": 0.0-1.0
        }}
    ],
    "summary": "Overall reallocation strategy"
}}"""

        response = client.chat.completions.create(
            model=AZURE_DEPLOYMENT,
            messages=[
                {"role": "system", "content": "You are an expert in manufacturing workforce optimization and production line management."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        result_text = response.choices[0].message.content.strip()
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        return json.loads(result_text)
    except Exception as e:
        print(f"Error in worker reallocation recommendation: {e}")
        # Fallback: simple distribution
        recommendations = []
        for i, worker_id in enumerate(worker_ids):
            target_line = available_lines[i % len(available_lines)]
            recommendations.append({
                "worker_id": worker_id,
                "current_line": no_go_line_id,
                "recommended_line": target_line,
                "reason": "Even distribution",
                "skill_match_score": 0.7
            })
        return {
            "recommendations": recommendations,
            "summary": "Workers distributed evenly across available lines"
        }

@app.post("/upload-form")
async def upload_form(
    file: UploadFile = File(...),
    form_type: str = Query("online", description="Form type: 'online' or 'offline'")
):
    """Upload production line status form (online or offline/handwritten)"""
    print(f"Received upload request: {file.filename}, type: {form_type}")
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        content = await file.read()
        
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Determine if it's an image (handwritten) or document
        is_image = file.content_type and file.content_type.startswith('image/')
        
        # Extract text
        try:
            if is_image:
                text = extract_text_from_image(content)
            else:
                text = extract_text_from_docx(content)
            
            if not text or len(text.strip()) == 0:
                text = f"Form uploaded: {file.filename}\nType: {'Handwritten' if is_image else 'Digital'}\nStatus: Processing..."
        except Exception as e:
            print(f"Error extracting text: {e}")
            text = f"Form uploaded: {file.filename}\nType: {'Handwritten' if is_image else 'Digital'}\nNote: Text extraction had issues, but form was uploaded."
        
        # Classify form
        try:
            form_classification = classify_form_type(text)
        except Exception as e:
            print(f"Error classifying form: {e}")
            form_classification = "GO"  # Default fallback
        
        # Extract attributes
        try:
            attributes = extract_form_attributes(text)
        except Exception as e:
            print(f"Error extracting attributes: {e}")
            attributes = {
                "production_line_id": None,
                "manager_name": None,
                "date": None,
                "reason": None,
                "worker_count": None,
                "skills_mentioned": []
            }
        
        form_data = {
            "filename": file.filename,
            "form_type": "offline" if is_image else "online",
            "content": text,
            "classification": form_classification,
            "attributes": attributes,
            "uploaded_at": datetime.now().isoformat(),
            "size": len(content)
        }
        
        uploaded_forms[file.filename] = form_data
        
        # If No-Go, get reallocation recommendations
        if form_classification == "NO-GO":
            pl_id = attributes.get("production_line_id")
            if pl_id and pl_id in production_lines:
                # Update line status
                production_lines[pl_id]["status"] = "down"
                
                # Get available lines
                available_lines = [
                    pl for pl, data in production_lines.items()
                    if data["status"] == "running" and len(data["workers"]) < data["capacity"]
                ]
                
                if available_lines:
                    try:
                        recommendations = recommend_worker_reallocation(pl_id, available_lines[:10])  # Limit to 10 lines
                        form_data["reallocation_recommendations"] = recommendations
                    except Exception as e:
                        print(f"Error generating reallocation recommendations: {e}")
                        # Create simple fallback recommendations
                        worker_ids = production_lines[pl_id].get("workers", [])[:20]
                        form_data["reallocation_recommendations"] = {
                            "summary": "Workers need reallocation (detailed recommendations unavailable)",
                            "recommendations": [
                                {
                                    "worker_id": wid,
                                    "current_line": pl_id,
                                    "recommended_line": available_lines[i % len(available_lines)] if available_lines else "N/A",
                                    "reason": "Even distribution",
                                    "skill_match_score": 0.7
                                }
                                for i, wid in enumerate(worker_ids)
                            ]
                        }
        
        # Store processing result
        form_processing_results[file.filename] = form_data
        
        print(f"✅ Successfully processed form: {file.filename}")
        return {
            "success": True,
            "form": form_data,
            "message": f"Form processed successfully. Classification: {form_classification}"
        }
    except HTTPException as he:
        print(f"❌ HTTP Exception in upload: {he.status_code} - {he.detail}")
        raise
    except Exception as e:
        print(f"❌ Upload error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing form: {str(e)}")

@app.get("/dashboard/status")
async def get_dashboard_status():
    """Get current production line status for dashboard"""
    running_lines = sum(1 for pl in production_lines.values() if pl["status"] == "running")
    down_lines = sum(1 for pl in production_lines.values() if pl["status"] == "down")
    total_workers = len(workers)
    active_workers = sum(1 for w in workers.values() if w["status"] == "active")
    
    recent_forms = list(uploaded_forms.values())[-10:]  # Last 10 forms
    
    return {
        "production_lines": {
            "total": 100,
            "running": running_lines,
            "down": down_lines,
            "utilization": f"{(running_lines/100)*100:.1f}%"
        },
        "workers": {
            "total": total_workers,
            "active": active_workers,
            "reallocated": 0  # Can be calculated from processing results
        },
        "recent_forms": recent_forms,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/production-lines")
async def get_production_lines():
    """Get all production lines"""
    return {
        "production_lines": production_lines,
        "count": len(production_lines)
    }

@app.get("/workers")
async def get_workers(production_line_id: Optional[str] = None):
    """Get workers, optionally filtered by production line"""
    if production_line_id:
        line = production_lines.get(production_line_id, {})
        worker_ids = line.get("workers", [])
        filtered_workers = {wid: workers[wid] for wid in worker_ids if wid in workers}
        return {"workers": filtered_workers, "count": len(filtered_workers)}
    return {"workers": workers, "count": len(workers)}

@app.get("/forms")
async def get_forms():
    """Get all uploaded forms"""
    return {
        "forms": list(uploaded_forms.values()),
        "count": len(uploaded_forms)
    }

@app.get("/processing-results")
async def get_processing_results():
    """Get all form processing results"""
    return {
        "results": list(form_processing_results.values()),
        "count": len(form_processing_results)
    }

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict] = None
    chat_history: List = []

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """AI Chat endpoint with RAG for manufacturing context"""
    try:
        client = get_azure_client()
        
        # Build knowledge base from current state
        kb_parts = []
        
        # Production lines status
        running_count = sum(1 for pl in production_lines.values() if pl["status"] == "running")
        down_count = sum(1 for pl in production_lines.values() if pl["status"] == "down")
        kb_parts.append(f"=== PRODUCTION LINES STATUS ===\nTotal: 100\nRunning: {running_count}\nDown: {down_count}\n")
        
        # Recent forms
        if uploaded_forms:
            recent = list(uploaded_forms.values())[-5:]
            kb_parts.append(f"=== RECENT FORMS ===\n{json.dumps(recent, indent=2)}\n")
        
        # Workers info
        kb_parts.append(f"=== WORKERS ===\nTotal: {len(workers)}\nActive: {sum(1 for w in workers.values() if w['status'] == 'active')}\n")
        
        # Processing results
        if form_processing_results:
            no_go_results = [r for r in form_processing_results.values() if r.get("classification") == "NO-GO"]
            if no_go_results:
                kb_parts.append(f"=== NO-GO FORMS ===\n{json.dumps(no_go_results, indent=2)}\n")
        
        knowledge_base = "\n".join(kb_parts)
        
        system_message = f"""You are an AI assistant for Pepsico Manufacturing Production Line Management System.

KNOWLEDGE BASE:
{knowledge_base}

You help managers understand:
- Production line status
- Form processing results
- Worker reallocation recommendations
- System operations

IMPORTANT FORMATTING RULES:
1. Always format your responses as bullet points using "- " or "* " at the start of each line
2. Do NOT use markdown formatting like **bold** or __italic__
3. Do NOT write long paragraphs - break information into clear, separate bullet points
4. Each point should be on a new line starting with "- "
5. Be concise and clear
6. Use simple, plain text - no special formatting characters

Example format:
- Point 1: Information here
- Point 2: More information
- Point 3: Additional details

Answer questions based on the knowledge base. Always use bullet points, never paragraphs."""

        messages = [{"role": "system", "content": system_message}]
        
        # Add chat history
        for msg in request.chat_history[-5:]:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        
        messages.append({"role": "user", "content": request.message})
        
        response = client.chat.completions.create(
            model=AZURE_DEPLOYMENT,
            messages=messages,
            temperature=0.3,
            max_tokens=500
        )
        
        # Format response to ensure bullet points
        response_text = response.choices[0].message.content
        
        # If response doesn't start with bullet points, convert to bullet points
        lines = response_text.split('\n')
        formatted_lines = []
        for line in lines:
            line = line.strip()
            if line:
                # If line doesn't already start with bullet, add one
                if not line.startswith(('-', '*', '•', '1.', '2.', '3.', '4.', '5.')):
                    # Check if it's a sentence that should be a bullet point
                    if len(line) > 10:  # Only convert longer lines
                        formatted_lines.append(f"- {line}")
                    else:
                        formatted_lines.append(line)
                else:
                    formatted_lines.append(line)
            else:
                formatted_lines.append('')
        
        response_text = '\n'.join(formatted_lines)
        
        return {"response": response_text}
    except Exception as e:
        print(f"Chat error: {e}")
        return {"response": f"Error: {str(e)}"}

@app.get("/")
async def root():
    return {
        "message": "Pepsico Manufacturing Production Line Management API",
        "version": "1.0",
        "status": "running",
        "endpoints": {
            "upload_form": "/upload-form",
            "dashboard": "/dashboard/status",
            "production_lines": "/production-lines",
            "workers": "/workers",
            "forms": "/forms",
            "chat": "/chat",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "azure_openai_configured": bool(AZURE_API_KEY),
        "ocr_available": OCR_AVAILABLE,
        "docx_available": DOCX_AVAILABLE
    }

