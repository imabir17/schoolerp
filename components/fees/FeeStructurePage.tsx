import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import ConfirmationModal from '../ui/ConfirmationModal';
import FeeStructureModal from './FeeStructureModal';
import api from '../../services/api';
import { FeeStructure } from '../../types';
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

const FeeStructurePage: React.FC = () => {
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);
    const [structureToDelete, setStructureToDelete] = useState<FeeStructure | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await api.getData('feeStructures');
        setFeeStructures(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (structureData: Omit<FeeStructure, 'id'>) => {
        const currentData = await api.getData('feeStructures');
        let updatedData;
        if (editingStructure) {
            updatedData = currentData.map((s: FeeStructure) => s.id === editingStructure.id ? { ...s, ...structureData } : s);
            toastService.show('Fee structure updated successfully!');
        } else {
            const newStructure: FeeStructure = {
                id: Math.max(0, ...currentData.map((s: FeeStructure) => s.id)) + 1,
                ...structureData,
            };
            updatedData = [newStructure, ...currentData];
            toastService.show('Fee structure created successfully!');
        }
        await api.setData('feeStructures', updatedData);
        await fetchData();
        closeModals();
    };
    
    const confirmDelete = async () => {
        if (structureToDelete) {
            const currentData = await api.getData('feeStructures');
            const updatedData = currentData.filter((s: FeeStructure) => s.id !== structureToDelete.id);
            await api.setData('feeStructures', updatedData);
            await fetchData();
            setStructureToDelete(null);
            toastService.show('Fee structure deleted successfully!');
        }
    };
    
    const closeModals = () => {
        setIsModalOpen(false);
        setEditingStructure(null);
    };

    return (
        <div>
            <Link to="/fees" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Fee Management
            </Link>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Fee Structures</h1>
                    <p className="text-gray-600 dark:text-gray-400">Define the types of fees for your school.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    Create Fee Type
                </button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    {isLoading ? <p>Loading...</p> : (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fee Name</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeStructures.map((structure) => (
                                <tr key={structure.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{structure.name}</td>
                                    <td className="px-6 py-4">${structure.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{structure.description}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setEditingStructure(structure)}
                                            className="text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-300 mr-4"
                                            aria-label={`Edit ${structure.name}`}
                                        >
                                            <EditIcon className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => setStructureToDelete(structure)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300"
                                            aria-label={`Delete ${structure.name}`}
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </Card>
            
            {(isModalOpen || editingStructure) && (
                <FeeStructureModal
                    isOpen={isModalOpen || !!editingStructure}
                    onClose={closeModals}
                    onSave={handleSave}
                    existingStructure={editingStructure}
                />
            )}
            
            {structureToDelete && (
                 <ConfirmationModal
                    isOpen={!!structureToDelete}
                    onClose={() => setStructureToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Fee Structure"
                    message={`Are you sure you want to delete the "${structureToDelete.name}" fee type?`}
                />
            )}
        </div>
    );
};

export default FeeStructurePage;
