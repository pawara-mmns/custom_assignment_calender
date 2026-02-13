import FilterPanel from './FilterPanel';
import RecentAdditions from './RecentAdditions';
import { useAssignments } from '../context/AssignmentContext';
import { HiPlus, HiCalendar } from 'react-icons/hi';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { openModal, assignments, filteredAssignments } = useAssignments();

    return (
        <>
            {open && (
                <div
                    className="sidebar-backdrop"
                    onClick={onClose}
                    style={{ display: 'none' }}
                    ref={(el) => {
                        if (el && window.innerWidth <= 768) {
                            el.style.display = 'block';
                        }
                    }}
                />
            )}
            <aside className={`sidebar ${open ? 'open' : ''}`}>
                {/* Logo / Brand */}
                <div
                    style={{
                        padding: '1.25rem 1.25rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: 'var(--gradient-you)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-glow-you)',
                        }}
                    >
                        <HiCalendar size={18} color="white" />
                    </div>
                    <div>
                        <h1
                            style={{
                                fontSize: '1rem',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            AssignCal
                        </h1>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            Assignment Calendar
                        </p>
                    </div>
                </div>

                {/* Stats bar */}
                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        margin: '0 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-glass)',
                    }}
                >
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {assignments.length}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Total
                        </div>
                    </div>
                    <div
                        style={{ width: 1, background: 'var(--border-glass)', alignSelf: 'stretch' }}
                    />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-you-light)' }}>
                            {filteredAssignments.length}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Showing
                        </div>
                    </div>
                </div>

                {/* Add Button */}
                <div style={{ padding: '0.75rem 1.25rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => openModal()}
                        style={{ width: '100%', justifyContent: 'center', padding: '0.6rem' }}
                    >
                        <HiPlus size={16} />
                        New Assignment
                    </button>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--border-glass)', margin: '0 1.25rem' }} />

                {/* Filter Panel */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <FilterPanel />

                    {/* Divider */}
                    <div style={{ height: 1, background: 'var(--border-glass)', margin: '0 1.25rem' }} />

                    {/* Recent Additions */}
                    <RecentAdditions />
                </div>
            </aside>
        </>
    );
}
