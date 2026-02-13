from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class AssignmentCreate(BaseModel):
    title: str
    dueDate: str
    course: str = ""
    type: str = "homework"
    assignedTo: str = "you"
    priority: str = "medium"
    status: str = "upcoming"
    notes: str = ""


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    dueDate: Optional[str] = None
    course: Optional[str] = None
    type: Optional[str] = None
    assignedTo: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class AssignmentResponse(BaseModel):
    id: str
    title: str
    dueDate: str
    course: str
    type: str
    assignedTo: str
    priority: str
    status: str
    notes: str
    createdAt: str
    updatedAt: str
