import { useEffect, useRef } from 'react';
import { TimerState } from '@/types/timekeeper';

export const useTimer = (
  timer: TimerState,
  onTimerUpdate: (updates: Partial<TimerState>) => void
) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        if (timer.minutes === 0 && timer.seconds === 0) {
          onTimerUpdate({ isRunning: false });
          return;
        }

        if (timer.seconds === 0) {
          onTimerUpdate({
            minutes: timer.minutes - 1,
            seconds: 59,
          });
        } else {
          onTimerUpdate({
            seconds: timer.seconds - 1,
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.minutes, timer.seconds, onTimerUpdate]);

  const startTimer = () => {
    onTimerUpdate({ isRunning: true });
  };

  const pauseTimer = () => {
    onTimerUpdate({ isRunning: false });
  };

  const resetTimer = () => {
    onTimerUpdate({
      minutes: timer.totalMinutes,
      seconds: 0,
      isRunning: false,
    });
  };

  const setTimer = (minutes: number) => {
    onTimerUpdate({
      minutes,
      seconds: 0,
      totalMinutes: minutes,
      isRunning: false,
    });
  };

  const getTimeRemaining = () => {
    return timer.minutes * 60 + timer.seconds;
  };

  const getTimeElapsed = () => {
    return timer.totalMinutes * 60 - getTimeRemaining();
  };

  const getProgressPercentage = () => {
    const total = timer.totalMinutes * 60;
    const remaining = getTimeRemaining();
    return ((total - remaining) / total) * 100;
  };

  return {
    startTimer,
    pauseTimer,
    resetTimer,
    setTimer,
    getTimeRemaining,
    getTimeElapsed,
    getProgressPercentage,
  };
};