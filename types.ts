export enum UserRole {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student',
  Parent = 'Parent',
}

export interface Student {
  id: number;
  studentId: string;
  name: string;
  class: string;
  section: string;
  classRoll: number;
  guardianName: string;
  guardianPhone: string;
  parentName: string;
  parentPhone: string;
  dob: string;
  address: string;
  avatarUrl: string;
  birthCertificateNo: string;
  monthlyScholarship: number;
}

export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
  Late = 'Late',
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  class: string;
  section: string;
}

export enum FeeStatus {
  Paid = 'Paid',
  Unpaid = 'Unpaid',
  Due = 'Due'
}

export interface Fee {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  month?: string;
  status: FeeStatus;
  paidDate?: string;
  dueDate: string;
  type: string;
  examId?: number;
  paymentMethod?: 'Cash' | 'Bank' | 'Card';
  notes?: string;
}

export interface School {
  id: number;
  name: string;
  address: string;
  phone: string;
  schoolId: string;
  password?: string;
}

export interface Teacher {
  id: number;
  name: string;
}

export interface ClassInfo {
  id: number;
  name: string; // e.g., "Class 10"
  sections: string[]; // e.g., ["A", "B"]
  teacherId: number;
  teacherName: string;
  studentCount: number;
  tuitionFee: number;
}

export enum StaffRole {
  Teacher = 'Teacher',
  HeadTeacher = 'Head Teacher',
  Accountant = 'Accountant',
  Cleaner = 'Cleaner',
  Watchman = 'Watchman',
  Admin = 'Admin'
}

export interface Staff {
  id: number;
  staffId: string;
  name: string;
  nid: string; // National Identification Number
  role: StaffRole;
  basicSalary: number;
  avatarUrl: string;
}

export enum StaffAttendanceStatus {
    Present = 'Present',
    Absent = 'Absent',
    OnLeave = 'On Leave',
}
  
export interface StaffAttendanceRecord {
    id: number;
    staffId: number;
    staffName: string;
    date: string;
    status: StaffAttendanceStatus;
}

export interface FeeStructure {
  id: number;
  name: string;
  description: string;
  amount: number;
}

export enum ExpenseCategory {
  Utilities = 'Utilities',
  Supplies = 'Office Supplies',
  Maintenance = 'Maintenance & Repairs',
  Marketing = 'Marketing',
  Other = 'Other',
}

export interface Expense {
  id: number;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  notes?: string;
}

export interface Income {
  id: number;
  date: string;
  source: string; // e.g., "Fundraiser", "Donation", "Asset Sale"
  amount: number;
  notes?: string;
}

export interface SalaryPayment {
  id: number;
  staffId: number;
  staffName: string;
  month: string;
  year: number;
  basicSalary: number;
  bonusAmount?: number;
  bonusReason?: string;
  deductionAmount?: number;
  deductionReason?: string;
  finalAmount: number;
  paymentDate: string;
  notes?: string;
}

export interface ExamSubject {
  subjectName: string;
  maxMarks: number;
}

export interface Exam {
  id: number;
  name: string; // e.g., "Mid-term Exam", "Final Exam"
  academicYear: string; // e.g., "2023-2024"
  startDate: string;
  endDate: string;
  examFee?: number;
  subjects: ExamSubject[];
}

export interface ExamSchedule {
  id: number;
  examId: number;
  classId: number;
  subject: string;
  date: string;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  maxMarks: number;
}

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  scheduleId: number; // Links to the specific subject/exam in the schedule
  marksObtained: number;
  grade?: string; // e.g., "A+", "B", "F"
  comments?: string;
}

export interface SchoolProfile {
  name: string;
  address: string;
  logoUrl: string | null;
}

export interface AcademicSession {
  id: number;
  name: string; // e.g., "2023-2024"
  startDate: string;
  endDate: string;
  isActive: boolean;
}