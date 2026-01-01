import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  Users,
  TrendingUp,
  FileText,
  Target,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    newUsersWeek: 0,
    activeUsersWeek: 0,
    psikotesCompletionRate: 0,
    avgClarityScore: 0,
    totalJournalEntries: 0,
    avgEntriesPerUser: 0,
  });

  const [skillsBreakdown, setSkillsBreakdown] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // days

  useEffect(() => {
    // Note: In production, you'd check for admin role here
    // For now, we'll just fetch the data
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Total Users
      const { count: totalUsers, error: usersError } = await supabase
        .from('psikotes_results')
        .select('user_id', { count: 'exact', head: true });
      if (usersError) throw usersError;

      // New Users (Last N Days)
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
      
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      let newUsersWeek = 0;
      if (authUsers && authUsers.users) {
        newUsersWeek = authUsers.users.filter(u => new Date(u.created_at) >= daysAgo).length;
      }

      // Active Users (Last N Days)
      const { data: activeUsersData, error: activeError } = await supabase
        .from('journal_entries')
        .select('user_id')
        .gte('created_at', daysAgo.toISOString());
      if (activeError) throw activeError;

      const activeUsersWeek = [...new Set(activeUsersData.map(entry => entry.user_id))].length;

      // Psikotes Completion Rate
      const { count: psikotesCount, error: psikotesError } = await supabase
        .from('psikotes_results')
        .select('*', { count: 'exact', head: true });
      if (psikotesError) throw psikotesError;

      const psikotesCompletionRate = totalUsers > 0 ? ((psikotesCount / totalUsers) * 100).toFixed(1) : 0;

      // Average Clarity Score
      const { data: compassData, error: compassError } = await supabase
        .from('compass_data')
        .select('clarity_score');
      if (compassError) throw compassError;

      const avgClarityScore = compassData.length > 0
        ? (compassData.reduce((sum, item) => sum + item.clarity_score, 0) / compassData.length).toFixed(1)
        : 0;

      // Total Journal Entries
      const { count: totalJournalEntries, error: journalError } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true });
      if (journalError) throw journalError;

      const avgEntriesPerUser = totalUsers > 0 ? (totalJournalEntries / totalUsers).toFixed(1) : 0;

      // Skills Breakdown
      const { data: skillsData, error: skillsError } = await supabase
        .from('skill_progress')
        .select('skill_id');
      if (skillsError) throw skillsError;

      const skillCounts = {};
      skillsData.forEach(item => {
        skillCounts[item.skill_id] = (skillCounts[item.skill_id] || 0) + 1;
      });

      const skillsBreakdown = Object.entries(skillCounts).map(([skill, count]) => ({
        skill: formatSkillName(skill),
        count,
      }));

      // User Growth (mock data for demo - in production, you'd query by date)
      const userGrowth = generateMockGrowthData(parseInt(dateRange));

      setMetrics({
        totalUsers,
        newUsersWeek,
        activeUsersWeek,
        psikotesCompletionRate,
        avgClarityScore,
        totalJournalEntries,
        avgEntriesPerUser,
      });

      setSkillsBreakdown(skillsBreakdown);
      setUserGrowth(userGrowth);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSkillName = (skillId) => {
    const names = {
      'uiux-design': 'UI/UX Design',
      'web-development': 'Web Development',
      'content-writing': 'Content Writing',
    };
    return names[skillId] || skillId;
  };

  const generateMockGrowthData = (days) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        users: Math.floor(Math.random() * 50) + (days - i) * 5,
      });
    }
    return data;
  };

  const handleExportCSV = (type) => {
    // In production, you'd generate actual CSV files
    alert(`Exporting ${type} as CSV... (Feature coming soon)`);
  };

  const handleExportPDF = () => {
    alert('Generating full report PDF... (Feature coming soon)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>
            <p className="text-text-light">Analytics and platform oversight</p>
          </div>

          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">All Time</option>
            </select>

            <Button variant="outline" onClick={fetchDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Button variant="primary" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light text-sm">Total Users</p>
                <p className="text-3xl font-bold text-text mt-1">{metrics.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light text-sm">New Users ({dateRange}d)</p>
                <p className="text-3xl font-bold text-text mt-1">{metrics.newUsersWeek}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light text-sm">Active Users ({dateRange}d)</p>
                <p className="text-3xl font-bold text-text mt-1">{metrics.activeUsersWeek}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-light text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-text mt-1">{metrics.psikotesCompletionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-text">User Growth</h3>
              <Button variant="outline" size="sm" onClick={() => handleExportCSV('user-growth')}>
                <Download className="w-3 h-3 mr-1" />
                CSV
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="#81B29A" strokeWidth={2} dot={{ fill: '#81B29A' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Skills Breakdown Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-text">Skills Explored</h3>
              <Button variant="outline" size="sm" onClick={() => handleExportCSV('skills')}>
                <Download className="w-3 h-3 mr-1" />
                CSV
              </Button>
            </div>
            {skillsBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={skillsBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#E07A5F" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-250 flex items-center justify-center text-text-light">
                No skills data available yet
              </div>
            )}
          </Card>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-text-light text-sm">Avg Clarity Score</p>
                <p className="text-2xl font-bold text-text">{metrics.avgClarityScore}/100</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-text-light text-sm">Total Journal Entries</p>
                <p className="text-2xl font-bold text-text">{metrics.totalJournalEntries}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-text-light text-sm">Avg Entries/User</p>
                <p className="text-2xl font-bold text-text">{metrics.avgEntriesPerUser}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Admin Dashboard Notice</h4>
              <p className="text-sm text-blue-700">
                This dashboard provides basic analytics for platform oversight. More advanced features (retention
                analysis, feedback monitoring, detailed exports) are planned for future releases. For full admin
                capabilities, consider integrating with analytics platforms like Mixpanel or Amplitude.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
