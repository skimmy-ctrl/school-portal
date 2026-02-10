import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import type { Course } from '../../../types';
import { motion } from 'framer-motion';

const mockCourses: Course[] = [
  {
    id: 'C001',
    name: 'Advanced Mathematics',
    code: 'MTH-301',
    instructor: 'Dr. Robert Johnson',
    credits: 4,
    description: 'Comprehensive coverage of calculus, linear algebra, and differential equations.',
  },
  {
    id: 'C002',
    name: 'Physics: Mechanics',
    code: 'PHY-201',
    instructor: 'Prof. Sarah Smith',
    credits: 4,
    description: 'Classical mechanics, waves, and oscillations.',
  },
  {
    id: 'C003',
    name: 'English Literature',
    code: 'ENG-250',
    instructor: 'Dr. Emily Davis',
    credits: 3,
    description: 'Analysis of classic and contemporary literary works.',
  },
  {
    id: 'C004',
    name: 'Chemistry: Organic',
    code: 'CHM-301',
    instructor: 'Prof. Michael Wilson',
    credits: 4,
    description: 'Structure, properties, and reactions of organic compounds.',
  },
  {
    id: 'C005',
    name: 'Biology: Cell Science',
    code: 'BIO-201',
    instructor: 'Dr. Jennifer Lee',
    credits: 3,
    description: 'Cell structure, function, and molecular biology.',
  },
  {
    id: 'C006',
    name: 'Computer Science: Algorithms',
    code: 'CS-301',
    instructor: 'Prof. David Martinez',
    credits: 4,
    description: 'Algorithm design, analysis, and implementation in Python and Java.',
  },
];

export function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Current semester courses and enrollment information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-blue-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">6</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-green-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Total Credits</p>
              <p className="text-3xl font-bold text-green-600 mt-1">22</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-purple-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Avg. Performance</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">A-</p>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Courses Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader title="Course List" />
          <CardBody>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Course Name</TableCell>
                  <TableCell header>Code</TableCell>
                  <TableCell header>Instructor</TableCell>
                  <TableCell header>Credits</TableCell>
                  <TableCell header>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{course.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{course.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      <Badge variant="success">Enrolled</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <Card hover>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Code:</span> {course.code}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Instructor:</span> {course.instructor}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Credits:</span> {course.credits}
                  </p>
                  <p className="text-sm text-gray-600 mt-3">{course.description}</p>
                </div>
                <button className="mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium text-sm">
                  View Course Details
                </button>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
