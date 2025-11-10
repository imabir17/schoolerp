import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './components/dashboard/DashboardPage';
import StudentManagementPage from './components/students/StudentManagementPage';
import AttendancePage from './components/attendance/AttendancePage';
import FeeManagementPage from './components/fees/FeeManagementPage';
import SettingsPage from './components/settings/SettingsPage';
import LoginPage from './components/auth/LoginPage';
import SuperAdminLoginPage from './components/auth/SuperAdminLoginPage';
import SuperAdminLayout from './components/superadmin/SuperAdminLayout';
import SuperAdminDashboardPage from './components/superadmin/SuperAdminDashboardPage';
import HomePage from './components/auth/HomePage';
import ClassManagementPage from './components/classes/ClassManagementPage';
import ClassDetailsPage from './components/classes/ClassDetailsPage';
import StaffManagementPage from './components/staff/StaffManagementPage';
import CollectFeePage from './components/fees/CollectFeePage';
import FeeRecordsPage from './components/fees/FeeRecordsPage';
import FeeStructurePage from './components/fees/FeeStructurePage';
import FinancePage from './components/finance/FinancePage';
import SalaryManagementPage from './components/finance/SalaryManagementPage';
import ExpenseManagementPage from './components/finance/ExpenseManagementPage';
import IncomeManagementPage from './components/finance/IncomeManagementPage';
import FinancialReportsPage from './components/finance/FinancialReportsPage';
import ExamManagementPage from './components/exams/ExamManagementPage';
import { appState } from './data/appState';
import api from './services/api';

// This component protects routes that require a school user to be logged in.
const ProtectedRoute: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = await appState.loadSession();
            setIsAuth(loggedIn);
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

// This component protects routes that require the super admin to be logged in.
const SuperAdminProtectedRoute: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = await api.isSuperAdminLoggedIn();
            setIsAuth(loggedIn);
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    return isAuth ? <Outlet /> : <Navigate to="/superadmin/login" replace />;
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Entry Point */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected School Routes */}
        <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentManagementPage />} />
              <Route path="/classes" element={<ClassManagementPage />} />
              <Route path="/classes/:classId" element={<ClassDetailsPage />} />
              <Route path="/staff" element={<StaffManagementPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/exams" element={<ExamManagementPage />} />
              <Route path="/fees" element={<FeeManagementPage />} />
              <Route path="/fees/collect" element={<CollectFeePage />} />
              <Route path="/fees/records" element={<FeeRecordsPage />} />
              <Route path="/fees/structure" element={<FeeStructurePage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/finance/salary" element={<SalaryManagementPage />} />
              <Route path="/finance/expenses" element={<ExpenseManagementPage />} />
              <Route path="/finance/income" element={<IncomeManagementPage />} />
              <Route path="/finance/reports" element={<FinancialReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
        </Route>

        {/* Super Admin Routes */}
        <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
        <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
        <Route element={<SuperAdminProtectedRoute />}>
            <Route element={<SuperAdminLayout />}>
              <Route path="/superadmin/dashboard" element={<SuperAdminDashboardPage />} />
            </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;