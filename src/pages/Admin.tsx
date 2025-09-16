import { useSearchParams } from 'react-router-dom';
import { AdminPanel } from '@/components/AdminPanel';
import { SessionManager } from '@/components/SessionManager';
import { useTimerStore } from '@/hooks/useTimerStore';

const Admin = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'sessions';
  
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    getActiveSession,
    updateTimer,
    updateDisplay,
    updateMessages,
  } = useTimerStore();

  if (view === 'control' && activeSessionId) {
    return (
      <AdminPanel
        session={getActiveSession()}
        onTimerUpdate={updateTimer}
        onDisplayUpdate={updateDisplay}
        onMessagesUpdate={updateMessages}
      />
    );
  }

  return (
    <SessionManager
      sessions={sessions}
      activeSessionId={activeSessionId}
      onCreateSession={createSession}
      onSelectSession={setActiveSessionId}
      onDeleteSession={deleteSession}
    />
  );
};

export default Admin;