import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { appState } from '../../data/appState';
import { Exam, ClassInfo, ExamSchedule } from '../../types';
import { generatePdfWithBranding } from '../../utils/pdfUtils';

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);

const ExamScheduleTab: React.FC = () => {
    const { exams, classes, examSchedules } = appState;
    
    const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id.toString() || '');
    const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id.toString() || '');

    const filteredSchedules = useMemo(() => {
        if (!selectedExamId || !selectedClassId) return [];
        return examSchedules.filter(s => 
            s.examId === parseInt(selectedExamId) &&
            s.classId === parseInt(selectedClassId)
        ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [examSchedules, selectedExamId, selectedClassId]);

    const handlePrint = () => {
        if (filteredSchedules.length === 0) return;

        const examName = exams.find(e => e.id === parseInt(selectedExamId))?.name || '';
        const className = classes.find(c => c.id === parseInt(selectedClassId))?.name || '';

        generatePdfWithBranding(
            appState.schoolProfile,
            `Exam Schedule: ${examName} - ${className}`,
            {
                head: [['Subject', 'Date', 'Time', 'Max Marks']],
                body: filteredSchedules.map(schedule => [
                    schedule.subject,
                    new Date(schedule.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                    `${schedule.startTime} - ${schedule.endTime}`,
                    schedule.maxMarks
                ]),
            },
            `Exam_Schedule_${examName.replace(/\s/g, '_')}_${className.replace(/\s/g, '_')}.pdf`
        );
    };

    return (
        <Card>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold">View Exam Schedule</h2>
                <div className="flex items-center flex-wrap space-x-2 md:space-x-4">
                    <select
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        className="input-field"
                    >
                        <option value="" disabled>Select an Exam</option>
                        {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="input-field"
                    >
                        <option value="" disabled>Select a Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                     <button className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2" disabled={filteredSchedules.length === 0} onClick={handlePrint}>
                        <PrintIcon className="w-4 h-4"/> <span>Print Schedule</span>
                    </button>
                     <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700">
                        Add Schedule
                    </button>
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Subject</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Time</th>
                            <th scope="col" className="px-6 py-3">Max Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchedules.map((schedule) => (
                            <tr key={schedule.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{schedule.subject}</td>
                                <td className="px-6 py-4">{new Date(schedule.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="px-6 py-4">{schedule.startTime} - {schedule.endTime}</td>
                                <td className="px-6 py-4">{schedule.maxMarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSchedules.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">No schedule found for the selected criteria.</p>}
            </div>
        </Card>
    );
};

export default ExamScheduleTab;
