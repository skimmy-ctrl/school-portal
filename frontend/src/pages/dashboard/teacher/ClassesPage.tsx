import { useEffect, useState, useContext } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../../components/common/Table';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import { isClassTeacher } from '../../../services/teacherRoleService';
import { markAttendanceBatch, getAttendancePercent } from '../../../services/attendanceService';
import {
  clampScore,
  computeGrade,
  computeTotal,
  EXAM_SCORE_MAX,
  fetchSubjectGradebook,
  fetchTeacherAssignedSubjects,
  saveSubjectScore,
  TEST_SCORE_MAX,
  type GradebookStudent,
  type GradebookSubject,
  type ScoreEntry,
} from '../../../services/gradebookService';

interface ClassDetail {
  id: string;
  code: string;
  name: string;
  section: string;
  room: string;
  schedule: string;
  students: number;
  averageScore: number;
  totalAssignments: number;
  submissionRate: number;
}

const mockTeacherClasses: ClassDetail[] = [
  {
    id: 'class1',
    code: 'MATH101',
    name: 'Mathematics 101',
    section: 'A',
    room: 'B201',
    schedule: 'Mon/Wed 09:00 - 10:30',
    students: 32,
    averageScore: 85.4,
    totalAssignments: 12,
    submissionRate: 94,
  },
  {
    id: 'class2',
    code: 'MATH101',
    name: 'Mathematics 101',
    section: 'B',
    room: 'B202',
    schedule: 'Tue/Thu 11:00 - 12:30',
    students: 31,
    averageScore: 82.1,
    totalAssignments: 12,
    submissionRate: 90,
  },
  {
    id: 'class3',
    code: 'MATH102',
    name: 'Mathematics 102',
    section: 'C',
    room: 'C101',
    schedule: 'Mon/Wed 13:00 - 14:30',
    students: 32,
    averageScore: 88.3,
    totalAssignments: 10,
    submissionRate: 96,
  },
  {
    id: 'class4',
    code: 'CALC301',
    name: 'Calculus Advanced',
    section: 'D',
    room: 'D110',
    schedule: 'Fri 09:00 - 12:00',
    students: 28,
    averageScore: 81.7,
    totalAssignments: 8,
    submissionRate: 92,
  },
];

