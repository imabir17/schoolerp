import React from 'react';
import { ClassInfo, Student } from '../../types';
import { generatePdfWithBranding } from '../../utils/pdfUtils';
import { appState } from '../../data/appState';

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);


interface ClassRosterPrintProps {
  classInfo: ClassInfo;
  students: Student[];
  onClose: () => void;
}

const ClassRosterPrint: React.FC<ClassRosterPrintProps> = ({ classInfo, students, onClose }) => {

  const generatePdf = () => {
    generatePdfWithBranding(
        appState.schoolProfile,
        `Student Roster: ${classInfo.name}`,
        {
            head: [['Student ID', 'Student Name', 'Class', 'Section', 'Roll No.']],
            body: students.map(student => [
                student.studentId,
                student.name,
                student.class,
                student.section,
                student.classRoll,
            ]),
        },
        `Roster-${classInfo.name.replace(/\s/g, '_')}.pdf`
    );
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Roster Preview</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {classInfo.name} - Sections: {classInfo.sections.join(', ')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Class Teacher: {classInfo.teacherName}</p>
          </div>
          <div className="flex items-center space-x-3">
             <button
                onClick={generatePdf}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 flex items-center space-x-2"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
             <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Close
              </button>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Student ID</th>
                  <th scope="col" className="px-6 py-3">Student Name</th>
                  <th scope="col" className="px-6 py-3">Class</th>
                  <th scope="col" className="px-6 py-3">Section</th>
                  <th scope="col" className="px-6 py-3">Roll No.</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{student.studentId}</td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4">{student.class}</td>
                    <td className="px-6 py-4">{student.section}</td>
                    <td className="px-6 py-4">{student.classRoll}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        {students.length === 0 && (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">No students found for this class.</p>
        )}
      </div>
    </div>
  );
};

export default ClassRosterPrint;
