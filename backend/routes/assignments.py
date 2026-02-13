from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime
import uuid

from models import AssignmentCreate, AssignmentUpdate, AssignmentResponse
from database import get_collection

router = APIRouter(prefix="/api/assignments", tags=["assignments"])


def _doc_to_response(doc: dict) -> AssignmentResponse:
    return AssignmentResponse(
        id=doc["id"],
        title=doc.get("title", ""),
        dueDate=doc.get("dueDate", ""),
        course=doc.get("course", ""),
        type=doc.get("type", "homework"),
        assignedTo=doc.get("assignedTo", "you"),
        priority=doc.get("priority", "medium"),
        status=doc.get("status", "upcoming"),
        notes=doc.get("notes", ""),
        createdAt=doc.get("createdAt", ""),
        updatedAt=doc.get("updatedAt", ""),
    )


@router.get("", response_model=List[AssignmentResponse])
def list_assignments(
    person: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
):
    col = get_collection()
    query: dict = {}

    if person:
        query["assignedTo"] = person
    if course:
        query["course"] = course
    if type:
        query["type"] = type
    if status:
        query["status"] = status

    docs = col.find(query).sort("createdAt", -1)
    return [_doc_to_response(d) for d in docs]


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: str):
    doc = get_collection().find_one({"id": assignment_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return _doc_to_response(doc)


@router.post("", response_model=AssignmentResponse, status_code=201)
def create_assignment(data: AssignmentCreate):
    now = datetime.utcnow().isoformat() + "Z"
    doc = {
        "id": str(uuid.uuid4()),
        "title": data.title,
        "dueDate": data.dueDate,
        "course": data.course,
        "type": data.type,
        "assignedTo": data.assignedTo,
        "priority": data.priority,
        "status": data.status,
        "notes": data.notes,
        "createdAt": now,
        "updatedAt": now,
    }
    get_collection().insert_one(doc)
    return _doc_to_response(doc)


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: str, data: AssignmentUpdate):
    col = get_collection()
    doc = col.find_one({"id": assignment_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Assignment not found")

    updates: dict = {"updatedAt": datetime.utcnow().isoformat() + "Z"}
    for field in ["title", "dueDate", "course", "type", "assignedTo", "priority", "status", "notes"]:
        val = getattr(data, field, None)
        if val is not None:
            updates[field] = val

    col.update_one({"id": assignment_id}, {"$set": updates})
    updated = col.find_one({"id": assignment_id})
    return _doc_to_response(updated)


@router.delete("/{assignment_id}", status_code=204)
def delete_assignment(assignment_id: str):
    result = get_collection().delete_one({"id": assignment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return None
