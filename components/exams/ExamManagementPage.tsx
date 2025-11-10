import React, { useState } from 'react';
import Card from '../ui/Card';
import ExamListTab from './ExamListTab';
import ExamScheduleTab from './ExamScheduleTab';
import ResultsTab from './ResultsTab';
import ExamFeeCollectionTab from './ExamFeeCollectionTab';

const ExamManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('list');

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Exam Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage exam schedules, and results.</p>
            </div>

            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('list')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'list' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Exam List
                    </button>
                    <button onClick={() => setActiveTab('schedule')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'schedule' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Exam Schedule
                    </button>
                    <button onClick={() => setActiveTab('results')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'results' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Manage Results
                    </button>
                    <button onClick={() => setActiveTab('collect-fees')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'collect-fees' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Collect Exam Fees
                    </button>
                </nav>
            </div>
            
            <div>
                {activeTab === 'list' && <ExamListTab />}
                {activeTab === 'schedule' && <ExamScheduleTab />}
                {activeTab === 'results' && <ResultsTab />}
                {activeTab === 'collect-fees' && <ExamFeeCollectionTab />}
            </div>
        </div>
    );
};

export default ExamManagementPage;