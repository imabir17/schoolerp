import React, { useState, useEffect } from 'react';
import { School } from '../../types';

interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (school: Omit<School, 'id'>) => void;
  existingSchool: School | null;
}

const SchoolModal: React.FC<SchoolModalProps> = ({ isOpen, onClose, onSave, existingSchool }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        schoolId: '',
        password: '',
    });

    useEffect(() => {
        if (existingSchool) {
            setFormData({
                name: existingSchool.name,
                address: existingSchool.address,
                phone: existingSchool.phone,
                schoolId: existingSchool.schoolId,
                password: existingSchool.password || '',
            });
        } else {
            setFormData({ name: '', address: '', phone: '', schoolId: '', password: '' });
        }
    }, [existingSchool, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{existingSchool ? 'Edit School' : 'Create New School'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 input-field" />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="w-full mt-1 input-field" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full mt-1 input-field" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t dark:border-gray-600">
                        <div>
                            <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School ID (for login)</label>
                            <input type="text" id="schoolId" name="schoolId" value={formData.schoolId} onChange={handleChange} required className="w-full mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required={!existingSchool} placeholder={existingSchool ? 'Leave blank to keep unchanged' : ''} className="w-full mt-1 input-field" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">Save School</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SchoolModal;
