import { SchoolProfile, Student, AttendanceRecord, Fee, Teacher, ClassInfo, Staff, StaffAttendanceRecord, FeeStructure, SalaryPayment, Expense, Income, Exam, ExamSchedule, ExamResult, AcademicSession, AttendanceStatus, FeeStatus, StaffRole, StaffAttendanceStatus, ExpenseCategory } from '../types';

// Helper to generate a consistent but unique set of data for a school
export const generateMockSchoolData = (profile: { name: string, address: string }) => {
  const schoolProfile: SchoolProfile = { name: profile.name, address: profile.address, logoUrl: null };
  
  const teachers: Teacher[] = [
    { id: 1, name: 'Mr. John Doe' }, { id: 2, name: 'Ms. Jane Smith' },
    { id: 3, name: 'Mrs. Emily White' }, { id: 4, name: 'Mr. Robert Brown' },
  ];
  
  const classes: ClassInfo[] = [
    { id: 1, name: 'Class 10', sections: ['A', 'B'], teacherId: 1, teacherName: 'Mr. John Doe', studentCount: 2, tuitionFee: 400 },
    { id: 2, name: 'Class 9', sections: ['A', 'B'], teacherId: 2, teacherName: 'Ms. Jane Smith', studentCount: 1, tuitionFee: 350 },
  ];
  
  const students: Student[] = [
    { id: 1, studentId: 'S001', name: 'Alice Johnson', class: '10', section: 'A', classRoll: 1, guardianName: 'John Johnson', guardianPhone: '123-456-7890', parentName: 'John Johnson', parentPhone: '123-456-7890', dob: '2008-05-15', address: '123 Maple St', avatarUrl: 'https://picsum.photos/seed/alice/100/100', birthCertificateNo: 'BCN12345', monthlyScholarship: 50 },
    { id: 2, studentId: 'S002', name: 'Bob Smith', class: '10', section: 'A', classRoll: 2, guardianName: 'Robert Smith', guardianPhone: '123-456-7891', parentName: 'Robert Smith', parentPhone: '123-456-7891', dob: '2008-07-22', address: '456 Oak Ave', avatarUrl: 'https://picsum.photos/seed/bob/100/100', birthCertificateNo: 'BCN67890', monthlyScholarship: 0 },
    { id: 3, studentId: 'S003', name: 'Charlie Brown', class: '9', section: 'B', classRoll: 5, guardianName: 'Charles Brown', guardianPhone: '123-456-7892', parentName: 'Charles Brown', parentPhone: '123-456-7892', dob: '2009-02-10', address: '789 Pine Ln', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', birthCertificateNo: 'BCN54321', monthlyScholarship: 0 },
  ];

  const staff: Staff[] = [
    { id: 1, staffId: 'T001', name: 'Dr. Evelyn Reed', nid: '1985123456789', role: StaffRole.HeadTeacher, basicSalary: 5000, avatarUrl: 'https://picsum.photos/seed/evelyn/100/100' },
    { id: 2, staffId: 'T002', name: 'Mr. Samuel Chen', nid: '1990010112345', role: StaffRole.Teacher, basicSalary: 3500, avatarUrl: 'https://picsum.photos/seed/samuel/100/100' },
    { id: 3, staffId: 'A001', name: 'Ms. Clara Oswald', nid: '1992053098765', role: StaffRole.Accountant, basicSalary: 3000, avatarUrl: 'https://picsum.photos/seed/clara/100/100' },
  ];
  
  return {
    schoolProfile,
    students,
    classes,
    teachers,
    staff,
    attendance: [
      { id: 1, studentId: 1, studentName: 'Alice Johnson', date: '2023-10-26', status: AttendanceStatus.Present, class: '10', section: 'A' },
      { id: 2, studentId: 2, studentName: 'Bob Smith', date: '2023-10-26', status: AttendanceStatus.Absent, class: '10', section: 'A' },
      { id: 3, studentId: 3, studentName: 'Charlie Brown', date: '2023-10-26', status: AttendanceStatus.Present, class: '9', section: 'B' },
    ] as AttendanceRecord[],
    fees: [
      { id: 1, studentId: 1, studentName: 'Alice Johnson', amount: 400, month: 'September', status: FeeStatus.Paid, paidDate: '2023-09-05', dueDate: '2023-09-10', type: 'Tuition Fee' },
      { id: 2, studentId: 2, studentName: 'Bob Smith', amount: 25, status: FeeStatus.Paid, paidDate: '2023-11-01', dueDate: '2023-11-10', type: 'Exam Fee', examId: 1 },
    ] as Fee[],
    staffAttendance: [
      { id: 1, staffId: 1, staffName: 'Dr. Evelyn Reed', date: '2023-10-27', status: StaffAttendanceStatus.Present },
      { id: 2, staffId: 2, staffName: 'Mr. Samuel Chen', date: '2023-10-27', status: StaffAttendanceStatus.OnLeave },
    ] as StaffAttendanceRecord[],
    feeStructures: [
      { id: 1, name: 'Tuition Fee', description: 'Monthly fee for academic classes.', amount: 400 },
      { id: 2, name: 'Library Fee', description: 'Annual fee for library access and resources.', amount: 50 },
    ] as FeeStructure[],
    salaryPayments: [
      { id: 1, staffId: 1, staffName: 'Dr. Evelyn Reed', month: 'September', year: 2023, basicSalary: 5000, finalAmount: 5000, paymentDate: '2023-10-01' },
    ] as SalaryPayment[],
    expenses: [
      { id: 1, date: '2023-10-15', category: ExpenseCategory.Utilities, description: 'Electricity Bill', amount: 500 },
    ] as Expense[],
    income: [
      { id: 1, date: '2023-10-05', source: 'Annual Fundraiser Event', amount: 2500 },
    ] as Income[],
    exams: [
      { id: 1, name: 'Mid-term Examination', academicYear: '2023-2024', startDate: '2023-11-15', endDate: '2023-11-25', examFee: 25, subjects: [ { subjectName: 'Mathematics', maxMarks: 100 }, { subjectName: 'English', maxMarks: 100 } ]},
      { id: 2, name: 'Final Examination', academicYear: '2023-2024', startDate: '2024-03-10', endDate: '2024-03-22', examFee: 50, subjects: [ { subjectName: 'Physics', maxMarks: 100 } ]},
    ] as Exam[],
    examSchedules: [
      { id: 1, examId: 1, classId: 1, subject: 'Mathematics', date: '2023-11-15', startTime: '09:00', endTime: '12:00', maxMarks: 100 },
      { id: 2, examId: 1, classId: 2, subject: 'English', date: '2023-11-16', startTime: '09:00', endTime: '12:00', maxMarks: 100 },
    ] as ExamSchedule[],
    examResults: [
       { id: 1, examId: 1, studentId: 1, scheduleId: 1, marksObtained: 85, grade: 'A' },
    ] as ExamResult[],
    academicSessions: [
      { id: 1, name: '2023-2024', startDate: '2023-08-01', endDate: '2024-05-31', isActive: true },
    ] as AcademicSession[],
  };
};

export const getEmptySchoolData = (profile?: { name: string, address: string }) => ({
  schoolProfile: { name: profile?.name || 'School ERP', address: profile?.address || 'Please set in settings', logoUrl: null },
  students: [] as Student[],
  attendance: [] as AttendanceRecord[],
  fees: [] as Fee[],
  teachers: [] as Teacher[],
  classes: [] as ClassInfo[],
  staff: [] as Staff[],
  staffAttendance: [] as StaffAttendanceRecord[],
  feeStructures: [] as FeeStructure[],
  salaryPayments: [] as SalaryPayment[],
  expenses: [] as Expense[],
  income: [] as Income[],
  exams: [] as Exam[],
  examSchedules: [] as ExamSchedule[],
  examResults: [] as ExamResult[],
  academicSessions: [] as AcademicSession[],
});
