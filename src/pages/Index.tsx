import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/hooks/useTimerStore';
import { Monitor, Settings, Timer, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { sessions, activeSessionId, getActiveSession } = useTimerStore();
  const activeSession = getActiveSession();

  useEffect(() => {
    // Auto-navigate to admin if no sessions exist
    if (sessions.length === 0) {
      navigate('/admin');
    }
  }, [sessions.length, navigate]);

  const handleDisplayView = () => {
    if (activeSessionId) {
      navigate(`/display?session=${activeSessionId}`);
    } else {
      navigate('/admin');
    }
  };

  const handleAdminView = () => {
    if (activeSessionId) {
      navigate('/admin?view=control');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-bg to-timer-bg">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Time Keeper
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Aplikasi pengatur waktu seminar profesional untuk mengontrol durasi pembicara di atas panggung
          </p>
        </div>

        {activeSession && (
          <div className="mb-8 text-center">
            <Card className="inline-block bg-admin-card border-admin-border">
              <CardContent className="p-4">
                <div className="text-white">
                  <p className="text-sm text-gray-400">Active Session</p>
                  <p className="text-lg font-semibold">{activeSession.name}</p>
                  <p className="text-sm text-timer-accent">
                    {activeSession.timer.minutes}:{activeSession.timer.seconds.toString().padStart(2, '0')} remaining
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Display View */}
          <Card className="bg-admin-card border-admin-border hover:bg-admin-card/80 transition-colors cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-timer-accent/20 rounded-full flex items-center justify-center group-hover:bg-timer-accent/30 transition-colors">
                <Monitor className="h-8 w-8 text-timer-accent" />
              </div>
              <CardTitle className="text-white">Display View</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-4">
                Tampilan timer untuk pembicara di atas panggung
              </p>
              <Button 
                onClick={handleDisplayView}
                className="w-full"
                disabled={!activeSessionId}
              >
                Open Display
              </Button>
            </CardContent>
          </Card>

          {/* Admin Control */}
          <Card className="bg-admin-card border-admin-border hover:bg-admin-card/80 transition-colors cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Settings className="h-8 w-8 text-blue-400" />
              </div>
              <CardTitle className="text-white">Admin Control</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-4">
                Panel kontrol untuk mengatur timer dan pesan
              </p>
              <Button 
                onClick={handleAdminView}
                className="w-full"
                variant="outline"
              >
                Open Admin
              </Button>
            </CardContent>
          </Card>

          {/* Session Manager */}
          <Card className="bg-admin-card border-admin-border hover:bg-admin-card/80 transition-colors cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-white">Session Manager</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-4">
                Kelola sesi seminar dan pengaturan
              </p>
              <Button 
                onClick={() => navigate('/admin')}
                className="w-full"
                variant="secondary"
              >
                Manage Sessions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        {sessions.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>{sessions.length} Sessions</span>
              </div>
              {activeSession && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeSession.display.backgroundColor }}
                  />
                  <span>Custom Theme Active</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
