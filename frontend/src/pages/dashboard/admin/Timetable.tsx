import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

type Period = {
  id: number;
  period: number;
  subject: string;
  teacher: string;
  time: string;
};

type DayTimetable = {
  [day: string]: Period[];
};

type SchoolTimetable = {
  [className: string]: DayTimetable;
};

/* ---------------- CONSTANTS ---------------- */

const CLASSES = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/* ---------------- COMPONENT ---------------- */

export function AdminTimetable() {
  const [selectedClass, setSelectedClass] = useState<string>("JSS1");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [timetables, setTimetables] = useState<SchoolTimetable>({});
  const [form, setForm] = useState({
    subject: "",
    teacher: "",
    time: ""
  });

  /* ---------- LOAD FROM LOCAL STORAGE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("school_timetables");
    if (saved) {
      setTimetables(JSON.parse(saved));
    }
  }, []);

  /* ---------- SAVE TO LOCAL STORAGE ---------- */
  useEffect(() => {
    localStorage.setItem("school_timetables", JSON.stringify(timetables));
  }, [timetables]);

  /* ---------- ADD PERIOD ---------- */
  const addPeriod = (): void => {
    if (!form.subject || !form.teacher || !form.time) return;

    setTimetables(prev => {
      const classData = prev[selectedClass] || {};
      const dayData = classData[selectedDay] || [];

      const newPeriod: Period = {
        id: Date.now(),
        period: dayData.length + 1,
        subject: form.subject,
        teacher: form.teacher,
        time: form.time
      };

      return {
        ...prev,
        [selectedClass]: {
          ...classData,
          [selectedDay]: [...dayData, newPeriod]
        }
      };
    });

    setForm({ subject: "", teacher: "", time: "" });
  };

  /* ---------- DELETE PERIOD ---------- */
  const deletePeriod = (id: number): void => {
    setTimetables(prev => {
      const updatedDay =
        prev[selectedClass]?.[selectedDay]
          ?.filter(p => p.id !== id)
          .map((p, index) => ({ ...p, period: index + 1 })) || [];

      return {
        ...prev,
        [selectedClass]: {
          ...prev[selectedClass],
          [selectedDay]: updatedDay
        }
      };
    });
  };

  const currentPeriods: Period[] =
    timetables[selectedClass]?.[selectedDay] || [];

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Admin – Manage Class Timetable
      </h1>

      {/* SELECTORS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <select
          className="border p-3 rounded"
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
        >
          {CLASSES.map(cls => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded"
          value={selectedDay}
          onChange={e => setSelectedDay(e.target.value)}
        >
          {DAYS.map(day => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {/* ADD PERIOD */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Subject"
          value={form.subject}
          onChange={e =>
            setForm({ ...form, subject: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Teacher"
          value={form.teacher}
          onChange={e =>
            setForm({ ...form, teacher: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Time (8:00 - 8:40)"
          value={form.time}
          onChange={e =>
            setForm({ ...form, time: e.target.value })
          }
        />

        <button
          onClick={addPeriod}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Add Period
        </button>
      </div>

      {/* TIMETABLE TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 font-semibold">
          {selectedClass} — {selectedDay}
        </div>

        {currentPeriods.length === 0 ? (
          <p className="p-4 text-gray-500">
            No timetable set for this day.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {currentPeriods.map(period => (
                <tr key={period.id} className="border-b">
                  <td className="p-3">{period.period}</td>
                  <td className="p-3">{period.subject}</td>
                  <td className="p-3">{period.teacher}</td>
                  <td className="p-3">{period.time}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deletePeriod(period.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
