import React, { useState, useMemo, useEffect } from 'react';
import Card from '../ui/Card';
import { AttendanceRecord, AttendanceStatus, Student, ClassInfo } from '../../types';
import StudentAttendanceHistoryModal from './StudentAttendanceHistoryModal';
import ClassAttendanceHistoryModal from './ClassAttendanceHistoryModal';
import { generatePdfWithBranding } from '../../utils/pdfUtils';
import api from '../../services/api';
import { appState } from '../../data/appState';
import { toastService } from '../../utils/toastService';

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);


const AttendancePage: React.FC = () => {
    // Local component state
    const [isLoading, setIsLoading] = useState(true);
    const [allAttendanceRecords, setAllAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [allClasses, setAllClasses] = useState<ClassInfo[]>([]);
    
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyRecords, setDailyRecords] = useState<AttendanceRecord[]>([]);

    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [viewingHistoryForStudent, setViewingHistoryForStudent] = useState<Student | null>(null);
    const [viewingHistoryForClass, setViewingHistoryForClass] = useState<ClassInfo | null>(null);

    // Fetch initial data
    const fetchData = async () => {
        setIsLoading(true);
        const [attendanceData, studentsData, classesData] = await Promise.all([
            api.getData('attendance'),
            api.getData('students'),
            api.getData('classes')
        ]);
        setAllAttendanceRecords(attendanceData);
        setAllStudents(studentsData);
        setAllClasses(classesData);
        if (classesData.length > 0) {
            setSelectedClassId(classesData[0].id.toString());
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Effect to filter and set attendance records for the selected class and date
    useEffect(() => {
        if (!selectedClassId || isLoading) {
            setDailyRecords([]);
            return;
        }

        const classInfo = allClasses.find(c => c.id === parseInt(selectedClassId, 10));
        if (!classInfo) return;

        const className = classInfo.name.replace('Class ', '');
        const studentsInClass = allStudents.filter(s => s.class === className && classInfo.sections.includes(s.section));
        
        const recordsForDay = studentsInClass.map(student => {
            const existingRecord = allAttendanceRecords.find(r => r.studentId === student.id && r.date === selectedDate);
            if (existingRecord) {
                return existingRecord;
            }
            // Create a temporary, unsaved record for marking
            return {
                id: -(student.id), // Use a temporary negative ID to avoid key conflicts
                studentId: student.id,
                studentName: student.name,
                date: selectedDate,
                status: AttendanceStatus.Present, // Default to Present
                class: student.class,
                section: student.section,
            };
        });
        setDailyRecords(recordsForDay);
    }, [selectedClassId, selectedDate, allStudents, allClasses, allAttendanceRecords, isLoading]);

    const handleStatusChange = (recordId: number, studentId: number, newStatus: AttendanceStatus) => {
        setDailyRecords(prev =>
            prev.map(record => ((record.id === recordId) || (record.id < 0 && record.studentId === studentId)) ? { ...record, status: newStatus } : record)
        );
    };

    const handleSaveAttendance = async () => {
        const recordsToSave = dailyRecords.filter(r => r.id < 0); // Only save new records
        if (recordsToSave.length === 0) {
            toastService.show('No changes to save.');
            return;
        }

        const currentRecords = await api.getData('attendance');
        let nextId = Math.max(0, ...currentRecords.map((r: AttendanceRecord) => r.id)) + 1;
        const newRecords = recordsToSave.map(r => ({ ...r, id: nextId++ }));
        
        await api.setData('attendance', [...currentRecords, ...newRecords]);
        await fetchData(); // Refresh all data
        toastService.show('Attendance saved successfully!');
    };
    
    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.Present: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case AttendanceStatus.Absent: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case AttendanceStatus.Late: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    
    const historySearchResults = useMemo(() => {
        if (!historySearchTerm.trim()) {
            return [];
        }
        const lowercasedTerm = historySearchTerm.toLowerCase();
        return allStudents.filter(student =>
            student.name.toLowerCase().includes(lowercasedTerm) ||
            student.studentId.toLowerCase().includes(lowercasedTerm)
        ).slice(0, 5);
    }, [historySearchTerm, allStudents]);

    const handlePrintDailyReport = () => {
        if (!selectedClassId || dailyRecords.length === 0) return;
        const classInfo = allClasses.find(c => c.id === parseInt(selectedClassId));
        if (!classInfo) return;

        generatePdfWithBranding(
            appState.schoolProfile,
            `Daily Attendance: ${classInfo.name} (${new Date(selectedDate).toLocaleDateString()})`,
            {
                head: [['Student Name', 'Student ID', 'Section', 'Status']],
                body: dailyRecords.map(record => {
                    const student = allStudents.find(s => s.id === record.studentId);
                    return [
                        record.studentName,
                        student?.studentId || 'N/A',
                        record.section,
                        record.status
                    ];
                })
            },
            `Attendance_${classInfo.name.replace(/\s/g, '_')}_${selectedDate}.pdf`
        );
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Attendance</h1>
                <p className="text-gray-600 dark:text-gray-400">Mark daily attendance and view student history.</p>
            </div>

            <Card className="mb-8">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mark Daily Attendance</h2>
                    <div className="flex items-center flex-wrap space-x-2 md:space-x-4">
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="" disabled>Select a class</option>
                            {allClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <input 
                            type="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" 
                        />
                        <button
                            onClick={() => {
                                const classInfo = allClasses.find(c => c.id === parseInt(selectedClassId, 10));
                                if (classInfo) setViewingHistoryForClass(classInfo);
                            }}
                            disabled={!selectedClassId}
                            className="text-primary-600 dark:text-primary-400 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                            View Class History
                        </button>
                        <button
                            onClick={handlePrintDailyReport}
                            disabled={!selectedClassId || dailyRecords.length === 0}
                            className="flex items-center space-x-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PrintIcon className="w-4 h-4" /> 
                            <span>Print Report</span>
                        </button>
                        <button onClick={handleSaveAttendance} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                            Save Attendance
                        </button>
                    </div>
                </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Class</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyRecords.map((record) => (
                                <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {record.studentName}
                                    </td>
                                    <td className="px-6 py-4">{record.class} - {record.section}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {Object.values(AttendanceStatus).map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(record.id, record.studentId, status)}
                                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                        record.status === status
                                                            ? getStatusColor(status)
                                                            : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {dailyRecords.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">{isLoading ? 'Loading...' : 'Select a class to see students.'}</p>}
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Student Attendance History</h2>
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="Search student by name or ID..."
                        value={historySearchTerm}
                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                     {historySearchResults.length > 0 && (
                        <div className="absolute z-10 w-full md:w-1/2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                            <ul>
                                {historySearchResults.map(student => (
                                    <li key={student.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center border-b dark:border-gray-600 last:border-b-0">
                                        <div>
                                          <p className="font-medium text-gray-800 dark:text-gray-200">{student.name}</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">{student.studentId} - Class {student.class}{student.section}</p>
                                        </div>
                                        <button 
                                            onClick={() => { setViewingHistoryForStudent(student); setHistorySearchTerm(''); }}
                                            className="text-sm font-semibold text-primary-600 hover:underline"
                                        >
                                            View History
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Card>

            <ClassAttendanceHistoryModal
                isOpen={!!viewingHistoryForClass}
                onClose={() => setViewingHistoryForClass(null)}
                classInfo={viewingHistoryForClass}
                students={allStudents}
                records={allAttendanceRecords}
            />
            <StudentAttendanceHistoryModal
                isOpen={!!viewingHistoryForStudent}
                onClose={() => setViewingHistoryForStudent(null)}
                student={viewingHistoryForStudent}
                records={allAttendanceRecords}
            />
        </div>
    );
};

export default AttendancePage;
