
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../ui/Card';
import { appState } from '../../data/appState';
import { Staff, StaffAttendanceRecord, StaffAttendanceStatus } from '../../types';
import CreateStaffModal from './CreateStaffModal';
import EditStaffModal from './EditStaffModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import StaffAttendanceHistoryModal from './StaffAttendanceHistoryModal';
import { toastService } from '../../utils/toastService';
import { generatePdfWithBranding } from '../../utils/pdfUtils';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);

const StaffManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('list');
    
    // Staff List State
    const [staffList, setStaffList] = useState<Staff[]>(appState.staff);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

    // Attendance State
    const [allAttendance, setAllAttendance] = useState<StaffAttendanceRecord[]>(appState.staffAttendance);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyAttendance, setDailyAttendance] = useState<StaffAttendanceRecord[]>([]);

    // History State
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [viewingHistoryFor, setViewingHistoryFor] = useState<Staff | null>(null);

    useEffect(() => {
        const recordsForDate = staffList.map(staff => {
            const existingRecord = allAttendance.find(r => r.staffId === staff.id && r.date === attendanceDate);
            if (existingRecord) return existingRecord;
            return {
                id: -staff.id, // temp id
                staffId: staff.id,
                staffName: staff.name,
                date: attendanceDate,
                status: StaffAttendanceStatus.Present,
            };
        });
        setDailyAttendance(recordsForDate);
    }, [attendanceDate, staffList, allAttendance]);

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const historySearchResults = useMemo(() => {
        if (!historySearchTerm.trim()) return [];
        return staffList.filter(staff =>
            staff.name.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
            staff.staffId.toLowerCase().includes(historySearchTerm.toLowerCase())
        ).slice(0, 5);
    }, [historySearchTerm, staffList]);

    const handleCreateStaff = (newStaffData: Omit<Staff, 'id' | 'staffId' | 'avatarUrl'>) => {
        const newId = Math.max(0, ...staffList.map(s => s.id)) + 1;
        const newStaff: Staff = {
            id: newId,
            staffId: `${newStaffData.role.charAt(0)}${String(newId).padStart(3, '0')}`,
            ...newStaffData,
            avatarUrl: `https://picsum.photos/seed/${newId}/100/100`,
        };
        const updatedList = [newStaff, ...staffList];
        setStaffList(updatedList);
        appState.staff = updatedList;
        setIsCreateModalOpen(false);
        toastService.show('Staff member created successfully!');
    };

    const handleUpdateStaff = (updatedStaff: Staff) => {
        const updatedList = staffList.map(s => s.id === updatedStaff.id ? updatedStaff : s);
        setStaffList(updatedList);
        appState.staff = updatedList;
        setEditingStaff(null);
        toastService.show('Staff member updated successfully!');
    };

    const confirmDelete = () => {
        if (staffToDelete) {
            const updatedList = staffList.filter(s => s.id !== staffToDelete.id);
            setStaffList(updatedList);
            appState.staff = updatedList;
            setStaffToDelete(null);
            toastService.show('Staff member deleted successfully!');
        }
    };
    
    const handleSaveAttendance = () => {
        // Logic to save attendance would go here...
        toastService.show('Attendance saved successfully!');
    };

    const handlePrintDailyReport = () => {
        generatePdfWithBranding(
            appState.schoolProfile,
            `Staff Attendance Report - ${new Date(attendanceDate).toLocaleDateString()}`,
            {
                head: [['Staff Name', 'Staff ID', 'Role', 'Status']],
                body: dailyAttendance.map(att => {
                    const staff = staffList.find(s => s.id === att.staffId);
                    return [
                        att.staffName,
                        staff?.staffId || 'N/A',
                        staff?.role || 'N/A',
                        att.status
                    ];
                })
            },
            `Staff_Attendance_${attendanceDate}.pdf`
        );
    };

    const handleStatusChange = (staffId: number, newStatus: StaffAttendanceStatus) => {
        setDailyAttendance(prev => prev.map(rec => rec.staffId === staffId ? { ...rec, status: newStatus } : rec));
    };

    const getStatusColor = (status: StaffAttendanceStatus) => {
        switch (status) {
            case StaffAttendanceStatus.Present: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case StaffAttendanceStatus.Absent: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case StaffAttendanceStatus.OnLeave: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Staff Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage staff profiles and track attendance.</p>
                </div>
                {activeTab === 'list' && (
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                        Add New Staff
                    </button>
                )}
            </div>

            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('list')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'list' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Staff List
                    </button>
                    <button onClick={() => setActiveTab('mark-attendance')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'mark-attendance' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Mark Attendance
                    </button>
                     <button onClick={() => setActiveTab('history')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Attendance History
                    </button>
                </nav>
            </div>
            
            {activeTab === 'list' && (
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search by name, ID, role..."
                            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Staff Name</th>
                                    <th scope="col" className="px-6 py-3">Staff ID</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Salary</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff) => (
                                    <tr key={staff.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="flex items-center">
                                                <img src={staff.avatarUrl} alt={staff.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                                                {staff.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{staff.staffId}</td>
                                        <td className="px-6 py-4">{staff.role}</td>
                                        <td className="px-6 py-4">${staff.basicSalary.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setEditingStaff(staff)}
                                                className="text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-300 mr-4"
                                            >
                                                <EditIcon className="w-5 h-5"/>
                                            </button>
                                            <button 
                                                onClick={() => setStaffToDelete(staff)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300"
                                            >
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeTab === 'mark-attendance' && (
                <Card>
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <input
                            type="date"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                         <div className="flex items-center space-x-2">
                            <button onClick={handlePrintDailyReport} className="flex items-center space-x-2 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                <PrintIcon className="w-4 h-4" />
                                <span>Print Report</span>
                            </button>
                            <button onClick={handleSaveAttendance} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                                Save Attendance
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Staff Name</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyAttendance.map(record => (
                                    <tr key={record.staffId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {record.staffName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {Object.values(StaffAttendanceStatus).map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(record.staffId, status)}
                                                        className={`px-3 py-1 text-xs font-medium rounded-full ${ record.status === status ? getStatusColor(status) : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeTab === 'history' && (
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Staff Attendance History</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search staff by name or ID..."
                            value={historySearchTerm}
                            onChange={(e) => setHistorySearchTerm(e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        {historySearchResults.length > 0 && (
                            <div className="absolute z-10 w-full md:w-1/2 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                                <ul>
                                    {historySearchResults.map(staff => (
                                        <li key={staff.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center border-b dark:border-gray-600 last:border-b-0">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{staff.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{staff.staffId} - {staff.role}</p>
                                            </div>
                                            <button 
                                                onClick={() => { setViewingHistoryFor(staff); setHistorySearchTerm(''); }}
                                                className="text-sm font-semibold text-primary-600 hover:underline"
                                            >
                                                View History
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            <CreateStaffModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateStaff} />
            {editingStaff && <EditStaffModal isOpen={!!editingStaff} onClose={() => setEditingStaff(null)} onUpdate={handleUpdateStaff} staff={editingStaff} />}
            {staffToDelete && <ConfirmationModal isOpen={!!staffToDelete} onClose={() => setStaffToDelete(null)} onConfirm={confirmDelete} title="Delete Staff" message={`Are you sure you want to delete ${staffToDelete.name}? This action cannot be undone.`} />}
            {viewingHistoryFor && <StaffAttendanceHistoryModal isOpen={!!viewingHistoryFor} onClose={() => setViewingHistoryFor(null)} staff={viewingHistoryFor} records={allAttendance} />}
        </div>
    );
};

export default StaffManagementPage;
