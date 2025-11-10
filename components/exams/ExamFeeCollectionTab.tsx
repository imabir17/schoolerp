
import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import { appState } from '../../data/appState';
import { Exam, ClassInfo, Student, Fee, FeeStatus } from '../../types';
import CollectExamFeeModal from './CollectExamFeeModal';
import { generatePdfWithBranding } from '../../utils/pdfUtils';
import AdmitCardReceipt from './AdmitCardReceipt';
import { toastService } from '../../utils/toastService';

interface StudentFeeStatus {
    student: Student;
    status: 'Paid' | 'Unpaid';
    feeRecord: Fee | null;
}

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);

const ExamFeeCollectionTab: React.FC = () => {
    const { exams, classes, students } = appState;
    const [fees, setFees] = useState<Fee[]>(appState.fees);

    const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id.toString() || '');
    const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id.toString() || '');
    const [payingStudentInfo, setPayingStudentInfo] = useState<{ student: Student; exam: Exam } | null>(null);
    const [receiptData, setReceiptData] = useState<{ student: Student, exam: Exam, fee: Fee } | null>(null);

    const studentFeeStatuses = useMemo<StudentFeeStatus[]>(() => {
        const examId = parseInt(selectedExamId);
        const classId = parseInt(selectedClassId);
        if (!examId || !classId) return [];

        const currentExam = exams.find(e => e.id === examId);
        if (!currentExam || typeof currentExam.examFee === 'undefined') return [];

        const currentClass = classes.find(c => c.id === classId);
        if (!currentClass) return [];

        const studentsInClass = students.filter(s =>
            s.class === currentClass.name.replace('Class ', '') && currentClass.sections.includes(s.section)
        );

        return studentsInClass.map(student => {
            const feeRecord = fees.find(f =>
                f.studentId === student.id && f.examId === examId && f.type === 'Exam Fee'
            );
            return {
                student,
                status: feeRecord && feeRecord.status === FeeStatus.Paid ? 'Paid' : 'Unpaid',
                feeRecord: feeRecord || null,
            };
        });
    }, [selectedExamId, selectedClassId, students, classes, exams, fees]);

    const handleConfirmPayment = (paymentData: Omit<Fee, 'id' | 'studentName' | 'status' | 'amount'>) => {
        if (!payingStudentInfo) return;

        const newFee: Fee = {
            id: Math.max(0, ...fees.map(f => f.id)) + 1,
            studentId: payingStudentInfo.student.id,
            studentName: payingStudentInfo.student.name,
            amount: payingStudentInfo.exam.examFee || 0,
            status: FeeStatus.Paid,
            ...paymentData,
        };
        const updatedFees = [...fees, newFee];
        setFees(updatedFees);
        appState.fees = updatedFees;
        setPayingStudentInfo(null);
        toastService.show(`Fee collected for ${payingStudentInfo.student.name}`);
        setReceiptData({ student: payingStudentInfo.student, exam: payingStudentInfo.exam, fee: newFee });
    };

    const getStatusBadge = (status: 'Paid' | 'Unpaid') => {
        if (status === 'Paid') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    };
    
    const handlePrintReport = () => {
        if (studentFeeStatuses.length === 0) return;

        const exam = exams.find(e => e.id === parseInt(selectedExamId));
        const classInfo = classes.find(c => c.id === parseInt(selectedClassId));

        if (!exam || !classInfo) return;

        generatePdfWithBranding(
            appState.schoolProfile,
            `Exam Fee Report: ${exam.name} - ${classInfo.name}`,
            {
                head: [['Student Name', 'Student ID', 'Status', 'Paid On']],
                body: studentFeeStatuses.map(({ student, status, feeRecord }) => [
                    student.name,
                    student.studentId,
                    status,
                    status === 'Paid' ? feeRecord?.paidDate || 'N/A' : 'N/A'
                ]),
                didParseCell: (data: any) => {
                    if (data.column.index === 2) { // Status column
                        if (data.cell.raw === 'Paid') {
                            data.cell.styles.textColor = [34, 197, 94]; // Green
                        }
                        if (data.cell.raw === 'Unpaid') {
                            data.cell.styles.textColor = [239, 68, 68]; // Red
                        }
                    }
                }
            },
            `Exam_Fee_Report_${exam.name.replace(/\s/g, '_')}_${classInfo.name.replace(/\s/g, '_')}.pdf`
        );
    };

    return (
        <Card>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold">Collect Exam Fees</h2>
                <div className="flex items-center flex-wrap space-x-2 md:space-x-4">
                    <select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="input-field">
                        {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="input-field">
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button onClick={handlePrintReport} disabled={studentFeeStatuses.length === 0} className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <PrintIcon className="w-4 h-4"/> <span>Print Report</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Student Name</th>
                            <th scope="col" className="px-6 py-3">Student ID</th>
                            <th scope="col" className="px-6 py-3">Fee Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentFeeStatuses.map(({ student, status }) => (
                            <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                                <td className="px-6 py-4">{student.studentId}</td>
                                <td className="px-6 py-4">${exams.find(e => e.id === parseInt(selectedExamId))?.examFee?.toFixed(2) || '0.00'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(status)}`}>
                                        {status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {status === 'Unpaid' ? (
                                        <button 
                                            onClick={() => setPayingStudentInfo({ student, exam: exams.find(e => e.id === parseInt(selectedExamId))! })}
                                            className="text-sm font-semibold text-primary-600 hover:underline"
                                        >
                                            Collect Fee
                                        </button>
                                    ) : (
                                        <span className="text-sm text-gray-500">Paid</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {studentFeeStatuses.length === 0 && <p className="text-center py-4 text-gray-500 dark:text-gray-400">Select an exam and class to see students.</p>}
            </div>
            {payingStudentInfo && (
                <CollectExamFeeModal
                    isOpen={!!payingStudentInfo}
                    onClose={() => setPayingStudentInfo(null)}
                    onConfirm={handleConfirmPayment}
                    student={payingStudentInfo.student}
                    exam={payingStudentInfo.exam}
                />
            )}
            {receiptData && (
                <AdmitCardReceipt
                    isOpen={!!receiptData}
                    onClose={() => setReceiptData(null)}
                    student={receiptData.student}
                    exam={receiptData.exam}
                    fee={receiptData.fee}
                />
            )}
        </Card>
    );
};

export default ExamFeeCollectionTab;
