import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Badge from '../../../components/common/Badge';
import { motion } from 'framer-motion';

interface ClassRecord {
  id: string;
  code: string;
  name: string;
  teacher: string;
  room: string;
  schedule: string;
  students: number;
  status: 'active' | 'archived' | 'planned';
}

const mockClasses: ClassRecord[] = [
  { id: 'c1', code: 'MATH101', name: 'Mathematics 101', teacher: 'Dr. Sarah Smith', room: 'B201', schedule: 'Mon/Wed 09:00 - 10:30', students: 32, status: 'active' },
  { id: 'c2', code: 'PHY201', name: 'Physics 201', teacher: 'Prof. Michael Chen', room: 'C102', schedule: 'Tue/Thu 11:00 - 12:30', students: 28, status: 'active' },
  { id: 'c3', code: 'CHEM150', name: 'Chemistry Basics', teacher: 'Dr. Emily Johnson', room: 'A305', schedule: 'Mon/Wed 13:00 - 14:30', students: 30, status: 'active' },
  { id: 'c4', code: 'CS301', name: 'Algorithms', teacher: 'Dr. Rachel Thompson', room: 'D110', schedule: 'Fri 09:00 - 12:00', students: 26, status: 'planned' },
  { id: 'c5', code: 'PE101', name: 'Physical Education', teacher: 'Prof. Christopher Lee', room: 'Gym', schedule: 'Tue/Thu 08:00 - 09:30', students: 0, status: 'archived' },
];

export function ClassesPage() {
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'planned' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'students'>('code');

  const filtered = mockClasses.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.teacher.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'students':
        return b.students - a.students;
      case 'code':
      default:
        return a.code.localeCompare(b.code);
    }
  });

  const stats = {
    total: mockClasses.length,
    active: mockClasses.filter((c) => c.status === 'active').length,
    planned: mockClasses.filter((c) => c.status === 'planned').length,
    archived: mockClasses.filter((c) => c.status === 'archived').length,
  };

  const statusVariant = (s: ClassRecord['status']) =>
    s === 'active' ? 'success' : s === 'planned' ? 'info' : 'default';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Classes Overview</h1>
        <p className="text-gray-600 mt-2">View and manage class schedules, assigned teachers, and enrollment.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: stats.total, icon: '📚', color: 'bg-blue-50' },
          { label: 'Active', value: stats.active, icon: '✅', color: 'bg-green-50' },
          { label: 'Planned', value: stats.planned, icon: '🗓️', color: 'bg-yellow-50' },
          { label: 'Archived', value: stats.archived, icon: '📦', color: 'bg-gray-50' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={s.color}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{s.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                  </div>
                  <div className="text-3xl opacity-50">{s.icon}</div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader title={`Classes (${sorted.length})`} />
        <CardBody>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by code, name or teacher..." />
              <select className="px-3 py-2 border rounded-lg" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="planned">Planned</option>
                <option value="archived">Archived</option>
              </select>
              <select className="px-3 py-2 border rounded-lg" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="code">Sort by Code</option>
                <option value="name">Sort by Name</option>
                <option value="students">Sort by Students</option>
              </select>
              <div className="flex items-center gap-2">
                <Button size="sm">Export CSV</Button>
                <Button size="sm" variant="secondary">New Class</Button>
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No classes found.</div>
            ) : (
              <div className="space-y-3">
                {sorted.map((c) => (
                  <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="p-4 border rounded-lg flex items-center justify-between gap-4 hover:shadow-sm transition">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex flex-col">
                        <div className="font-semibold text-gray-900 truncate">{c.code} — {c.name}</div>
                        <div className="text-sm text-gray-500 truncate">{c.teacher} • {c.room}</div>
                        <div className="text-xs text-gray-400 mt-1">{c.schedule}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-gray-600">Students</div>
                        <div className="font-medium text-gray-900">{c.students}</div>
                      </div>
                      <Badge variant={statusVariant(c.status)}>{c.status === 'active' ? 'Active' : c.status === 'planned' ? 'Planned' : 'Archived'}</Badge>
                      <Button size="sm" variant="secondary">Manage</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
