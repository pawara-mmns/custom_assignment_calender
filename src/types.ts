export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  course: string;
  type: AssignmentType;
  assignedTo: 'you' | 'partner';
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'completed' | 'overdue';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentType = 'exam' | 'paper' | 'project' | 'quiz' | 'homework' | 'other';

export interface Filters {
  person: 'all' | 'you' | 'partner';
  courses: string[];
  types: AssignmentType[];
  statuses: ('upcoming' | 'completed' | 'overdue')[];
  dateRange: { start: string | null; end: string | null };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Assignment;
}
