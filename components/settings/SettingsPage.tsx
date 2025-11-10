import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { appState } from '../../data/appState';
import api from '../../services/api';
import { SchoolProfile } from '../../types';
import AcademicSessionModal from './AcademicSessionModal';
import { toastService } from '../../utils/toastService';

const SettingsPage: React.FC = () => {
  // Initialize local form state from the central app state
  const [profile, setProfile] = useState<SchoolProfile>({ ...appState.schoolProfile });
  const [logoPreview, setLogoPreview] = useState<string | null>(appState.schoolProfile.logoUrl);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfile(prev => ({ ...prev, logoUrl: result }));
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await api.saveSchoolProfile(profile);
    // Also update the in-memory appState so changes are reflected immediately
    Object.assign(appState.schoolProfile, profile);
    setIsSaving(false);
    toastService.show('School profile updated successfully!');
  };

  const activeSession = appState.academicSessions.find(s => s.isActive);

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage system-wide configurations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">System Configuration</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Academic Session</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Session: {activeSession ? activeSession.name : 'Not Set'}</p>
                        </div>
                        <button onClick={() => setIsSessionModalOpen(true)} className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Manage</button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Classes & Sections</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Configure classes and their sections.</p>
                        </div>
                        <Link to="/classes" className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Manage</Link>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">School Branding</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School Name</label>
                        <input type="text" id="schoolName" name="name" value={profile.name} onChange={handleProfileChange} className="w-full mt-1 input-field" />
                    </div>
                     <div>
                        <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">School Address</label>
                        <input type="text" id="schoolAddress" name="address" value={profile.address} onChange={handleProfileChange} className="w-full mt-1 input-field" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">School Logo</label>
                         <div className="mt-2 flex items-center space-x-4">
                            <span className="inline-block h-20 w-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                                {logoPreview ? 
                                    <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain" /> :
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 6.253v11.494m-9-5.747h18M5.468 18.07A9.003 9.003 0 0112 3.93a9.003 9.003 0 016.532 14.14" />
                                    </svg>
                                }
                            </span>
                            <label htmlFor="logo-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <span>Change Logo</span>
                                <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/png, image/jpeg"/>
                            </label>
                         </div>
                    </div>
                </div>
                <div className="flex justify-end mt-6 border-t dark:border-gray-600 pt-4">
                    <button onClick={handleSaveChanges} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-primary-400" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </Card>
        </div>
        <AcademicSessionModal 
            isOpen={isSessionModalOpen}
            onClose={() => setIsSessionModalOpen(false)}
        />
    </div>
  );
};

export default SettingsPage;
