import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Badge from '../../../components/common/Badge';
import { motion } from 'framer-motion';

interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  class: string;
  submittedDate: string;
  submittedTime: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  grade?: number;
  maxPoints: number;
  feedback?: string;
  fileSize: string;
  downloadUrl: string;
}

const mockSubmissions: Submission[] = [
  {
    id: 'sub1',
    assignmentId: 'a1',
    assignmentTitle: 'Chapter 5 Problem Set',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.johnson@school.com',
    studentId: 'STU-001',
    class: 'MATH101 - Section A',
    submittedDate: '2024-01-31',
    submittedTime: '14:32',
    status: 'graded',
    grade: 48,
    maxPoints: 50,
    feedback: 'Great work! Check problem 12 - small calculation error.',
    fileSize: '2.3 MB',
    downloadUrl: '#',
  },
  {
    id: 'sub2',
    assignmentId: 'a1',
    assignmentTitle: 'Chapter 5 Problem Set',
    studentName: 'Sarah Williams',
    studentEmail: 'sarah.williams@school.com',
    studentId: 'STU-002',
    class: 'MATH101 - Section A',
    submittedDate: '2024-02-01',
    submittedTime: '09:15',
    status: 'submitted',
    maxPoints: 50,
    fileSize: '2.1 MB',
    downloadUrl: '#',
  },
  {
    id: 'sub3',
    assignmentId: 'a1',
    assignmentTitle: 'Chapter 5 Problem Set',
    studentName: 'Michael Brown',
    studentEmail: 'michael.brown@school.com',
    studentId: 'STU-003',
    class: 'MATH101 - Section A',
    submittedDate: '2024-02-02',
    submittedTime: '23:58',
    status: 'late',
    maxPoints: 50,
    fileSize: '1.9 MB',
    downloadUrl: '#',
  },
  {
    id: 'sub4',
    assignmentId: 'a1',
    assignmentTitle: 'Chapter 5 Problem Set',
    studentName: 'Emma Davis',
    studentEmail: 'emma.davis@school.com',
    studentId: 'STU-004',
    class: 'MATH101 - Section A',
    submittedDate: '2024-01-30',
    submittedTime: '11:22',
    status: 'graded',
    grade: 50,
    maxPoints: 50,
    feedback: 'Perfect! Excellent solution methodology.',
    fileSize: '2.4 MB',
    downloadUrl: '#',
  },
  {
    id: 'sub5',
    assignmentId: 'a2',
    assignmentTitle: 'Calculus Integration Worksheet',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.johnson@school.com',
    studentId: 'STU-001',
    class: 'CALC301 - Section D',
    submittedDate: '2024-02-04',
    submittedTime: '16:45',
    status: 'submitted',
    maxPoints: 40,
    fileSize: '1.8 MB',
    downloadUrl: '#',
  },
];

