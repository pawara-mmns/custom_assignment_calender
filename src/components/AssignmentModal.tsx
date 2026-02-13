import React, { useState, useEffect } from 'react';
import { useAssignments } from '../context/AssignmentContext';
import type { AssignmentType } from '../types';
import { HiX, HiTrash } from 'react-icons/hi';

const TYPES: AssignmentType[] = ['exam', 'paper', 'project', 'quiz', 'homework', 'other'];
const PRIORITIES = ['low', 'medium', 'high'] as const;

interface FormData {
    title: string;
    dueDate: string;
    course: string;
    type: AssignmentType;
    assignedTo: 'you' | 'partner';
    priority: 'low' | 'medium' | 'high';
    status: 'upcoming' | 'completed' | 'overdue';
    notes: string;
}

const defaultForm: FormData = {
    title: '',
    dueDate: '',
    course: '',
    type: 'homework',
    assignedTo: 'you',
    priority: 'medium',
    status: 'upcoming',
    notes: '',
};

export default function AssignmentModal() {
    const { modalOpen, closeModal, editingAssignment, addAssignment, updateAssignment, deleteAssignment } =
        useAssignments();
    const [form, setForm] = useState<FormData>(defaultForm);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isEditing = editingAssignment && editingAssignment.id;

    useEffect(() => {
        if (editingAssignment) {
            setForm({
                title: editingAssignment.title || '',
                dueDate: editingAssignment.dueDate
                    ? editingAssignment.dueDate.slice(0, 16)
                    : '',
                course: editingAssignment.course || '',
                type: editingAssignment.type || 'homework',
                assignedTo: editingAssignment.assignedTo || 'you',
                priority: editingAssignment.priority || 'medium',
                status: editingAssignment.status || 'upcoming',
                notes: editingAssignment.notes || '',
            });
        } else {
            setForm(defaultForm);
        }
        setConfirmDelete(false);
    }, [editingAssignment, modalOpen]);

    if (!modalOpen) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.dueDate) return;

        const data = {
            ...form,
            dueDate: new Date(form.dueDate).toISOString(),
        };

        if (isEditing) {
            await updateAssignment(editingAssignment.id, data);
        } else {
            await addAssignment(data);
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        if (isEditing) {
            await deleteAssignment(editingAssignment.id);
        }
        closeModal();
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div
                className="modal-content glass-lg"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: '1.75rem' }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                    }}
                >
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        {isEditing ? 'Edit Assignment' : 'New Assignment'}
                    </h2>
                    <button className="btn-icon" onClick={closeModal}>
                        <HiX size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Title *</label>
                        <input
                            className="input"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Chapter 5 Essay"
                            required
                        />
                    </div>

                    {/* Due Date + Course */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="label">Due Date *</label>
                            <input
                                className="input"
                                type="datetime-local"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Course</label>
                            <input
                                className="input"
                                name="course"
                                value={form.course}
                                onChange={handleChange}
                                placeholder="e.g. CS 101"
                            />
                        </div>
                    </div>

                    {/* Type + Assigned To */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="label">Type</label>
                            <select className="select" name="type" value={form.type} onChange={handleChange}>
                                {TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Assigned To</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {(['you', 'partner'] as const).map((p) => (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setForm((prev) => ({ ...prev, assignedTo: p }))}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            transition: 'all 0.25s',
                                            background:
                                                form.assignedTo === p
                                                    ? p === 'you'
                                                        ? 'linear-gradient(135deg, #7c3aed, #a78bfa)'
                                                        : 'linear-gradient(135deg, #0891b2, #22d3ee)'
                                                    : 'rgba(255,255,255,0.04)',
                                            color: form.assignedTo === p ? 'white' : 'var(--text-secondary)',
                                            boxShadow:
                                                form.assignedTo === p
                                                    ? p === 'you'
                                                        ? '0 0 12px rgba(139,92,246,0.3)'
                                                        : '0 0 12px rgba(6,182,212,0.3)'
                                                    : 'none',
                                        }}
                                    >
                                        {p === 'you' ? '👤 You' : '👥 Partner'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Priority + Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                            <label className="label">Priority</label>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                {PRIORITIES.map((p) => (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                                        style={{
                                            flex: 1,
                                            padding: '0.4rem',
                                            borderRadius: '6px',
                                            border: form.priority === p ? 'none' : '1px solid var(--border-glass)',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            transition: 'all 0.25s',
                                            background:
                                                form.priority === p
                                                    ? p === 'high'
                                                        ? 'rgba(239,68,68,0.2)'
                                                        : p === 'medium'
                                                            ? 'rgba(245,158,11,0.2)'
                                                            : 'rgba(16,185,129,0.2)'
                                                    : 'transparent',
                                            color:
                                                form.priority === p
                                                    ? p === 'high'
                                                        ? '#fca5a5'
                                                        : p === 'medium'
                                                            ? '#fcd34d'
                                                            : '#6ee7b7'
                                                    : 'var(--text-muted)',
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="label">Status</label>
                            <select className="select" name="status" value={form.status} onChange={handleChange}>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Notes</label>
                        <textarea
                            className="input"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Optional notes…"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
                        {isEditing ? (
                            <button
                                type="button"
                                className={confirmDelete ? 'btn btn-danger' : 'btn btn-secondary'}
                                onClick={handleDelete}
                                style={{ gap: '0.35rem' }}
                            >
                                <HiTrash size={15} />
                                {confirmDelete ? 'Confirm Delete' : 'Delete'}
                            </button>
                        ) : (
                            <div />
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {isEditing ? 'Save Changes' : 'Add Assignment'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
