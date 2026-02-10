import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import type { Assignment } from '../../../types';
import { motion } from 'framer-motion';

const mockAssignments: Assignment[] = [
  {
    id: 'A001',
    courseId: 'C001',
    title: 'Calculus Problem Set 5',
    description: 'Solve the given differential equations using integration techniques.',
    dueDate: '2024-02-05',
    submissionStatus: 'pending',
  },
  {
    id: 'A002',
    courseId: 'C002',
    title: 'Physics Lab Report: Simple Harmonic Motion',
    description: 'Write a comprehensive lab report on the spring-mass system experiment.',
    dueDate: '2024-02-03',
    submissionStatus: 'submitted',
  },
  {
    id: 'A003',
    courseId: 'C003',
    title: 'Literature Essay: Themes in Pride and Prejudice',
    description: 'Analyze the major themes and their development throughout the novel.',
    dueDate: '2024-02-10',
    submissionStatus: 'pending',
  },
  {
    id: 'A004',
    courseId: 'C004',
    title: 'Organic Chemistry Synthesis',
    description: 'Design a multi-step synthesis route for the given target molecule.',
    dueDate: '2024-01-31',
    submissionStatus: 'submitted',
    grade: 92,
  },
  {
    id: 'A005',
    courseId: 'C001',
    title: 'Midterm Exam Review',
    description: 'Study guide and practice problems for the midterm examination.',
    dueDate: '2024-02-15',
    submissionStatus: 'pending',
  },
  {
    id: 'A006',
    courseId: 'C006',
    title: 'Algorithm Implementation: Sorting Algorithms',
    description: 'Implement and analyze various sorting algorithms in Python.',
    dueDate: '2024-02-08',
    submissionStatus: 'submitted',
    grade: 88,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'submitted':
      return 'info';
    case 'graded':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 3600 * 24));
  return days;
};

export function AssignmentsPage() {
  const pendingCount = mockAssignments.filter(a => a.submissionStatus === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-2">Track and submit your course assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-orange-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{pendingCount}</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-blue-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Submitted</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {mockAssignments.filter(a => a.submissionStatus === 'submitted').length}
              </p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-green-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Graded</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {mockAssignments.filter(a => a.grade !== undefined).length}
              </p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-purple-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{mockAssignments.length}</p>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Assignments Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader title="Assignment List" />
          <CardBody>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Assignment</TableCell>
                  <TableCell header>Due Date</TableCell>
                  <TableCell header>Days Left</TableCell>
                  <TableCell header>Status</TableCell>
                  <TableCell header>Grade</TableCell>
                  <TableCell header>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAssignments.map((assignment) => {
                  const daysLeft = getDaysUntilDue(assignment.dueDate);
                  const isOverdue = daysLeft < 0;

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{assignment.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{assignment.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                          {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(assignment.submissionStatus)}>
                          {getStatusLabel(assignment.submissionStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.grade ? (
                          <span className="font-semibold text-gray-900">{assignment.grade}%</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {assignment.submissionStatus === 'pending' ? (
                          <Button variant="primary" size="sm">
                            Submit
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Upcoming Assignments */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Submissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAssignments
            .filter(a => a.submissionStatus === 'pending')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card hover className="border-orange-200">
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{assignment.title}</h3>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="text-sm font-semibold text-orange-600">
                        {getDaysUntilDue(assignment.dueDate)} days left
                      </span>
                    </div>
                    <Button variant="primary" fullWidth size="sm">
                      Submit Assignment
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
