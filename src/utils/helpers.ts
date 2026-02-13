import { format, formatDistanceToNow } from 'date-fns';
import type { Assignment } from '../types';

export function formatDueDate(dateStr: string): string {
    return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
}

export function formatShortDate(dateStr: string): string {
    return format(new Date(dateStr), 'MMM d');
}

export function timeAgo(dateStr: string): string {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function getTypeChipClass(type: string): string {
    const map: Record<string, string> = {
        exam: 'chip-exam',
        paper: 'chip-paper',
        project: 'chip-project',
        quiz: 'chip-quiz',
        homework: 'chip-homework',
        other: 'chip-other',
    };
    return map[type] || 'chip-other';
}

export function getPersonChipClass(assignedTo: string): string {
    return assignedTo === 'you' ? 'chip-you' : 'chip-partner';
}

export function getStatusClass(status: string): string {
    const map: Record<string, string> = {
        upcoming: 'status-upcoming',
        completed: 'status-completed',
        overdue: 'status-overdue',
    };
    return map[status] || '';
}

export function getUniqueCourses(assignments: Assignment[]): string[] {
    const courses = new Set(assignments.map((a) => a.course).filter(Boolean));
    return Array.from(courses).sort();
}

export function getWeekKey(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day;
    d.setDate(diff);
    return d.toISOString().split('T')[0];
}

export function getBusyWeeks(assignments: Assignment[], threshold = 3): Set<string> {
    const weekCounts = new Map<string, number>();
    assignments.forEach((a) => {
        const key = getWeekKey(new Date(a.dueDate));
        weekCounts.set(key, (weekCounts.get(key) || 0) + 1);
    });
    const busy = new Set<string>();
    weekCounts.forEach((count, key) => {
        if (count >= threshold) busy.add(key);
    });
    return busy;
}