export function TeacherClassesPage() {
  const auth = useContext(AuthContext);
  const [selectedClass, setSelectedClass] = useState<ClassDetail | null>(mockTeacherClasses[0]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceSelection, setAttendanceSelection] = useState<Record<string, boolean>>({});
  const [assignedSubjects, setAssignedSubjects] = useState<GradebookSubject[]>([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [subjectRoster, setSubjectRoster] = useState<GradebookStudent[]>([]);
  const [subjectScores, setSubjectScores] = useState<Record<string, ScoreEntry>>({});
  const [submittingStudentId, setSubmittingStudentId] = useState<string | null>(null);
  const [submittedByStudent, setSubmittedByStudent] = useState<Record<string, boolean>>({});
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);
  const [isGradebookLoading, setIsGradebookLoading] = useState(false);
  const [gradebookError, setGradebookError] = useState('');

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'info';
    if (grade.startsWith('C')) return 'warning';
    return 'danger';
  };

  const stats = {
    totalClasses: mockTeacherClasses.length,
    totalStudents: mockTeacherClasses.reduce((sum, c) => sum + c.students, 0),
    averageSubmissionRate: Math.round(
      mockTeacherClasses.reduce((sum, c) => sum + c.submissionRate, 0) / mockTeacherClasses.length
    ),
    averageClassScore: (
      mockTeacherClasses.reduce((sum, c) => sum + c.averageScore, 0) / mockTeacherClasses.length
    ).toFixed(1),
  };

  useEffect(() => {
    let isMounted = true;
    const loadSubjects = async () => {
      setIsSubjectsLoading(true);
      setGradebookError('');
      try {
        const subjects = await fetchTeacherAssignedSubjects();
        if (!isMounted) return;
        setAssignedSubjects(subjects);
        if (!selectedSubjectCode && subjects.length > 0) {
          setSelectedSubjectCode(subjects[0].code);
        }
      } catch (error) {
        if (!isMounted) return;
        setAssignedSubjects([]);
        setSelectedSubjectCode('');
        setSubjectRoster([]);
        setSubjectScores({});
        setGradebookError(error instanceof Error ? error.message : 'Failed to load assigned subjects');
      } finally {
        if (isMounted) {
          setIsSubjectsLoading(false);
        }
      }
    };

    void loadSubjects();
    return () => {
      isMounted = false;
    };
  }, [auth?.user?.email, selectedSubjectCode]);

  useEffect(() => {
    let isMounted = true;

    const loadRoster = async () => {
      if (!selectedSubjectCode) {
        if (isMounted) {
          setSubjectRoster([]);
          setSubjectScores({});
        }
        return;
      }

      setIsGradebookLoading(true);
      setGradebookError('');
      try {
        const gradebook = await fetchSubjectGradebook(selectedSubjectCode);
        if (!isMounted) return;
        setSubjectRoster(gradebook.students);
        setSubjectScores(gradebook.scores);
        const submittedState = Object.entries(gradebook.scores).reduce<Record<string, boolean>>(
          (acc, [studentId, score]) => {
            acc[studentId] = Boolean(score.updatedAt);
            return acc;
          },
          {}
        );
        setSubmittedByStudent(submittedState);
      } catch (error) {
        if (!isMounted) return;
        setSubjectRoster([]);
        setSubjectScores({});
        setSubmittedByStudent({});
        setGradebookError(error instanceof Error ? error.message : 'Failed to load gradebook');
      } finally {
        if (isMounted) {
          setIsGradebookLoading(false);
        }
      }
    };

    void loadRoster();
    return () => {
      isMounted = false;
    };
  }, [selectedSubjectCode]);

  const handleScoreChange = (
    studentId: string,
    field: keyof Pick<ScoreEntry, 'test1' | 'test2' | 'exam'>,
    value: string
  ) => {
    if (!selectedSubjectCode) return;

    if (value === '') {
      setSubjectScores((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], [field]: undefined },
      }));
      return;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    const max = field === 'exam' ? EXAM_SCORE_MAX : TEST_SCORE_MAX;

    setSubjectScores((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: clampScore(parsed, max) },
    }));
    setSubmittedByStudent((prev) => ({ ...prev, [studentId]: false }));
  };

  const handleSaveScores = async (studentId: string) => {
    if (!selectedSubjectCode) return;
    const current = subjectScores[studentId] || {};
    setGradebookError('');
    setSubmittingStudentId(studentId);
    try {
      const saved = await saveSubjectScore(selectedSubjectCode, studentId, current);
      setSubjectScores((prev) => ({ ...prev, [studentId]: saved }));
      setSubmittedByStudent((prev) => ({ ...prev, [studentId]: true }));
    } catch (error) {
      setGradebookError(error instanceof Error ? error.message : 'Failed to save score');
    } finally {
      setSubmittingStudentId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-600 mt-2">Manage your teaching classes and view student progress</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Classes', value: stats.totalClasses, icon: '📚', color: 'bg-blue-50' },
          { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓', color: 'bg-green-50' },
          { label: 'Avg Submission Rate', value: `${stats.averageSubmissionRate}%`, icon: '📤', color: 'bg-orange-50' },
          { label: 'Avg Class Score', value: `${stats.averageClassScore}`, icon: '📊', color: 'bg-purple-50' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes List */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader title="Your Classes" />
            <CardBody>
              <div className="space-y-2">
                {mockTeacherClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedClass?.id === cls.id
                        ? 'bg-primary-100 border-2 border-primary-500'
                        : 'border border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{cls.code}</div>
                    <div className="text-sm text-gray-600">{cls.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Section {cls.section} • {cls.students} students</div>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Selected Class Details */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {selectedClass && (
            <>
              <Card>
                <CardHeader title={`${selectedClass.code} - ${selectedClass.name}`} />
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Section</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedClass.section}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Room</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedClass.room}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Schedule</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedClass.schedule}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Students Enrolled</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedClass.students}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Class Score</p>
                      <p className="text-lg font-semibold text-primary-600">{selectedClass.averageScore.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submission Rate</p>
                      <p className="text-lg font-semibold text-green-600">{selectedClass.submissionRate}%</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                        <Button size="sm">Create Assignment</Button>
                        <Button size="sm" variant="secondary">Export Grades</Button>
                        <Button size="sm" variant="secondary">View Submissions</Button>
                        {auth?.user && isClassTeacher(auth.user.email) && (
                          <Button size="sm" variant="primary" onClick={() => {
                            // initialize attendanceSelection with all students present=true by default
                            const map: Record<string, boolean> = {};
                            subjectRoster.forEach(s => (map[s.email] = true));
                            setAttendanceSelection(map);
                            setShowAttendanceModal(true);
                          }}>
                            Take Attendance
                          </Button>
                        )}
                  </div>
                </CardBody>
              </Card>

              {/* Students in Class */}
              <Card>
                <CardHeader
                  title={`Students Enrolled${selectedSubjectCode ? ` (${subjectRoster.length})` : ''}`}
                  subtitle={selectedSubjectCode ? `Subject ${selectedSubjectCode}` : 'Select a subject to load students'}
                />
                <CardBody>
                  <div className="space-y-3">
                    {isGradebookLoading ? (
                      <p className="text-sm text-gray-600">Loading students...</p>
                    ) : subjectRoster.length === 0 ? (
                      <p className="text-sm text-gray-600">No students found for this subject.</p>
                    ) : subjectRoster.map((student) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <p className="text-xs text-gray-500 mt-1">{student.enrollmentId}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs text-gray-600">Current Grade</p>
                              <Badge variant="default">Pending</Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600">Attendance</p>
                              <p className="font-medium text-gray-900">
                                {getAttendancePercent(student.email) ?? 0}%
                              </p>
                            </div>
                            <Button size="sm" variant="secondary">View</Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Subject Gradebook */}
              <Card>
                <CardHeader
                  title="Subject Gradebook"
                  subtitle="Update test and exam scores for enrolled students"
                />
                <CardBody>
                  {gradebookError ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {gradebookError}
                    </div>
                  ) : null}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Assigned Subjects</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {assignedSubjects.length > 0 ? (
                          assignedSubjects.map((subject) => (
                            <Badge key={subject.code} variant="info">
                              {subject.name} ({subject.code})
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="default">No assigned subjects</Badge>
                        )}
                      </div>
                    </div>
                    <div className="min-w-[220px]">
                      <label className="text-xs font-semibold text-gray-600 uppercase">Select Subject</label>
                      <select
                        value={selectedSubjectCode}
                        onChange={(event) => setSelectedSubjectCode(event.target.value)}
                        disabled={isSubjectsLoading || assignedSubjects.length === 0}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {assignedSubjects.map((subject) => (
                          <option key={subject.code} value={subject.code}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isGradebookLoading ? (
                    <p className="text-sm text-gray-600">Loading gradebook...</p>
                  ) : selectedSubjectCode ? (
                    <Table className="min-w-[760px]">
                      <TableHead>
                        <TableRow>
                          <TableCell header>Student</TableCell>
                          <TableCell header>Enrollment ID</TableCell>
                          <TableCell header>Test 1 / {TEST_SCORE_MAX}</TableCell>
                          <TableCell header>Test 2 / {TEST_SCORE_MAX}</TableCell>
                          <TableCell header>Exam / {EXAM_SCORE_MAX}</TableCell>
                          <TableCell header>Total</TableCell>
                          <TableCell header>Grade</TableCell>
                          <TableCell header>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subjectRoster.map((student) => {
                          const score = subjectScores[student.id] || {};
                          const total = computeTotal(score);
                          const grade = computeGrade(total);
                          return (
                            <TableRow key={`${selectedSubjectCode}-${student.id}`}>
                              <TableCell>
                                <div className="font-semibold text-gray-900">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </TableCell>
                              <TableCell>{student.enrollmentId}</TableCell>
                              <TableCell>
                                <input
                                  type="number"
                                  min={0}
                                  max={TEST_SCORE_MAX}
                                  value={score.test1 ?? ''}
                                  onChange={(event) =>
                                    handleScoreChange(student.id, 'test1', event.target.value)
                                  }
                                  className="w-24 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="number"
                                  min={0}
                                  max={TEST_SCORE_MAX}
                                  value={score.test2 ?? ''}
                                  onChange={(event) =>
                                    handleScoreChange(student.id, 'test2', event.target.value)
                                  }
                                  className="w-24 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="number"
                                  min={0}
                                  max={EXAM_SCORE_MAX}
                                  value={score.exam ?? ''}
                                  onChange={(event) =>
                                    handleScoreChange(student.id, 'exam', event.target.value)
                                  }
                                  className="w-24 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-gray-900">
                                  {total == null ? '—' : total}
                                </span>
                              </TableCell>
                              <TableCell>
                                {grade ? (
                                  <Badge variant={getGradeBadgeVariant(grade)}>{grade}</Badge>
                                ) : (
                                  <span className="text-xs text-gray-500">Pending</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <button
                                  onClick={() => void handleSaveScores(student.id)}
                                  disabled={submittingStudentId === student.id}
                                  className={`px-3 py-1.5 rounded-md text-sm font-semibold text-white ${
                                    submittedByStudent[student.id]
                                      ? 'bg-green-600 hover:bg-green-700'
                                      : 'bg-blue-600 hover:bg-blue-700'
                                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                                >
                                  {submittingStudentId === student.id
                                    ? 'Submitting...'
                                    : submittedByStudent[student.id]
                                      ? 'Submitted'
                                      : 'Submit'}
                                </button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-gray-600">No subjects assigned yet.</p>
                  )}
                </CardBody>
              </Card>
              {showAttendanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowAttendanceModal(false)} />
                  <div className="relative bg-white rounded-lg w-11/12 max-w-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold">Take Attendance - {selectedClass?.code}</h3>
                    <div className="mt-4 space-y-3">
                      {subjectRoster.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2 border-b">
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-sm text-gray-500">{s.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!attendanceSelection[s.email]}
                                onChange={(e) => setAttendanceSelection(prev => ({ ...prev, [s.email]: e.target.checked }))}
                              />
                              <span className="text-sm">Present</span>
                            </label>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="secondary" onClick={() => setShowAttendanceModal(false)}>Cancel</Button>
                        <Button onClick={() => {
                          const entries = Object.keys(attendanceSelection).map(email => ({ email, present: !!attendanceSelection[email] }));
                          markAttendanceBatch(entries);
                          setShowAttendanceModal(false);
                          // reload to show updated attendance
                          window.location.reload();
                        }}>Submit Attendance</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
