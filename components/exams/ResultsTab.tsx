import React, { useState, useMemo, useEffect } from 'react';
import Card from '../ui/Card';
import { appState } from '../../data/appState';
import { Exam, ClassInfo, ExamSchedule, Student, ExamResult } from '../../types';
import { generatePdfWithBranding } from '../../utils/pdfUtils';
import { toastService } from '../../utils/toastService';

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);

const ResultsTab: React.FC = () => {
    const { exams, classes, examSchedules, students } = appState;
    const [results, setResults] = useState<ExamResult[]>(appState.examResults);

    const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id.toString() || '');
    const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id.toString() || '');
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
    const [marks, setMarks] = useState<Record<number, string>>({}); // studentId -> marks

    const availableSchedules = useMemo(() => {
        if (!selectedExamId || !selectedClassId) return [];
        return examSchedules.filter(s => 
            s.examId === parseInt(selectedExamId) &&
            s.classId === parseInt(selectedClassId)
        );
    }, [examSchedules, selectedExamId, selectedClassId]);
    
    // Auto-select first schedule when filters change
    useEffect(() => {
        setSelectedScheduleId(availableSchedules[0]?.id.toString() || '');
    }, [availableSchedules]);


    const studentsInClass = useMemo(() => {
        if (!selectedClassId) return [];
        const classInfo = classes.find(c => c.id === parseInt(selectedClassId));
        if (!classInfo) return [];
        const className = classInfo.name.replace('Class ', '');
        return students.filter(s => s.class === className && classInfo.sections.includes(s.section));
    }, [students, classes, selectedClassId]);

    // Populate marks from existing results
    useEffect(() => {
        if (!selectedScheduleId || studentsInClass.length === 0) {
            setMarks({});
            return;
        }
        const initialMarks: Record<number, string> = {};
        studentsInClass.forEach(student => {
            const result = results.find(r => r.studentId === student.id && r.scheduleId === parseInt(selectedScheduleId));
            if (result) {
                initialMarks[student.id] = result.marksObtained.toString();
            } else {
                initialMarks[student.id] = '';
            }
        });
        setMarks(initialMarks);
    }, [selectedScheduleId, studentsInClass, results]);
    
    const handleMarkChange = (studentId: number, value: string) => {
        setMarks(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSaveResults = () => {
        if (!selectedExamId || !selectedScheduleId) return;

        let nextResultId = Math.max(0, ...results.map(r => r.id)) + 1;
        const updatedResults = [...results];

        // FIX: Explicitly type the destructured array from Object.entries
        // to ensure `markStr` is correctly inferred as a string.
        Object.entries(marks).forEach(([studentIdStr, markStr]: [string, string]) => {
            const studentId = parseInt(studentIdStr);
            const marksObtained = parseFloat(markStr);
            if (isNaN(marksObtained)) return;

            const existingResultIndex = updatedResults.findIndex(
                r => r.studentId === studentId && r.scheduleId === parseInt(selectedScheduleId)
            );

            if (existingResultIndex > -1) {
                updatedResults[existingResultIndex].marksObtained = marksObtained;
            } else {
                updatedResults.push({
                    id: nextResultId++,
                    examId: parseInt(selectedExamId),
                    studentId: studentId,
                    scheduleId: parseInt(selectedScheduleId),
                    marksObtained: marksObtained,
                });
            }
        });

        setResults(updatedResults);
        appState.examResults = updatedResults;
        toastService.show('Results saved successfully!');
    };

    const maxMarks = examSchedules.find(s => s.id === parseInt(selectedScheduleId))?.maxMarks || 100;

    const handlePrintResults = () => {
        if (!selectedScheduleId) return;

        const examName = exams.find(e => e.id === parseInt(selectedExamId))?.name || '';
        const className = classes.find(c => c.id === parseInt(selectedClassId))?.name || '';
        const subjectName = examSchedules.find(s => s.id === parseInt(selectedScheduleId))?.subject || '';

        generatePdfWithBranding(
            appState.schoolProfile,
            `Exam Results: ${examName} - ${className}`,
            {
                head: [['Student Name', 'Student ID', `Marks (out of ${maxMarks})`]],
                body: studentsInClass.map(student => [
                    student.name,
                    student.studentId,
                    marks[student.id] || 'N/A'
                ]),
            },
            `Results_${examName}_${className}_${subjectName}.pdf`.replace(/\s/g, '_')
        );
    };

    const handlePrintReportCard = (student: Student) => {
        if (!selectedExamId) return;

        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        const examName = exams.find(e => e.id === parseInt(selectedExamId))?.name || '';
        
        const studentSchedules = examSchedules.filter(s => 
            s.examId === parseInt(selectedExamId) &&
            s.classId === parseInt(selectedClassId)
        );
        
        const studentResults = studentSchedules.map(schedule => {
            const result = results.find(r => r.studentId === student.id && r.scheduleId === schedule.id);
            return {
                subject: schedule.subject,
                marksObtained: result?.marksObtained ?? 'N/A',
                maxMarks: schedule.maxMarks,
                grade: result?.grade ?? 'N/A',
            };
        });
        
        // Custom generation for report card layout
        if (appState.schoolProfile.logoUrl) {
            doc.addImage(appState.schoolProfile.logoUrl, 'PNG', 14, 14, 20, 20);
        }
        doc.setFontSize(22).setFont('helvetica', 'bold').text(appState.schoolProfile.name, 105, 22, { align: 'center' });
        doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(100).text(appState.schoolProfile.address, 105, 29, { align: 'center' });
        
        doc.setFontSize(18);
        doc.text('Student Report Card', 105, 50, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Exam: ${examName}`, 14, 65);
        doc.text(`Student: ${student.name} (ID: ${student.studentId})`, 14, 71);
        doc.text(`Class: ${student.class}-${student.section}`, 14, 77);

        (doc as any).autoTable({
            startY: 85,
            head: [['Subject', 'Marks Obtained', 'Max Marks', 'Grade']],
            body: studentResults.map(res => [
                res.subject,
                res.marksObtained,
                res.maxMarks,
                res.grade,
            ]),
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] },
        });
        
        const totalMarks = studentResults.reduce((sum, res) => sum + (typeof res.marksObtained === 'number' ? res.marksObtained : 0), 0);
        const totalMaxMarks = studentResults.reduce((sum, res) => sum + res.maxMarks, 0);
        const percentage = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(2) : 'N/A';
        
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total: ${totalMarks}/${totalMaxMarks}`, 14, finalY + 10);
        doc.text(`Percentage: ${percentage}%`, 14, finalY + 16);

        doc.save(`Report_Card_${student.name.replace(/\s/g, '_')}_${examName.replace(/\s/g, '_')}.pdf`);
    };

    return (
        <Card>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold">Enter & View Results</h2>
                <div className="flex items-center flex-wrap space-x-2 md:space-x-4">
                    <select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="input-field">
                        {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="input-field">
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                     <select value={selectedScheduleId} onChange={e => setSelectedScheduleId(e.target.value)} className="input-field" disabled={availableSchedules.length === 0}>
                        {availableSchedules.length > 0 ? availableSchedules.map(s => <option key={s.id} value={s.id}>{s.subject}</option>) : <option>No Subjects</option>}
                    </select>
                    <button onClick={handlePrintResults} disabled={!selectedScheduleId} className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <PrintIcon className="w-4 h-4"/> <span>Print Results</span>
                    </button>
                </div>
            </div>
             <div className="overflow-x-auto">
                {selectedScheduleId ? (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Student ID</th>
                                <th scope="col" className="px-6 py-3">Marks Obtained (out of {maxMarks})</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInClass.map((student) => (
                                <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                                    <td className="px-6 py-4">{student.studentId}</td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="number" 
                                            value={marks[student.id] || ''}
                                            onChange={e => handleMarkChange(student.id, e.target.value)}
                                            className="w-24 px-2 py-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                            max={maxMarks}
                                            min={0}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handlePrintReportCard(student)} className="text-primary-600 hover:text-primary-800" title="Print Report Card">
                                            <PrintIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">Please select an exam, class, and subject to manage results.</p>
                )}
            </div>
            {selectedScheduleId && (
                <div className="flex justify-end mt-6">
                    <button onClick={handleSaveResults} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700">
                        Save Results
                    </button>
                </div>
            )}
        </Card>
    );
};

export default ResultsTab;