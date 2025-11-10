import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import api from '../../services/api';
import { Expense } from '../../types';
import ExpenseModal from './ExpenseModal';
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

const ExpenseManagementPage: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await api.getData('expenses');
        setExpenses(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (expenseData: Omit<Expense, 'id'>) => {
        const currentData = await api.getData('expenses');
        let updatedData;
        if (editingExpense) {
            updatedData = currentData.map((e: Expense) => e.id === editingExpense.id ? { ...editingExpense, ...expenseData } : e);
            toastService.show('Expense updated successfully!');
        } else {
            const newExpense: Expense = {
                id: Math.max(0, ...currentData.map((e: Expense) => e.id)) + 1,
                ...expenseData,
            };
            updatedData = [newExpense, ...currentData];
            toastService.show('Expense added successfully!');
        }
        await api.setData('expenses', updatedData);
        await fetchData();
        closeModals();
    };
    
    const confirmDelete = async () => {
        if (expenseToDelete) {
            const currentData = await api.getData('expenses');
            const updatedData = currentData.filter((e: Expense) => e.id !== expenseToDelete.id);
            await api.setData('expenses', updatedData);
            await fetchData();
            setExpenseToDelete(null);
            toastService.show('Expense deleted successfully!');
        }
    };

    const closeModals = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
    };

    return (
        <div>
            <Link to="/finance" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Finance
            </Link>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expense Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Track and manage all school expenses.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700">
                    Add Expense
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    {isLoading ? <p>Loading...</p> : (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{expense.date}</td>
                                    <td className="px-6 py-4">{expense.category}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{expense.description}</td>
                                    <td className="px-6 py-4">${expense.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setEditingExpense(expense)} className="text-primary-600 hover:text-primary-800 mr-4"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => setExpenseToDelete(expense)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </Card>

            {(isModalOpen || editingExpense) && (
                <ExpenseModal 
                    isOpen={isModalOpen || !!editingExpense}
                    onClose={closeModals}
                    onSave={handleSave}
                    existingExpense={editingExpense}
                />
            )}

            {expenseToDelete && (
                <ConfirmationModal
                    isOpen={!!expenseToDelete}
                    onClose={() => setExpenseToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Expense"
                    message="Are you sure you want to delete this expense record?"
                />
            )}
        </div>
    );
};

export default ExpenseManagementPage;
