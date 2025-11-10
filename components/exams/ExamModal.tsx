import React, { useState, useEffect } from 'react';
import { Exam } from '../../types';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Exam, 'id'>) => void;
  existingExam: Exam | null;
}

type FormSubject = {
    subjectName: string;
    maxMarks: string;
};

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const ExamModal: React.FC<ExamModalProps> = ({ isOpen, onClose, onSave, existingExam }) => {
    const [formData, setFormData] = useState({
        name: '',
        academicYear: '2023-2024',
        startDate: '',
        endDate: '',
        examFee: '',
        subjects: [] as FormSubject[],
    });

    useEffect(() => {
        if (existingExam) {
            setFormData({
                ...existingExam,
                examFee: existingExam.examFee?.toString() || '',
                subjects: existingExam.subjects.map(s => ({
                    subjectName: s.subjectName,
                    maxMarks: s.maxMarks.toString(),
                })) || [],
            });
        } else {
            setFormData({
                name: '',
                academicYear: '2023-2024',
                startDate: '',
                endDate: '',
                examFee: '',
                subjects: [{ subjectName: '', maxMarks: '' }],
            });
        }
    }, [existingExam, isOpen]);

    if (!isOpen) return null;

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubjectChange = (index: number, field: keyof FormSubject, value: string) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index][field] = value;
        setFormData(prev => ({...prev, subjects: newSubjects}));
    };

    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { subjectName: '', maxMarks: '' }],
        }));
    };

    const removeSubject = (index: number) => {
        const newSubjects = formData.subjects.filter((_, i) => i !== index);
        setFormData(prev => ({...prev, subjects: newSubjects}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, academicYear, startDate, endDate, examFee, subjects } = formData;
        onSave({
            name,
            academicYear,
            startDate,
            endDate,
            examFee: examFee ? parseFloat(examFee) : undefined,
            subjects: subjects.map(s => ({
                subjectName: s.subjectName,
                maxMarks: parseInt(s.maxMarks, 10) || 0,
            })).filter(s => s.subjectName && s.maxMarks > 0),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{existingExam ? 'Edit Exam' : 'Create New Exam'}</h2>
                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleGeneralChange} required className="w-full mt-1 input-field" placeholder="e.g., Mid-term Examination" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year</label>
                                <input type="text" name="academicYear" id="academicYear" value={formData.academicYear} onChange={handleGeneralChange} required className="w-full mt-1 input-field" placeholder="e.g., 2023-2024" />
                            </div>
                             <div>
                                <label htmlFor="examFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Fee ($)</label>
                                <input type="number" name="examFee" id="examFee" value={formData.examFee} onChange={handleGeneralChange} className="w-full mt-1 input-field" placeholder="e.g., 25" min="0" step="0.01" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleGeneralChange} required className="w-full mt-1 input-field" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleGeneralChange} required className="w-full mt-1 input-field" />
                            </div>
                        </div>

                        <div className="pt-4 border-t dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Subjects & Marks</h3>
                            <div className="space-y-3">
                                {formData.subjects.map((subject, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={subject.subjectName}
                                            onChange={e => handleSubjectChange(index, 'subjectName', e.target.value)}
                                            placeholder="Subject Name"
                                            className="w-full input-field"
                                            required
                                        />
                                        <input
                                            type="number"
                                            value={subject.maxMarks}
                                            onChange={e => handleSubjectChange(index, 'maxMarks', e.target.value)}
                                            placeholder="Max Marks"
                                            className="w-40 input-field"
                                            required
                                        />
                                        <button type="button" onClick={() => removeSubject(index)} className="text-red-500 hover:text-red-700 p-2">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addSubject} className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-800">
                                + Add Another Subject
                            </button>
                        </div>

                    </div>
                     <div className="flex justify-end mt-8 space-x-3 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamModal;