import { useEffect, useState } from 'react';
import { TimerState, DisplaySettings, MessageData } from '@/types/timekeeper';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  timer: TimerState;
  display: DisplaySettings;
  messages: MessageData;
  className?: string;
}

export const TimerDisplay = ({ timer, display, messages, className }: TimerDisplayProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-timer-bg text-timer-text">
        <div className="text-4xl">Loading...</div>
      </div>
    );
  }

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const totalSeconds = timer.minutes * 60 + timer.seconds;
    if (totalSeconds <= 60) return 'text-timer-danger'; // Last minute - red
    if (totalSeconds <= 300) return 'text-timer-warning'; // Last 5 minutes - orange
    return 'text-timer-accent'; // Normal - yellow
  };

  const dynamicStyles = {
    backgroundColor: display.backgroundColor,
    color: display.textColor,
  };

  if (display.mode === 'message') {
    return (
      <div 
        className={cn("flex h-screen items-center justify-center p-8", className)}
        style={dynamicStyles}
      >
        <div className="max-w-6xl text-center">
          <div 
            className="rounded-3xl border-4 p-12"
            style={{ borderColor: display.textColor }}
          >
            <p 
              className="leading-relaxed"
              style={{ 
                fontSize: 'var(--message-font-size)',
                color: display.textColor 
              }}
            >
              {messages.longMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("flex h-screen flex-col items-center justify-center p-8", className)}
      style={dynamicStyles}
    >
      {/* Message Box */}
      <div className="mb-16 max-w-4xl">
        <div 
          className="rounded-2xl border-2 px-8 py-6 text-center"
          style={{ borderColor: display.textColor }}
        >
          <p 
            className="font-medium"
            style={{ 
              fontSize: 'var(--label-font-size)',
              color: display.textColor 
            }}
          >
            {messages.shortMessage}
          </p>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <div 
          className={cn("mb-8 font-bold tabular-nums", getTimerColor())}
          style={{ 
            fontSize: 'var(--timer-font-size)',
            color: display.textColor,
            textShadow: '0 0 40px currentColor',
          }}
        >
          {formatTime(timer.minutes, timer.seconds)}
        </div>
        
        {/* Labels */}
        <div className="flex justify-center gap-32">
          <div 
            className="font-semibold"
            style={{ 
              fontSize: 'var(--label-font-size)',
              color: display.textColor 
            }}
          >
            Menit
          </div>
          <div 
            className="font-semibold"
            style={{ 
              fontSize: 'var(--label-font-size)',
              color: display.textColor 
            }}
          >
            Detik
          </div>
        </div>
      </div>

      {/* Running Indicator */}
      {timer.isRunning && (
        <div className="absolute bottom-8 right-8">
          <div 
            className="h-6 w-6 animate-pulse rounded-full"
            style={{ backgroundColor: display.textColor }}
          />
        </div>
      )}
    </div>
  );
};