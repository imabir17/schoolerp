import React, { useState } from 'react';
import api from '../../services/api';
import { toastService } from '../../utils/toastService';

interface SuperAdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuperAdminSettingsModal: React.FC<SuperAdminSettingsModalProps> = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);
        const result = await api.changeSuperAdminPassword(currentPassword, newPassword);
        setIsLoading(false);

        if (result.success) {
            toastService.show('Password changed successfully!');
            onClose();
        } else {
            setError(result.message || 'An unknown error occurred.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Super Admin Password</h2>
                {error && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                        <input 
                            type="password" 
                            id="currentPassword" 
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            required 
                            className="w-full mt-1 input-field" 
                        />
                    </div>
                     <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                        <input 
                            type="password" 
                            id="newPassword" 
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required 
                            className="w-full mt-1 input-field" 
                        />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required 
                            className="w-full mt-1 input-field" 
                        />
                    </div>
                    <div className="flex justify-end mt-6 space-x-3 pt-4 border-t dark:border-gray-600">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminSettingsModal;