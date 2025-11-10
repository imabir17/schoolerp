import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import api from '../../services/api';
import { appState } from '../../data/appState';
import { Staff, SalaryPayment } from '../../types';
import PaySalaryModal from './PaySalaryModal';
import { toastService } from '../../utils/toastService';

declare global {
  interface Window {
    jspdf: any;
  }
}

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const SalaryManagementPage: React.FC = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const [staffData, paymentsData] = await Promise.all([
            api.getData('staff'),
            api.getData('salaryPayments'),
        ]);
        setStaffList(staffData);
        setSalaryPayments(paymentsData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const generatePayslip = (payment: SalaryPayment) => {
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        const staff = staffList.find(s => s.id === payment.staffId);
        if (!staff) return;

        // Add Header
        if (appState.schoolProfile.logoUrl) {
            doc.addImage(appState.schoolProfile.logoUrl, 'PNG', 14, 14, 20, 20);
        }
        doc.setFontSize(22).setFont('helvetica', 'bold').text(appState.schoolProfile.name, 105, 22, { align: 'center' });
        doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(100).text(appState.schoolProfile.address, 105, 29, { align: 'center' });

        doc.setFontSize(18);
        doc.text('Payslip', 105, 50, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`For the month of ${payment.month}, ${payment.year}`, 105, 58, { align: 'center' });
        
        doc.line(14, 65, 196, 65);

        doc.text(`Staff Name: ${payment.staffName}`, 14, 75);
        doc.text(`Staff ID: ${staff.staffId}`, 14, 81);
        doc.text(`Role: ${staff.role}`, 14, 87);
        doc.text(`Payment Date: ${payment.paymentDate}`, 14, 93);

        (doc as any).autoTable({
            startY: 100,
            head: [['Description', 'Amount']],
            body: [
                ['Basic Salary', `$${payment.basicSalary.toFixed(2)}`],
                ...(payment.bonusAmount ? [[`Bonus: ${payment.bonusReason}`, `$${payment.bonusAmount.toFixed(2)}`]] : []),
            ],
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] }, // Green
            columnStyles: { 1: { halign: 'right' } },
        });

        let finalY = (doc as any).lastAutoTable.finalY;

        if (payment.deductionAmount) {
            (doc as any).autoTable({
                startY: finalY + 5,
                head: [['Deductions', 'Amount']],
                body: [
                    [`${payment.deductionReason}`, `-$${payment.deductionAmount.toFixed(2)}`],
                ],
                theme: 'striped',
                headStyles: { fillColor: [220, 38, 38] }, // Red
                columnStyles: { 1: { halign: 'right' } },
            });
            finalY = (doc as any).lastAutoTable.finalY;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Net Salary Paid: $${payment.finalAmount.toFixed(2)}`, 196, finalY + 15, { align: 'right' });

        doc.save(`Payslip_${payment.staffName.replace(/\s/g, '_')}_${payment.month}${payment.year}.pdf`);
    };
    
    const handlePaySalary = async (paymentData: Omit<SalaryPayment, 'id' | 'staffName'>) => {
        const currentPayments = await api.getData('salaryPayments');
        const newPayment: SalaryPayment = {
            id: Math.max(0, ...currentPayments.map((p: SalaryPayment) => p.id)) + 1,
            staffName: staffList.find(s => s.id === paymentData.staffId)?.name || 'N/A',
            ...paymentData,
        };
        
        await api.setData('salaryPayments', [newPayment, ...currentPayments]);
        await fetchData();
        setSelectedStaff(null);
        toastService.show(`Salary paid to ${newPayment.staffName} successfully!`);
        generatePayslip(newPayment);
    };

    return (
        <div>
            <Link to="/finance" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Finance
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Salary Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Pay Staff Salaries</h2>
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {isLoading ? <p>Loading...</p> : (
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Staff Name</th>
                                    <th scope="col" className="px-6 py-3">Basic Salary</th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map(staff => (
                                    <tr key={staff.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{staff.name}</td>
                                        <td className="px-6 py-4">${staff.basicSalary.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedStaff(staff)}
                                                className="bg-primary-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-primary-700"
                                            >
                                                Pay Salary
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                </Card>
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Salary Payment History</h2>
                     <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {isLoading ? <p>Loading...</p> : (
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Staff Name</th>
                                    <th scope="col" className="px-6 py-3">Amount Paid</th>
                                    <th scope="col" className="px-6 py-3">Period</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaryPayments.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).map(payment => (
                                    <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{payment.staffName}</td>
                                        <td className="px-6 py-4">${payment.finalAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-xs">{payment.month}, {payment.year}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => generatePayslip(payment)} className="text-primary-600 hover:text-primary-800" title="Download Payslip">
                                                <DownloadIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                </Card>
            </div>
            {selectedStaff && (
                <PaySalaryModal
                    isOpen={!!selectedStaff}
                    onClose={() => setSelectedStaff(null)}
                    onConfirm={handlePaySalary}
                    staff={selectedStaff}
                />
            )}
        </div>
    );
};

export default SalaryManagementPage;
