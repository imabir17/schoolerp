import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appState } from '../../data/appState';

const SchoolLogo = () => (
    <div className="flex items-center justify-center mb-6 text-gray-800 dark:text-white">
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18M5.468 18.07A9.003 9.003 0 0112 3.93a9.003 9.003 0 016.532 14.14"></path></svg>
        <span className="ml-4 text-3xl font-bold">School ERP</span>
    </div>
);

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [schoolId, setSchoolId] = useState('springfield_elem');
    const [password, setPassword] = useState('pass123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const loggedIn = await appState.login(schoolId, password);
        setIsLoading(false);
        if (loggedIn) {
            navigate('/dashboard');
        } else {
            setError('Invalid School ID or Password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <SchoolLogo />
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Sign in to your school
                </h2>
                {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md">
                        <div>
                            <label htmlFor="school-id-login" className="sr-only">School ID</label>
                            <input
                                id="school-id-login"
                                name="school-id"
                                type="text"
                                required
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="School ID"
                                value={schoolId}
                                onChange={(e) => setSchoolId(e.target.value)}
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

export default LoginPage;
