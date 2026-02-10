import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import type { Grade } from '../../../types';
import { motion } from 'framer-motion';

const mockGrades: Grade[] = [
  {
    id: 'G001',
    courseId: 'C001',
    courseName: 'Advanced Mathematics',
    midterm: 88,
    finals: 92,
    assignments: 90,
    gpa: 4.0,
  },
  {
    id: 'G002',
    courseId: 'C002',
    courseName: 'Physics: Mechanics',
    midterm: 85,
    finals: 89,
    assignments: 87,
    gpa: 3.7,
  },
  {
    id: 'G003',
    courseId: 'C003',
    courseName: 'English Literature',
    midterm: 92,
    finals: 95,
    assignments: 94,
    gpa: 4.0,
  },
  {
    id: 'G004',
    courseId: 'C004',
    courseName: 'Chemistry: Organic',
    midterm: 80,
    finals: 85,
    assignments: 83,
    gpa: 3.3,
  },
  {
    id: 'G005',
    courseId: 'C005',
    courseName: 'Biology: Cell Science',
    midterm: 87,
    finals: 90,
    assignments: 88,
    gpa: 3.7,
  },
  {
    id: 'G006',
    courseId: 'C006',
    courseName: 'Computer Science: Algorithms',
    midterm: 91,
    finals: 94,
    assignments: 92,
    gpa: 4.0,
  },
];

const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return 'success';
  if (percentage >= 80) return 'info';
  if (percentage >= 70) return 'warning';
  return 'danger';
};

const getLetterGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

const calculateAverage = (grades: Grade[]): number => {
  const avg =
    grades.reduce((sum, g) => sum + (g.midterm + g.finals + g.assignments) / 3, 0) /
    grades.length;
  return Math.round(avg * 10) / 10;
};

const calculateGPA = (grades: Grade[]): number => {
  const gpa = grades.reduce((sum, g) => sum + g.gpa, 0) / grades.length;
  return Math.round(gpa * 100) / 100;
};

export function GradesPage() {
  const avgScore = calculateAverage(mockGrades);
  const gpa = calculateGPA(mockGrades);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
        <p className="text-gray-600 mt-2">Academic performance and transcript information</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-green-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{avgScore}%</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-blue-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Cumulative GPA</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{gpa.toFixed(2)}</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-purple-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Courses Taken</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{mockGrades.length}</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-orange-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Grade Distribution</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {mockGrades.filter(g => g.gpa >= 3.7).length}A&apos;s
              </p>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Grades Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader title="Grade Details by Course" />
          <CardBody>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Course</TableCell>
                  <TableCell header>Midterm</TableCell>
                  <TableCell header>Finals</TableCell>
                  <TableCell header>Assignments</TableCell>
                  <TableCell header>Average</TableCell>
                  <TableCell header>Grade</TableCell>
                  <TableCell header>GPA</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockGrades.map((grade) => {
                  const average = Math.round(
                    (grade.midterm + grade.finals + grade.assignments) / 3
                  );

                  return (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <p className="font-medium text-gray-900">{grade.courseName}</p>
                      </TableCell>
                      <TableCell>{grade.midterm}%</TableCell>
                      <TableCell>{grade.finals}%</TableCell>
                      <TableCell>{grade.assignments}%</TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">{average}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getGradeColor(average)}>
                          {getLetterGrade(average)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary-600">{grade.gpa.toFixed(1)}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Performance Chart Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader
            title="Grade Distribution"
            subtitle="Visual representation of your performance across courses"
          />
          <CardBody>
            <div className="space-y-4">
              {mockGrades.map((grade) => {
                const average = Math.round(
                  (grade.midterm + grade.finals + grade.assignments) / 3
                );

                return (
                  <div key={grade.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{grade.courseName}</p>
                      <p className="text-sm font-semibold text-gray-700">{average}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          average >= 90
                            ? 'bg-green-500'
                            : average >= 80
                              ? 'bg-blue-500'
                              : average >= 70
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                        }`}
                        style={{ width: `${average}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
