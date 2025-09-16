import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTimerStore } from '@/hooks/useTimerStore';
import { Monitor, Settings, Timer, Users, Lock, Play } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { sessions, activeSessionId, getActiveSession, createSession } = useTimerStore();
  const activeSession = getActiveSession();
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleDisplayView = () => {
    if (activeSessionId) {
      navigate(`/display?session=${activeSessionId}`);
    } else {
      alert('Tidak ada sesi aktif! Silakan buat sesi baru di Admin Panel.');
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      navigate('/admin');
    } else {
      alert('Password salah! Gunakan: admin123');
    }
  };

  const handleQuickStart = () => {
    const sessionId = createSession('Sesi Cepat ' + new Date().toLocaleTimeString());
    navigate('/admin?view=control');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-bg to-timer-bg">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ⏰ Time Keeper
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Aplikasi pengatur waktu seminar profesional untuk mengontrol durasi pembicara di atas panggung
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Button 
              onClick={handleQuickStart}
              size="lg"
              className="bg-timer-accent hover:bg-timer-accent/80"
            >
              <Play className="h-5 w-5 mr-2" />
              Mulai Cepat (5 Menit)
            </Button>
            <Button 
              onClick={() => setShowAdminLogin(true)}
              size="lg"
              variant="outline"
            >
              <Lock className="h-5 w-5 mr-2" />
              Admin Panel
            </Button>
          </div>
        </div>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="mb-8 max-w-md mx-auto">
            <Card className="bg-admin-card border-admin-border">
              <CardHeader>
                <CardTitle className="text-white text-center">Login Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="password"
                  placeholder="Masukkan password admin"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-admin-bg border-admin-border text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAdminLogin} className="flex-1">
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAdminLogin(false);
                      setAdminPassword('');
                    }}
                  >
                    Batal
                  </Button>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Default password: admin123
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSession && (
          <div className="mb-8 text-center">
            <Card className="inline-block bg-admin-card border-admin-border">
              <CardContent className="p-6">
                <div className="text-white">
                  <p className="text-sm text-gray-400 mb-2">🟢 Sesi Aktif</p>
                  <p className="text-xl font-bold mb-2">{activeSession.name}</p>
                  <div className="text-3xl font-bold text-timer-accent mb-2">
                    {activeSession.timer.minutes.toString().padStart(2, '0')}:
                    {activeSession.timer.seconds.toString().padStart(2, '0')}
                  </div>
                  <p className="text-sm text-gray-400">
                    {activeSession.timer.isRunning ? '▶️ Berjalan' : '⏸️ Dihentikan'} • 
                    Durasi: {activeSession.timer.totalMinutes} menit
                  </p>
                  <Button 
                    onClick={handleDisplayView}
                    className="mt-3"
                    size="sm"
                  >
                    Buka Tampilan Timer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Display View - For Stage */}
          <Card className="bg-admin-card border-admin-border hover:bg-admin-card/80 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-20 h-20 bg-timer-accent/20 rounded-full flex items-center justify-center group-hover:bg-timer-accent/30 transition-colors">
                <Monitor className="h-10 w-10 text-timer-accent" />
              </div>
              <CardTitle className="text-white text-xl">🎯 Tampilan Timer</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6 leading-relaxed">
                Tampilan besar untuk pembicara di atas panggung.<br/>
                Menampilkan waktu dan pesan yang jelas.
              </p>
              <Button 
                onClick={handleDisplayView}
                className="w-full"
                size="lg"
                disabled={!activeSessionId}
              >
                {activeSessionId ? 'Buka Tampilan Timer' : 'Buat Sesi Dulu'}
              </Button>
              {!activeSessionId && (
                <p className="text-xs text-gray-500 mt-2">
                  Buat sesi baru di Admin Panel terlebih dahulu
                </p>
              )}
            </CardContent>
          </Card>

          {/* Admin Panel */}
          <Card className="bg-admin-card border-admin-border hover:bg-admin-card/80 transition-colors cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Settings className="h-10 w-10 text-blue-400" />
              </div>
              <CardTitle className="text-white text-xl">⚙️ Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6 leading-relaxed">
                Kontrol penuh timer, durasi, warna,<br/>
                dan pesan untuk pembicara.
              </p>
              <Button 
                onClick={() => setShowAdminLogin(true)}
                className="w-full"
                size="lg"
                variant="outline"
              >
                <Lock className="h-5 w-5 mr-2" />
                Masuk Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="bg-admin-card/50 border-admin-border">
            <CardContent className="p-6">
              <h3 className="text-white text-lg font-semibold mb-4 text-center">
                📋 Cara Menggunakan Time Keeper
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-timer-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-timer-accent font-bold">1</span>
                  </div>
                  <p className="text-gray-300">
                    <strong>Login Admin</strong><br/>
                    Gunakan password: admin123
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-timer-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-timer-accent font-bold">2</span>
                  </div>
                  <p className="text-gray-300">
                    <strong>Atur Timer</strong><br/>
                    Buat sesi, set durasi & pesan
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-timer-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-timer-accent font-bold">3</span>
                  </div>
                  <p className="text-gray-300">
                    <strong>Tampilkan</strong><br/>
                    Buka tampilan timer di layar besar
                  </p>
                </div>
              </div>
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
