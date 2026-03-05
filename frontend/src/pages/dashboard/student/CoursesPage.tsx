import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import {
  computeGrade,
  computeTotal,
  fetchMySubjectScores,
  type ScoreEntry,
} from '../../../services/gradebookService';
import {
  fetchMySubjectEnrollment,
  getFallbackSubjectEnrollment,
  saveMySubjectEnrollment,
  type SubjectClassLevel,
  type SubjectOption,
} from '../../../services/subjectEnrollmentService';

export function CoursesPage() {
  const [classLevel, setClassLevel] = useState<SubjectClassLevel>('junior');
  const [className, setClassName] = useState<'JSS1' | 'JSS2' | 'JSS3' | 'SSS1' | 'SSS2' | 'SSS3'>('JSS1');
  const [availableSubjects, setAvailableSubjects] = useState<SubjectOption[]>([]);
  const [enrolledSubjectCodes, setEnrolledSubjectCodes] = useState<string[]>([]);
  const [maxSubjects, setMaxSubjects] = useState(11);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
  const [myScores, setMyScores] = useState<Record<string, ScoreEntry>>({});

  const loadEnrollment = useCallback(async () => {
    setIsLoading(true);

    try {
      const enrollment = await fetchMySubjectEnrollment();
      setClassLevel(enrollment.classLevel);
      setClassName(enrollment.className);
      setAvailableSubjects(enrollment.availableSubjects);
      setEnrolledSubjectCodes(enrollment.subjectCodes);
      setMaxSubjects(enrollment.maxSubjects);
      setLimitMessage('');
    } catch {
      const fallback = getFallbackSubjectEnrollment('junior');
      setClassLevel(fallback.classLevel);
      setClassName(fallback.className);
      setAvailableSubjects(fallback.availableSubjects);
      setEnrolledSubjectCodes(fallback.subjectCodes);
      setMaxSubjects(fallback.maxSubjects);
      setLimitMessage('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEnrollment();
  }, [loadEnrollment]);

  useEffect(() => {
    const loadScores = async () => {
      const scores = await fetchMySubjectScores();
      setMyScores(scores);
    };

    void loadScores();
  }, []);

  const persistEnrollment = async (nextSubjectCodes: string[]) => {
    setIsSaving(true);

    try {
      const enrollment = await saveMySubjectEnrollment({
        classLevel,
        subjectCodes: nextSubjectCodes,
      });

      setClassName(enrollment.className);
      setAvailableSubjects(enrollment.availableSubjects);
      setEnrolledSubjectCodes(enrollment.subjectCodes);
      setMaxSubjects(enrollment.maxSubjects);
    } catch {
      const fallback = getFallbackSubjectEnrollment(classLevel);
      setAvailableSubjects(fallback.availableSubjects);
      setEnrolledSubjectCodes(nextSubjectCodes);
      setMaxSubjects(fallback.maxSubjects);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEnrollment = async (subjectCode: string) => {
    if (isSaving || isLoading) {
      return;
    }

    const isEnrolled = enrolledSubjectCodes.includes(subjectCode);

    if (isEnrolled) {
      setLimitMessage('');
      const nextCodes = enrolledSubjectCodes.filter((code) => code !== subjectCode);
      await persistEnrollment(nextCodes);
      return;
    }

    if (enrolledSubjectCodes.length >= maxSubjects) {
      setLimitMessage(`You can enroll in a maximum of ${maxSubjects} subjects.`);
      return;
    }

    setLimitMessage('');
    const nextCodes = [...enrolledSubjectCodes, subjectCode];
    await persistEnrollment(nextCodes);
  };

  const selectedSubjects = useMemo(
    () => availableSubjects.filter((subject) => enrolledSubjectCodes.includes(subject.code)),
    [availableSubjects, enrolledSubjectCodes]
  );
  const remainingSlots = Math.max(maxSubjects - enrolledSubjectCodes.length, 0);
  const getGradeVariant = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'info';
    if (grade.startsWith('C')) return 'warning';
    return 'danger';
  };

  const resultRows = useMemo(
    () =>
      selectedSubjects.map((subject) => {
        const score = myScores[subject.code] ?? null;
        const total = computeTotal(score);
        const grade = computeGrade(total);
        return {
          subject,
          score,
          total,
          grade,
        };
      }),
    [selectedSubjects, myScores]
  );

  const handleAddSubject = async () => {
    if (!selectedSubjectCode || isSaving || isLoading) {
      return;
    }

    if (enrolledSubjectCodes.includes(selectedSubjectCode)) {
      setLimitMessage('This subject is already enrolled.');
      return;
    }

    if (enrolledSubjectCodes.length >= maxSubjects) {
      setLimitMessage(`You can enroll in a maximum of ${maxSubjects} subjects.`);
      return;
    }

    const nextCodes = [...enrolledSubjectCodes, selectedSubjectCode];
    setLimitMessage('');
    await persistEnrollment(nextCodes);
    setSelectedSubjectCode('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subject Enrollment</h1>
        <p className="text-gray-600 mt-2">Enroll in your offered subjects. Maximum allowed is {maxSubjects}.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
          Class: {className}
        </span>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
          Level: {classLevel === 'junior' ? 'Junior' : 'Senior'}
        </span>
        {isSaving && <span className="text-gray-500">Saving...</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-blue-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Enrolled Subjects</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{enrolledSubjectCodes.length}</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-green-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Maximum Allowed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{maxSubjects}</p>
            </CardBody>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-purple-50">
            <CardBody>
              <p className="text-gray-600 text-sm">Slots Remaining</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{remainingSlots}</p>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {limitMessage && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          {limitMessage}
        </div>
      )}

      <Card>
        <CardHeader title="Add Subject" subtitle="Select a subject and add it to your enrollment" />
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedSubjectCode}
              onChange={(event) => setSelectedSubjectCode(event.target.value)}
              disabled={isLoading || isSaving || availableSubjects.length === 0}
              className="w-full sm:max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="">Select subject</option>
              {availableSubjects.map((subject) => (
                <option key={subject.code} value={subject.code}>
                  {subject.name} ({subject.code}){enrolledSubjectCodes.includes(subject.code) ? ' - Enrolled' : ''}
                </option>
              ))}
            </select>
            <button
              onClick={() => void handleAddSubject()}
              disabled={
                !selectedSubjectCode ||
                isLoading ||
                isSaving ||
                enrolledSubjectCodes.length >= maxSubjects
              }
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Subject
            </button>
          </div>
        </CardBody>
      </Card>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader
            title={`${classLevel === 'junior' ? 'Junior' : 'Senior'} Subject List`}
            subtitle={`Choose up to ${maxSubjects} subjects`}
          />
          <CardBody>
            {isLoading ? (
              <p className="text-sm text-gray-600">Loading subjects...</p>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell header>Subject Name</TableCell>
                    <TableCell header>Code</TableCell>
                    <TableCell header>Status</TableCell>
                    <TableCell header>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableSubjects.map((subject) => {
                    const isEnrolled = enrolledSubjectCodes.includes(subject.code);
                    const disableEnroll = !isEnrolled && enrolledSubjectCodes.length >= maxSubjects;

                    return (
                      <TableRow key={subject.code}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.code}</TableCell>
                        <TableCell>
                          {isEnrolled ? <Badge variant="success">Enrolled</Badge> : <Badge variant="default">Not Enrolled</Badge>}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => void handleToggleEnrollment(subject.code)}
                            disabled={disableEnroll || isSaving}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isEnrolled
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                            } ${disableEnroll || isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isEnrolled ? 'Drop' : 'Enroll'}
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </motion.div>

      <Card>
        <CardHeader title="Selected Subjects" />
        <CardBody>
          {selectedSubjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((subject) => (
                <Badge key={subject.code} variant="info" className="px-3 py-1">
                  {subject.name} ({subject.code})
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">You have not enrolled in any subject yet.</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="My Results" subtitle="Test and exam scores for your enrolled subjects" />
        <CardBody>
          {resultRows.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Subject</TableCell>
                  <TableCell header>Test 1</TableCell>
                  <TableCell header>Test 2</TableCell>
                  <TableCell header>Exam</TableCell>
                  <TableCell header>Total</TableCell>
                  <TableCell header>Grade</TableCell>
                  <TableCell header>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultRows.map((row) => (
                  <TableRow key={row.subject.code}>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{row.subject.name}</div>
                      <div className="text-xs text-gray-500">{row.subject.code}</div>
                    </TableCell>
                    <TableCell>{row.score?.test1 ?? '—'}</TableCell>
                    <TableCell>{row.score?.test2 ?? '—'}</TableCell>
                    <TableCell>{row.score?.exam ?? '—'}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        {row.total == null ? '—' : row.total}
                      </span>
                    </TableCell>
                    <TableCell>
                      {row.grade ? (
                        <Badge variant={getGradeVariant(row.grade)}>{row.grade}</Badge>
                      ) : (
                        <span className="text-xs text-gray-500">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.total == null ? (
                        <Badge variant="default">Awaiting</Badge>
                      ) : (
                        <Badge variant="info">Recorded</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-600">Enroll in a subject to see your results here.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
