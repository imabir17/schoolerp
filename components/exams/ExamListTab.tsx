
import React, { useState } from 'react';
import Card from '../ui/Card';
import { appState } from '../../data/appState';
import { Exam } from '../../types';
import ConfirmationModal from '../ui/ConfirmationModal';
import ExamModal from './ExamModal';
import { generatePdfWithBranding } from '../../utils/pdfUtils';
import { toastService } from '../../utils/toastService';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);


const ExamListTab: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>(appState.exams);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

    const handleSave = (examData: Omit<Exam, 'id'>) => {
        let updatedExams;
        if (editingExam) {
            updatedExams = exams.map(e => e.id === editingExam.id ? { ...editingExam, ...examData } : e);
            toastService.show('Exam updated successfully!');
        } else {
            const newExam: Exam = {
                id: Math.max(0, ...exams.map(e => e.id)) + 1,
                ...examData,
            };
            updatedExams = [newExam, ...exams];
            toastService.show('Exam created successfully!');
        }
        setExams(updatedExams);
        appState.exams = updatedExams;
        closeModals();
    };

    const confirmDelete = () => {
        if (examToDelete) {
            const updatedExams = exams.filter(e => e.id !== examToDelete.id);
            setExams(updatedExams);
            appState.exams = updatedExams;
            setExamToDelete(null);
            toastService.show('Exam deleted successfully!');
        }
    };

    const closeModals = () => {
        setIsModalOpen(false);
        setEditingExam(null);
    };
    
    const handlePrint = () => {
        generatePdfWithBranding(
            appState.schoolProfile,
            'Exam List',
            {
                head: [['Exam Name', 'Academic Year', 'Start Date', 'End Date', 'Fee']],
                body: exams.map(exam => [
                    exam.name,
                    exam.academicYear,
                    exam.startDate,
                    exam.endDate,
                    exam.examFee ? `$${exam.examFee.toFixed(2)}` : 'N/A'
                ])
            },
            'Exam_List.pdf'
        );
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Exam Definitions</h2>
                 <div className="flex items-center space-x-2">
                    <button onClick={handlePrint} className="flex items-center space-x-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        <PrintIcon className="w-4 h-4" />
                        <span>Print List</span>
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700">
                        Create New Exam
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Exam Name</th>
                            <th scope="col" className="px-6 py-3">Academic Year</th>
                            <th scope="col" className="px-6 py-3">Subjects</th>
                            <th scope="col" className="px-6 py-3">Start Date</th>
                            <th scope="col" className="px-6 py-3">End Date</th>
                            <th scope="col" className="px-6 py-3">Exam Fee</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => (
                            <tr key={exam.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{exam.name}</td>
                                <td className="px-6 py-4">{exam.academicYear}</td>
                                <td className="px-6 py-4">
                                    <div className="relative group">
                                        <span className="cursor-pointer underline decoration-dotted">{exam.subjects.length} Subjects</span>
                                        <div className="absolute hidden group-hover:block bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg border dark:border-gray-700 z-10 w-56 text-xs">
                                            <ul className="space-y-1">
                                                {exam.subjects.map((s, i) => (
                                                    <li key={i} className="flex justify-between">
                                                        <span>{s.subjectName}</span>
                                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{s.maxMarks} Marks</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{exam.startDate}</td>
                                <td className="px-6 py-4">{exam.endDate}</td>
                                <td className="px-6 py-4">{exam.examFee ? `$${exam.examFee.toFixed(2)}` : 'N/A'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => setEditingExam(exam)} className="text-primary-600 hover:text-primary-800 mr-4"><EditIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setExamToDelete(exam)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {(isModalOpen || editingExam) && (
                <ExamModal
                    isOpen={isModalOpen || !!editingExam}
                    onClose={closeModals}
                    onSave={handleSave}
                    existingExam={editingExam}
                />
            )}
            {examToDelete && (
                <ConfirmationModal
                    isOpen={!!examToDelete}
                    onClose={() => setExamToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Exam"
                    message="Are you sure you want to delete this exam? All related schedules and results will also be deleted."
                />
            )}
        </Card>
    );
};

export default ExamListTab;
