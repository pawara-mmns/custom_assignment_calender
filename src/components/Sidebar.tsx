import FilterPanel from './FilterPanel';
import RecentAdditions from './RecentAdditions';
import { useAssignments } from '../context/AssignmentContext';
import { HiPlus, HiCalendar, HiX } from 'react-icons/hi';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { openModal, assignments, filteredAssignments } = useAssignments();

    return (
        <>
            {/* Backdrop — only visible on mobile when sidebar is open */}
            <div
                className={`sidebar-backdrop ${open ? 'active' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${open ? 'open' : ''}`}>
                {/* Logo / Brand */}
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <div className="sidebar-logo">
                            <HiCalendar size={18} color="white" />
                        </div>
                        <div>
                            <h1 className="sidebar-title">AssignCal</h1>
                            <p className="sidebar-subtitle">Assignment Calendar</p>
                        </div>
                    </div>
                    {/* Close button — only visible on mobile */}
                    <button className="btn-icon sidebar-close" onClick={onClose}>
                        <HiX size={18} />
                    </button>
                </div>

                {/* Stats bar */}
                <div className="sidebar-stats">
                    <div className="sidebar-stat">
                        <div className="sidebar-stat-value">{assignments.length}</div>
                        <div className="sidebar-stat-label">Total</div>
                    </div>
                    <div className="sidebar-stat-divider" />
                    <div className="sidebar-stat">
                        <div className="sidebar-stat-value" style={{ color: 'var(--accent-you-light)' }}>
                            {filteredAssignments.length}
                        </div>
                        <div className="sidebar-stat-label">Showing</div>
                    </div>
                </div>

                {/* Add Button */}
                <div style={{ padding: '0.75rem 1.25rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            openModal();
                            onClose(); // close sidebar on mobile after opening modal
                        }}
                        style={{ width: '100%', justifyContent: 'center', padding: '0.6rem' }}
                    >
                        <HiPlus size={16} />
                        New Assignment
                    </button>
                </div>

                {/* Divider */}
                <div className="sidebar-divider" />

                {/* Scrollable content */}
                <div className="sidebar-scroll">
                    <FilterPanel />
                    <div className="sidebar-divider" />
                    <RecentAdditions />
                </div>
            </aside>
        </>
    );
}
