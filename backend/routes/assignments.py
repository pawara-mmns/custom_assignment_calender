from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime
import uuid

from models import AssignmentCreate, AssignmentUpdate, AssignmentResponse
from database import get_connection

router = APIRouter(prefix="/api/assignments", tags=["assignments"])


def _row_to_dict(row, columns) -> dict:
    return {col: val for col, val in zip(columns, row)}


COLUMNS = [
    "id", "title", "due_date", "course", "type",
    "assigned_to", "priority", "status", "notes",
    "created_at", "updated_at",
]

FIELD_MAP = {
    "id": "id",
    "title": "title",
    "due_date": "dueDate",
    "course": "course",
    "type": "type",
    "assigned_to": "assignedTo",
    "priority": "priority",
    "status": "status",
    "notes": "notes",
    "created_at": "createdAt",
    "updated_at": "updatedAt",
}


def _to_response(row) -> AssignmentResponse:
    d = _row_to_dict(row, COLUMNS)
    return AssignmentResponse(**{FIELD_MAP[k]: str(v) if v is not None else "" for k, v in d.items()})


@router.get("", response_model=List[AssignmentResponse])
def list_assignments(
    person: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
):
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT " + ", ".join(COLUMNS) + " FROM assignments WHERE 1=1"
    params = []

    if person:
        query += " AND assigned_to = ?"
        params.append(person)
    if course:
        query += " AND course = ?"
        params.append(course)
    if type:
        query += " AND type = ?"
        params.append(type)
    if status:
        query += " AND status = ?"
        params.append(status)

    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    cursor.close()
    return [_to_response(row) for row in rows]


@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT " + ", ".join(COLUMNS) + " FROM assignments WHERE id = ?",
        [assignment_id],
    )
    row = cursor.fetchone()
    cursor.close()
    if not row:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return _to_response(row)


@router.post("", response_model=AssignmentResponse, status_code=201)
def create_assignment(data: AssignmentCreate):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat() + "Z"
    aid = str(uuid.uuid4())

    cursor.execute(
        """INSERT INTO assignments (id, title, due_date, course, type, assigned_to, priority, status, notes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            aid,
            data.title,
            data.dueDate,
            data.course,
            data.type,
            data.assignedTo,
            data.priority,
            data.status,
            data.notes,
            now,
            now,
        ],
    )
    conn.commit()

    cursor.execute(
        "SELECT " + ", ".join(COLUMNS) + " FROM assignments WHERE id = ?", [aid]
    )
    row = cursor.fetchone()
    cursor.close()
    return _to_response(row)


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: str, data: AssignmentUpdate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM assignments WHERE id = ?", [assignment_id])
    if not cursor.fetchone():
        cursor.close()
        raise HTTPException(status_code=404, detail="Assignment not found")

    updates = []
    params = []
    now = datetime.utcnow().isoformat() + "Z"

    field_col = {
        "title": "title",
        "dueDate": "due_date",
        "course": "course",
        "type": "type",
        "assignedTo": "assigned_to",
        "priority": "priority",
        "status": "status",
        "notes": "notes",
    }

    for field, col in field_col.items():
        val = getattr(data, field, None)
        if val is not None:
            updates.append(f"{col} = ?")
            params.append(val)

    updates.append("updated_at = ?")
    params.append(now)
    params.append(assignment_id)

    cursor.execute(
        f"UPDATE assignments SET {', '.join(updates)} WHERE id = ?", params
    )
    conn.commit()

    cursor.execute(
        "SELECT " + ", ".join(COLUMNS) + " FROM assignments WHERE id = ?",
        [assignment_id],
    )
    row = cursor.fetchone()
    cursor.close()
    return _to_response(row)


@router.delete("/{assignment_id}", status_code=204)
def delete_assignment(assignment_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM assignments WHERE id = ?", [assignment_id])
    if not cursor.fetchone():
        cursor.close()
        raise HTTPException(status_code=404, detail="Assignment not found")

    cursor.execute("DELETE FROM assignments WHERE id = ?", [assignment_id])
    conn.commit()
    cursor.close()
    return None
