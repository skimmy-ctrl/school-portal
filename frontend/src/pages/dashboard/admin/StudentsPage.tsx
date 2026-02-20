import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { motion } from 'framer-motion';
import { deleteUserById, fetchUsersByRole } from '../../../services/adminService';
import { getStoredAccessToken } from '../../../services/authService';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  enrollmentStatus: 'active' | 'inactive' | 'pending';
  joinDate: string;
  gpa: number;
  coursesEnrolled: number;
  avatar: string;
}

export function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'gpa' | 'joinDate'>('name');

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const refreshStudents = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchUsersByRole('student');
      setStudents(data.map((user) => ({
        id: String(user.id),
        name: user.displayName || user.fullName || user.email,
        email: user.email,
        registrationNumber: `STU-${user.id}`,
        enrollmentStatus: user.isActive ? 'active' : 'inactive',
        joinDate: user.createdAt,
        gpa: 0,
        coursesEnrolled: 0,
        avatar:
          user.avatarUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            user.email
          )}`,
      })));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load students.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStudents();
    const token = getStoredAccessToken();
    if (!token) return;

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const wsUrl = apiBase.replace(/^http/, 'ws');
    const socket = new WebSocket(`${wsUrl}/ws/admin?token=${encodeURIComponent(token)}`);

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', role: 'student' }));
    });

    socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data as string);
        if (message.type === 'users' && Array.isArray(message.payload)) {
          const mapped = message.payload.map((user: any) => ({
            id: String(user.id),
            name: user.displayName || user.fullName || user.email,
            email: user.email,
            registrationNumber: `STU-${user.id}`,
            enrollmentStatus: user.isActive ? 'active' : 'inactive',
            joinDate: user.createdAt,
            gpa: 0,
            coursesEnrolled: 0,
            avatar:
              user.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                user.email
              )}`,
          }));
          setStudents(mapped);
        }
        if (message.type === 'userCreated' && message.payload) {
          const user = message.payload;
          const mapped = {
            id: String(user.id),
            name: user.displayName || user.fullName || user.email,
            email: user.email,
            registrationNumber: `STU-${user.id}`,
            enrollmentStatus: user.isActive ? 'active' : 'inactive',
            joinDate: user.createdAt,
            gpa: 0,
            coursesEnrolled: 0,
            avatar:
              user.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                user.email
              )}`,
          } as StudentRecord;
          setStudents((prev) => [mapped, ...prev]);
        }
      } catch (_error) {
        // ignore
      }
    });

    socket.addEventListener('error', () => {
      setLoadError('Realtime connection failed. Showing last known data.');
    });

    return () => {
      socket.close();
    };
  }, []);

  // Filter and search students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || student.enrollmentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'gpa') {
      return b.gpa - a.gpa;
    } else if (sortBy === 'joinDate') {
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: '✓',
      pending: '⏳',
      inactive: '✕',
    };
    return icons[status as keyof typeof icons] || '•';
  };

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.enrollmentStatus === 'active').length,
    pendingStudents: students.filter((s) => s.enrollmentStatus === 'pending').length,
    averageGPA:
      students.filter((s) => s.gpa > 0).length > 0
        ? (
            students.filter((s) => s.gpa > 0).reduce((sum, s) => sum + s.gpa, 0) /
            students.filter((s) => s.gpa > 0).length
          ).toFixed(2)
        : '—',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all students in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-blue-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                </div>
                <div className="text-4xl opacity-50">👨‍🎓</div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-green-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeStudents}</p>
                </div>
                <div className="text-4xl opacity-50">✓</div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-yellow-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Enrollment</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingStudents}</p>
                </div>
                <div className="text-4xl opacity-50">⏳</div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-purple-50">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average GPA</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.averageGPA}</p>
                </div>
                <div className="text-4xl opacity-50">📊</div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader title="Search & Filter" />
          <CardBody>
            <div className="space-y-4">
              {loadError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {loadError}
                </div>
              )}

              {/* Search Input */}
              <Input
                label="Search Students"
                placeholder="Search by name, email, or registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
              />

              {/* Filter and Sort Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Students</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="gpa">GPA (Highest)</option>
                    <option value="joinDate">Join Date (Newest)</option>
                  </select>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Showing {sortedStudents.length} of {students.length} students
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader 
            title={`Student Records (${sortedStudents.length})`}
            action={<button onClick={refreshStudents} style={{backgroundColor: '#0066cc', color: 'white'}} className="px-4 py-2 rounded-lg font-semibold hover:opacity-90">Refresh</button>}
          />
          <CardBody>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading students...</div>
            ) : sortedStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No students found matching your search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">GPA</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Courses</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{student.name}</p>
                              <p className="text-sm text-gray-600 truncate">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600 font-mono">{student.registrationNumber}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              student.enrollmentStatus
                            )}`}
                          >
                            {getStatusIcon(student.enrollmentStatus)} {student.enrollmentStatus.charAt(0).toUpperCase() + student.enrollmentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {student.gpa > 0 ? (
                            <p className="font-semibold text-gray-900">{student.gpa.toFixed(2)}</p>
                          ) : (
                            <p className="text-sm text-gray-500">—</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className="font-semibold text-gray-900">{student.coursesEnrolled}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600">{new Date(student.joinDate).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                              View
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Delete student ${student.name} (${student.email})? This action cannot be undone.`)) return;
                                try {
                                  await deleteUserById(Number(student.id));
                                  setStudents((prev) => prev.filter((item) => item.id !== student.id));
                                } catch (error) {
                                  setLoadError(error instanceof Error ? error.message : 'Failed to delete user.');
                                }
                              }}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Bulk Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader title="Bulk Actions" />
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary">📥 Import Students</Button>
              <Button variant="secondary">📤 Export Students</Button>
              <Button variant="secondary">📧 Send Message</Button>
              <Button variant="danger">🗑️ Deactivate Selected</Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

    </div>
  );
}
