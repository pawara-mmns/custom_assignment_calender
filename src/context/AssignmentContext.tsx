import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Assignment, Filters } from '../types';
import * as api from '../services/api';
import toast from 'react-hot-toast';

interface AssignmentContextType {
    assignments: Assignment[];
    filteredAssignments: Assignment[];
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    loading: boolean;
    modalOpen: boolean;
    editingAssignment: Assignment | null;
    openModal: (assignment?: Assignment | null) => void;
    closeModal: () => void;
    addAssignment: (data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateAssignment: (id: string, data: Partial<Assignment>) => Promise<void>;
    deleteAssignment: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

const AssignmentContext = createContext<AssignmentContextType | null>(null);

const defaultFilters: Filters = {
    person: 'all',
    courses: [],
    types: [],
    statuses: [],
    dateRange: { start: null, end: null },
};

export function AssignmentProvider({ children }: { children: React.ReactNode }) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

    const fetchAssignments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getAssignments();
            setAssignments(data);
        } catch {
            // Backend not available – work in local mode
            console.warn('Backend not available, running in local-only mode.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const filteredAssignments = React.useMemo(() => {
        return assignments.filter((a) => {
            if (filters.person !== 'all' && a.assignedTo !== filters.person) return false;
            if (filters.courses.length > 0 && !filters.courses.includes(a.course)) return false;
            if (filters.types.length > 0 && !filters.types.includes(a.type)) return false;
            if (filters.statuses.length > 0 && !filters.statuses.includes(a.status)) return false;
            if (filters.dateRange.start) {
                if (new Date(a.dueDate) < new Date(filters.dateRange.start)) return false;
            }
            if (filters.dateRange.end) {
                if (new Date(a.dueDate) > new Date(filters.dateRange.end)) return false;
            }
            return true;
        });
    }, [assignments, filters]);

    const openModal = useCallback((assignment?: Assignment | null) => {
        setEditingAssignment(assignment || null);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditingAssignment(null);
    }, []);

    const addAssignment = useCallback(
        async (data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>) => {
            try {
                const created = await api.createAssignment(data);
                setAssignments((prev) => [created, ...prev]);
                toast.success('Assignment added!');
            } catch {
                // Offline fallback
                const fakeId = crypto.randomUUID();
                const now = new Date().toISOString();
                const newAssignment: Assignment = {
                    ...data,
                    id: fakeId,
                    createdAt: now,
                    updatedAt: now,
                };
                setAssignments((prev) => [newAssignment, ...prev]);
                toast.success('Assignment added (local)');
            }
        },
        []
    );

    const updateAssignmentFn = useCallback(
        async (id: string, data: Partial<Assignment>) => {
            try {
                const updated = await api.updateAssignment(id, data);
                setAssignments((prev) => prev.map((a) => (a.id === id ? updated : a)));
                toast.success('Assignment updated!');
            } catch {
                setAssignments((prev) =>
                    prev.map((a) =>
                        a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
                    )
                );
                toast.success('Assignment updated (local)');
            }
        },
        []
    );

    const deleteAssignmentFn = useCallback(async (id: string) => {
        try {
            await api.deleteAssignment(id);
            setAssignments((prev) => prev.filter((a) => a.id !== id));
            toast.success('Assignment deleted');
        } catch {
            setAssignments((prev) => prev.filter((a) => a.id !== id));
            toast.success('Assignment deleted (local)');
        }
    }, []);

    return (
        <AssignmentContext.Provider
            value={{
                assignments,
                filteredAssignments,
                filters,
                setFilters,
                loading,
                modalOpen,
                editingAssignment,
                openModal,
                closeModal,
                addAssignment,
                updateAssignment: updateAssignmentFn,
                deleteAssignment: deleteAssignmentFn,
                refresh: fetchAssignments,
            }}
        >
            {children}
        </AssignmentContext.Provider>
    );
}

export function useAssignments() {
    const ctx = useContext(AssignmentContext);
    if (!ctx) throw new Error('useAssignments must be used within AssignmentProvider');
    return ctx;
}
