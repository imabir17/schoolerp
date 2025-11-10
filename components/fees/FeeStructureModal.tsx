
import React, { useState, useEffect } from 'react';
import { FeeStructure } from '../../types';

interface FeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<FeeStructure, 'id'>) => void;
  existingStructure: FeeStructure | null;
}

const FeeStructureModal: React.FC<FeeStructureModalProps> = ({ isOpen, onClose, onSave, existingStructure }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (existingStructure) {
            setName(existingStructure.name);
            setDescription(existingStructure.description);
            setAmount(String(existingStructure.amount));
        } else {
            setName('');
            setDescription('');
            setAmount('');
        }
    }, [existingStructure, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount) return;
        onSave({ name, description, amount: parseFloat(amount) });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {existingStructure ? 'Edit Fee Type' : 'Create New Fee Type'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="feeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fee Name</label>
                            <input 
                                type="text" 
                                id="feeName" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                placeholder="e.g., Tuition Fee"
                            />
                        </div>
                         <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                            <input 
                                type="number" 
                                id="amount" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                required 
                                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                placeholder="e.g., 400"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                            <textarea 
                                id="description" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={3}
                                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                placeholder="e.g., Monthly fee for academic classes"
                            />
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

export default FeeStructureModal;