export function TeacherSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [filterAssignment, setFilterAssignment] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'graded' | 'late' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [feedbackValue, setFeedbackValue] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const assignmentOptions = [
    'all',
    ...new Set(submissions.map((s) => `${s.assignmentId}-${s.assignmentTitle}`)),
  ];

  const filtered = submissions.filter((sub) => {
    const matchesAssignment =
      filterAssignment === 'all' || `${sub.assignmentId}-${sub.assignmentTitle}` === filterAssignment;
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAssignment && matchesStatus && matchesSearch;
  });

  const stats = {
    total: submissions.length,
    graded: submissions.filter((s) => s.status === 'graded').length,
    pending: submissions.filter((s) => s.status === 'submitted' || s.status === 'pending').length,
    late: submissions.filter((s) => s.status === 'late').length,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'graded':
        return 'success';
      case 'submitted':
        return 'info';
      case 'late':
        return 'warning';
      case 'pending':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleGradeSubmission = () => {
    if (!selectedSubmission || !gradeValue) return;

    setSubmissions(
      submissions.map((s) =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              grade: parseFloat(gradeValue),
              feedback: feedbackValue,
              status: 'graded',
            }
          : s
      )
    );

    setSelectedSubmission(null);
    setGradeValue('');
    setFeedbackValue('');
  };

  const downloadTemplate = () => {
    const headers = ['studentId', 'studentEmail', 'assignmentId', 'assignmentTitle', 'grade', 'feedback'];
    const sample = [
      ['STU-001', 'alex.johnson@school.com', 'a1', 'Chapter 5 Problem Set', '48', 'Well done'],
      ['STU-002', 'sarah.williams@school.com', 'a1', 'Chapter 5 Problem Set', '42', 'Check Q3'],
    ];
    const csv = [headers.join(','), ...sample.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (file?: File | null) => {
    if (!file) return;
    setIsUploading(true);
    setUploadErrors([]);

    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setUploadErrors(['Empty file']);
      setIsUploading(false);
      return;
    }

    const header = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => line.split(',').map((c) => c.trim()));

    const updates: Partial<Submission & { studentId?: string }>[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const obj: Record<string, string> = {};
      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = row[j] ?? '';
      }

      const studentId = (obj['studentId'] || obj['studentID'] || obj['student id'] || '').trim();
      const studentEmail = (obj['studentEmail'] || obj['studentemail'] || '').trim();
      const assignmentId = (obj['assignmentId'] || obj['assignmentID'] || '').trim();
      const assignmentTitle = (obj['assignmentTitle'] || obj['assignmenttitle'] || '').trim();
      const gradeStr = (obj['grade'] || '').trim();
      const feedback = (obj['feedback'] || '').trim();

      if (!studentId && !studentEmail) {
        errors.push(`Row ${i + 2}: missing studentId or studentEmail`);
        continue;
      }
      if (!assignmentId && !assignmentTitle) {
        errors.push(`Row ${i + 2}: missing assignmentId or assignmentTitle`);
        continue;
      }

      const grade = gradeStr === '' ? undefined : parseFloat(gradeStr);

      updates.push({ studentId, studentEmail, assignmentId, assignmentTitle, grade, feedback });
    }

    // Apply updates to state
    setSubmissions((prev) => {
      const next = [...prev];
      updates.forEach((u) => {
        // try to find existing by studentId/email + assignmentId/title
        const foundIndex = next.findIndex(
          (s) =>
            (u.studentId && s.studentId === u.studentId) || (u.studentEmail && s.studentEmail === u.studentEmail)
        );

        if (foundIndex >= 0) {
          const s = next[foundIndex];
          next[foundIndex] = {
            ...s,
            grade: u.grade === undefined ? s.grade : u.grade,
            feedback: u.feedback === undefined ? s.feedback : u.feedback,
            status: u.grade !== undefined ? 'graded' : s.status,
          };
        } else {
          // create new record if assignment info present
          const newSub: Submission = {
            id: `import-${Math.random().toString(36).slice(2, 9)}`,
            assignmentId: u.assignmentId || 'imported',
            assignmentTitle: u.assignmentTitle || 'Imported Assignment',
            studentName: u.studentEmail || u.studentId || 'Unknown Student',
            studentEmail: u.studentEmail || '',
            studentId: u.studentId || 'UNKNOWN',
            class: 'Imported Class',
            submittedDate: new Date().toISOString().split('T')[0],
            submittedTime: new Date().toTimeString().split(' ')[0].slice(0,5),
            status: u.grade !== undefined ? 'graded' : 'submitted',
            grade: u.grade as any,
            maxPoints: 100,
            feedback: u.feedback,
            fileSize: '-',
            downloadUrl: '#',
          };
          next.push(newSub);
        }
      });
      return next;
    });

    setUploadErrors(errors);
    setIsUploading(false);
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Student Submissions</h1>
        <p className="text-gray-600 mt-2">Review, grade, and provide feedback on student work</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', value: stats.total, icon: '📥', color: 'bg-blue-50' },
          { label: 'Graded', value: stats.graded, icon: '✅', color: 'bg-green-50' },
          { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'bg-orange-50' },
          { label: 'Late', value: stats.late, icon: '⚠️', color: 'bg-red-50' },
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader title={`Submissions (${filtered.length})`} />
            <CardBody>
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, email, or ID..."
                  />
                  <select
                    value={filterAssignment}
                    onChange={(e) => setFilterAssignment(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Assignments</option>
                    {assignmentOptions.map(
                      (opt) =>
                        opt !== 'all' && (
                          <option key={opt} value={opt}>
                            {opt.split('-')[1].trim()}
                          </option>
                        )
                    )}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="graded">Graded</option>
                    <option value="submitted">Submitted</option>
                    <option value="late">Late</option>
                    <option value="pending">Pending</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setShowUploadModal(true)}>
                      ⤴️ Upload Results
                    </Button>
                    <Button size="sm" variant="secondary" onClick={downloadTemplate}>
                      ⤓ Template
                    </Button>
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No submissions match your filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((submission) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{submission.studentName}</h4>
                          <p className="text-sm text-gray-600 truncate">{submission.assignmentTitle}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {submission.studentId} • {submission.class}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {submission.submittedDate} at {submission.submittedTime}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge variant={getStatusBadgeVariant(submission.status) as any}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>
                          {submission.grade !== undefined && (
                            <div className="text-right">
                              <p className="text-xs text-gray-600">Grade</p>
                              <p className="font-semibold text-lg text-primary-600">
                                {submission.grade}/{submission.maxPoints}
                              </p>
                            </div>
                          )}
                          <Button size="sm" variant="secondary" onClick={() => setSelectedSubmission(submission)}>
                            {submission.status === 'graded' ? 'View' : 'Grade'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Detail Panel */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {selectedSubmission ? (
            <div className="space-y-4">
              <Card>
                <CardHeader title="Submission Details" />
                <CardBody>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Student</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.studentName}</p>
                      <p className="text-xs text-gray-500">{selectedSubmission.studentEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assignment</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.assignmentTitle}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Class</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.class}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Submitted</p>
                      <p className="font-semibold text-gray-900">
                        {selectedSubmission.submittedDate} {selectedSubmission.submittedTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">File Size</p>
                      <p className="font-semibold text-gray-900">{selectedSubmission.fileSize}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <Button fullWidth size="sm" variant="secondary" className="mb-2">
                        📥 Download
                      </Button>
                      <Button fullWidth size="sm" variant="secondary">
                        👁️ Preview
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Grading Form */}
              <Card>
                <CardHeader title={selectedSubmission.status === 'graded' ? 'Grade' : 'Add Grade'} />
                <CardBody>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Score (out of {selectedSubmission.maxPoints})</label>
                      <Input
                        type="number"
                        min="0"
                        max={selectedSubmission.maxPoints}
                        value={
                          selectedSubmission.status === 'graded'
                            ? selectedSubmission.grade?.toString() || ''
                            : gradeValue
                        }
                        onChange={(e) => setGradeValue(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Feedback</label>
                      <textarea
                        value={
                          selectedSubmission.status === 'graded'
                            ? selectedSubmission.feedback || ''
                            : feedbackValue
                        }
                        onChange={(e) => setFeedbackValue(e.target.value)}
                        placeholder="Provide constructive feedback..."
                        className="w-full p-3 border rounded-lg h-24 resize-none"
                      />
                    </div>
                    {selectedSubmission.status !== 'graded' && (
                      <Button fullWidth onClick={handleGradeSubmission}>
                        Submit Grade
                      </Button>
                    )}
                    <Button
                      fullWidth
                      variant="secondary"
                      onClick={() => {
                        setSelectedSubmission(null);
                        setGradeValue('');
                        setFeedbackValue('');
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-gray-500 py-12">Select a submission to view details and grade</p>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </div>
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-white rounded-lg w-11/12 max-w-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Upload Results (CSV)</h3>
            <p className="text-sm text-gray-600 mt-1">CSV columns: studentId,studentEmail,assignmentId,assignmentTitle,grade,feedback</p>
            <div className="mt-4 space-y-3">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                className="w-full"
                disabled={isUploading}
              />
              {isUploading && <p className="text-sm text-gray-600">Processing file...</p>}
              {uploadErrors.length > 0 && (
                <div className="text-sm text-red-600">
                  {uploadErrors.map((err, i) => (
                    <div key={i}>{err}</div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Button onClick={() => setShowUploadModal(false)} variant="secondary" disabled={isUploading}>Cancel</Button>
                <Button onClick={() => downloadTemplate()} size="sm" variant="secondary" disabled={isUploading}>Download Template</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
