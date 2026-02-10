import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { motion } from 'framer-motion';

// Mock data for admin
const mockAdminStats = {
  totalStudents: 1250,
  totalTeachers: 85,
  totalClasses: 52,
  systemHealth: 98.5,
};

const mockRecentActivity = [
  { id: '1', type: 'user_registration', description: 'New student registered: John Smith', timestamp: '2024-01-26 10:30 AM' },
  { id: '2', type: 'class_created', description: 'New class created: Physics 201 (Section C)', timestamp: '2024-01-26 09:15 AM' },
  { id: '3', type: 'user_registration', description: 'New teacher added: Prof. Michael Chen', timestamp: '2024-01-25 03:45 PM' },
  { id: '4', type: 'announcement', description: 'School announcement posted: Mid-semester exam schedule', timestamp: '2024-01-25 02:20 PM' },
];

const mockSystemAlerts = [
  { id: '1', level: 'warning', message: '5 students have not completed enrollment', action: 'Review' },
  { id: '2', level: 'info', message: 'Backup completed successfully', action: 'Details' },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Total Students',
      value: mockAdminStats.totalStudents,
      color: 'bg-blue-50',
    },
    {
      title: 'Total Teachers',
      value: mockAdminStats.totalTeachers,
      color: 'bg-green-50',
    },
    {
      title: 'Total Classes',
      value: mockAdminStats.totalClasses,
      color: 'bg-orange-50',
    },
    {
      title: 'System Health',
      value: `${mockAdminStats.systemHealth.toFixed(1)}%`,
      color: 'bg-purple-50',
    },
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      user_registration: '👤',
      class_created: '📚',
      announcement: '📢',
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const getAlertBadgeColor = (level: string) => {
    const colors = {
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      info: 'bg-blue-100 text-blue-800 border-blue-300',
      error: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[level as keyof typeof colors] || colors.info;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {user?.name || 'Admin'}!</h1>
        <p className="text-gray-600 mt-2">School administrative dashboard - manage users, classes, and system settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={card.color}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader
              title="Recent Activity"
              subtitle="Latest system activities and events"
            />
            <CardBody>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="text-2xl shrink-0">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Management Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader title="Management" />
            <CardBody>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/dashboard/admin/students')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Manage Students
                </button>
                <button
                  onClick={() => navigate('/dashboard/admin/teachers')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Manage Teachers
                </button>
                <button
                  onClick={() => navigate('/dashboard/admin/classes')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Manage Classes
                </button>
                <button
                  onClick={() => navigate('/dashboard/admin/announcements')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Post Announcement
                </button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* System Alerts */}
      {mockSystemAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader
              title="System Alerts"
              subtitle="Important notifications requiring attention"
            />
            <CardBody>
              <div className="space-y-3">
                {mockSystemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border-l-4 rounded-lg flex items-start justify-between ${getAlertBadgeColor(alert.level)}`}>
                    <p className="font-medium">{alert.message}</p>
                    <button className="text-xs font-semibold hover:underline ml-2 shrink-0">
                      {alert.action}
                    </button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader
            title="System Overview"
            subtitle="Key metrics and insights"
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Sessions</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">247</p>
                <p className="text-xs text-gray-500 mt-1">Users currently online</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Enrollment Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-2">94.2%</p>
                <p className="text-xs text-gray-500 mt-1">Students with complete enrollment</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Data Storage</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">67.4%</p>
                <p className="text-xs text-gray-500 mt-1">System capacity in use</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
