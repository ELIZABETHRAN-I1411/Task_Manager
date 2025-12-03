
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import json
import os
from datetime import datetime
from uuid import uuid4

# Initialize FastAPI app
app = FastAPI(title="Task Manager API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database file path
DB_FILE = "tasks.json"

# Pydantic models
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: str = Field(default="todo")
    priority: int = Field(default=3, ge=1, le=5)
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[str] = None
    priority: Optional[int] = Field(None, ge=1, le=5)
    due_date: Optional[str] = None

class Task(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    priority: int
    created_at: str
    updated_at: str
    due_date: Optional[str]

# Database operations
def load_tasks() -> dict:
    """Load tasks from JSON file"""
    if not os.path.exists(DB_FILE):
        return {"tasks": []}
    
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except:
        return {"tasks": []}

def save_tasks(data: dict):
    """Save tasks to JSON file"""
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def validate_status(status: str):
    """Validate task status"""
    valid_statuses = ["todo", "in_progress", "done"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

# Routes
@app.get("/", tags=["Health"])
def read_root():
    """Health check endpoint"""
    return {"message": "Task Manager API is running"}

@app.get("/items", response_model=List[Task], tags=["Tasks"])
def get_items(
    status: Optional[str] = Query(None),
    priority: Optional[int] = Query(None, ge=1, le=5),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    """
    Get all tasks with optional filtering and pagination
    - **status**: Filter by status (todo, in_progress, done)
    - **priority**: Filter by priority (1-5)
    - **skip**: Number of items to skip (default: 0)
    - **limit**: Number of items to return (default: 10, max: 100)
    """
    data = load_tasks()
    tasks = data.get("tasks", [])
    
    # Apply filters
    if status:
        validate_status(status)
        tasks = [t for t in tasks if t["status"] == status]
    
    if priority:
        tasks = [t for t in tasks if t["priority"] == priority]
    
    # Apply pagination
    total = len(tasks)
    tasks = tasks[skip:skip + limit]
    
    return tasks

@app.post("/items", response_model=Task, status_code=201, tags=["Tasks"])
def create_item(task: TaskCreate):
    """
    Create a new task
    - **title**: Task title (required, 1-200 characters)
    - **description**: Task description (optional, max 1000 characters)
    - **status**: Task status (default: todo, options: todo, in_progress, done)
    - **priority**: Task priority (default: 3, range: 1-5)
    - **due_date**: Due date in ISO format (optional)
    """
    validate_status(task.status)
    
    data = load_tasks()
    
    new_task = {
        "id": str(uuid4()),
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "due_date": task.due_date
    }
    
    data["tasks"].append(new_task)
    save_tasks(data)
    
    return new_task

@app.get("/items/{item_id}", response_model=Task, tags=["Tasks"])
def get_item(item_id: str):
    """Get a specific task by ID"""
    data = load_tasks()
    
    for task in data.get("tasks", []):
        if task["id"] == item_id:
            return task
    
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/items/{item_id}", response_model=Task, tags=["Tasks"])
def update_item(item_id: str, task_update: TaskUpdate):
    """
    Update a task
    - **id**: Task ID (path parameter)
    - **title**: Updated title (optional)
    - **description**: Updated description (optional)
    - **status**: Updated status (optional)
    - **priority**: Updated priority (optional)
    - **due_date**: Updated due date (optional)
    """
    data = load_tasks()
    
    for task in data.get("tasks", []):
        if task["id"] == item_id:
            # Validate status if provided
            if task_update.status:
                validate_status(task_update.status)
            
            # Update only provided fields
            if task_update.title is not None:
                task["title"] = task_update.title
            if task_update.description is not None:
                task["description"] = task_update.description
            if task_update.status is not None:
                task["status"] = task_update.status
            if task_update.priority is not None:
                task["priority"] = task_update.priority
            if task_update.due_date is not None:
                task["due_date"] = task_update.due_date
            
            task["updated_at"] = datetime.utcnow().isoformat() + "Z"
            
            save_tasks(data)
            return task
    
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/items/{item_id}", status_code=204, tags=["Tasks"])
def delete_item(item_id: str):
    """Delete a task by ID"""
    data = load_tasks()
    
    original_length = len(data.get("tasks", []))
    data["tasks"] = [t for t in data.get("tasks", []) if t["id"] != item_id]
    
    if len(data["tasks"]) == original_length:
        raise HTTPException(status_code=404, detail="Task not found")
    
    save_tasks(data)
    return None

@app.get("/docs", tags=["Documentation"])
def get_docs():
    """API documentation"""
    return {
        "title": "Task Manager API",
        "version": "1.0.0",
        "endpoints": {
            "GET /items": "Get all tasks (with filtering and pagination)",
            "POST /items": "Create a new task",
            "GET /items/{id}": "Get a specific task",
            "PUT /items/{id}": "Update a task",
            "DELETE /items/{id}": "Delete a task"
        }
    }