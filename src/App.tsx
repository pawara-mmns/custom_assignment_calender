import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AssignmentProvider } from './context/AssignmentContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import AssignmentModal from './components/AssignmentModal';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AssignmentProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.85rem',
          },
        }}
      />
      <div className="app-layout">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
          <CalendarView />
        </div>
      </div>
      <AssignmentModal />
    </AssignmentProvider>
  );
}
