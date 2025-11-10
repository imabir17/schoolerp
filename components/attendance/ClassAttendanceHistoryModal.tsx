import React, { useMemo } from 'react';
import { ClassInfo, Student, AttendanceRecord, AttendanceStatus } from '../../types';
import { generatePdfWithBranding } from '../../utils/pdfUtils';
import { appState } from '../../data/appState';

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);

interface ClassAttendanceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo | null;
  students: Student[];
  records: AttendanceRecord[];
}

const ClassAttendanceHistoryModal: React.FC<ClassAttendanceHistoryModalProps> = ({ isOpen, onClose, classInfo, students, records }) => {
  if (!isOpen || !classInfo) return null;

  const attendanceSummary = useMemo(() => {
    const studentsInClass = students.filter(s =>
        s.class === classInfo.name.replace('Class ', '') &&
        classInfo.sections.includes(s.section)
    );
    const studentIdsInClass = new Set(studentsInClass.map(s => s.id));

    const recordsForClass = records.filter(r => studentIdsInClass.has(r.studentId));

    // FIX: Explicitly type the accumulator in the reduce function to ensure
    // correct type inference for `summaryByDate`, which in turn correctly types
    // `stats` in the subsequent `map` operation.
    const summaryByDate = recordsForClass.reduce((acc: Record<string, { present: number; absent: number; late: number; }>, record) => {
        if (!acc[record.date]) {
            acc[record.date] = { present: 0, absent: 0, late: 0 };
        }
        if (record.status === AttendanceStatus.Present) acc[record.date].present++;
        else if (record.status === AttendanceStatus.Absent) acc[record.date].absent++;
        else if (record.status === AttendanceStatus.Late) acc[record.date].late++;
        return acc;
    }, {} as Record<string, { present: number; absent: number; late: number; }>);
    
    return Object.entries(summaryByDate).map(([date, stats]) => {
        const totalRecords = stats.present + stats.absent + stats.late;
        const presentPercentage = totalRecords > 0 
            ? (((stats.present + stats.late) / totalRecords) * 100).toFixed(1)
            : '0.0';
        return { date, ...stats, percentage: presentPercentage };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [classInfo, students, records]);

  const handlePrint = () => {
      if (!classInfo) return;
      generatePdfWithBranding(
          appState.schoolProfile,
          `Attendance Summary for ${classInfo.name}`,
          {
              head: [['Date', 'Present', 'Absent', 'Late', 'Attendance %']],
              body: attendanceSummary.map(s => [s.date, s.present, s.absent, s.late, `${s.percentage}%`]),
          },
          `Attendance_Summary_${classInfo.name.replace(/\s/g, '_')}.pdf`
      );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Class Attendance History</h2>
                <p className="text-gray-600 dark:text-gray-400">{classInfo.name} - Sections: {classInfo.sections.join(', ')}</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-center">Present</th>
                  <th scope="col" className="px-6 py-3 text-center">Absent</th>
                  <th scope="col" className="px-6 py-3 text-center">Late</th>
                  <th scope="col" className="px-6 py-3 text-center">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendanceSummary.length > 0 ? (
                    attendanceSummary.map((summary) => (
                    <tr key={summary.date} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{summary.date}</td>
                        <td className="px-6 py-4 text-center text-green-600 dark:text-green-400">{summary.present}</td>
                        <td className="px-6 py-4 text-center text-red-600 dark:text-red-400">{summary.absent}</td>
                        <td className="px-6 py-4 text-center text-yellow-600 dark:text-yellow-400">{summary.late}</td>
                        <td className="px-6 py-4 text-center font-medium">{summary.percentage}%</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No attendance records found for this class.</td>
                    </tr>
                )}
              </tbody>
            </table>
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t dark:border-gray-600 space-x-2">
            <button
                type="button"
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none"
            >
                <PrintIcon className="w-4 h-4" />
                <span>Print Summary</span>
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ClassAttendanceHistoryModal;