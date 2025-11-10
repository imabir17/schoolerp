import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { School } from '../../types';
import Card from '../ui/Card';
import SchoolModal from './SchoolModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import SuperAdminSettingsModal from './SuperAdminSettingsModal';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

const SuperAdminDashboardPage: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);
    const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const fetchSchools = async () => {
        setIsLoading(true);
        const fetchedSchools = await api.getSchools();
        setSchools(fetchedSchools);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleSaveSchool = async (schoolData: Omit<School, 'id'>) => {
        if (editingSchool) {
            await api.updateSchool({ ...editingSchool, ...schoolData });
        } else {
            await api.createSchool(schoolData);
        }
        await fetchSchools();
        closeSchoolModal();
    };

    const handleDelete = async () => {
        if (schoolToDelete) {
            await api.deleteSchool(schoolToDelete.id);
            await fetchSchools();
            setSchoolToDelete(null);
        }
    };
    
    const openCreateModal = () => {
        setEditingSchool(null);
        setIsSchoolModalOpen(true);
    };

    const openEditModal = (school: School) => {
        setEditingSchool(school);
        setIsSchoolModalOpen(true);
    };
    
    const closeSchoolModal = () => {
        setIsSchoolModalOpen(false);
        setEditingSchool(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">School Management</h1>
                        <p className="text-gray-600 dark:text-gray-400">Create and manage school accounts.</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                        Create New School
                    </button>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        {isLoading ? <p className="text-center py-8">Loading schools...</p> : (
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">School Name</th>
                                        <th scope="col" className="px-6 py-3">School ID</th>
                                        <th scope="col" className="px-6 py-3">Address</th>
                                        <th scope="col" className="px-6 py-3">Phone</th>
                                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schools.map((school) => (
                                        <tr key={school.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {school.name}
                                            </td>
                                            <td className="px-6 py-4">{school.schoolId}</td>
                                            <td className="px-6 py-4">{school.address}</td>
                                            <td className="px-6 py-4">{school.phone}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => openEditModal(school)} className="text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-300 mr-4">
                                                    <EditIcon className="w-5 h-5"/>
                                                </button>
                                                <button onClick={() => setSchoolToDelete(school)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300">
                                                    <TrashIcon className="w-5 h-5"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {schools.length === 0 && !isLoading && (
                        <p className="py-8 text-center text-gray-500 dark:text-gray-400">No schools found. Create one to get started.</p>
                    )}
                </Card>
            </div>
            
            <div className="lg:col-span-1">
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>
                 <Card>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <ShieldIcon className="w-10 h-10 text-primary-500"/>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Security Settings</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Change your super admin password.</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSettingsModalOpen(true)} className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                        Change Password
                    </button>
                 </Card>
            </div>

            <SchoolModal 
                isOpen={isSchoolModalOpen} 
                onClose={closeSchoolModal} 
                onSave={handleSaveSchool}
                existingSchool={editingSchool}
            />

            <SuperAdminSettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />

            {schoolToDelete && (
                <ConfirmationModal
                    isOpen={!!schoolToDelete}
                    onClose={() => setSchoolToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete School"
                    message={`Are you sure you want to delete ${schoolToDelete.name}? This will permanently delete all data associated with this school.`}
                />
            )}
        </div>
    );
};

export default SuperAdminDashboardPage;