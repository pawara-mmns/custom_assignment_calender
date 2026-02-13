import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAssignments } from '../context/AssignmentContext';
import type { CalendarEvent, Assignment } from '../types';
import { getBusyWeeks, getWeekKey } from '../utils/helpers';
import { useState } from 'react';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

export default function CalendarView() {
    const { filteredAssignments, openModal, assignments } = useAssignments();
    const [currentView, setCurrentView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    const busyWeeks = useMemo(() => getBusyWeeks(assignments), [assignments]);

    const events: CalendarEvent[] = useMemo(
        () =>
            filteredAssignments.map((a) => ({
                id: a.id,
                title: a.title,
                start: new Date(a.dueDate),
                end: new Date(a.dueDate),
                resource: a,
            })),
        [filteredAssignments]
    );

    const eventStyleGetter = (event: CalendarEvent) => {
        const isYou = event.resource.assignedTo === 'you';
        return {
            className: isYou ? 'event-you' : 'event-partner',
            style: {
                background: isYou
                    ? 'linear-gradient(135deg, #7c3aed, #a78bfa)'
                    : 'linear-gradient(135deg, #0891b2, #22d3ee)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '2px 6px',
            },
        };
    };

    const dayPropGetter = (date: Date) => {
        const weekKey = getWeekKey(date);
        if (busyWeeks.has(weekKey)) {
            return {
                style: {
                    background: 'rgba(245, 158, 11, 0.04)',
                },
            };
        }
        return {};
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        openModal(event.resource);
    };

    const handleSelectSlot = (slotInfo: { start: Date }) => {
        const newAssignment = {
            dueDate: slotInfo.start.toISOString(),
        } as Assignment;
        openModal(newAssignment);
    };

    return (
        <div className="animate-fade-in" style={{ flex: 1, padding: '1.5rem' }}>
            {/* Busy week indicator */}
            {busyWeeks.size > 0 && (
                <div
                    className="animate-pulse-glow"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '999px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        color: '#fcd34d',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                    }}
                >
                    🔥 {busyWeeks.size} busy week{busyWeeks.size > 1 ? 's' : ''} detected (3+ assignments)
                </div>
            )}

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={currentView}
                onView={setCurrentView}
                date={currentDate}
                onNavigate={setCurrentDate}
                style={{ height: 'calc(100vh - 140px)' }}
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayPropGetter}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                popup
                views={['month', 'week', 'day']}
            />
        </div>
    );
}
