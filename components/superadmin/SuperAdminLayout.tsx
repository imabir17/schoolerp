import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const SuperAdminHeader: React.FC = () => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        await api.superAdminLogout();
        navigate('/superadmin/login');
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <h1 className="ml-3 text-xl font-semibold text-gray-800 dark:text-white">Super Admin Panel</h1>
            </div>
            <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 transform bg-gray-200 rounded-md dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-300 dark:focus:bg-gray-600"
            >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
            </button>
        </header>
    );
};

const SuperAdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <SuperAdminHeader />
      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;