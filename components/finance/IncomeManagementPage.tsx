import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import api from '../../services/api';
import { Income } from '../../types';
import IncomeModal from './IncomeModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import { toastService } from '../../utils/toastService';

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const IncomeManagementPage: React.FC = () => {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);
    const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await api.getData('income');
        setIncomes(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (incomeData: Omit<Income, 'id'>) => {
        const currentData = await api.getData('income');
        let updatedData;
        if (editingIncome) {
            updatedData = currentData.map((i: Income) => i.id === editingIncome.id ? { ...editingIncome, ...incomeData } : i);
            toastService.show('Income record updated successfully!');
        } else {
            const newIncome: Income = {
                id: Math.max(0, ...currentData.map((i: Income) => i.id)) + 1,
                ...incomeData,
            };
            updatedData = [newIncome, ...currentData];
            toastService.show('Income record added successfully!');
        }
        await api.setData('income', updatedData);
        await fetchData();
        closeModals();
    };
    
    const confirmDelete = async () => {
        if (incomeToDelete) {
            const currentData = await api.getData('income');
            const updatedData = currentData.filter((i: Income) => i.id !== incomeToDelete.id);
            await api.setData('income', updatedData);
            await fetchData();
            setIncomeToDelete(null);
            toastService.show('Income record deleted successfully!');
        }
    };

    const closeModals = () => {
        setIsModalOpen(false);
        setEditingIncome(null);
    };

    return (
        <div>
            <Link to="/finance" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Finance
            </Link>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Income Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track all non-fee related school income.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700">
                    Add Income
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    {isLoading ? <p>Loading...</p> : (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Source</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map((income) => (
                                <tr key={income.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{income.date}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{income.source}</td>
                                    <td className="px-6 py-4">${income.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setEditingIncome(income)} className="text-primary-600 hover:text-primary-800 mr-4"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => setIncomeToDelete(income)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </Card>

            {(isModalOpen || editingIncome) && (
                <IncomeModal 
                    isOpen={isModalOpen || !!editingIncome}
                    onClose={closeModals}
                    onSave={handleSave}
                    existingIncome={editingIncome}
                />
            )}

            {incomeToDelete && (
                <ConfirmationModal
                    isOpen={!!incomeToDelete}
                    onClose={() => setIncomeToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Income Record"
                    message="Are you sure you want to delete this income record?"
                />
            )}
        </div>
    );
};

export default IncomeManagementPage;
