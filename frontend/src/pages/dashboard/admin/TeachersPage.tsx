import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Badge from '../../../components/common/Badge';
import { motion } from 'framer-motion';
import { getTeacherRoles, setTeacherRole } from '../../../services/teacherRoleService';
import { assignTeacherByEmail, deleteUserById, fetchUsersByRole } from '../../../services/adminService';

interface TeacherRecord {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  qualification: string;
  status: 'active' | 'on-leave' | 'inactive';
  joinDate: string;
  classesTeaching: number;
  totalStudents: number;
  avatar: string;
  isClassTeacher?: boolean;
}

// Teachers are loaded from userService; mock data removed

export function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'on-leave' | 'inactive'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'students'>('name');
  const [teacherRoles, setTeacherRolesState] = useState(getTeacherRoles());
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ email: '' });

  const refreshTeachers = async () => {
    try {
      const data = await fetchUsersByRole('teacher');
      setTeachers(
        data.map((u) => ({
          id: String(u.id),
          name: u.displayName || u.fullName || u.email,
          email: u.email,
          employeeId: '',
          department: 'General',
          qualification: '',
          status: u.isActive ? 'active' : 'inactive',
          joinDate: new Date(u.createdAt).toISOString().split('T')[0],
          classesTeaching: 0,
          totalStudents: 0,
          avatar:
            u.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              u.email
            )}`,
        }))
      );
    } catch (_error) {
      // ignore for now
    }
  };

  useEffect(() => {
    refreshTeachers();
  }, []);

  const handleToggleClassTeacher = (email: string) => {
    const isCurrentlyClassTeacher = teacherRoles[email]?.isClassTeacher;
    setTeacherRole(email, { isClassTeacher: !isCurrentlyClassTeacher });
    // Update local state immediately for UI
    setTeacherRolesState(prev => ({
      ...prev,
      [email]: { isClassTeacher: !isCurrentlyClassTeacher }
    }));
  };

  // Get unique departments
  const departments = ['all', ...new Set(teachers.map((t) => t.department))];

  // Filter and search teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || teacher.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Sort teachers
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case 'students':
        return b.totalStudents - a.totalStudents;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const stats = {
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter((t) => t.status === 'active').length,
    onLeave: teachers.filter((t) => t.status === 'on-leave').length,
    totalClassrooms: teachers.reduce((sum, t) => sum + t.classesTeaching, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all teaching staff</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Teachers', value: stats.totalTeachers, icon: '👨‍🏫', color: 'bg-blue-50' },
          { label: 'Active', value: stats.activeTeachers, icon: '✅', color: 'bg-green-50' },
          { label: 'On Leave', value: stats.onLeave, icon: '🏖️', color: 'bg-orange-50' },
          { label: 'Total Classes', value: stats.totalClassrooms, icon: '🏛️', color: 'bg-purple-50' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={stat.color}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="text-4xl opacity-50">{stat.icon}</div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="joinDate">Sort by Join Date</option>
                  <option value="students">Sort by Students</option>
                </select>
              </div>
                <div className="text-sm text-gray-600">
                Showing {sortedTeachers.length} of {teachers.length} teachers
                </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Add Teacher</h3>
            <div className="mt-4 space-y-3">
              <Input placeholder="Email" value={newTeacher.email} onChange={(e) => setNewTeacher(prev => ({...prev, email: e.target.value}))} />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={() => {
                  if (!newTeacher.email) return;
                  assignTeacherByEmail(newTeacher.email)
                    .then(() => {
                      setNewTeacher({ email: '' });
                      setShowAddModal(false);
                      refreshTeachers();
                    })
                    .catch(() => {
                      // ignore for now
                    });
                }}
                className='bg-blue-400 text-white'>Add</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teachers List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader 
            title={`Teachers (${sortedTeachers.length})`}
            action={<button onClick={() => setShowAddModal(true)} style={{backgroundColor: '#0066cc', color: 'white'}} className="px-4 py-2 rounded-lg font-semibold hover:opacity-90">+ Add</button>}
          />
          <CardBody>
            {sortedTeachers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No teachers found matching your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedTeachers.map((teacher) => (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-12 h-12 rounded-full shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{teacher.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{teacher.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default">{teacher.department}</Badge>
                          <span className="text-xs text-gray-500">{teacher.employeeId}</span>
                        </div>
                      </div>
                    </div>
                      <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium text-gray-900">{teacher.classesTeaching} Classes</p>
                          <p className="text-xs text-gray-500">{teacher.totalStudents} Students</p>
                        </div>
                        <div className="text-right hidden md:block">
                          <p className="text-xs text-gray-500">Joined</p>
                          <p className="text-sm font-medium text-gray-900">{teacher.joinDate}</p>
                        </div>
                        <Badge
                          variant={teacher.status === 'active' ? 'success' : teacher.status === 'on-leave' ? 'warning' : 'default'}
                        >
                          {teacher.status === 'on-leave' ? 'On Leave' : teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                        </Badge>
                        {(teacherRoles[teacher.email]?.isClassTeacher || teacher.isClassTeacher) && (
                          <Badge variant="info">👨‍🏫 Class Teacher</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <Button size="sm" variant="secondary" className="whitespace-nowrap">
                          Edit
                        </Button>
                        <button
                          onClick={() => handleToggleClassTeacher(teacher.email)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                            teacherRoles[teacher.email]?.isClassTeacher || teacher.isClassTeacher
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          title={(teacherRoles[teacher.email]?.isClassTeacher || teacher.isClassTeacher) ? 'Revoke Class Teacher role' : 'Assign Class Teacher role'}
                        >
                          {(teacherRoles[teacher.email]?.isClassTeacher || teacher.isClassTeacher) ? '✕ Revoke' : '✓ Make Class Teacher'}
                        </button>
                        <button
                          onClick={() => {
                            if (!window.confirm(`Delete teacher ${teacher.name} (${teacher.email})? This action cannot be undone.`)) return;
                            deleteUserById(Number(teacher.id)).then(refreshTeachers);
                          }}
                          className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200"
                          title="Delete teacher"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
