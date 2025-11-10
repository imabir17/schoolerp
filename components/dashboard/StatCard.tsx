
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
  green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300',
  purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
