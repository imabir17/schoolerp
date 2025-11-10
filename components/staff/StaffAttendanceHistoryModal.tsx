
import React from 'react';
import { Staff, StaffAttendanceRecord, StaffAttendanceStatus } from '../../types';
import { generatePdfWithBranding } from '../../utils/pdfUtils';
import { appState } from '../../data/appState';

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);

const getStatusColor = (status: StaffAttendanceStatus) => {
    switch (status) {
        case StaffAttendanceStatus.Present: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case StaffAttendanceStatus.Absent: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case StaffAttendanceStatus.OnLeave: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

interface StaffAttendanceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  records: StaffAttendanceRecord[];
}

const StaffAttendanceHistoryModal: React.FC<StaffAttendanceHistoryModalProps> = ({ isOpen, onClose, staff, records }) => {
  if (!isOpen || !staff) return null;

  const staffRecords = records
    .filter(record => record.staffId === staff.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePrintHistory = () => {
    if (!staff) return;
    generatePdfWithBranding(
        appState.schoolProfile,
        `Attendance History for ${staff.name}`,
        {
            head: [['Date', 'Status']],
            body: staffRecords.map(rec => [rec.date, rec.status])
        },
        `Staff_Attendance_${staff.name.replace(/\s/g, '_')}.pdf`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance History</h2>
                <p className="text-gray-600 dark:text-gray-400">{staff.name} ({staff.staffId})</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {staffRecords.length > 0 ? (
                    staffRecords.map((record) => (
                    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{record.date}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                                {record.status}
                            </span>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No attendance records found.</td>
                    </tr>
                )}
              </tbody>
            </table>
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t dark:border-gray-600 space-x-2">
             <button
                type="button"
                onClick={handlePrintHistory}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none"
              >
                <PrintIcon className="w-4 h-4" />
                <span>Print Report</span>
              </button>
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none">Close</button>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceHistoryModal;
