import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import api from '../../services/api';
import { Student } from '../../types';
import CreateStudentModal from './CreateStudentModal';
import EditStudentModal from './EditStudentModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import { toastService } from '../../utils/toastService';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);


const StudentManagementPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    const fetchStudents = async () => {
        setIsLoading(true);
        const data = await api.getData('students');
        setStudents(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateStudent = async (newStudentData: Omit<Student, 'id' | 'studentId' | 'avatarUrl' | 'dob' | 'address'> & { photo?: string }) => {
        const currentStudents = await api.getData('students');
        const newId = Math.max(0, ...currentStudents.map((s: Student) => s.id)) + 1;
        const newStudentId = `S${String(newId).padStart(3, '0')}`;
        
        const newStudent: Student = {
            id: newId,
            studentId: newStudentId,
            ...newStudentData,
            avatarUrl: newStudentData.photo || `https://picsum.photos/seed/${newId}/100/100`,
            dob: new Date().toISOString().split('T')[0], // Placeholder
            address: 'N/A', // Placeholder
        };
        await api.setData('students', [newStudent, ...currentStudents]);
        await fetchStudents();
        setIsCreateModalOpen(false);
        toastService.show('Student created successfully!');
    };

    const handleUpdateStudent = async (updatedStudent: Student) => {
        const currentStudents = await api.getData('students');
        const updatedList = currentStudents.map((s: Student) => s.id === updatedStudent.id ? updatedStudent : s);
        await api.setData('students', updatedList);
        await fetchStudents();
        setEditingStudent(null);
        toastService.show('Student updated successfully!');
    };

    const confirmDelete = async () => {
        if (studentToDelete) {
            const currentStudents = await api.getData('students');
            const updatedList = currentStudents.filter((s: Student) => s.id !== studentToDelete.id);
            await api.setData('students', updatedList);
            await fetchStudents();
            setStudentToDelete(null);
            toastService.show('Student deleted successfully!');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage all student records in one place.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    Add New Student
                </button>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search by name, ID, class..."
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? <p className="text-center py-8">Loading students...</p> : (
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Student Name</th>
                                    <th scope="col" className="px-6 py-3">Student ID</th>
                                    <th scope="col" className="px-6 py-3">Class</th>
                                    <th scope="col" className="px-6 py-3">Guardian</th>
                                    <th scope="col" className="px-6 py-3">Contact</th>
                                    <th scope="col" className="px-6 py-3">Scholarship</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="flex items-center">
                                                <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                                {student.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{student.studentId}</td>
                                        <td className="px-6 py-4">{student.class} - {student.section}</td>
                                        <td className="px-6 py-4">{student.guardianName}</td>
                                        <td className="px-6 py-4">{student.guardianPhone}</td>
                                        <td className="px-6 py-4">${student.monthlyScholarship.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setEditingStudent(student)}
                                                className="text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-300 mr-4"
                                                aria-label={`Edit ${student.name}`}
                                            >
                                                <EditIcon className="w-5 h-5"/>
                                            </button>
                                            <button 
                                                onClick={() => setStudentToDelete(student)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300"
                                                aria-label={`Delete ${student.name}`}
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                     {filteredStudents.length === 0 && !isLoading && (
                        <p className="text-center py-8 text-gray-500 dark:text-gray-400">No students found.</p>
                    )}
                </div>
            </Card>
            <CreateStudentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateStudent} />
            {editingStudent && (
                <EditStudentModal 
                    isOpen={!!editingStudent}
                    onClose={() => setEditingStudent(null)}
                    onUpdate={handleUpdateStudent}
                    student={editingStudent}
                />
            )}
            {studentToDelete && (
                 <ConfirmationModal
                    isOpen={!!studentToDelete}
                    onClose={() => setStudentToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Student"
                    message={`Are you sure you want to delete ${studentToDelete.name}? This action cannot be undone.`}
                />
            )}
        </div>
    );
};

export default StudentManagementPage;
