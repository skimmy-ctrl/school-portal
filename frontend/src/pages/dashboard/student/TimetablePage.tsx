import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { motion } from 'framer-motion';

interface ClassSession {
  day: string;
  time: string;
  course: string;
  instructor: string;
  location: string;
}

const timetable: Record<string, ClassSession[]> = {
  Monday: [
    { day: 'Monday', time: '09:00 - 10:30', course: 'Advanced Mathematics', instructor: 'Dr. Robert Johnson', location: 'Room 101' },
    { day: 'Monday', time: '10:45 - 12:15', course: 'Physics: Mechanics', instructor: 'Prof. Sarah Smith', location: 'Lab 02' },
    { day: 'Monday', time: '13:00 - 14:30', course: 'Computer Science: Algorithms', instructor: 'Prof. David Martinez', location: 'Room 205' },
  ],
  Tuesday: [
    { day: 'Tuesday', time: '09:00 - 10:30', course: 'English Literature', instructor: 'Dr. Emily Davis', location: 'Room 103' },
    { day: 'Tuesday', time: '10:45 - 12:15', course: 'Chemistry: Organic', instructor: 'Prof. Michael Wilson', location: 'Lab 03' },
    { day: 'Tuesday', time: '14:45 - 16:15', course: 'Biology: Cell Science', instructor: 'Dr. Jennifer Lee', location: 'Room 202' },
  ],
  Wednesday: [
    { day: 'Wednesday', time: '09:00 - 10:30', course: 'Advanced Mathematics', instructor: 'Dr. Robert Johnson', location: 'Room 101' },
    { day: 'Wednesday', time: '10:45 - 12:15', course: 'English Literature', instructor: 'Dr. Emily Davis', location: 'Room 103' },
    { day: 'Wednesday', time: '13:00 - 14:30', course: 'Physics: Mechanics', instructor: 'Prof. Sarah Smith', location: 'Room 104' },
  ],
  Thursday: [
    { day: 'Thursday', time: '09:00 - 10:30', course: 'Biology: Cell Science', instructor: 'Dr. Jennifer Lee', location: 'Lab 01' },
    { day: 'Thursday', time: '10:45 - 12:15', course: 'Chemistry: Organic', instructor: 'Prof. Michael Wilson', location: 'Lab 03' },
    { day: 'Thursday', time: '13:00 - 14:30', course: 'Computer Science: Algorithms', instructor: 'Prof. David Martinez', location: 'Room 205' },
  ],
  Friday: [
    { day: 'Friday', time: '09:00 - 10:30', course: 'Advanced Mathematics', instructor: 'Dr. Robert Johnson', location: 'Room 101' },
    { day: 'Friday', time: '10:45 - 12:15', course: 'Biology: Cell Science', instructor: 'Dr. Jennifer Lee', location: 'Room 202' },
  ],
};

export function TimetablePage() {
  const days = Object.keys(timetable);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Timetable</h1>
        <p className="text-gray-600 mt-2">Weekly class schedule for this semester</p>
      </div>

      {/* Timetable Grid */}
      <div className="space-y-4">
        {days.map((day, dayIndex) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
          >
            <Card>
              <CardHeader title={day} />
              <CardBody>
                <div className="space-y-3">
                  {timetable[day].map((session, index) => (
                    <div
                      key={`${day}-${index}`}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-20 text-center">
                        <p className="text-sm font-semibold text-primary-600">{session.time}</p>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{session.course}</h4>
                        <p className="text-sm text-gray-600 mt-1">Instructor: {session.instructor}</p>
                        <p className="text-sm text-gray-600">Location: {session.location}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <button className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full hover:bg-primary-200 transition-colors font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Calendar View Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader
            title="Key Dates"
            subtitle="Important academic dates and holidays"
          />
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-semibold text-gray-900">Mid-Semester Exam</p>
                  <p className="text-sm text-gray-600">February 15-22, 2024</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-gray-900">Spring Break</p>
                  <p className="text-sm text-gray-600">March 1-7, 2024 (No classes)</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-semibold text-gray-900">Final Exam</p>
                  <p className="text-sm text-gray-600">April 25 - May 5, 2024</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
