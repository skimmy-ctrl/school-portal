import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { motion } from 'framer-motion';

// Mock data for teacher
const mockTeacherStats = {
  totalStudents: 127,
  classesTeaching: 4,
  pendingSubmissions: 8,
  averageClassScore: 82.5,
};

const mockClasses = [
  { id: '1', name: 'Mathematics 101', students: 32, section: 'A' },
  { id: '2', name: 'Mathematics 101', students: 31, section: 'B' },
  { id: '3', name: 'Mathematics 102', students: 32, section: 'C' },
  { id: '4', name: 'Calculus Advanced', students: 32, section: 'D' },
];

const mockRecentSubmissions = [
  { id: '1', studentName: 'Alex Johnson', assignment: 'Assignment 5', submittedAt: '2024-01-26', status: 'submitted' },
  { id: '2', studentName: 'Sarah Williams', assignment: 'Assignment 5', submittedAt: '2024-01-26', status: 'submitted' },
  { id: '3', studentName: 'Michael Brown', assignment: 'Assignment 4', submittedAt: '2024-01-25', status: 'graded' },
  { id: '4', studentName: 'Emma Davis', assignment: 'Assignment 4', submittedAt: '2024-01-25', status: 'graded' },
];

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: 'Total Students',
      value: mockTeacherStats.totalStudents,
      color: 'bg-blue-50',
    },
    {
      title: 'Classes Teaching',
      value: mockTeacherStats.classesTeaching,
      color: 'bg-green-50',
    },
    {
      title: 'Pending Submissions',
      value: mockTeacherStats.pendingSubmissions,
      color: 'bg-orange-50',
    },
    {
      title: 'Average Class Score',
      value: `${mockTeacherStats.averageClassScore.toFixed(1)}%`,
      color: 'bg-purple-50',
    },
  ];

  const getSubmissionStatusBadge = (status: string) => {
    const statusStyles = {
      submitted: 'bg-blue-100 text-blue-800',
      graded: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.pending;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {user?.name || 'Teacher'}!</h1>
        <p className="text-gray-600 mt-2">Here's your teaching overview for this semester</p>
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
        {/* Recent Submissions */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader
              title="Recent Student Submissions"
              action={
                <button
                  onClick={() => navigate('/dashboard/teacher/submissions')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All →
                </button>
              }
            />
            <CardBody>
              <div className="space-y-4">
                {mockRecentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{submission.studentName}</p>
                      <p className="text-sm text-gray-600">{submission.assignment} • {submission.submittedAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getSubmissionStatusBadge(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader title="Quick Actions" />
            <CardBody>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/dashboard/teacher/classes')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Manage Classes
                </button>
                <button
                  onClick={() => navigate('/dashboard/teacher/assignments')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Create Assignment
                </button>
                <button
                  onClick={() => navigate('/dashboard/teacher/submissions')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Review Submissions
                </button>
                <button
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  Generate Report
                </button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Classes Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader
            title="My Classes"
            subtitle="Classes you are teaching this semester"
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockClasses.map((classItem) => (
                <div key={classItem.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">Section {classItem.section}</p>
                      <p className="text-sm text-gray-500 mt-2">📍 {classItem.students} Students</p>
                    </div>
                    <div className="text-3xl">🎓</div>
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
