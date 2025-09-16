import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TimerDisplay } from '@/components/TimerDisplay';
import { useTimerStore } from '@/hooks/useTimerStore';

const Display = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sessions, activeSessionId, setActiveSessionId, getActiveSession } = useTimerStore();
  
  const sessionId = searchParams.get('session');

  useEffect(() => {
    if (sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setActiveSessionId(sessionId);
      } else {
        navigate('/');
      }
    } else if (!activeSessionId && sessions.length > 0) {
      navigate('/');
    }
  }, [sessionId, sessions, activeSessionId, setActiveSessionId, navigate]);

  const activeSession = getActiveSession();

  if (!activeSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-timer-bg text-timer-text">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">No Active Session</h2>
          <p className="text-xl text-gray-400">Please select a session from the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <TimerDisplay
      timer={activeSession.timer}
      display={activeSession.display}
      messages={activeSession.messages}
    />
  );
};

export default Display;