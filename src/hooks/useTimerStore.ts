import { useState, useEffect, useCallback } from 'react';
import { TimerState, DisplaySettings, MessageData, TimerSession } from '@/types/timekeeper';

const STORAGE_KEY = 'timekeeper_sessions';
const ACTIVE_SESSION_KEY = 'timekeeper_active_session';

export const useTimerStore = () => {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    const savedActiveId = localStorage.getItem(ACTIVE_SESSION_KEY);
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    if (savedActiveId) {
      setActiveSessionId(savedActiveId);
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Save active session ID to localStorage
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
    }
  }, [activeSessionId]);

  const createSession = useCallback((name: string): string => {
    const newSession: TimerSession = {
      id: Date.now().toString(),
      name,
      timer: {
        minutes: 5,
        seconds: 0,
        isRunning: false,
        totalMinutes: 5,
      },
      display: {
        backgroundColor: '#21212b',
        textColor: '#f5f5f5',
        mode: 'timer',
      },
      messages: {
        shortMessage: 'Teks Peringatan Untuk Pembicara',
        longMessage: 'Teks pesan untuk pembicara dan juga host dari operator seminar',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession.id;
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<TimerSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id 
        ? { ...session, ...updates, updatedAt: new Date().toISOString() }
        : session
    ));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  const getActiveSession = useCallback((): TimerSession | null => {
    return sessions.find(session => session.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  const updateTimer = useCallback((timerUpdates: Partial<TimerState>) => {
    if (!activeSessionId) return;
    
    updateSession(activeSessionId, {
      timer: {
        ...getActiveSession()?.timer!,
        ...timerUpdates,
      },
    });
  }, [activeSessionId, updateSession, getActiveSession]);

  const updateDisplay = useCallback((displayUpdates: Partial<DisplaySettings>) => {
    if (!activeSessionId) return;
    
    updateSession(activeSessionId, {
      display: {
        ...getActiveSession()?.display!,
        ...displayUpdates,
      },
    });
  }, [activeSessionId, updateSession, getActiveSession]);

  const updateMessages = useCallback((messageUpdates: Partial<MessageData>) => {
    if (!activeSessionId) return;
    
    updateSession(activeSessionId, {
      messages: {
        ...getActiveSession()?.messages!,
        ...messageUpdates,
      },
    });
  }, [activeSessionId, updateSession, getActiveSession]);

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    getActiveSession,
    updateTimer,
    updateDisplay,
    updateMessages,
  };
};