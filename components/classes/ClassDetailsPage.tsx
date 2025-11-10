
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { appState } from '../../data/appState';
import { Student, ClassInfo } from '../../types';
import Card from '../ui/Card';
import PromotionModal from './PromotionModal';
import { toastService } from '../../utils/toastService';

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const ClassDetailsPage: React.FC = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const numericClassId = classId ? parseInt(classId, 10) : NaN;

  const [allStudents, setAllStudents] = useState<Student[]>(appState.students);
  const [allClasses] = useState<ClassInfo[]>(appState.classes);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  const currentClass = useMemo(() => allClasses.find(c => c.id === numericClassId), [allClasses, numericClassId]);

  const studentsInClass = useMemo(() => {
    if (!currentClass) return [];
    const className = currentClass.name.replace('Class ', '');
    return allStudents.filter(s => s.class === className && currentClass.sections.includes(s.section));
  }, [allStudents, currentClass]);
  
  if (!currentClass) {
    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold">Class not found</h1>
            <Link to="/classes" className="text-primary-600 hover:underline mt-4 inline-block">Go back to Class Management</Link>
        </div>
    );
  }

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudentIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(studentId)) {
            newSet.delete(studentId);
        } else {
            newSet.add(studentId);
        }
        return newSet;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedStudentIds(new Set(studentsInClass.map(s => s.id)));
      } else {
          setSelectedStudentIds(new Set());
      }
  };
  
  const handlePromote = (targetClassId: number, promotionData: { studentId: number; newRoll: number }[]) => {
      const targetClass = allClasses.find(c => c.id === targetClassId);
      if (!targetClass) return;

      const targetClassName = targetClass.name.replace('Class ', '');
      
      const updatedStudents = allStudents.map(student => {
          const promotionInfo = promotionData.find(p => p.studentId === student.id);
          if (promotionInfo) {
              return {
                  ...student,
                  class: targetClassName,
                  // For simplicity, we assign to the first section of the new class
                  section: targetClass.sections[0], 
                  classRoll: promotionInfo.newRoll,
              };
          }
          return student;
      });

      setAllStudents(updatedStudents);
      appState.students = updatedStudents;

      setSelectedStudentIds(new Set());
      setIsPromotionModalOpen(false);
      toastService.show(`${promotionData.length} student(s) promoted successfully!`);
  };

  const selectedStudents = studentsInClass.filter(s => selectedStudentIds.has(s.id));
  const isAllSelected = selectedStudentIds.size > 0 && studentsInClass.length > 0 && selectedStudentIds.size === studentsInClass.length;

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <div>
                <button onClick={() => navigate('/classes')} className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to all classes
                </button>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {currentClass.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Teacher: {currentClass.teacherName} | Sections: {currentClass.sections.join(', ')}</p>
            </div>
            <button
                onClick={() => setIsPromotionModalOpen(true)}
                disabled={selectedStudentIds.size === 0}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Promote Selected Students ({selectedStudentIds.size})
            </button>
        </div>

        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th scope="col" className="px-6 py-3">Student Name</th>
                            <th scope="col" className="px-6 py-3">Student ID</th>
                            <th scope="col" className="px-6 py-3">Section</th>
                            <th scope="col" className="px-6 py-3">Roll No.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsInClass.map((student) => (
                            <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={selectedStudentIds.has(student.id)}
                                        onChange={() => handleSelectStudent(student.id)}
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center">
                                        <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                        {student.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{student.studentId}</td>
                                <td className="px-6 py-4">{student.section}</td>
                                <td className="px-6 py-4">{student.classRoll}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {studentsInClass.length === 0 && (
                <p className="py-8 text-center text-gray-500 dark:text-gray-400">No students found in this class.</p>
            )}
        </Card>

        <PromotionModal 
            isOpen={isPromotionModalOpen}
            onClose={() => setIsPromotionModalOpen(false)}
            onPromote={handlePromote}
            studentsToPromote={selectedStudents}
            allClasses={allClasses}
            currentClassId={numericClassId}
        />
    </div>
  );
};

export default ClassDetailsPage;
