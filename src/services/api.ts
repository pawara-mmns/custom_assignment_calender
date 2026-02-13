import axios from 'axios';
import type { Assignment } from '../types';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

export async function getAssignments(filters?: Record<string, string>): Promise<Assignment[]> {
    const params = new URLSearchParams();
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
    }
    const { data } = await api.get('/assignments', { params });
    return data;
}

export async function createAssignment(
    assignment: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Assignment> {
    const { data } = await api.post('/assignments', assignment);
    return data;
}

export async function updateAssignment(
    id: string,
    assignment: Partial<Assignment>
): Promise<Assignment> {
    const { data } = await api.put(`/assignments/${id}`, assignment);
    return data;
}

export async function deleteAssignment(id: string): Promise<void> {
    await api.delete(`/assignments/${id}`);
}
