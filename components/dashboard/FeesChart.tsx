
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

interface FeesChartProps {
    data: { name: string; Collected: number; Due: number }[];
}

const FeesChart: React.FC<FeesChartProps> = ({ data }) => {
  return (
    <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Fee Collection Analysis (Last 7 Months)</h2>
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="currentColor"/>
                <YAxis stroke="currentColor"/>
                <Tooltip 
                    cursor={{fill: 'rgba(107, 114, 128, 0.1)'}}
                    contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                        borderColor: 'rgba(55, 65, 81, 1)',
                        color: '#ffffff'
                    }} 
                />
                <Legend />
                <Bar dataKey="Collected" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Due" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default FeesChart;
