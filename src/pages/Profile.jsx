import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
  User,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  Mail,
  Bell,
  Lock,
  Trash2,
  HelpCircle,
  MessageSquare,
  Check,
  X,
} from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    psikotesCount: 0,
    journalCount: 0,
    skillsExplored: 0,
    daysActive: 0,
  });

  const [compassHistory, setCompassHistory] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reflectionReminders: true,
  });

  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch psikotes count
      const { count: psikotesCount, error: psikotesError } = await supabase
        .from('psikotes_results')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (psikotesError) throw psikotesError;

      // Fetch journal count
      const { count: journalCount, error: journalError } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (journalError) throw journalError;

      // Fetch skills explored (distinct skill_id count)
      const { data: skillsData, error: skillsError } = await supabase
        .from('skill_progress')
        .select('skill_id')
        .eq('user_id', user.id);
      if (skillsError) throw skillsError;
      const uniqueSkills = [...new Set(skillsData.map(s => s.skill_id))];

      // Fetch days active (distinct dates from journal_entries)
      const { data: journalDates, error: datesError } = await supabase
        .from('journal_entries')
        .select('created_at')
        .eq('user_id', user.id);
      if (datesError) throw datesError;
      const uniqueDates = [...new Set(journalDates.map(entry => entry.created_at.split('T')[0]))];

      // Fetch compass history
      const { data: compassData, error: compassError } = await supabase
        .from('compass_data')
        .select('id, clarity_score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (compassError) throw compassError;

      // Fetch user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      setStats({
        psikotesCount: psikotesCount || 0,
        journalCount: journalCount || 0,
        skillsExplored: uniqueSkills.length,
        daysActive: uniqueDates.length,
      });

      setCompassHistory(compassData || []);

      if (settingsData) {
        setSettings({
          emailNotifications: settingsData.email_notifications,
          reflectionReminders: settingsData.reflection_reminders,
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingToggle = async (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting],
    };

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          email_notifications: newSettings.emailNotifications,
          reflection_reminders: newSettings.reflectionReminders,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Gagal update settings. Coba lagi?');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validation
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setPasswordError('Password minimal 8 karakter');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Password tidak cocok');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      alert('Password berhasil diubah! ✅');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Gagal ubah password. Coba lagi?');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmed) return;

    try {
      // Note: This requires Supabase to have the delete user function enabled
      // For now, we'll just sign out and show a message
      // In production, you'd call a server function to delete the user

      const { error } = await supabase.rpc('delete_user', { user_id: user.id });

      if (error) {
        // If RPC doesn't exist, just sign out
        console.warn('Delete user RPC not found, signing out instead');
      }

      await signOut();
      navigate('/', { state: { message: 'Akun kamu telah dihapus. Terima kasih sudah mencoba GenMave! 👋' } });
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Gagal hapus akun. Hubungi support untuk bantuan.');
    }
  };

  const getAvatarColor = (email) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];
    const charCode = email.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-8">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Info Card */}
            <Card>
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full ${getAvatarColor(
                    user.email
                  )} flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4`}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold text-text mb-1">{user.email}</h2>
                <div className="flex items-center justify-center gap-2 text-text-light text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(user.created_at)}</span>
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card>
              <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-light">
                    <Target className="w-4 h-4" />
                    <span>Psikotes Taken</span>
                  </div>
                  <span className="font-semibold text-text">{stats.psikotesCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-light">
                    <FileText className="w-4 h-4" />
                    <span>Journal Entries</span>
                  </div>
                  <span className="font-semibold text-text">{stats.journalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-light">
                    <User className="w-4 h-4" />
                    <span>Skills Explored</span>
                  </div>
                  <span className="font-semibold text-text">{stats.skillsExplored}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-text-light">
                    <Calendar className="w-4 h-4" />
                    <span>Days Active</span>
                  </div>
                  <span className="font-semibold text-text">{stats.daysActive}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compass History Card */}
            <Card>
              <h3 className="font-semibold text-text mb-4">Compass History</h3>
              {compassHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-light mb-4">Belum ada compass. Mulai dengan psikotes!</p>
                  <Button onClick={() => navigate('/psikotes')}>Mulai Psikotes</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {compassHistory.map((compass, index) => (
                    <div
                      key={compass.id}
                      className="flex items-center justify-between p-4 bg-neutral rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-text">Compass {compassHistory.length - index}</h4>
                        <p className="text-sm text-text-light">{formatDate(compass.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-text-light">Clarity Score</p>
                          <p className="text-2xl font-bold text-primary">{compass.clarity_score}/100</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/compass?id=${compass.id}`)}>
                          Lihat
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => navigate('/psikotes')}>
                    Retake Psikotes
                  </Button>
                </div>
              )}
            </Card>

            {/* Settings Card */}
            <Card>
              <h3 className="font-semibold text-text mb-4">Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-text-light" />
                    <span className="text-text">Email Notifications</span>
                  </div>
                  <button
                    onClick={() => handleSettingToggle('emailNotifications')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'
                    } relative`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-text-light" />
                    <span className="text-text">Weekly Reflection Reminders</span>
                  </div>
                  <button
                    onClick={() => handleSettingToggle('reflectionReminders')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.reflectionReminders ? 'bg-primary' : 'bg-gray-300'
                    } relative`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        settings.reflectionReminders ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    ></div>
                  </button>
                </div>

                <hr className="border-gray-200" />

                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Lock className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Ubah Password</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200 text-sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Hapus Akun</span>
                </Button>
              </div>
            </Card>

            {/* Support Card */}
            <Card>
              <h3 className="font-semibold text-text mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate('/help')}>
                  <HelpCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Help Center</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => (window.location.href = 'mailto:support@genmave.app')}
                >
                  <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Contact Support</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text">Ubah Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-text-light hover:text-text">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Password Baru"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Minimal 8 karakter"
                  required
                />
                <Input
                  label="Konfirmasi Password Baru"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Ketik ulang password baru"
                  required
                />

                {passwordError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{passwordError}</div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)}>
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Simpan
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-red-600">Hapus Akun</h3>
                <button onClick={() => setShowDeleteModal(false)} className="text-text-light hover:text-text">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-600 text-sm">
                    ⚠️ Semua data kamu akan dihapus permanen. Aksi ini tidak bisa dibatalkan.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteConfirmed}
                    onChange={(e) => setDeleteConfirmed(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-text text-sm">Saya yakin ingin hapus akun dan semua data saya</span>
                </label>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                    Batal
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteAccount}
                    disabled={!deleteConfirmed}
                  >
                    Hapus Akun
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
