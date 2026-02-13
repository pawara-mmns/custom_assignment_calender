import { HiMenu, HiRefresh } from 'react-icons/hi';
import { useAssignments } from '../context/AssignmentContext';

interface HeaderProps {
    onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
    const { refresh, loading } = useAssignments();

    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid var(--border-glass)',
                background: 'rgba(17, 24, 39, 0.5)',
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 0,
                zIndex: 30,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                    className="btn-icon"
                    onClick={onMenuToggle}
                    style={{ display: 'none' }}
                    ref={(el) => {
                        if (el && window.innerWidth <= 768) el.style.display = 'inline-flex';
                    }}
                >
                    <HiMenu size={18} />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Calendar</h2>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Legend */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginRight: '0.5rem',
                        fontSize: '0.75rem',
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '3px',
                                background: 'var(--gradient-you)',
                            }}
                        />
                        <span style={{ color: 'var(--text-secondary)' }}>You</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '3px',
                                background: 'var(--gradient-partner)',
                            }}
                        />
                        <span style={{ color: 'var(--text-secondary)' }}>Partner</span>
                    </span>
                </div>

                <button
                    className="btn-icon"
                    onClick={refresh}
                    title="Refresh"
                    style={{
                        transition: 'transform 0.3s',
                        animation: loading ? 'spin 1s linear infinite' : 'none',
                    }}
                >
                    <HiRefresh size={16} />
                </button>
            </div>
        </header>
    );
}
