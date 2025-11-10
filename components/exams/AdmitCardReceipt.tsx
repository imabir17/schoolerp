import React from 'react';
import { Student, Exam, Fee } from '../../types';
import { appState } from '../../data/appState';

declare global {
  interface Window {
    jspdf: any;
  }
}

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

interface AdmitCardReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  exam: Exam;
  fee: Fee;
}

const AdmitCardReceipt: React.FC<AdmitCardReceiptProps> = ({ isOpen, onClose, student, exam, fee }) => {
    if (!isOpen) return null;

    const generatePdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // --- Header ---
        if (appState.schoolProfile.logoUrl) {
            doc.addImage(appState.schoolProfile.logoUrl, 'PNG', 14, 14, 25, 25);
        }
        doc.setFontSize(24).setFont('helvetica', 'bold').text(appState.schoolProfile.name, 105, 22, { align: 'center' });
        doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(100).text(appState.schoolProfile.address, 105, 29, { align: 'center' });
        
        // --- Title ---
        doc.setFontSize(16).setFont('helvetica', 'bold').text('Admit Card & Fee Receipt', 105, 50, { align: 'center' });
        doc.setFontSize(12).text(exam.name, 105, 57, { align: 'center' });

        // --- Student Photo ---
        try {
            const img = new Image();
            img.src = student.avatarUrl;
            img.onload = () => {
                doc.addImage(img, 'JPEG', 155, 65, 40, 40);
            };
        } catch(e) {
            console.error("Could not add student photo", e);
        }
        
        // --- Student Details ---
        doc.setFontSize(11).setFont('helvetica', 'bold');
        doc.text('Student Name:', 14, 70);
        doc.text('Student ID:', 14, 78);
        doc.text('Class:', 14, 86);
        doc.text('Roll No:', 14, 94);
        
        doc.setFont('helvetica', 'normal');
        doc.text(student.name, 50, 70);
        doc.text(student.studentId, 50, 78);
        doc.text(`${student.class} - ${student.section}`, 50, 86);
        doc.text(String(student.classRoll), 50, 94);

        // --- Payment Details ---
        doc.line(14, 115, 196, 115);
        doc.setFontSize(14).setFont('helvetica', 'bold').text('Payment Confirmation', 14, 123);
        
        doc.setFontSize(11).setFont('helvetica', 'bold');
        doc.text('Fee Paid:', 14, 132);
        doc.text('Transaction ID:', 14, 140);
        doc.text('Payment Date:', 14, 148);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`$${fee.amount.toFixed(2)}`, 50, 132);
        doc.text(`TRX-${fee.id}-${student.id}`, 50, 140);
        doc.text(fee.paidDate || 'N/A', 50, 148);
        
        doc.setFontSize(14).setFont('helvetica', 'bold').setTextColor(34, 197, 94).text('PAID', 196, 132, { align: 'right' });
        doc.setTextColor(0);

        // --- Footer/Instructions ---
        doc.line(14, 180, 196, 180);
        doc.setFontSize(10).setFont('helvetica', 'italic');
        doc.text('Instructions: Please bring this admit card to the examination hall. Digital copies are not permitted.', 14, 188);
        
        doc.save(`Admit_Card_${student.name.replace(' ', '_')}.pdf`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="text-center mb-4">
                        {appState.schoolProfile.logoUrl && <img src={appState.schoolProfile.logoUrl} alt="School Logo" className="w-20 h-20 mx-auto mb-2 object-contain"/>}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{appState.schoolProfile.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{appState.schoolProfile.address}</p>
                    </div>

                    <div className="text-center my-6">
                        <h3 className="text-xl font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-200">Admit Card & Fee Receipt</h3>
                        <p className="text-gray-600 dark:text-gray-400">{exam.name}</p>
                    </div>

                    <div className="flex justify-between items-start p-4 border rounded-lg dark:border-gray-700">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Student Name</p>
                            <p className="font-semibold text-lg text-gray-900 dark:text-white">{student.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Student ID</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{student.studentId}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Class</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{student.class} - {student.section}</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Roll No.</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{student.classRoll}</p>
                        </div>
                        <img src={student.avatarUrl} alt={student.name} className="w-28 h-28 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"/>
                    </div>

                    <div className="mt-4 p-4 border rounded-lg dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
                         <h4 className="font-semibold text-green-800 dark:text-green-300">Payment Confirmed</h4>
                         <div className="flex justify-between items-baseline mt-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">Fee Paid: <span className="font-bold text-xl">${fee.amount.toFixed(2)}</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Paid on: {fee.paidDate}</p>
                         </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Close</button>
                    <button type="button" onClick={generatePdf} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                        <DownloadIcon className="w-4 h-4" />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdmitCardReceipt;
