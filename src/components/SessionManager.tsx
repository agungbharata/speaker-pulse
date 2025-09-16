import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimerSession } from '@/types/timekeeper';
import { Plus, Play, Trash2, Calendar } from 'lucide-react';

interface SessionManagerProps {
  sessions: TimerSession[];
  activeSessionId: string | null;
  onCreateSession: (name: string) => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export const SessionManager = ({
  sessions,
  activeSessionId,
  onCreateSession,
  onSelectSession,
  onDeleteSession,
}: SessionManagerProps) => {
  const [newSessionName, setNewSessionName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      onCreateSession(newSessionName.trim());
      setNewSessionName('');
      setShowCreateForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-admin-bg p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Session Manager</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* Create Session Form */}
        {showCreateForm && (
          <Card className="mb-6 bg-admin-card border-admin-border">
            <CardHeader>
              <CardTitle className="text-white">Create New Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Session Name</Label>
                <Input
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="e.g., Seminar Teknologi 2024"
                  className="bg-admin-bg border-admin-border text-white mt-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateSession()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateSession} disabled={!newSessionName.trim()}>
                  Create Session
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewSessionName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <Card className="bg-admin-card border-admin-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Sessions Yet</h3>
                <p className="text-gray-400 text-center mb-4">
                  Create your first session to start managing seminar timers
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card 
                key={session.id}
                className={`bg-admin-card border-admin-border transition-colors ${
                  activeSessionId === session.id ? 'ring-2 ring-timer-accent' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {session.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Created: {formatDate(session.createdAt)}</span>
                        <span>Updated: {formatDate(session.updatedAt)}</span>
                        <span>Duration: {session.timer.totalMinutes} min</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: session.display.backgroundColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: session.display.textColor }}
                        />
                        <span className="text-xs text-gray-500">
                          {session.display.mode === 'timer' ? 'Timer Mode' : 'Message Mode'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onSelectSession(session.id)}
                        variant={activeSessionId === session.id ? "default" : "outline"}
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {activeSessionId === session.id ? 'Active' : 'Select'}
                      </Button>
                      <Button
                        onClick={() => onDeleteSession(session.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};