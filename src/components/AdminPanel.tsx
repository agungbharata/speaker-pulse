import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TimerSession } from '@/types/timekeeper';
import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, RotateCcw, Monitor, MessageSquare } from 'lucide-react';

interface AdminPanelProps {
  session: TimerSession | null;
  onTimerUpdate: (updates: any) => void;
  onDisplayUpdate: (updates: any) => void;
  onMessagesUpdate: (updates: any) => void;
}

export const AdminPanel = ({ 
  session, 
  onTimerUpdate, 
  onDisplayUpdate, 
  onMessagesUpdate 
}: AdminPanelProps) => {
  const [newDuration, setNewDuration] = useState('5');

  const { startTimer, pauseTimer, resetTimer, setTimer } = useTimer(
    session?.timer || { minutes: 5, seconds: 0, isRunning: false, totalMinutes: 5 },
    onTimerUpdate
  );

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-admin-bg text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Active Session</h2>
          <p className="text-gray-400">Create or select a session to start</p>
        </div>
      </div>
    );
  }

  const handleDurationChange = () => {
    const minutes = parseInt(newDuration);
    if (minutes > 0) {
      setTimer(minutes);
    }
  };

  const handleColorChange = (type: 'backgroundColor' | 'textColor', color: string) => {
    onDisplayUpdate({ [type]: color });
  };

  return (
    <div className="min-h-screen bg-admin-bg p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel - {session.name}</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Timer Controls */}
          <Card className="bg-admin-card border-admin-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="h-5 w-5" />
                Timer Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-timer-accent mb-2">
                  {session.timer.minutes.toString().padStart(2, '0')}:
                  {session.timer.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-400">
                  {session.timer.isRunning ? 'Running' : 'Paused'}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={session.timer.isRunning ? pauseTimer : startTimer}
                  className="flex-1"
                  variant={session.timer.isRunning ? "destructive" : "default"}
                >
                  {session.timer.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button onClick={resetTimer} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Set Duration (minutes)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    min="1"
                    max="60"
                    className="bg-admin-bg border-admin-border text-white"
                  />
                  <Button onClick={handleDurationChange} variant="outline">
                    Set
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Controls */}
          <Card className="bg-admin-card border-admin-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={session.display.mode === 'message'}
                  onCheckedChange={(checked) => 
                    onDisplayUpdate({ mode: checked ? 'message' : 'timer' })
                  }
                />
                <Label className="text-gray-300">
                  {session.display.mode === 'message' ? 'Message Mode' : 'Timer Mode'}
                </Label>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-gray-300">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={session.display.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-full h-10 rounded border border-admin-border"
                    />
                    <Input
                      value={session.display.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="bg-admin-bg border-admin-border text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      value={session.display.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="w-full h-10 rounded border border-admin-border"
                    />
                    <Input
                      value={session.display.textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="bg-admin-bg border-admin-border text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Controls */}
          <Card className="bg-admin-card border-admin-border md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Short Message (Timer Mode)</Label>
                <Input
                  value={session.messages.shortMessage}
                  onChange={(e) => onMessagesUpdate({ shortMessage: e.target.value })}
                  className="bg-admin-bg border-admin-border text-white mt-1"
                  placeholder="Message for timer display"
                />
              </div>

              <div>
                <Label className="text-gray-300">Long Message (Message Mode)</Label>
                <Textarea
                  value={session.messages.longMessage}
                  onChange={(e) => onMessagesUpdate({ longMessage: e.target.value })}
                  className="bg-admin-bg border-admin-border text-white mt-1 min-h-[100px]"
                  placeholder="Full message for message display mode"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};