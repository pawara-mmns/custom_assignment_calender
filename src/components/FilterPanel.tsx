import { useAssignments } from '../context/AssignmentContext';
import { getUniqueCourses } from '../utils/helpers';
import type { AssignmentType } from '../types';
import { HiFilter, HiX } from 'react-icons/hi';

const TYPES: { value: AssignmentType; label: string }[] = [
    { value: 'exam', label: 'Exam' },
    { value: 'paper', label: 'Paper' },
    { value: 'project', label: 'Project' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'homework', label: 'Homework' },
    { value: 'other', label: 'Other' },
];

const STATUSES = [
    { value: 'upcoming' as const, label: 'Upcoming', color: '#a78bfa' },
    { value: 'completed' as const, label: 'Completed', color: '#10b981' },
    { value: 'overdue' as const, label: 'Overdue', color: '#ef4444' },
];

export default function FilterPanel() {
    const { assignments, filters, setFilters } = useAssignments();
    const courses = getUniqueCourses(assignments);

    const activeCount =
        (filters.person !== 'all' ? 1 : 0) +
        filters.courses.length +
        filters.types.length +
        filters.statuses.length +
        (filters.dateRange.start ? 1 : 0) +
        (filters.dateRange.end ? 1 : 0);

    const clearAll = () => {
        setFilters({
            person: 'all',
            courses: [],
            types: [],
            statuses: [],
            dateRange: { start: null, end: null },
        });
    };

    const toggleArrayFilter = <T extends string>(
        key: 'courses' | 'types' | 'statuses',
        value: T
    ) => {
        setFilters((prev) => {
            const arr = prev[key] as T[];
            return {
                ...prev,
                [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
            };
        });
    };

    return (
        <div className="animate-fade-in" style={{ padding: '1rem 1.25rem' }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HiFilter size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Filters
                    </span>
                    {activeCount > 0 && (
                        <span
                            style={{
                                background: 'var(--gradient-you)',
                                color: 'white',
                                borderRadius: '999px',
                                padding: '0.1rem 0.45rem',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                            }}
                        >
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={clearAll}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-you-light)',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                        }}
                    >
                        <HiX size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Person Filter */}
            <div style={{ marginBottom: '1rem' }}>
                <span className="label">Person</span>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {(['all', 'you', 'partner'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setFilters((prev) => ({ ...prev, person: p }))}
                            style={{
                                flex: 1,
                                padding: '0.35rem',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                transition: 'all 0.25s',
                                background:
                                    filters.person === p
                                        ? p === 'you'
                                            ? 'rgba(139,92,246,0.2)'
                                            : p === 'partner'
                                                ? 'rgba(6,182,212,0.2)'
                                                : 'rgba(255,255,255,0.08)'
                                        : 'transparent',
                                color:
                                    filters.person === p
                                        ? p === 'you'
                                            ? '#a78bfa'
                                            : p === 'partner'
                                                ? '#22d3ee'
                                                : 'var(--text-primary)'
                                        : 'var(--text-muted)',
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type Filter */}
            <div style={{ marginBottom: '1rem' }}>
                <span className="label">Type</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {TYPES.map(({ value, label }) => {
                        const active = filters.types.includes(value);
                        return (
                            <button
                                key={value}
                                onClick={() => toggleArrayFilter('types', value)}
                                className={`chip ${active ? `chip-${value}` : ''}`}
                                style={{
                                    cursor: 'pointer',
                                    border: active ? 'none' : '1px solid var(--border-glass)',
                                    opacity: active ? 1 : 0.5,
                                    transition: 'all 0.25s',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Status Filter */}
            <div style={{ marginBottom: '1rem' }}>
                <span className="label">Status</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {STATUSES.map(({ value, label, color }) => {
                        const active = filters.statuses.includes(value);
                        return (
                            <button
                                key={value}
                                onClick={() => toggleArrayFilter('statuses', value)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '6px',
                                    border: active ? 'none' : '1px solid var(--border-glass)',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    background: active ? `${color}15` : 'transparent',
                                    color: active ? color : 'var(--text-muted)',
                                    transition: 'all 0.25s',
                                    textAlign: 'left',
                                }}
                            >
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: color,
                                        opacity: active ? 1 : 0.3,
                                    }}
                                />
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Course Filter */}
            {courses.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <span className="label">Course</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {courses.map((c) => {
                            const active = filters.courses.includes(c);
                            return (
                                <button
                                    key={c}
                                    onClick={() => toggleArrayFilter('courses', c)}
                                    style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '999px',
                                        border: active ? 'none' : '1px solid var(--border-glass)',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        background: active ? 'rgba(139,92,246,0.15)' : 'transparent',
                                        color: active ? '#a78bfa' : 'var(--text-muted)',
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Date Range */}
            <div>
                <span className="label">Date Range</span>
                <div style={{ display: 'flex', gap: '0.35rem', flexDirection: 'column' }}>
                    <input
                        type="date"
                        className="input"
                        value={filters.dateRange.start || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, start: e.target.value || null },
                            }))
                        }
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                    />
                    <input
                        type="date"
                        className="input"
                        value={filters.dateRange.end || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                dateRange: { ...prev.dateRange, end: e.target.value || null },
                            }))
                        }
                        style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                    />
                </div>
            </div>
        </div>
    );
}
