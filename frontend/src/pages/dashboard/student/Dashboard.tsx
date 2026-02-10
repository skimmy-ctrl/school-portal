import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import type { Announcement } from '../../../types';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { getAttendancePercent } from '../../../services/attendanceService';

// Mock data for student
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Mid-Semester Exam Schedule Released',
    content: 'The mid-semester exam schedule has been released. Check your timetable page for details.',
    author: 'Academic Office',
    date: '2024-01-26',
    priority: 'high',
    audience: ['student'],
  },
  {
    id: '2',
    title: 'New Library Resources Available',
    content: 'We have added 200 new books and online journals to our library. Visit the library website to explore.',
    author: 'Library Team',
    date: '2024-01-25',
    priority: 'normal',
    audience: ['student'],
  },
  {
    id: '3',
    title: 'Sports Day Registration Open',
    content: 'Register for our annual sports day happening on February 15th. Limited spots available!',
    author: 'Sports Committee',
    date: '2024-01-24',
    priority: 'normal',
    audience: ['student'],
  },
];

const mockGPA = 3.85;
const mockRecentGrades = [
  { course: 'Mathematics', grade: 'A', gradePoint: 4.0 },
  { course: 'Physics', grade: 'A-', gradePoint: 3.7 },
  { course: 'English', grade: 'A', gradePoint: 4.0 },
  { course: 'Chemistry', grade: 'B+', gradePoint: 3.3 },
];

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'GPA',
      value: mockGPA.toFixed(2),
      color: 'bg-blue-50',
    },
    {
      title: 'Active Courses',
      value: '6',
      color: 'bg-green-50',
    },
    {
      title: 'Pending Assignments',
      value: '3',
      color: 'bg-orange-50',
    },
    {
      title: 'Attendance Rate',
      value: `${user ? (getAttendancePercent(user.email) ?? 95) : 95}%`,
      color: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {user?.name || 'Student'}!</h1>
        <p className="text-gray-600 mt-2">Here's your academic overview for this term</p>
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
        {/* Recent Grades */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader
              title="Recent Grades"
              action={
                <button
                  onClick={() => navigate('/dashboard/student/grades')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All →
                </button>
              }
            />
            <CardBody>
              <div className="space-y-4">
                {mockRecentGrades.map((item) => (
                  <div key={item.course} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.course}</p>
                      <p className="text-sm text-gray-600">Grade Point: {item.gradePoint.toFixed(1)}</p>
                    </div>
                    <div className="text-2xl font-bold text-primary-600">{item.grade}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader title="Quick Links" />
            <CardBody>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/dashboard/student/courses')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  My Courses
                </button>
                <button
                  onClick={() => navigate('/dashboard/student/assignments')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Assignments
                </button>
                <button
                  onClick={() => navigate('/dashboard/student/timetable')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Timetable
                </button>
                <button
                  onClick={() => navigate('/dashboard/student/grades')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Grades
                </button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Announcements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader
            title="Latest Announcements"
            subtitle="Stay updated with important notices from the school"
          />
          <CardBody>
            <div className="space-y-4">
              {mockAnnouncements.map((announcement) => (
                <div key={announcement.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                        {announcement.priority === 'high' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                      <p className="text-xs text-gray-500">{announcement.author} • {announcement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
