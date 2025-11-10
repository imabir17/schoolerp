import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SuperAdminLogo = () => (
    <div className="flex items-center justify-center mb-6 text-gray-800 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <span className="ml-4 text-3xl font-bold">Super Admin</span>
    </div>
);

const SuperAdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('superadmin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const loggedIn = await api.superAdminLogin(username, password);
        setIsLoading(false);
        if (loggedIn) {
            navigate('/superadmin/dashboard');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <SuperAdminLogo />
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Super Admin Panel Login
                </h2>
                {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md">
                        <div>
                            <label htmlFor="admin-id" className="sr-only">Admin Username</label>
                            <input
                                id="admin-id"
                                name="admin-id"
                                type="text"
                                required
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Admin Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password-login" className="sr-only">Password</label>
                            <input
                                id="password-login"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md group hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuperAdminLoginPage;