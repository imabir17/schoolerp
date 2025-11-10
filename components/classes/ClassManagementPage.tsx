
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { MOCK_CLASSES, MOCK_TEACHERS, MOCK_STUDENTS } from '../../data/mockData';
import { ClassInfo, Teacher, Student } from '../../types';
import CreateClassModal from './CreateClassModal';
import EditClassModal from './EditClassModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import ClassRosterPrint from './ClassRosterPrint';
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


const ClassManagementPage: React.FC = () => {
    const [classes, setClasses] = useState<ClassInfo[]>(MOCK_CLASSES);
    const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
    const [classToDelete, setClassToDelete] = useState<ClassInfo | null>(null);
    const [printingClass, setPrintingClass] = useState<ClassInfo | null>(null);
    const [studentsToPrint, setStudentsToPrint] = useState<Student[]>([]);
    const navigate = useNavigate();

    const handleCreateClass = (newClassData: Omit<ClassInfo, 'id' | 'teacherName' | 'studentCount'>) => {
        const teacher = teachers.find(t => t.id === newClassData.teacherId);
        if (!teacher) return;
        
        const newClass: ClassInfo = {
            id: Math.max(0, ...classes.map(c => c.id)) + 1,
            ...newClassData,
            teacherName: teacher.name,
            studentCount: 0, // New classes start with 0 students
        };
        setClasses(prev => [newClass, ...prev]);
        setIsCreateModalOpen(false);
        toastService.show('Class created successfully!');
    };

    const handleUpdateClass = (updatedClass: ClassInfo) => {
        const teacher = teachers.find(t => t.id === updatedClass.teacherId);
        if (!teacher) return;
        
        const finalClass = { ...updatedClass, teacherName: teacher.name };
        
        setClasses(prev => prev.map(c => c.id === finalClass.id ? finalClass : c));
        setEditingClass(null);
        toastService.show('Class updated successfully!');
    };
    
    const confirmDelete = () => {
        if (classToDelete) {
            setClasses(prev => prev.filter(c => c.id !== classToDelete.id));
            setClassToDelete(null);
            toastService.show('Class deleted successfully!');
        }
    };

    const handlePrintRoster = (classInfo: ClassInfo) => {
        const relevantStudents = MOCK_STUDENTS.filter(
            student => student.class === classInfo.name.replace('Class ', '') && classInfo.sections.includes(student.section)
        );
        setStudentsToPrint(relevantStudents);
        setPrintingClass(classInfo);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Class Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage all classes and sections.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    Create New Class
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Class Name</th>
                                <th scope="col" className="px-6 py-3">Sections</th>
                                <th scope="col" className="px-6 py-3">Class Teacher</th>
                                <th scope="col" className="px-6 py-3">Student Count</th>
                                <th scope="col" className="px-6 py-3">Tuition Fee</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls) => (
                                <tr key={cls.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => navigate(`/classes/${cls.id}`)}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{cls.name}</td>
                                    <td className="px-6 py-4">{cls.sections.join(', ')}</td>
                                    <td className="px-6 py-4">{cls.teacherName}</td>
                                    <td className="px-6 py-4">{cls.studentCount}</td>
                                    <td className="px-6 py-4">${cls.tuitionFee.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => handlePrintRoster(cls)}
                                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
                                            aria-label={`Print roster for ${cls.name}`}
                                        >
                                            <PrintIcon className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => setEditingClass(cls)}
                                            className="text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-300 mr-4"
                                            aria-label={`Edit ${cls.name}`}
                                        >
                                            <EditIcon className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => setClassToDelete(cls)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300"
                                            aria-label={`Delete ${cls.name}`}
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <CreateClassModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onCreate={handleCreateClass} 
                teachers={teachers}
            />

            {editingClass && (
                <EditClassModal
                    isOpen={!!editingClass}
                    onClose={() => setEditingClass(null)}
                    onUpdate={handleUpdateClass}
                    classInfo={editingClass}
                    teachers={teachers}
                />
            )}

            {classToDelete && (
                 <ConfirmationModal
                    isOpen={!!classToDelete}
                    onClose={() => setClassToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Class"
                    message={`Are you sure you want to delete ${classToDelete.name}? This might affect student records.`}
                />
            )}
            
            {printingClass && (
                <ClassRosterPrint 
                    classInfo={printingClass}
                    students={studentsToPrint}
                    onClose={() => setPrintingClass(null)}
                />
            )}
        </div>
    );
};

export default ClassManagementPage;
