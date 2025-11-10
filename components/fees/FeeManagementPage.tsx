
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

const HistoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);


const FeeManagementPage: React.FC = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Fee Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Collect fees, view records, and manage fee structures.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <Link to="/fees/collect" className="block transform hover:-translate-y-1 transition-transform duration-300">
                    <Card className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl">
                        <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
                            <DollarSignIcon className="w-10 h-10 text-primary-600 dark:text-primary-400"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Collect Student Fees</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Search for a student and process their fee payments.</p>
                    </Card>
                </Link>
                
                <Link to="/fees/records" className="block transform hover:-translate-y-1 transition-transform duration-300">
                    <Card className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl">
                        <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                            <HistoryIcon className="w-10 h-10 text-green-600 dark:text-green-400"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">View Fee Records</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Browse and filter the history of all fee transactions.</p>
                    </Card>
                </Link>

                <Link to="/fees/structure" className="block transform hover:-translate-y-1 transition-transform duration-300">
                    <Card className="h-full flex flex-col items-center justify-center text-center hover:shadow-xl">
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-4">
                            <SettingsIcon className="w-10 h-10 text-yellow-600 dark:text-yellow-400"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Fee Structure</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Define and manage different types of fees.</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default FeeManagementPage;