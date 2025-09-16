export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalMinutes: number;
}

export interface DisplaySettings {
  backgroundColor: string;
  textColor: string;
  mode: 'timer' | 'message';
}

export interface MessageData {
  shortMessage: string;
  longMessage: string;
}

export interface TimerSession {
  id: string;
  name: string;
  timer: TimerState;
  display: DisplaySettings;
  messages: MessageData;
  createdAt: string;
  updatedAt: string;
}