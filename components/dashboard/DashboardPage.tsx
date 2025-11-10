import React from 'react';
import StatCard from './StatCard';
import AttendanceChart from './AttendanceChart';
import FeesChart from './FeesChart';
import { appState } from '../../data/appState';
import { FeeStatus, AttendanceStatus } from '../../types';

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const ClipboardCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>
);
const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const DashboardPage: React.FC = () => {
    // Data is now sourced from the live appState object
    const { students, staff, fees, attendance } = appState;
    
    // Stat Calculations
    const totalStudents = students.length;
    const totalStaff = staff.length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const totalFeesCollected = fees
        .filter(fee => fee.status === FeeStatus.Paid && fee.paidDate && new Date(fee.paidDate).getMonth() === currentMonth && new Date(fee.paidDate).getFullYear() === currentYear)
        .reduce((sum, fee) => sum + fee.amount, 0);

    const todayString = new Date().toISOString().split('T')[0];
    const attendanceTodayRecords = attendance.filter(att => att.date === todayString);
    const presentToday = attendanceTodayRecords.filter(att => att.status === AttendanceStatus.Present || att.status === AttendanceStatus.Late).length;
    const attendancePercentage = attendanceTodayRecords.length > 0 ? (presentToday / attendanceTodayRecords.length * 100).toFixed(1) : '0.0';
    
    // Fees Chart Data (Last 7 Months)
    const feesChartData = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'short' });

        const collected = fees
            .filter(fee => fee.status === FeeStatus.Paid && fee.paidDate && new Date(fee.paidDate).getMonth() === month && new Date(fee.paidDate).getFullYear() === year)
            .reduce((sum, fee) => sum + fee.amount, 0);

        const due = fees
            .filter(fee => (fee.status === FeeStatus.Due || fee.status === FeeStatus.Unpaid) && new Date(fee.dueDate).getMonth() === month && new Date(fee.dueDate).getFullYear() === year)
            .reduce((sum, fee) => sum + fee.amount, 0);

        return { name: monthName, Collected: collected, Due: due };
    }).reverse();

    // Attendance Chart Data (Last 7 Days)
    const attendanceChartData = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayName = date.toLocaleString('default', { weekday: 'short' });

        const recordsForDay = attendance.filter(rec => rec.date === dateString);
        const presentCount = recordsForDay.filter(rec => rec.status === AttendanceStatus.Present || rec.status === AttendanceStatus.Late).length;
        
        const percentage = recordsForDay.length > 0 ? Math.round((presentCount / recordsForDay.length) * 100) : 0;
        
        return { name: dayName, Attendance: percentage };
    }).reverse();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's a real-time overview of your school.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard title="Total Students" value={totalStudents.toString()} icon={<UsersIcon className="w-8 h-8"/>} color="blue" />
        <StatCard title="Attendance Today" value={`${attendancePercentage}%`} icon={<ClipboardCheckIcon className="w-8 h-8"/>} color="green" />
        <StatCard title="Fees Collected (This Month)" value={`$${totalFeesCollected.toLocaleString()}`} icon={<DollarSignIcon className="w-8 h-8"/>} color="yellow" />
        <StatCard title="Total Staff" value={totalStaff.toString()} icon={<BriefcaseIcon className="w-8 h-8"/>} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <div className="lg:col-span-3">
          <FeesChart data={feesChartData} />
        </div>
        <div className="lg:col-span-2">
            <AttendanceChart data={attendanceChartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
