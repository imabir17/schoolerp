import { Student, AttendanceRecord, Fee, AttendanceStatus, FeeStatus, School, Teacher, ClassInfo, Staff, StaffRole, StaffAttendanceRecord, StaffAttendanceStatus, FeeStructure, SalaryPayment, Expense, Income, ExpenseCategory, Exam, ExamSchedule, ExamResult, SchoolProfile, AcademicSession } from '../types';

export const MOCK_SCHOOL_PROFILE: SchoolProfile = {
  name: 'Springfield Academy',
  address: '123 Education Lane, Springfield, 12345',
  logoUrl: null, // Initially no logo
};

export const MOCK_ACADEMIC_SESSIONS: AcademicSession[] = [
  { id: 1, name: '2023-2024', startDate: '2023-08-01', endDate: '2024-05-31', isActive: true },
  { id: 2, name: '2022-2023', startDate: '2022-08-01', endDate: '2023-05-31', isActive: false },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 1, studentId: 'S001', name: 'Alice Johnson', class: '10', section: 'A', classRoll: 1, guardianName: 'John Johnson', guardianPhone: '123-456-7890', parentName: 'John Johnson', parentPhone: '123-456-7890', dob: '2008-05-15', address: '123 Maple St, Springfield', avatarUrl: 'https://picsum.photos/seed/alice/100/100', birthCertificateNo: 'BCN12345', monthlyScholarship: 50 },
  { id: 2, studentId: 'S002', name: 'Bob Smith', class: '10', section: 'A', classRoll: 2, guardianName: 'Robert Smith', guardianPhone: '123-456-7891', parentName: 'Robert Smith', parentPhone: '123-456-7891', dob: '2008-07-22', address: '456 Oak Ave, Springfield', avatarUrl: 'https://picsum.photos/seed/bob/100/100', birthCertificateNo: 'BCN67890', monthlyScholarship: 0 },
  { id: 3, studentId: 'S003', name: 'Charlie Brown', class: '9', section: 'B', classRoll: 5, guardianName: 'Charles Brown', guardianPhone: '123-456-7892', parentName: 'Charles Brown', parentPhone: '123-456-7892', dob: '2009-02-10', address: '789 Pine Ln, Springfield', avatarUrl: 'https://picsum.photos/seed/charlie/100/100', birthCertificateNo: 'BCN54321', monthlyScholarship: 0 },
  { id: 4, studentId: 'S004', name: 'Diana Prince', class: '11', section: 'C', classRoll: 3, guardianName: 'Queen Hippolyta', guardianPhone: '123-456-7893', parentName: 'Queen Hippolyta', parentPhone: '123-456-7893', dob: '2007-11-30', address: '1 Paradise Island', avatarUrl: 'https://picsum.photos/seed/diana/100/100', birthCertificateNo: 'BCN98765', monthlyScholarship: 100 },
  { id: 5, studentId: 'S005', name: 'Ethan Hunt', class: '10', section: 'B', classRoll: 12, guardianName: 'Mr. Hunt', guardianPhone: '123-456-7894', parentName: 'Mr. Hunt', parentPhone: '123-456-7894', dob: '2008-01-01', address: '10 Mission Way, Springfield', avatarUrl: 'https://picsum.photos/seed/ethan/100/100', birthCertificateNo: 'BCN11223', monthlyScholarship: 0 },
  { id: 6, studentId: 'S006', name: 'Fiona Glenanne', class: '9', section: 'A', classRoll: 8, guardianName: 'Mrs. Glenanne', guardianPhone: '123-456-7895', parentName: 'Mrs. Glenanne', parentPhone: '123-456-7895', dob: '2009-09-19', address: '20 Burn Notice Rd, Springfield', avatarUrl: 'https://picsum.photos/seed/fiona/100/100', birthCertificateNo: 'BCN44556', monthlyScholarship: 0 },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 1, studentId: 1, studentName: 'Alice Johnson', date: '2023-10-26', status: AttendanceStatus.Present, class: '10', section: 'A' },
  { id: 2, studentId: 2, studentName: 'Bob Smith', date: '2023-10-26', status: AttendanceStatus.Absent, class: '10', section: 'A' },
  { id: 3, studentId: 3, studentName: 'Charlie Brown', date: '2023-10-26', status: AttendanceStatus.Present, class: '9', section: 'B' },
  { id: 4, studentId: 4, studentName: 'Diana Prince', date: '2023-10-26', status: AttendanceStatus.Late, class: '11', section: 'C' },
  { id: 5, studentId: 5, studentName: 'Ethan Hunt', date: '2023-10-26', status: AttendanceStatus.Present, class: '10', section: 'B' },
  { id: 6, studentId: 6, studentName: 'Fiona Glenanne', date: '2023-10-26', status: AttendanceStatus.Present, class: '9', section: 'A' },
  { id: 7, studentId: 1, studentName: 'Alice Johnson', date: '2023-10-25', status: AttendanceStatus.Present, class: '10', section: 'A' },
  { id: 8, studentId: 2, studentName: 'Bob Smith', date: '2023-10-25', status: AttendanceStatus.Present, class: '10', section: 'A' },
  { id: 9, studentId: 1, studentName: 'Alice Johnson', date: '2023-10-24', status: AttendanceStatus.Present, class: '10', section: 'A' },
  { id: 10, studentId: 2, studentName: 'Bob Smith', date: '2023-10-24', status: AttendanceStatus.Late, class: '10', section: 'A' },
  { id: 11, studentId: 1, studentName: 'Alice Johnson', date: '2023-10-23', status: AttendanceStatus.Absent, class: '10', section: 'A' },
  { id: 12, studentId: 2, studentName: 'Bob Smith', date: '2023-10-23', status: AttendanceStatus.Present, class: '10', section: 'A' },
  { id: 13, studentId: 3, studentName: 'Charlie Brown', date: '2023-10-25', status: AttendanceStatus.Present, class: '9', section: 'B' },
  { id: 14, studentId: 3, studentName: 'Charlie Brown', date: '2023-10-24', status: AttendanceStatus.Present, class: '9', section: 'B' },
];

