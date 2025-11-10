
import React, { useState, useEffect, useMemo } from 'react';
import { Staff, SalaryPayment } from '../../types';

interface PaySalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: Omit<SalaryPayment, 'id' | 'staffName'>) => void;
  staff: Staff | null;
}

const PaySalaryModal: React.FC<PaySalaryModalProps> = ({ isOpen, onClose, onConfirm, staff }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [bonusAmount, setBonusAmount] = useState('');
    const [bonusReason, setBonusReason] = useState('');
    const [deductionAmount, setDeductionAmount] = useState('');
    const [deductionReason, setDeductionReason] = useState('');
    const [notes, setNotes] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
            setMonth(currentMonthName);
            setYear(new Date().getFullYear());
            setBonusAmount('');
            setBonusReason('');
            setDeductionAmount('');
            setDeductionReason('');
            setNotes('');
        }
    }, [isOpen]);

    const finalAmount = useMemo(() => {
        if (!staff) return 0;
        const bonus = parseFloat(bonusAmount) || 0;
        const deduction = parseFloat(deductionAmount) || 0;
        return staff.basicSalary + bonus - deduction;
    }, [staff, bonusAmount, deductionAmount]);

    if (!isOpen || !staff) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            staffId: staff.id,
            basicSalary: staff.basicSalary,
            bonusAmount: parseFloat(bonusAmount) || undefined,
            bonusReason: bonusReason || undefined,
            deductionAmount: parseFloat(deductionAmount) || undefined,
            deductionReason: deductionReason || undefined,
            finalAmount,
            month,
            year,
            paymentDate: new Date().toISOString().split('T')[0],
            notes,
        });
    };
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pay Salary</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Confirm payment for <span className="font-semibold">{staff.name}</span></p>
                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Basic Salary</label>
                            <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md font-semibold text-gray-900 dark:text-white">
                                ${staff.basicSalary.toFixed(2)}
                            </div>
                        </div>
                         <div>
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">For Month</label>
                            <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} required className="w-full mt-1 input-field">
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="bonusAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bonus ($)</label>
                                <input type="number" id="bonusAmount" value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} className="w-full mt-1 input-field" placeholder="e.g., 200" />
                            </div>
                             <div>
                                <label htmlFor="bonusReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bonus Reason</label>
                                <input type="text" id="bonusReason" value={bonusReason} onChange={e => setBonusReason(e.target.value)} className="w-full mt-1 input-field" placeholder="e.g., Performance" />
                            </div>
                        </div>
                    </div>
                     <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="deductionAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deduction ($)</label>
                                <input type="number" id="deductionAmount" value={deductionAmount} onChange={e => setDeductionAmount(e.target.value)} className="w-full mt-1 input-field" placeholder="e.g., 50" />
                            </div>
                            <div>
                                <label htmlFor="deductionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deduction Reason</label>
                                <input type="text" id="deductionReason" value={deductionReason} onChange={e => setDeductionReason(e.target.value)} className="w-full mt-1 input-field" placeholder="e.g., Unpaid leave" />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Final Payable Amount</label>
                        <div className="mt-1 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-md font-bold text-2xl text-blue-800 dark:text-blue-300 text-center">
                            ${finalAmount.toFixed(2)}
                        </div>
                    </div>

                    <div className="flex justify-end mt-8 space-x-3 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">Confirm Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaySalaryModal;
