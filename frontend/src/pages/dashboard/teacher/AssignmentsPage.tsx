import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Badge from '../../../components/common/Badge';
import { motion } from 'framer-motion';

interface Assignment {
  id: string;
  title: string;
  class: string;
  description: string;
  points: number;
  dueDate: string;
  createdDate: string;
  totalSubmissions: number;
  graded: number;
  pending: number;
  avgScore: number;
}

const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Chapter 5 Problem Set',
    class: 'MATH101 - Section A',
    description: 'Complete problems 1-25 from chapter 5. Show all work.',
    points: 50,
    dueDate: '2024-02-02',
    createdDate: '2024-01-22',
    totalSubmissions: 32,
    graded: 28,
    pending: 4,
    avgScore: 45.2,
  },
  {
    id: 'a2',
    title: 'Calculus Integration Worksheet',
    class: 'CALC301 - Section D',
    description: 'Practice integration techniques. Use integration by parts and substitution.',
    points: 40,
    dueDate: '2024-02-05',
    createdDate: '2024-01-25',
    totalSubmissions: 28,
    graded: 22,
    pending: 6,
    avgScore: 38.1,
  },
  {
    id: 'a3',
    title: 'Quiz: Derivatives',
    class: 'MATH102 - Section C',
    description: 'Online quiz covering derivatives and their applications.',
    points: 30,
    dueDate: '2024-02-01',
    createdDate: '2024-01-20',
    totalSubmissions: 32,
    graded: 32,
    pending: 0,
    avgScore: 27.4,
  },
  {
    id: 'a4',
    title: 'Midterm Exam - Part A',
    class: 'MATH101 - Section B',
    description: 'Midterm examination covering chapters 1-4.',
    points: 100,
    dueDate: '2024-02-10',
    createdDate: '2024-01-15',
    totalSubmissions: 31,
    graded: 15,
    pending: 16,
    avgScore: 82.3,
  },
];

export function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    classSelect: 'MATH101 - Section A',
    description: '',
    points: '50',
    dueDate: '',
  });

  const handleCreateAssignment = () => {
    if (!formData.title.trim() || !formData.dueDate) return;

    const newAssignment: Assignment = {
      id: `a${Date.now()}`,
      title: formData.title,
      class: formData.classSelect,
      description: formData.description,
      points: parseInt(formData.points),
      dueDate: formData.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
      totalSubmissions: 0,
      graded: 0,
      pending: 0,
      avgScore: 0,
    };

    setAssignments([newAssignment, ...assignments]);
    setFormData({ title: '', classSelect: 'MATH101 - Section A', description: '', points: '50', dueDate: '' });
    setShowCreateForm(false);
  };

  const stats = {
    totalAssignments: assignments.length,
    totalSubmissions: assignments.reduce((sum, a) => sum + a.totalSubmissions, 0),
    pendingGrades: assignments.reduce((sum, a) => sum + a.pending, 0),
    avgClassScore: (assignments.reduce((sum, a) => sum + a.avgScore, 0) / assignments.length).toFixed(1),
  };

  const getDueDateStatus = (date: string) => {
    const dueDate = new Date(date);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return { variant: 'danger', label: 'Overdue' };
    if (daysUntilDue <= 2) return { variant: 'warning', label: `${daysUntilDue}d left` };
    return { variant: 'success', label: `${daysUntilDue}d left` };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">Create, manage, and grade student assignments</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assignments', value: stats.totalAssignments, icon: '📝', color: 'bg-blue-50' },
          { label: 'Total Submissions', value: stats.totalSubmissions, icon: '📤', color: 'bg-green-50' },
          { label: 'Pending Grades', value: stats.pendingGrades, icon: '⏳', color: 'bg-orange-50' },
          { label: 'Avg Class Score', value: `${stats.avgClassScore}%`, icon: '📊', color: 'bg-purple-50' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={s.color}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{s.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                  </div>
                  <div className="text-4xl opacity-50">{s.icon}</div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Assignment Form */}
      {showCreateForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader title="Create New Assignment" />
            <CardBody>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Assignment Title"
                  />
                  <select
                    value={formData.classSelect}
                    onChange={(e) => setFormData({ ...formData, classSelect: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option>MATH101 - Section A</option>
                    <option>MATH101 - Section B</option>
                    <option>MATH102 - Section C</option>
                    <option>CALC301 - Section D</option>
                  </select>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    placeholder="Points"
                  />
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    placeholder="Due Date"
                  />
                </div>
                <div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Assignment Description"
                    className="w-full p-3 border rounded-lg h-20 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateAssignment}>Create Assignment</Button>
                  <Button variant="secondary" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Assignments List */}
      <Card>
        <CardHeader
          title={`Assignments (${assignments.length})`}
          action={
            !showCreateForm && (
              <Button size="sm" onClick={() => setShowCreateForm(true)}>
                ➕ New Assignment
              </Button>
            )
          }
        />
        <CardBody>
          {assignments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No assignments yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment, index) => {
                const dueDateStatus = getDueDateStatus(assignment.dueDate);
                const completionRate = Math.round((assignment.graded / assignment.totalSubmissions) * 100) || 0;

                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{assignment.class}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{assignment.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{assignment.points} pts</span>
                          <span className="text-xs text-gray-600">Created: {assignment.createdDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        {/* Due Date Badge */}
                        <Badge variant={dueDateStatus.variant as any}>
                          Due: {assignment.dueDate}
                        </Badge>

                        {/* Submission Stats */}
                        <div className="text-right text-sm">
                          <p className="text-gray-600">Submissions</p>
                          <p className="font-semibold text-gray-900">{assignment.graded}/{assignment.totalSubmissions}</p>
                        </div>

                        {/* Grade Progress */}
                        <div className="text-right text-sm">
                          <p className="text-gray-600">Avg Score</p>
                          <p className="font-semibold text-primary-600">{assignment.avgScore.toFixed(1)}%</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="secondary">Grade</Button>
                          <Button size="sm" variant="secondary">Edit</Button>
                          <Button size="sm" variant="danger">Delete</Button>
                        </div>

                        {/* Grading Progress Bar */}
                        {assignment.totalSubmissions > 0 && (
                          <div className="w-40 mt-2">
                            <div className="text-xs text-gray-600 mb-1">{completionRate}% graded</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
