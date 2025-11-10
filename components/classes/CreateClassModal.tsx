import React, { useState } from 'react';
import { ClassInfo, Teacher } from '../../types';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (classData: Omit<ClassInfo, 'id' | 'teacherName' | 'studentCount'>) => void;
  teachers: Teacher[];
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose, onCreate, teachers }) => {
    const [name, setName] = useState('');
    const [sections, setSections] = useState('');
    const [teacherId, setTeacherId] = useState<number | string>('');
    const [tuitionFee, setTuitionFee] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !sections || !teacherId || !tuitionFee) return;

        onCreate({
            name,
            sections: sections.split(',').map(s => s.trim()).filter(Boolean),
            teacherId: Number(teacherId),
            tuitionFee: Number(tuitionFee),
        });
        
        // Reset form
        setName('');
        setSections('');
        setTeacherId('');
        setTuitionFee('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Class</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="className" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</label>
                            <input type="text" id="className" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Class 10"/>
                        </div>
                        <div>
                            <label htmlFor="sections" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sections</label>
                            <input type="text" id="sections" value={sections} onChange={(e) => setSections(e.target.value)} required className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., A, B, C"/>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comma-separated values.</p>
                        </div>
                        <div>
                            <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class Teacher</label>
                            <select id="teacherId" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option value="" disabled>Select a teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tuitionFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tuition Fee ($)</label>
                            <input type="number" id="tuitionFee" value={tuitionFee} onChange={(e) => setTuitionFee(e.target.value)} required className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., 400"/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-8 space-x-3 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">Create Class</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClassModal;