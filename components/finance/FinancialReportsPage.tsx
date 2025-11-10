import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { appState } from '../../data/appState';
import { Income, Expense, SalaryPayment, Fee, FeeStatus } from '../../types';
import { generatePdfWithBranding } from '../../utils/pdfUtils';

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

const FinancialReportsPage: React.FC = () => {
    const { income, expenses, salaryPayments, fees } = appState;

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const setDateRange = (period: 'day' | 'week' | 'month') => {
        const end = new Date();
        const start = new Date();
        if (period === 'day') {
            // No change needed for start, it's today
        } else if (period === 'week') {
            start.setDate(end.getDate() - 7);
        } else if (period === 'month') {
            start.setMonth(end.getMonth() - 1);
        }
        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    const { filteredIncomes, filteredFees, filteredExpenses, filteredSalaries, totalIncome, totalExpense, netBalance } = useMemo(() => {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (end) end.setHours(23, 59, 59, 999); // Include entire end day

        const filterByDate = (item: { date: string } | { paymentDate: string } | { paidDate?: string }) => {
            const itemDateStr = 'date' in item ? item.date : 'paymentDate' in item ? item.paymentDate : item.paidDate;
            if (!itemDateStr) return false;
            const itemDate = new Date(itemDateStr);
            if (start && end) return itemDate >= start && itemDate <= end;
            if (start) return itemDate >= start;
            if (end) return itemDate <= end;
            return true;
        };
        
        const feesPaidInRange = fees.filter(f => f.status === FeeStatus.Paid && f.paidDate && filterByDate({paidDate: f.paidDate}));
        const feeIncome = feesPaidInRange.reduce((sum, f) => sum + f.amount, 0);
        
        const otherIncomes = income.filter(filterByDate);
        const totalOtherIncome = otherIncomes.reduce((sum, i) => sum + i.amount, 0);
        const totalIncome = feeIncome + totalOtherIncome;

        const filteredExpenses = expenses.filter(filterByDate);
        const filteredSalaries = salaryPayments.filter(filterByDate);

        const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalSalary = filteredSalaries.reduce((sum, s) => sum + s.finalAmount, 0);
        const totalOutflow = totalExpenseAmount + totalSalary;

        return {
            filteredIncomes: otherIncomes,
            filteredFees: feesPaidInRange,
            filteredExpenses,
            filteredSalaries,
            totalIncome,
            totalExpense: totalOutflow,
            netBalance: totalIncome - totalOutflow,
        };
    }, [income, expenses, salaryPayments, fees, startDate, endDate]);
    
     const generatePdf = () => {
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        
        // Custom generation; `generatePdfWithBranding` is too simple for this layout.
        // Add Header
        if (appState.schoolProfile.logoUrl) {
            doc.addImage(appState.schoolProfile.logoUrl, 'PNG', 14, 14, 20, 20);
        }
        doc.setFontSize(22).setFont('helvetica', 'bold').text(appState.schoolProfile.name, 105, 22, { align: 'center' });
        doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(100).text(appState.schoolProfile.address, 105, 29, { align: 'center' });
        
        doc.setFontSize(18);
        doc.text('Financial Report', 105, 50, { align: 'center' });
        doc.setFontSize(11);
        doc.text(`Period: ${startDate || 'Start'} to ${endDate || 'End'}`, 105, 58, { align: 'center' });

        doc.setFontSize(14);
        doc.text('Summary', 14, 75);
        doc.setFontSize(11);
        doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, 82);
        doc.text(`Total Expenses & Salaries: $${totalExpense.toFixed(2)}`, 14, 88);
        doc.setFont('helvetica', 'bold');
        doc.text(`Net Balance: $${netBalance.toFixed(2)}`, 14, 94);
        
        let startY = 105;

        if (filteredFees.length > 0 || filteredIncomes.length > 0) {
            (doc as any).autoTable({
                startY,
                head: [['Date', 'Income Source / Student', 'Type', 'Amount']],
                body: [
                    ...filteredFees.map(f => [f.paidDate, f.studentName, f.type, `$${f.amount.toFixed(2)}`]),
                    ...filteredIncomes.map(i => [i.date, i.source, 'Other Income', `$${i.amount.toFixed(2)}`]),
                ],
                didDrawPage: (data: any) => { startY = data.cursor.y + 10; },
                headStyles: { fillColor: [34, 197, 94] }, // Green
                tableWidth: 'auto',
                columnStyles: { 3: { halign: 'right' } }
            });
             startY = (doc as any).lastAutoTable.finalY;
        }
        
        if (filteredExpenses.length > 0 || filteredSalaries.length > 0) {
             (doc as any).autoTable({
                startY: startY + 10,
                head: [['Date', 'Details', 'Category', 'Amount']],
                body: [
                    ...filteredSalaries.map(s => [s.paymentDate, `Salary for ${s.staffName} (${s.month} ${s.year})`, 'Salary', `$${s.finalAmount.toFixed(2)}`]),
                    ...filteredExpenses.map(e => [e.date, e.description, e.category, `$${e.amount.toFixed(2)}`]),
                ],
                headStyles: { fillColor: [239, 68, 68] }, // Red
                tableWidth: 'auto',
                columnStyles: { 3: { halign: 'right' } }
            });
        }

        doc.save(`Financial_Report_${startDate}_to_${endDate}.pdf`);
    };

    return (
        <div>
            <Link to="/finance" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Finance
            </Link>
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>
                    <p className="text-gray-600 dark:text-gray-400">View and download financial summaries.</p>
                </div>
                <button onClick={generatePdf} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center space-x-2">
                    <DownloadIcon className="w-5 h-5"/>
                    <span>Download PDF</span>
                </button>
            </div>
            
            <Card className="mb-8">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                        <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 input-field"/>
                    </div>
                     <div>
                        <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                        <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 input-field"/>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => setDateRange('day')} className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Today</button>
                        <button onClick={() => setDateRange('week')} className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">This Week</button>
                        <button onClick={() => setDateRange('month')} className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">This Month</button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center bg-green-50 dark:bg-green-900/30">
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Total Income</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">${totalIncome.toFixed(2)}</p>
                </Card>
                 <Card className="text-center bg-red-50 dark:bg-red-900/30">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Total Expenses</h3>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">${totalExpense.toFixed(2)}</p>
                </Card>
                 <Card className={`text-center ${netBalance >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                    <h3 className={`text-lg font-medium ${netBalance >= 0 ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'}`}>Net Balance</h3>
                    <p className={`text-3xl font-bold mt-2 ${netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>${netBalance.toFixed(2)}</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Income & Fees</h2>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Source/Student</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...filteredFees, ...filteredIncomes].sort((a,b) => {
                                    // FIX: Use a type guard to correctly access date properties.
                                    const dateA = 'studentName' in a ? a.paidDate! : a.date;
                                    const dateB = 'studentName' in b ? b.paidDate! : b.date;
                                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                                }).map((item, idx) => (
                                    <tr key={idx} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{'studentName' in item ? item.paidDate : item.date}</td>
                                        <td className="px-4 py-2 font-medium">{'studentName' in item ? item.studentName : item.source}</td>
                                        <td className="px-4 py-2 text-right text-green-600 dark:text-green-400">+${item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(filteredFees.length === 0 && filteredIncomes.length === 0) && <p className="text-center py-4 text-gray-500">No income recorded in this period.</p>}
                    </div>
                </Card>
                 <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Expenses & Salaries</h2>
                     <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Details</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...filteredExpenses, ...filteredSalaries].sort((a,b) => {
                                    const dateA = 'paymentDate' in a ? a.paymentDate : a.date;
                                    const dateB = 'paymentDate' in b ? b.paymentDate : b.date;
                                    return new Date(dateB).getTime() - new Date(dateA).getTime()
                                }).map((item, idx) => (
                                    <tr key={idx} className="border-b dark:border-gray-700">
                                        <td className="px-4 py-2">{'paymentDate' in item ? item.paymentDate : item.date}</td>
                                        <td className="px-4 py-2 font-medium">{'staffName' in item ? `Salary: ${item.staffName}` : item.description}</td>
                                        <td className="px-4 py-2 text-right text-red-600 dark:text-red-400">-${'finalAmount' in item ? item.finalAmount.toFixed(2) : item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {(filteredExpenses.length === 0 && filteredSalaries.length === 0) && <p className="text-center py-4 text-gray-500">No expenses recorded in this period.</p>}
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default FinancialReportsPage;