export const MOCK_FEES: Fee[] = [
  // This will be populated on-the-fly by the CollectFeePage logic.
  // Adding one paid record for history.
  { id: 1, studentId: 1, studentName: 'Alice Johnson', amount: 400, month: 'September', status: FeeStatus.Paid, paidDate: '2023-09-05', dueDate: '2023-09-10', type: 'Tuition Fee' },
  { id: 2, studentId: 2, studentName: 'Bob Smith', amount: 25, status: FeeStatus.Paid, paidDate: '2023-11-01', dueDate: '2023-11-10', type: 'Exam Fee', examId: 1 },
];

// FIX: Corrected MOCK_SCHOOLS to align with the School interface in types.ts.
// Removed `creationDate` and added required `address`, `phone`, and `password` fields.
export const MOCK_SCHOOLS: School[] = [
  { id: 1, name: 'Springfield Elementary', schoolId: 'springfield_elem', address: '123 Education Lane, Springfield', phone: '555-123-4567', password: 'pass123' },
  { id: 2, name: 'North Central High', schoolId: 'north_central_high', address: '456 High St, Northville', phone: '555-234-5678', password: 'password123' },
  { id: 3, name: 'Oak Valley Academy', schoolId: 'oak_valley_acad', address: '789 Academy Rd, Oak Valley', phone: '555-345-6789', password: 'password123' },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 1, name: 'Mr. John Doe' },
  { id: 2, name: 'Ms. Jane Smith' },
  { id: 3, name: 'Mrs. Emily White' },
  { id: 4, name: 'Mr. Robert Brown' },
];

export const MOCK_CLASSES: ClassInfo[] = [
  { id: 1, name: 'Class 10', sections: ['A', 'B'], teacherId: 1, teacherName: 'Mr. John Doe', studentCount: 65, tuitionFee: 400 },
  { id: 2, name: 'Class 9', sections: ['A', 'B'], teacherId: 2, teacherName: 'Ms. Jane Smith', studentCount: 72, tuitionFee: 350 },
  { id: 3, name: 'Class 11', sections: ['C'], teacherId: 3, teacherName: 'Mrs. Emily White', studentCount: 35, tuitionFee: 450 },
  { id: 4, name: 'Class 8', sections: ['A', 'B', 'C'], teacherId: 4, teacherName: 'Mr. Robert Brown', studentCount: 95, tuitionFee: 300 },
];

