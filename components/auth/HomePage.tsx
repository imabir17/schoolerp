
import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-4 text-primary-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

const SchoolIcon = () => (
    <svg className="w-12 h-12 mx-auto mb-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18M5.468 18.07A9.003 9.003 0 0112 3.93a9.003 9.003 0 016.532 14.14"></path></svg>
);

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="text-center mb-12">
                 <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                    Welcome to School ERP
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Your complete school management solution.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-8">
                <Link to="/superadmin/login" className="block p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <SuperAdminIcon />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Super Admin Login
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage schools and system settings.
                    </p>
                </Link>

                <Link to="/login" className="block p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    <SchoolIcon />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        School Login
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Access your school's dashboard.
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
