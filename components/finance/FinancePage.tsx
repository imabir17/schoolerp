
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const SalaryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const ExpenseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const IncomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const ReportsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

const FinancePage: React.FC = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Finance Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage salaries, expenses, income, and view financial reports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                <Link to="/finance/salary" className="block transform hover:-translate-y-1 transition-transform duration-300">
                    <Card className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl">
                        <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                            <SalaryIcon className="w-10 h-10 text-primary-600 dark:text-primary-400"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Salary Management</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Process and track staff salary payments.</p>
                    </Card>
                </Link>
                
                <Link to="/finance/expenses" className="block transform hover:-translate-y-1 transition-transform duration-300">
                    <Card className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl">
                        <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
                            <ExpenseIcon className="w-10 h-10 text-red-600 dark:text-red-400 rotate-180"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Expense Management</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Record and categorize all school expenses.</p>
                    </Card>
                </Link>

                <Link to="/finance/income" className="block transform hover:-translate-y-1 transition-transform duration-300">
                    <Card className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl">
                        <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                            <IncomeIcon className="w-10 h-10 text-green-600 dark:text-green-400"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Income Management</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Record all non-fee related income.</p>
                    </Card>
                </Link>
                
                <Link to="/finance/reports" className="block transform hover:-translate-y-1 transition-transform duration-300">
                    <Card className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl">
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-4">
                            <ReportsIcon className="w-10 h-10 text-yellow-600 dark:text-yellow-400"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Financial Reports</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Generate detailed financial summaries.</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default FinancePage;