export const MOCK_STAFF: Staff[] = [
    { id: 1, staffId: 'T001', name: 'Dr. Evelyn Reed', nid: '1985123456789', role: StaffRole.HeadTeacher, basicSalary: 5000, avatarUrl: 'https://picsum.photos/seed/evelyn/100/100' },
    { id: 2, staffId: 'T002', name: 'Mr. Samuel Chen', nid: '1990010112345', role: StaffRole.Teacher, basicSalary: 3500, avatarUrl: 'https://picsum.photos/seed/samuel/100/100' },
    { id: 3, staffId: 'A001', name: 'Ms. Clara Oswald', nid: '1992053098765', role: StaffRole.Accountant, basicSalary: 3000, avatarUrl: 'https://picsum.photos/seed/clara/100/100' },
    { id: 4, staffId: 'C001', name: 'John Smith', nid: '1980112233445', role: StaffRole.Cleaner, basicSalary: 1500, avatarUrl: 'https://picsum.photos/seed/john/100/100' },
    { id: 5, staffId: 'W001', name: 'Peter Jones', nid: '1975031577889', role: StaffRole.Watchman, basicSalary: 1600, avatarUrl: 'https://picsum.photos/seed/peter/100/100' }
];

export const MOCK_STAFF_ATTENDANCE: StaffAttendanceRecord[] = [
    { id: 1, staffId: 1, staffName: 'Dr. Evelyn Reed', date: '2023-10-27', status: StaffAttendanceStatus.Present },
    { id: 2, staffId: 2, staffName: 'Mr. Samuel Chen', date: '2023-10-27', status: StaffAttendanceStatus.Present },
    { id: 3, staffId: 3, staffName: 'Ms. Clara Oswald', date: '2023-10-27', status: StaffAttendanceStatus.OnLeave },
    { id: 4, staffId: 4, staffName: 'John Smith', date: '2023-10-27', status: StaffAttendanceStatus.Present },
    { id: 5, staffId: 5, staffName: 'Peter Jones', date: '2023-10-27', status: StaffAttendanceStatus.Absent },
    { id: 6, staffId: 1, staffName: 'Dr. Evelyn Reed', date: '2023-10-26', status: StaffAttendanceStatus.Present },
    { id: 7, staffId: 2, staffName: 'Mr. Samuel Chen', date: '2023-10-26', status: StaffAttendanceStatus.Present },
    { id: 8, staffId: 3, staffName: 'Ms. Clara Oswald', date: '2023-10-26', status: StaffAttendanceStatus.Present },
    { id: 9, staffId: 4, staffName: 'John Smith', date: '2023-10-26', status: StaffAttendanceStatus.Absent },
    { id: 10, staffId: 5, staffName: 'Peter Jones', date: '2023-10-26', status: StaffAttendanceStatus.Present },
    { id: 11, staffId: 1, staffName: 'Dr. Evelyn Reed', date: '2023-10-25', status: StaffAttendanceStatus.Present },
    { id: 12, staffId: 2, staffName: 'Mr. Samuel Chen', date: '2023-10-25', status: StaffAttendanceStatus.OnLeave },
    { id: 13, staffId: 3, staffName: 'Ms. Clara Oswald', date: '2023-10-25', status: StaffAttendanceStatus.Present },
    { id: 14, staffId: 4, staffName: 'John Smith', date: '2023-10-25', status: StaffAttendanceStatus.Present },
    { id: 15, staffId: 5, staffName: 'Peter Jones', date: '2023-10-25', status: StaffAttendanceStatus.Present },
];

export const MOCK_FEE_STRUCTURES: FeeStructure[] = [
    { id: 1, name: 'Tuition Fee', description: 'Monthly fee for academic classes.', amount: 400 },
    { id: 2, name: 'Library Fee', description: 'Annual fee for library access and resources.', amount: 50 },
    { id: 3, name: 'Sports Fee', description: 'Annual fee for sports facilities and events.', amount: 50 },
];

