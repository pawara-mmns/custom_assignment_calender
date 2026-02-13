import { useMemo } from 'react';
import { useAssignments } from '../context/AssignmentContext';
import { formatShortDate, timeAgo, getTypeChipClass, getPersonChipClass } from '../utils/helpers';
import { HiClock, HiSparkles } from 'react-icons/hi';

export default function RecentAdditions() {
    const { assignments, openModal } = useAssignments();

    const recent = useMemo(() => {
        return [...assignments]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [assignments]);

    if (recent.length === 0) {
        return (
            <div style={{ padding: '1rem 1.25rem' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                    }}
                >
                    <HiSparkles size={14} style={{ color: 'var(--accent-warning)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Recent
                    </span>
                </div>
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                        padding: '1.5rem 0',
                    }}
                >
                    No assignments yet. Click the + button to add one!
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem 1.25rem' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                }}
            >
                <HiSparkles size={14} style={{ color: 'var(--accent-warning)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Recent
                </span>
                <span
                    style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        marginLeft: 'auto',
                    }}
                >
                    Last {recent.length}
                </span>
            </div>

            <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {recent.map((a) => (
                    <button
                        key={a.id}
                        onClick={() => openModal(a)}
                        className="animate-slide-in"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-glass)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.25s',
                            width: '100%',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glass)';
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1,
                                }}
                            >
                                {a.title}
                            </span>
                            <span className={`chip ${getPersonChipClass(a.assignedTo)}`}>{a.assignedTo}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className={`chip ${getTypeChipClass(a.type)}`}>{a.type}</span>
                            {a.course && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.course}</span>
                            )}
                            <span
                                style={{
                                    marginLeft: 'auto',
                                    fontSize: '0.65rem',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                }}
                            >
                                <HiClock size={10} />
                                {formatShortDate(a.dueDate)}
                            </span>
                        </div>
                        <span
                            style={{
                                fontSize: '0.6rem',
                                color: 'var(--text-muted)',
                                fontStyle: 'italic',
                            }}
                        >
                            Added {timeAgo(a.createdAt)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
