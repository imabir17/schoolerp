
import React, { useState, useEffect } from 'react';
import { Staff, StaffRole } from '../../types';

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (staff: Staff) => void;
  staff: Staff | null;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ isOpen, onClose, onUpdate, staff }) => {
    const [formData, setFormData] = useState<Partial<Staff>>({});
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (staff) {
            setFormData(staff);
            setPhotoPreview(staff.avatarUrl);
        }
    }, [staff]);

    if (!isOpen || !staff) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({...prev, avatarUrl: reader.result as string}));
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({
            ...staff,
            ...formData,
            basicSalary: Number(formData.basicSalary) || 0,
        } as Staff);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Staff Details</h2>
                <form onSubmit={handleSubmit}>
                     <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="nid" className="block text-sm font-medium text-gray-700 dark:text-gray-300">National Identification (NID) No.</label>
                            <input type="text" id="nid" name="nid" value={formData.nid || ''} onChange={handleChange} required className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign Role</label>
                            <select id="role" name="role" value={formData.role || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                                {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="basicSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Basic Salary ($)</label>
                            <input type="number" id="basicSalary" name="basicSalary" value={formData.basicSalary || ''} onChange={handleChange} required className="w-full px-3 py-2 mt-1 text-gray-900 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Photo</label>
                             <div className="mt-1 flex items-center space-x-4">
                                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    {photoPreview ? 
                                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" /> :
                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    }
                                </span>
                                <label htmlFor="photo-upload-edit" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <span>Change</span>
                                    <input id="photo-upload-edit" name="photo-upload" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/*"/>
                                </label>
                             </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-8 space-x-3 border-t dark:border-gray-600 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStaffModal;
