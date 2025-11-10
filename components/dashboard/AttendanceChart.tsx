
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

interface AttendanceChartProps {
    data: { name: string; Attendance: number }[];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  return (
    <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Weekly Attendance Trend</h2>
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="currentColor" />
                <YAxis unit="%" stroke="currentColor" domain={[0, 100]} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                        borderColor: 'rgba(55, 65, 81, 1)',
                        color: '#ffffff'
                    }} 
                />
                <Legend />
                <Line type="monotone" dataKey="Attendance" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default AttendanceChart;
