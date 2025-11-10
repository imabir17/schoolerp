
import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Expense, 'id'>) => void;
  existingExpense: Expense | null;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, existingExpense }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: ExpenseCategory.Other,
        description: '',
        amount: '',
        notes: '',
    });

    useEffect(() => {
        if (existingExpense) {
            setFormData({
                date: existingExpense.date,
                category: existingExpense.category,
                description: existingExpense.description,
                amount: String(existingExpense.amount),
                notes: existingExpense.notes || '',
            });
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                category: ExpenseCategory.Other,
                description: '',
                amount: '',
                notes: '',
            });
        }
    }, [existingExpense, isOpen]);

    if (!isOpen) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{existingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
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
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} required className="w-full mt-1 input-field">
                                {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Reason</label>
                            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="w-full mt-1 input-field" placeholder="e.g., Monthly electricity bill" />
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

export default ExpenseModal;
