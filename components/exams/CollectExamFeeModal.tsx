import React, { useState } from 'react';
import { Student, Exam, Fee } from '../../types';

interface CollectExamFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: Omit<Fee, 'id' | 'studentName' | 'status' | 'amount'>) => void;
  student: Student;
  exam: Exam;
}

const CollectExamFeeModal: React.FC<CollectExamFeeModalProps> = ({ isOpen, onClose, onConfirm, student, exam }) => {
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank' | 'Card'>('Cash');
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            studentId: student.id,
            type: 'Exam Fee',
            examId: exam.id,
            dueDate: exam.startDate,
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod,
            notes,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Collect Exam Fee</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">For <span className="font-semibold">{student.name}</span></p>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Exam:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{exam.name}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fee Amount:</span>
                        <span className="font-bold text-xl text-primary-600 dark:text-primary-400">${exam.examFee?.toFixed(2)}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                            <select 
                                id="paymentMethod" 
                                value={paymentMethod} 
                                onChange={(e) => setPaymentMethod(e.target.value as 'Cash' | 'Bank' | 'Card')}
                                className="w-full mt-1 input-field"
                            >
                                <option>Cash</option>
                                <option>Bank</option>
                                <option>Card</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                className="w-full mt-1 input-field"
                                placeholder="e.g., Paid by guardian"
                            />
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

export default CollectExamFeeModal;