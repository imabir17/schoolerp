
import React, { useState, useEffect } from 'react';
import { Income } from '../../types';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Income, 'id'>) => void;
  existingIncome: Income | null;
}

const IncomeModal: React.FC<IncomeModalProps> = ({ isOpen, onClose, onSave, existingIncome }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        source: '',
        amount: '',
        notes: '',
    });

    useEffect(() => {
        if (existingIncome) {
            setFormData({
                date: existingIncome.date,
                source: existingIncome.source,
                amount: String(existingIncome.amount),
                notes: existingIncome.notes || '',
            });
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                source: '',
                amount: '',
                notes: '',
            });
        }
    }, [existingIncome, isOpen]);

    if (!isOpen) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            amount: parseFloat(formData.amount),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{existingIncome ? 'Edit Income' : 'Add New Income'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                                <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="w-full mt-1 input-field" />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                                <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} required className="w-full mt-1 input-field" placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source of Income</label>
                            <input type="text" name="source" id="source" value={formData.source} onChange={handleChange} required className="w-full mt-1 input-field" placeholder="e.g., Annual Fundraiser" />
                        </div>
                         <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                            <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full mt-1 input-field" placeholder="Add any extra details..."></textarea>
                        </div>
                    </div>
                     <div className="flex justify-end mt-8 space-x-3 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IncomeModal;