export const MOCK_SALARY_PAYMENTS: SalaryPayment[] = [
    { id: 1, staffId: 1, staffName: 'Dr. Evelyn Reed', month: 'September', year: 2023, basicSalary: 5000, finalAmount: 5000, paymentDate: '2023-10-01' },
    { id: 2, staffId: 2, staffName: 'Mr. Samuel Chen', month: 'September', year: 2023, basicSalary: 3500, finalAmount: 3500, paymentDate: '2023-10-01' },
    { id: 3, staffId: 3, staffName: 'Ms. Clara Oswald', month: 'September', year: 2023, basicSalary: 3000, finalAmount: 3000, paymentDate: '2023-10-01' },
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 1, date: '2023-10-15', category: ExpenseCategory.Utilities, description: 'Electricity Bill', amount: 500 },
    { id: 2, date: '2023-10-12', category: ExpenseCategory.Supplies, description: 'Stationery and office supplies', amount: 150 },
    { id: 3, date: '2023-10-20', category: ExpenseCategory.Maintenance, description: 'Classroom window repair', amount: 250 },
];

export const MOCK_INCOME: Income[] = [
    { id: 1, date: '2023-10-05', source: 'Annual Fundraiser Event', amount: 2500 },
    { id: 2, date: '2023-10-18', source: 'Government Grant', amount: 5000 },
    { id: 3, date: '2023-10-25', source: 'Donation from PTA', amount: 750 },
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 1, name: 'Mid-term Examination', academicYear: '2023-2024', startDate: '2023-11-15', endDate: '2023-11-25', examFee: 25,
    subjects: [
        { subjectName: 'Mathematics', maxMarks: 100 },
        { subjectName: 'Physics', maxMarks: 80 },
        { subjectName: 'Chemistry', maxMarks: 80 },
        { subjectName: 'English', maxMarks: 100 },
        { subjectName: 'Social Studies', maxMarks: 80 },
    ]
  },
  {
    id: 2, name: 'Final Examination', academicYear: '2023-2024', startDate: '2024-03-10', endDate: '2024-03-22', examFee: 50,
    subjects: [
        { subjectName: 'Mathematics', maxMarks: 100 },
        { subjectName: 'Physics', maxMarks: 100 },
        { subjectName: 'Chemistry', maxMarks: 100 },
        { subjectName: 'Biology', maxMarks: 100 },
        { subjectName: 'English', maxMarks: 100 },
        { subjectName: 'History', maxMarks: 100 },
    ]
  },
];

export const MOCK_EXAM_SCHEDULES: ExamSchedule[] = [
  // Mid-term for Class 10
  { id: 1, examId: 1, classId: 1, subject: 'Mathematics', date: '2023-11-15', startTime: '09:00', endTime: '12:00', maxMarks: 100 },
  { id: 2, examId: 1, classId: 1, subject: 'Physics', date: '2023-11-17', startTime: '09:00', endTime: '11:00', maxMarks: 80 },
  { id: 3, examId: 1, classId: 1, subject: 'Chemistry', date: '2023-11-19', startTime: '09:00', endTime: '11:00', maxMarks: 80 },
  
  // Mid-term for Class 9
  { id: 4, examId: 1, classId: 2, subject: 'English', date: '2023-11-16', startTime: '09:00', endTime: '12:00', maxMarks: 100 },
  { id: 5, examId: 1, classId: 2, subject: 'Social Studies', date: '2023-11-18', startTime: '09:00', endTime: '11:00', maxMarks: 80 },
];

export const MOCK_EXAM_RESULTS: ExamResult[] = [
  // Results for Alice Johnson (studentId: 1) in Mid-term (examId: 1)
  { id: 1, examId: 1, studentId: 1, scheduleId: 1, marksObtained: 85, grade: 'A' },
  { id: 2, examId: 1, studentId: 1, scheduleId: 2, marksObtained: 72, grade: 'A-' },
  { id: 3, examId: 1, studentId: 1, scheduleId: 3, marksObtained: 68, grade: 'B+' },

  // Results for Bob Smith (studentId: 2) in Mid-term (examId: 1)
  { id: 4, examId: 1, studentId: 2, scheduleId: 1, marksObtained: 92, grade: 'A+' },
  { id: 5, examId: 1, studentId: 2, scheduleId: 2, marksObtained: 75, grade: 'A' },
  { id: 6, examId: 1, studentId: 2, scheduleId: 3, marksObtained: 78, grade: 'A' },
];