
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { MOCK_FEES, MOCK_STUDENTS, MOCK_CLASSES } from '../../data/mockData';
import { Fee, FeeStatus, Student, ClassInfo } from '../../types';

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const FeeRecordsPage: React.FC = () => {
    const [fees] = useState<Fee[]>(MOCK_FEES);
    const [students] = useState<Student[]>(MOCK_STUDENTS);
    const [classes] = useState<ClassInfo[]>(MOCK_CLASSES);
    
    const [filters, setFilters] = useState({
        status: 'All',
        classId: 'All',
        startDate: '',
        endDate: '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const getStatusBadge = (status: FeeStatus) => {
        switch (status) {
            case FeeStatus.Paid: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case FeeStatus.Unpaid: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case FeeStatus.Due: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const filteredFees = useMemo(() => {
        let tempFees = [...fees];

        if (filters.status !== 'All') {
            tempFees = tempFees.filter(fee => fee.status === filters.status);
        }
        
        if (filters.classId !== 'All') {
            const classInfo = classes.find(c => c.id === parseInt(filters.classId, 10));
            if (classInfo) {
                const className = classInfo.name.replace('Class ', '');
                const studentIdsInClass = new Set(students.filter(s => s.class === className).map(s => s.id));
                tempFees = tempFees.filter(fee => studentIdsInClass.has(fee.studentId));
            }
        }
        
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            tempFees = tempFees.filter(fee => fee.paidDate && new Date(fee.paidDate) >= startDate);
        }
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            tempFees = tempFees.filter(fee => fee.paidDate && new Date(fee.paidDate) <= endDate);
        }

        return tempFees;
    }, [fees, students, classes, filters]);


    return (
        <div>
            <Link to="/fees" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Fee Management
            </Link>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Fee Transaction Records</h1>
                <p className="text-gray-600 dark:text-gray-400">View and filter all past fee records.</p>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select name="status" id="status" value={filters.status} onChange={handleFilterChange} className="mt-1 w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option>All</option>
                            {Object.values(FeeStatus).map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="classId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class</label>
                        <select name="classId" id="classId" value={filters.classId} onChange={handleFilterChange} className="mt-1 w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="All">All Classes</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date (Paid)</label>
                        <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date (Paid)</label>
                        <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Fee Type</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Month</th>
                                <th scope="col" className="px-6 py-3">Due Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Paid Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFees.map((fee) => (
                                <tr key={fee.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{fee.studentName}</td>
                                    <td className="px-6 py-4">{fee.type}</td>
                                    <td className="px-6 py-4">${fee.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{fee.month}</td>
                                    <td className="px-6 py-4">{fee.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(fee.status)}`}>
                                            {fee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{fee.paidDate || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredFees.length === 0 && (
                        <p className="text-center py-8 text-gray-500 dark:text-gray-400">No records match the current filters.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default FeeRecordsPage;