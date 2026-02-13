import { HiMenu, HiRefresh, HiPlus } from 'react-icons/hi';
import { useAssignments } from '../context/AssignmentContext';

interface HeaderProps {
    onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
    const { refresh, loading, openModal } = useAssignments();

    return (
        <header className="app-header">
            <div className="header-left">
                <button className="btn-icon header-menu-btn" onClick={onMenuToggle}>
                    <HiMenu size={18} />
                </button>
                <div>
                    <h2 className="header-title">Calendar</h2>
                    <p className="header-date">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
            </div>

            <div className="header-right">
                {/* Legend — hidden on very small screens */}
                <div className="header-legend">
                    <span className="header-legend-item">
                        <span className="header-legend-dot" style={{ background: 'var(--gradient-you)' }} />
                        <span>You</span>
                    </span>
                    <span className="header-legend-item">
                        <span className="header-legend-dot" style={{ background: 'var(--gradient-partner)' }} />
                        <span>Partner</span>
                    </span>
                </div>

                {/* Mobile-only add button */}
                <button className="btn-icon header-add-btn" onClick={() => openModal()}>
                    <HiPlus size={16} />
                </button>

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
